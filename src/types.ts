export interface RawDailyData {
  date: string;
  visits: { [key: string]: number | undefined };
  conversions: { [key: string]: number | undefined };
}

export interface RawVariation {
  id?: number;
  name: string;
}

export interface RawData {
  variations: RawVariation[];
  data: RawDailyData[];
}
