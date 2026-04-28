import React from "react";

interface GachaMachineProps {
  isSpinning: boolean;
  animationKey: number;
  onGacha: () => void;
  onShowRatio: () => void;
}

export const GachaMachine: React.FC<GachaMachineProps> = ({
  isSpinning,
  animationKey,
  onGacha,
  onShowRatio,
}) => {
  return (
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
        onClick={onGacha}
        disabled={isSpinning}
        className={`btn btn-primary btn-lg text-2xl text-white ${isSpinning ? "loading" : ""}`}
      >
        {isSpinning ? "" : "ガチャる"}
      </button>

      {!isSpinning && (
        <button onClick={onShowRatio} className="link mt-2">
          提供割合
        </button>
      )}
    </div>
  );
};
