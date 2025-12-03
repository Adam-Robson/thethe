export interface PostType {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface PostFormType {
  onPostCreated: () => void;
}

