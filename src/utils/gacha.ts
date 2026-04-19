import { client } from "@/microcms";

export interface GachaItem {
    id: string;
    name: string;
    description: string;
    img: {
        url: string;
        width?: number;
        height?: number;
    };
    rarity: string[];
}

export const fetchGachaItems = async (): Promise<GachaItem[]> => {
    const res = await client.getList<GachaItem>({
        endpoint: "items",
    });
    return res.contents;
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

    // アイテム側のrarity配列の最初の要素で判定
    const selectedItems = items.filter(item => item.rarity[0] === selectedRarity);
    if (selectedItems.length === 0) {
        throw new Error(`選ばれたレアリティ(${selectedRarity})にアイテムがありません`);
    }

    const randomIndex = Math.floor(Math.random() * selectedItems.length);
    return selectedItems[randomIndex];
};