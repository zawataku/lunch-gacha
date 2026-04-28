export interface GachaItem {
  id: string;
  name: string;
  description: string;
  img?: {
    url: string;
  };
  rarity?: string[];
}
