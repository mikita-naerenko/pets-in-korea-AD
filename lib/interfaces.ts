import { JsonArray, JsonValue } from "@prisma/client/runtime/library";

export interface Article {
  id: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  nameOfSource?: string | null;
  linkToSource?: string | null;
  authorName?: string | null;
  authorLink?: string | null;
  tags?: Tag[];
  images?: Img[] | [];
}

export interface TagList {
  id: string;
  label: string;
  rusTitle: string;
  articles: Article[] | [];
}

export interface Tag {
  id: string;
  label: string;
  rusTitle: string;
  articles?: Article[];
  images?: TagImage[];
  theme?: Theme[];
  news?: News[];
}

export interface TagImage {
  id: string;
  tagId: string;
  createdAt: Date;
  url: string;
  updatedAt: Date;
}
export interface ThemeImage {
  id: string;
  themeId: string;
  createdAt: Date;
  url: string;
  updatedAt: Date;
}

export interface Img {
  articleId: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  url: string;
}

export interface RemovedItem {
  id: string;
  removedItemType: string;
  removedAt: Date;
  title?: string | null;
  label?: string | null;
  rusLabel?: string | null;
  nameOfSource?: string | null;
  linkToSource?: string | null;
  authorName?: string | null;
  authorLink?: string | null;
  description?: string | null;
  koreanPhraseId?: string | null;
  content?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  tags?: JsonValue;
  images?: JsonValue;
  themeId?: string | null;
  phrases?: JsonValue | null;
  rusTranslates?: JsonValue;
  engTranslates?: JsonValue;
}

export interface News {
  id: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  nameOfSource: string | null;
  linkToSource: string | null;
  authorName: string | null;
  authorLink: string | null;
  createdAt: Date;
  updatedAt: Date;
  images?: NewsImg[];
  tags?: Tag[];
}

export interface NewsImg {
  newsId: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  url: string;
}

export interface Theme {
  id: string;
  label: string;
  description: string;
  rusLabel: string;
  images: ThemeImage[] | [];
  tags: Tag[] | [];
  createdAt: Date;
  updatedAt: Date;
  phrases: Phrase[] | [];
}

export interface Phrase {
  id: string;
  authorId: string;
  phrase: string;
  themeId: string;
  createdAt: Date;
  updatedAt: Date;
  rusTranslates: Translate[] | [];
  engTranslates: Translate[] | [];
}

export interface Translate {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  translate: string;
  transcription: string;
  theme: string;
  koreanPhraseId: string;
}
