import React from "react";
import { GachaItem } from "@/types";

interface GachaHistoryProps {
  history: GachaItem[];
  onClear: () => void;
}

export const GachaHistory: React.FC<GachaHistoryProps> = ({ history, onClear }) => {
  return (
    <div className="collapse collapse-arrow bg-base-300">
      <input type="checkbox" />
      <div className="collapse-title text-lg md:text-xl font-bold">ガチャ履歴（直近10件）</div>
      <div className="collapse-content">
        {history.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-base-200 pb-2 last:border-0"
                >
                  {item.img?.url ? (
                    <img
                      src={item.img.url}
                      alt={item.name}
                      className="size-16 rounded object-cover"
                    />
                  ) : (
                    <div className="size-16 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{item.name || "不明な料理"}</p>
                    <p className="text-sm opacity-70">{item.rarity?.[0] || "不明"}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={onClear} className="btn btn-error btn-sm text-white">
                ガチャ履歴をクリア
              </button>
            </div>
          </>
        ) : (
          <p className="py-4 text-center">履歴がありません。</p>
        )}
      </div>
    </div>
  );
};
