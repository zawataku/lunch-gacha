import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebaseの設定
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchRarities = async (): Promise<Record<string, { name: string; probability: number }>> => {
    const raritiesCollection = collection(db, "rarities");
    const snapshot = await getDocs(raritiesCollection);
    const rarities: Record<string, { name: string; probability: number }> = {};
    snapshot.forEach((doc) => {
        rarities[doc.id] = doc.data() as { name: string; probability: number };
    });
    return rarities;
};

export const fetchItems = async (): Promise<
    { id: string; name: string; imageUrl: string; description: string; rarity: string }[]
> => {
    const itemsCollection = collection(db, "items");
    const snapshot = await getDocs(itemsCollection);
    const items: { id: string; name: string; imageUrl: string; description: string; rarity: string }[] = [];
    snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as { id: string; name: string; imageUrl: string; description: string; rarity: string });
    });
    return items;
};