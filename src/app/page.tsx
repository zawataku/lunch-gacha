"use client";

import { useEffect, useState } from "react";
import { fetchGachaItems, performGacha, GachaItem } from "@/utils/gacha";
import { saveToHistory, getHistory, clearHistory } from "@/utils/cookies";

export default function GachaPage() {
  const [items, setItems] = useState<GachaItem[]>([]);
  const [history, setHistory] = useState<GachaItem[]>([]);
  const [result, setResult] = useState<GachaItem | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      const gachaItems = await fetchGachaItems();
      setItems(gachaItems);
    };

    loadItems();
    setHistory(getHistory());
  }, []);

  const handleGacha = () => {
    if (items.length > 0) {
      const selectedItem = performGacha(items);
      setResult(selectedItem);
      saveToHistory(selectedItem);
      setHistory(getHistory());
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Gacha</h1>
      <button
        onClick={handleGacha}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        ガチャを引く
      </button>
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">結果:</h2>
          <img src={result.imgpath} alt={result.name} className="size-32" />
          <p>{result.name}</p>
          <p>{result.description}</p>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold">履歴:</h2>
        {history.length > 0 ? (
          <>
            {history.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img src={item.imgpath} alt={item.name} className="size-16" />
                <p>{item.name}</p>
              </div>
            ))}
            <button
              onClick={handleClearHistory}
              className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
            >
              ガチャ履歴をクリア
            </button>
          </>
        ) : (
          <p>履歴がありません。</p>
        )}
      </div>
    </div>
  );
}