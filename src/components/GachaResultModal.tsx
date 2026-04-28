import React from "react";
import { GachaItem } from "@/types";

interface GachaResultModalProps {
  result: GachaItem | null;
}

export const GachaResultModal: React.FC<GachaResultModalProps> = ({ result }) => {
  if (!result) return null;

  return (
    <dialog id="gacha_modal" className="modal">
      <div className="modal-box">
        <div className="flex flex-col items-center gap-4">
          {result.img?.url && (
            <img src={result.img.url} alt={result.name} className="size-32" />
          )}
          <p className="text-xl font-bold">
            {result.name}（{result.rarity?.[0] || "不明"}）
          </p>
          <p className="text-center">{result.description}</p>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
