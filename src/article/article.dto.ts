export interface CreateArticleDTO {
  url: string;
  title: string;
  image: string;
  description: string;
  rating: number;
}

export interface RateArticleDTO {
  action: string;
  id: string;
}

export type UpdateArticleDTO = Partial<CreateArticleDTO>;
