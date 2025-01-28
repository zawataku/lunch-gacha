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
    <main className="flex min-h-[101vh] flex-col items-center justify-center bg-base-200 p-8">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-4 shadow-lg md:p-12">

        <h1 className="mb-8 text-center text-4xl font-bold">昼ごはんガチャ</h1>
        <div className="flex flex-col items-center gap-3">
          <img src="/gacha.png" alt="ガチャガチャの画像" className="w-40" />
          <button
            onClick={handleGacha}
            className="btn btn-primary btn-lg text-2xl text-white"
          >
            ガチャる
          </button>
          <a
            onClick={() => {
              const modal = document.getElementById("gacha_ratio_modal") as HTMLDialogElement | null;
              if (modal) {
                modal.showModal();
              }
            }}
            className="link"
          >
            提供割合
          </a>
        </div>

        <dialog id="gacha_ratio_modal" className="modal">
          <div className="modal-box">
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-bold">提供割合</p>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>レアリティ</th>
                    <th>提供割合</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>SSレア</td>
                    <td>1%</td>
                  </tr>
                  <tr>
                    <td>Sレア</td>
                    <td>4%</td>
                  </tr>
                  <tr>
                    <td>レア</td>
                    <td>15%</td>
                  </tr>
                  <tr>
                    <td>ノーマル</td>
                    <td>80%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {result && (
          <dialog id="gacha_modal" className="modal">
            <div className="modal-box">
              <div className="flex flex-col items-center gap-4">
                <img src={result.imgpath} alt={result.name} className="size-32" />
                <p className="text-xl font-bold">{result.name}（{result.rarity}）</p>
                <p>{result.description}</p>
                <p className="font-bold"></p>
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
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleClearHistory}
                      className="btn btn-error text-white"
                    >
                      ガチャ履歴をクリア
                    </button>
                  </div>
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