export interface CreateArticleDTO {
  url: string;
  title: string;
  image: string;
  description: string;
  rating: number;
}

export interface SlackArticleDTO {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
}


export interface RateArticleDTO {
  action: string;
  id: string;
}

export type UpdateArticleDTO = Partial<CreateArticleDTO>;
