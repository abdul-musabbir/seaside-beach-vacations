export interface Listing {
  id: number;
  title: string;
  description: string;
  feature_image: string;
  location: string;
  slug: string;
  meta: {
    cleaning_fees: number;
    labor_day_minimum_stay: number;
    labor_day_price: number;
    memorial_day_minimum_stay: number;
    memorial_day_price: number;
    normal_minimum_stay: number;
    normal_price: number;
    num_bathrooms: number;
    num_bedrooms: number;
    num_kitchens: number;
    num_sleeps: number;
    peak_season_minimum_stay: number;
    peak_season_price: number;
    peak_season_start: string; // Can be converted to Date if needed
    security_deposit: number;
    utility_fees: number;
  };
  price: number;
  price_type: string;
  minimum_stay: number;
  gallery_images: string;
}
