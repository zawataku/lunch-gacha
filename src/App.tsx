import { useEffect, useState } from "react";
import { saveToHistory, getHistory, clearHistory } from "@/utils/cookies";
import { GachaItem } from "@/types";
import { GachaMachine } from "@/components/GachaMachine";
import { GachaResultModal } from "@/components/GachaResultModal";
import { GachaRatioModal } from "@/components/GachaRatioModal";
import { GachaHistory } from "@/components/GachaHistory";

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

  const handleShowRatio = () => {
    const modal = document.getElementById("gacha_ratio_modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <main className="flex min-h-[101vh] flex-col items-center justify-center bg-base-200 p-8">
      <div className="relative flex flex-col gap-5 w-full max-w-2xl rounded-xl bg-white px-4 py-12 shadow-lg md:px-12">
        <h1 className="text-center text-2xl font-bold md:text-4xl">昼ごはんガチャ</h1>

        <GachaMachine
          isSpinning={isSpinning}
          animationKey={animationKey}
          onGacha={handleGacha}
          onShowRatio={handleShowRatio}
        />

        <GachaRatioModal />

        <GachaResultModal result={result} />

        <GachaHistory history={history} onClear={handleClearHistory} />
      </div>
    </main>
  );
}
