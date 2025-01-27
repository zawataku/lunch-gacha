"use client";

import { useState } from "react";
import Cookies from "js-cookie";

type GachaItem = {
  name: string;
  imageUrl: string;
  description: string;
  rarity: string;
};

export default function Home() {
  const [result, setResult] = useState<GachaItem | null>(null);

  const rollGacha = async () => {
    try {
      const res = await fetch("/api/gacha");
      const item: GachaItem = await res.json();
      setResult(item);

      // ガチャ履歴をCookieに保存
      const history = JSON.parse(Cookies.get("gachaHistory") || "[]");
      history.push(item);
      Cookies.set("gachaHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error during gacha roll:", error);
    }
  };

  return (
    <div className="p-4 text-center">
      <button onClick={rollGacha} className="rounded bg-blue-500 px-4 py-2 text-white">
        ガチャを回す
      </button>
      {result && (
        <div className="mt-4">
          <p>結果: <strong>{result.name}</strong></p>
          <img src={result.imageUrl} alt={result.name} className="mx-auto w-32" />
          <p>{result.description}</p>
          <p>レアリティ: <strong>{result.rarity}</strong></p>
        </div>
      )}
    </div>
  );
}