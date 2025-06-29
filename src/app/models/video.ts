// src/app/models/models.ts
export interface Video {
  _id: string;
  title: string;
  path: string;
  img: string;
  duration: number;
  isFavorite?: boolean;
  isLoading?: boolean;
  themeColor?: string;
}