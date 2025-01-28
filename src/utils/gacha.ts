import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export interface GachaItem {
    id: string;
    name: string;
    description: string;
    imgpath: string;
    rarity: string;
}

export const fetchGachaItems = async (): Promise<GachaItem[]> => {
    const snapshot = await getDocs(collection(db, "items"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GachaItem));
};

export const performGacha = (items: GachaItem[]): GachaItem => {
    // 1. レアリティの確率定義（固定）
    const rarityProbabilities: { [key: string]: number } = {
        "ノーマル": 70,
        "レア": 25,
        "Sレア": 4,
        "SSレア": 1,
    };

    // 2. レアリティの抽選
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

    if (!selectedRarity) {
        throw new Error("レアリティの抽選に失敗しました");
    }

    const selectedItems = items.filter(item => item.rarity === selectedRarity);
    if (selectedItems.length === 0) {
        throw new Error(`選ばれたレアリティ(${selectedRarity})にアイテムがありません`);
    }

    const randomIndex = Math.floor(Math.random() * selectedItems.length);
    return selectedItems[randomIndex];
};