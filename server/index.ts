import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "microcms-js-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// microCMS Client
const client = createClient({
  serviceDomain: process.env.VITE_MICROCMS_SERVICE_DOMAIN || "",
  apiKey: process.env.VITE_MICROCMS_API_KEY || "",
});

app.use(cors());
app.use(express.json());

// Gacha Item Interface
interface GachaItem {
  id: string;
  name: string;
  description: string;
  img: {
    url: string;
  };
  rarity: string[];
}

// Lottery Logic
const performGacha = (items: GachaItem[]): GachaItem => {
  const rarityProbabilities: { [key: string]: number } = {
    "ノーマル": 70,
    "レア": 25,
    "Sレア": 4,
    "SSレア": 1,
  };

  const rarityEntries = Object.entries(rarityProbabilities);
  const totalRarityWeight = 100;
  const rarityRandomValue = Math.random() * totalRarityWeight;

  let cumulativeRarity = 0;
  let selectedRarity = "";

  for (const [rarity, probability] of rarityEntries) {
    cumulativeRarity += probability;
    if (rarityRandomValue <= cumulativeRarity) {
      selectedRarity = rarity;
      break;
    }
  }

  const selectedItems = items.filter(item => {
    const itemRarity = item.rarity?.[0]?.trim();
    return itemRarity === selectedRarity;
  });

  if (selectedItems.length === 0) {
    return items[Math.floor(Math.random() * items.length)];
  }

  const randomIndex = Math.floor(Math.random() * selectedItems.length);
  return selectedItems[randomIndex];
};

// API Endpoint
app.get("/api/gacha", async (req, res) => {
  try {
    const response = await client.getList<GachaItem>({
      endpoint: "items",
    });
    const items = response.contents;

    if (items.length === 0) {
      return res.status(404).json({ error: "No items found" });
    }

    const result = performGacha(items);
    res.json(result);
  } catch (error) {
    console.error("Gacha Error:", error);
    res.status(500).json({ error: "Failed to perform gacha" });
  }
});

// Serve static files from the Vite build directory
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

// Handle SPA routing
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
