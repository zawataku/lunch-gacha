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

      setTimeout(() => {
        const modal = document.getElementById("gacha_modal") as HTMLDialogElement;
        if (modal) {
          modal.showModal();
        }
      }, 0);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base-200 p-8">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg md:p-12">

        <h1 className="mb-8 text-center text-3xl font-bold">昼ごはんガチャ</h1>
        <div className="flex flex-col items-center gap-3">
          <img src="/gacha.png" alt="ガチャガチャの画像" className="w-40" />
          <button
            onClick={handleGacha}
            className="btn btn-primary text-white"
          >
            ガチャる
          </button>
        </div>

        {result && (
          <dialog id="gacha_modal" className="modal">
            <div className="modal-box">
              <div className="flex flex-col items-center gap-4">
                <img src={result.imgpath} alt={result.name} className="size-32" />
                <p className="text-xl font-bold">{result.name}</p>
                <p>{result.description}</p>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        )}

        <div className="mt-4">
          <div className="collapse collapse-arrow bg-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-bold">ガチャ履歴</div>
            <div className="collapse-content">
              {history.length > 0 ? (
                <>
                  <div className="flex flex-col gap-4">
                    {history.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img src={item.imgpath} alt={item.name} className="size-16" />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleClearHistory}
                    className="btn btn-error mt-4 text-white"
                  >
                    ガチャ履歴をクリア
                  </button>
                </>
              ) : (
                <p>履歴がありません。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}