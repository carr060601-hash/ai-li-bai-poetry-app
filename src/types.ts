export interface PoemRecommendation {
  id: string;
  title: string;           // 詩名 (e.g. 《月下獨酌四首·其一》)
  dynasty: string;         // 朝代 (唐)
  author: string;          // 作者 (李白)
  genre: string;           // 體裁 (e.g. 五言古詩、七言絕句)
  verses: string[];        // 詩句清單
  famousVerse: string;     // 最著名詩句 / 警句
  vernacular: string;      // 白話文詳細解釋
  reason: string;          // 推薦原因 (針對使用者的心情或關鍵字)
  background?: string;     // 詩作背景 / 太白生平心境
  moodTag: string;         // 意境標籤 (如：孤月清輝、曠達豪邁、望月思鄉)
  queryKeyword: string;    // 使用者當時輸入的關鍵字/心情
  timestamp: number;
}

export interface RecommendRequest {
  keyword: string;
}

export interface RecommendResponse {
  poem: PoemRecommendation;
  isAiGenerated: boolean;
  message?: string;
}
