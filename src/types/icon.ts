export interface IconInstanceType {
  name: string;
  size?: number | string;
  weight?: 'bold' | 'regular' | 'light' | 'thin' | 'fill' | 'duotone';
  label?: string;
  className?: string | string[] | Record<string, boolean>;
  [key: string]: unknown;
}
