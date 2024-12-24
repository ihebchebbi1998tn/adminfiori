export interface Visitor {
  id_visitors: number;
  page_visitors: string;
  city_visitors: string;
  country_visitors: string;
  ip_visitors: string;
  date_visitors: string;
}


export interface DailyVisits {
  date: string;
  count: number;
  pages: Record<string, number>;
}