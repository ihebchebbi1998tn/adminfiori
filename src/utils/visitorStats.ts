import { Visitor } from '../types/visitors';

export const calculateDailyVisits = (visitors: Visitor[]): Record<string, number> => {
  if (!visitors || !Array.isArray(visitors)) return {};
  
  return visitors.reduce((acc: Record<string, number>, visitor) => {
    const date = visitor.date_visitors.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
};

export const calculatePageViews = (visitors: Visitor[]): Record<string, number> => {
  if (!visitors || !Array.isArray(visitors)) return {};
  
  return visitors.reduce((acc: Record<string, number>, visitor) => {
    const page = visitor.page_visitors;
    acc[page] = (acc[page] || 0) + 1;
    return acc;
  }, {});
};

export const calculateRegionalStats = (visitors: Visitor[]): Array<{
  region: string;
  count: number;
  percentage: number;
  flag: string;
}> => {
  if (!visitors || !Array.isArray(visitors)) return [];

  const countryCount = visitors.reduce((acc: Record<string, number>, visitor) => {
    const country = visitor.country_visitors;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const total = visitors.length;

  return Object.entries(countryCount).map(([country, count]) => ({
    region: country,
    count,
    percentage: (count / total) * 100,
    flag: getFlagEmoji(country) // You'll need to implement this function or use a flag library
  }));
};

// Helper function to get flag emoji (simplified version)
const getFlagEmoji = (countryName: string): string => {
  // This is a simplified version. You might want to use a proper country-to-flag library
  const flagEmojis: Record<string, string> = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    // Add more countries as needed
  };
  return flagEmojis[countryName] || '🏳️';
};
