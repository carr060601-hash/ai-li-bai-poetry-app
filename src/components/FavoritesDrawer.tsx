import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { PoemRecommendation } from '../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: PoemRecommendation[];
  onSelectPoem: (poem: PoemRecommendation) => void;
  onRemoveFavorite: (poemId: string) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectPoem,
  onRemoveFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer panel */}
      <aside className="w-full max-w-md bg-[#FAF6EE] h-full shadow-2xl border-l border-[#D4C4B2] flex flex-col z-10 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E3D6C6] bg-[#F2EAE0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#A62B2B] text-white flex items-center justify-center font-calligraphy text-xs">
              詩篋
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#2E241D] font-serif-tc">
                太白詩篋
              </h3>
              <p className="text-xs text-[#786759] font-serif-tc">
                已收藏 {favorites.length} 首詩篇
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-[#8F2323] hover:text-[#B32424] px-2 py-1 rounded hover:bg-[#EBDDD0] transition-colors cursor-pointer"
                title="清空收藏"
              >
                清空
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#E8DCCF] text-[#594A3E] transition-colors cursor-pointer"
              title="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {favorites.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Bookmark className="w-12 h-12 text-[#D2C2B0] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#5A4A3D] font-serif-tc">
                詩篋尚空
              </p>
              <p className="text-xs text-[#8A796A] font-serif-tc mt-1 max-w-xs mx-auto">
                在詩詞卡片右上角點擊書籤圖標，即可將心儀的太白名作收入詩篋，隨時復讀品賞。
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFFFFF]/80 border border-[#E0D1BF] rounded-xl p-4 shadow-2xs hover:border-[#A62B2B]/60 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="font-bold text-base text-[#2E241D] font-serif-tc">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-[#857161] font-serif-tc">
                      {item.dynasty} · {item.author} ({item.genre})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(item.id);
                    }}
                    className="text-[#A49282] hover:text-[#A62B2B] p-1 transition-colors cursor-pointer"
                    title="移除此詩"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Famous quote preview */}
                <p className="text-xs text-[#8F2323] font-serif-tc font-medium line-clamp-1 my-1.5 bg-[#FAF3E8] px-2 py-1 rounded">
                  {item.famousVerse || item.verses[0]}
                </p>

                {/* Reason preview */}
                <p className="text-xs text-[#635345] font-serif-tc line-clamp-2 mb-3">
                  {item.reason}
                </p>

                {/* Open in main view */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectPoem(item);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#F2ECE0] hover:bg-[#A62B2B] hover:text-white text-[#4A3C30] text-xs font-serif-tc transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>翻開細閱</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#E3D6C6] bg-[#F4EDE2] text-center text-[11px] text-[#8C7A6B] font-serif-tc">
          太白詩篇隨心伴讀 · 紀錄珍藏
        </div>
      </aside>
    </div>
  );
};
