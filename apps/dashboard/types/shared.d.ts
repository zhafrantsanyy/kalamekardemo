declare module "@kalamekar/shared/catalog" {
  export interface FlowerItem {
    id: string;
    nama: string;
    harga: number;
    kat: string;
    img: string;
  }
  export const FLOWERS: FlowerItem[];
  export const FMAP: Record<string, FlowerItem>;
  export const SIZES: Array<{ id: string; nama: string; fee: number; saran: string; r: number }>;
  export function rupiah(n: number): string;
}

declare module "@kalamekar/shared/tokens" {
  export const colors: Record<string, string>;
  export const fonts: { display: string; body: string };
  export const WA_NUMBER: string;
  export const BUILDER_URL: string;
  export const STATUS_COLORS: Record<string, { bg: string; fg: string }>;
}
