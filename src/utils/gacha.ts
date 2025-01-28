import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export interface GachaItem {
    id: string;
    name: string;
    description: string;
    imgpath: string;
    probability: number;
    rarity: string;
}

export const fetchGachaItems = async (): Promise<GachaItem[]> => {
    const snapshot = await getDocs(collection(db, "items"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GachaItem));
};

export const performGacha = (items: GachaItem[]): GachaItem => {
    const totalWeight = items.reduce((sum, item) => sum + item.probability, 0);
    const randomValue = Math.random() * totalWeight;
    let cumulative = 0;

    for (const item of items) {
        cumulative += item.probability;
        if (randomValue <= cumulative) {
            return item;
        }
    }

    throw new Error("Gacha failed");
};