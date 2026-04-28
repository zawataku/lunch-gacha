import { useEffect, useState } from "react";
import { saveToHistory, getHistory, clearHistory } from "@/utils/cookies";

export interface GachaItem {
  id: string;
  name: string;
  description: string;
  img?: {
    url: string;
  };
  rarity?: string[];
}

export default function App() {
  const [history, setHistory] = useState<GachaItem[]>([]);
  const [result, setResult] = useState<GachaItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const GACHA_ANIMATION_TIME = 3000;

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleGacha = async () => {
    setAnimationKey(Date.now());
    setIsSpinning(true);
    setResult(null);

    try {
      const [response] = await Promise.all([
        fetch("/api/gacha"),
        new Promise((resolve) => setTimeout(resolve, GACHA_ANIMATION_TIME)),
      ]);

      if (!response.ok) {
        throw new Error("Failed to fetch gacha result");
      }

      const selectedItem: GachaItem = await response.json();
      setResult(selectedItem);
      saveToHistory(selectedItem);
      setHistory(getHistory());

      setIsSpinning(false);

      setTimeout(() => {
        const modal = document.getElementById("gacha_modal") as HTMLDialogElement;
        if (modal) {
          modal.showModal();
        }
      }, 100);
    } catch (error) {
      console.error("Gacha failed:", error);
      setIsSpinning(false);
      alert("通信に失敗しました。もう一度お試しください。");
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <main className="flex min-h-[101vh] flex-col items-center justify-center bg-base-200 p-8">
      <div className="relative flex flex-col gap-5 w-full max-w-2xl rounded-xl bg-white px-4 py-12 shadow-lg md:px-12">

        <h1 className="text-center text-2xl font-bold md:text-4xl">昼ごはんガチャ</h1>
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-64 items-center justify-center">
            {isSpinning ? (
              <img
                src={`/gacha.gif?t=${animationKey}`}
                alt="ガチャを回しています"
                className="w-64"
              />
            ) : (
              <img src="/gacha.png" alt="ガチャガチャの画像" className="w-64" />
            )}
          </div>

          <button
            onClick={handleGacha}
            disabled={isSpinning}
            className={`btn btn-primary btn-lg text-2xl text-white ${isSpinning ? "loading" : ""}`}
          >
            {isSpinning ? "" : "ガチャる"}
          </button>

          {!isSpinning && (
            <button
              onClick={() => {
                const modal = document.getElementById("gacha_ratio_modal") as HTMLDialogElement | null;
                if (modal) {
                  modal.showModal();
                }
              }}
              className="link mt-2"
            >
              提供割合
            </button>
          )}
        </div>

        {/* 提供割合モーダル */}
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
                  <tr><td>SSレア</td><td>1%</td></tr>
                  <tr><td>Sレア</td><td>4%</td></tr>
                  <tr><td>レア</td><td>25%</td></tr>
                  <tr><td>ノーマル</td><td>70%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {/* ガチャ結果モーダル */}
        {result && (
          <dialog id="gacha_modal" className="modal">
            <div className="modal-box">
              <div className="flex flex-col items-center gap-4">
                {result.img?.url && (
                  <img src={result.img.url} alt={result.name} className="size-32" />
                )}
                <p className="text-xl font-bold">{result.name}（{result.rarity?.[0] || "不明"}）</p>
                <p className="text-center">{result.description}</p>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        )}

        {/* 履歴セクション */}
        <div className="collapse collapse-arrow bg-base-300">
          <input type="checkbox" />
          <div className="collapse-title text-lg md:text-xl font-bold">ガチャ履歴</div>
          <div className="collapse-content">
            {history.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {history.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 border-b border-base-200 pb-2 last:border-0">
                      {item.img?.url ? (
                        <img src={item.img.url} alt={item.name} className="size-16 rounded object-cover" />
                      ) : (
                        <div className="size-16 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Image</div>
                      )}
                      <div>
                        <p className="font-bold">{item.name || "不明な料理"}</p>
                        <p className="text-sm opacity-70">{item.rarity?.[0] || "不明"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleClearHistory}
                    className="btn btn-error btn-sm text-white"
                  >
                    ガチャ履歴をクリア
                  </button>
                </div>
              </>
            ) : (
              <p className="py-4 text-center">履歴がありません。</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
