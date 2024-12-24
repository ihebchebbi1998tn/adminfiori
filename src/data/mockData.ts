export const products = [
  {
    id_product: 1,
    nom_product: "Summer Floral Dress",
    img_product: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
    description_product: "Elegant floral summer dress with adjustable straps",
    type_product: "Dress",
    category_product: "Women",
    price_product: 89.99,
    qnty_product: 50,
    status_product: "In Stock",
    createdate_product: "2024-03-10"
  },
  {
    id_product: 2,
    nom_product: "Classic Denim Jacket",
    img_product: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
    description_product: "Timeless denim jacket with vintage wash",
    type_product: "Jacket",
    category_product: "Unisex",
    price_product: 129.99,
    qnty_product: 35,
    status_product: "In Stock",
    createdate_product: "2024-03-09"
  },
  {
    id_product: 3,
    nom_product: "Leather Ankle Boots",
    img_product: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800",
    description_product: "Genuine leather boots with side zipper",
    type_product: "Shoes",
    category_product: "Women",
    price_product: 159.99,
    qnty_product: 0,
    status_product: "Out of Stock",
    createdate_product: "2024-03-08"
  }
];

export const orders = [
  {
    id_order: 1,
    time_order: "2024-03-15T10:30:00",
    nomby_order: "Emma Wilson",
    emailby_order: "emma@example.com",
    adressby_order: "123 Fashion St, NY",
    phoneby_order: "+1234567890",
    paimentstatus_order: "Paid",
    products_order: [1, 2],
    qty_products_order: [1, 2],
    otherinfo_order: "Express Delivery",
    paimentmethod_odrder: "Credit Card",
    status_order: "Processing"
  },
  {
    id_order: 2,
    time_order: "2024-03-14T15:45:00",
    nomby_order: "James Brown",
    emailby_order: "james@example.com",
    adressby_order: "456 Style Ave, LA",
    phoneby_order: "+1987654321",
    paimentstatus_order: "Pending",
    products_order: [3],
    qty_products_order: [1],
    otherinfo_order: "Standard Delivery",
    paimentmethod_odrder: "PayPal",
    status_order: "Pending"
  }
];

export const visitors = [
  {
    id_visitors: 1,
    city_visitors: "New York",
    country_visitors: "USA",
    ip_visitors: "192.168.1.1"
  },
  {
    id_visitors: 2,
    city_visitors: "London",
    country_visitors: "UK",
    ip_visitors: "192.168.1.2"
  }
];

export const stats = {
  totalSales: 15789.45,
  totalOrders: 145,
  totalProducts: 67,
  totalVisitors: 1234
};

export const visitorStats = {
  dailyVisits: [
    { date: '2024-03-15', count: 245, pages: { home: 120, products: 80, cart: 45 } },
    { date: '2024-03-14', count: 189, pages: { home: 95, products: 65, cart: 29 } },
    { date: '2024-03-13', count: 267, pages: { home: 130, products: 89, cart: 48 } },
    { date: '2024-03-12', count: 198, pages: { home: 98, products: 70, cart: 30 } },
    { date: '2024-03-11', count: 215, pages: { home: 105, products: 75, cart: 35 } }
  ],
  regionStats: [
    { region: 'North America', count: 450, flag: '🇺🇸', percentage: 45 },
    { region: 'Europe', count: 280, flag: '🇪🇺', percentage: 28 },
    { region: 'Asia', count: 180, flag: '🇯🇵', percentage: 18 },
    { region: 'Others', count: 90, flag: '🌍', percentage: 9 }
  ],
  pageViews: {
    home: 580,
    products: 420,
    cart: 210,
    checkout: 150
  }
};