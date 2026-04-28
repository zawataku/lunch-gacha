import React from "react";

export const GachaRatioModal: React.FC = () => {
  return (
    <dialog id="gacha_ratio_modal" className="modal">
      <div className="modal-box">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg md:text-xl font-bold">提供割合</p>
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
                <td>25%</td>
              </tr>
              <tr>
                <td>ノーマル</td>
                <td>70%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
