import React from 'react';
import { Bookmark, Sparkles, ScrollText, Compass } from 'lucide-react';

interface ClassicalHeaderProps {
  savedCount: number;
  onOpenFavorites: () => void;
  onRandomInspire: () => void;
  isLoading: boolean;
}

export const ClassicalHeader: React.FC<ClassicalHeaderProps> = ({
  savedCount,
  onOpenFavorites,
  onRandomInspire,
  isLoading,
}) => {
  return (
    <header className="w-full border-b border-[#E3D8C8] bg-[#FDFBF7]/90 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Title and Classical Seal */}
        <div className="flex items-center gap-3.5">
          {/* Vermilion Classical Seal */}
          <div 
            id="vermilion-seal" 
            className="w-11 h-11 rounded-sm bg-[#A62B2B] text-[#FFF6E9] flex flex-col items-center justify-center font-calligraphy text-xs leading-none shadow-sm border border-[#851D1D] select-none tracking-widest"
            title="青蓮居士印"
          >
            <span>青蓮</span>
            <span className="mt-0.5">居士</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-[#2B231D] font-serif-tc">
                AI 李白詩詞小助手
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs bg-[#EAE0D0] text-[#6B5A4B] rounded border border-[#D8CABE] font-serif-tc">
                盛唐詩仙 · 繁體中文
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#736357] font-serif-tc mt-0.5 flex items-center gap-1.5">
              <span>感君一刻心緒</span>
              <span className="text-[#C4A482]">·</span>
              <span>借得太白詩魂</span>
              <span className="text-[#C4A482]">·</span>
              <span className="hidden xs:inline">撫慰人間凡心</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Random discovery & Favorites collection */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-random-inspire"
            onClick={onRandomInspire}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm rounded-md bg-[#F2ECE1] hover:bg-[#E8DFD0] text-[#4A3D34] border border-[#D5C7B6] transition-colors cursor-pointer disabled:opacity-50"
            title="隨機品讀李白傳世名篇"
          >
            <Compass className="w-4 h-4 text-[#8C2D19]" />
            <span>隨機拾珠</span>
          </button>

          <button
            id="btn-open-favorites"
            onClick={onOpenFavorites}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm rounded-md bg-[#F7F2E7] hover:bg-[#ECE4D4] text-[#4A3D34] border border-[#D5C7B6] transition-colors cursor-pointer relative"
            title="查看已收藏的詩篇"
          >
            <Bookmark className="w-4 h-4 text-[#A62B2B]" />
            <span>太白詩篋</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#A62B2B] text-white text-[10px] font-bold rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
