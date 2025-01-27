import { NextResponse } from "next/server";
import { fetchRarities, fetchItems } from "@/firebase";
import { random } from "lodash";

// GETメソッドのエクスポート
export async function GET() {
    try {
        const rarities = await fetchRarities();
        const items = await fetchItems();

        // レアリティ抽選
        const rarityPool: string[] = [];
        Object.entries(rarities).forEach(([key, rarity]) => {
            const count = Math.round(rarity.probability * 100);
            rarityPool.push(...Array(count).fill(key));
        });
        const selectedRarity = rarityPool[random(0, rarityPool.length - 1)];

        // レアリティに基づいてアイテムを抽選
        const filteredItems = items.filter((item) => item.rarity === selectedRarity);
        const selectedItem = filteredItems[random(0, filteredItems.length - 1)];

        return NextResponse.json(selectedItem);
    } catch (error) {
        console.error("Error during gacha draw:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}