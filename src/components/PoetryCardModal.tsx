import React, { useState } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { PoemRecommendation } from '../types';

interface PoetryCardModalProps {
  poem: PoemRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PoetryCardModal: React.FC<PoetryCardModalProps> = ({
  poem,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !poem) return null;

  const handleCopyText = async () => {
    const formatted = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n   ${poem.title}  [唐·李白]\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n${poem.verses.join('\n')}\n\n「${poem.famousVerse}」\n\n因念及「${poem.queryKeyword}」而薦：\n${poem.reason}\n\n—— AI 李白詩詞小助手`;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-[#FAF6EE] border-4 border-[#C8B8A4] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#887768] hover:text-[#2B231D] rounded-full hover:bg-[#ECE0D0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Postcard Layout */}
        <div className="border border-[#E0D1BF] p-6 rounded-xl bg-[#FDFBF7] relative text-center">
          {/* Classical seal */}
          <div className="absolute top-4 right-4 w-10 h-10 border border-[#A62B2B] flex flex-col items-center justify-center text-[#A62B2B] text-[10px] font-calligraphy rotate-3">
            <span>太白</span>
            <span>詩箋</span>
          </div>

          <p className="text-xs text-[#8A7663] font-serif-tc tracking-widest uppercase mb-1">
            盛唐詩仙 · 雅集詩箋
          </p>

          <h3 className="text-2xl sm:text-3xl font-bold font-serif-tc text-[#261E18] tracking-widest mt-2 mb-1">
            {poem.title}
          </h3>
          <p className="text-xs text-[#736355] font-serif-tc mb-5">
            唐 · 李白 著
          </p>

          {/* Verses */}
          <div className="space-y-2 py-3 border-y border-[#ECE0D2] my-4 font-serif-tc text-base sm:text-lg text-[#2E241E] leading-relaxed">
            {poem.verses.map((v, i) => (
              <p key={i}>{v}</p>
            ))}
          </div>

          {/* Golden couplet */}
          <p className="text-sm font-bold font-serif-tc text-[#8F2323] my-3">
            「{poem.famousVerse}」
          </p>

          <p className="text-xs text-[#635345] font-serif-tc mt-4 italic">
            「{poem.reason}」
          </p>
        </div>

        {/* Modal Buttons */}
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#A62B2B] hover:bg-[#8F2323] text-white font-serif-tc text-sm tracking-wider transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>已複製詩箋文字</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>複製雅緻詩箋</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
