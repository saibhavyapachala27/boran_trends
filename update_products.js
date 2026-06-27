import fs from 'fs';
import path from 'path';

const filePath = './src/data/products.json';
const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const CATEGORY_MAP = {
  'Baggy Jeans': 'Jeans',
  'Regular Jeans': 'Jeans',
  'Premium Denim': 'Jeans',
  'Linen Pants': 'Trousers',
  'Formal Pants': 'Trousers',
  'Linen Shirts': 'Shirts',
  'Cotton Shirts': 'Shirts',
  'Formal Shirts': 'Shirts',
  'Printed Shirts': 'Shirts',
  'Half-Hand Shirts': 'Shirts',
  'Acid Wash Shirts': 'Shirts',
  'Oversized T-Shirts': 'T-Shirts',
  'Down Shoulder T-Shirts': 'T-Shirts',
  'Printed Baggy T-Shirts': 'T-Shirts',
  'Graphic T-Shirts': 'T-Shirts',
  'Premium Fashion Collection': 'Co-ord Sets',
};

// Map existing products
products.forEach(p => {
  if (CATEGORY_MAP[p.category]) {
    p.category = CATEGORY_MAP[p.category];
  }
  // Remove Mothkur stock to align with Bhongir and Jangaon only
  delete p.stock_mothkur;
  if (p.variants) {
    p.variants.forEach(v => {
      delete v.stock_mothkur;
    });
  }
});

// Seed new items
const newItems = [
  {
    id: "cargo_utility_1",
    name: "Utility Multi-Pocket Cargo Pants",
    category: "Cargos",
    price: 1499,
    original_price: 2199,
    description: "Premium heavy-cotton canvas cargos featuring multiple utility pockets, tactical strap details, and an adjustable ankle drawcord. Designed for a clean, modern aesthetic.",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80"],
    colors: ["Black", "Olive", "Khaki"],
    sizes: ["30", "32", "34", "36"],
    stock_bhongir: 15,
    stock_jangaon: 12,
    is_trending: true,
    is_new_arrival: true,
    is_featured: true,
    status: "active",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    created_by: "admin@borantrends.com",
    is_sample: false
  },
  {
    id: "coord_linen_1",
    name: "Summer Resort Linen Co-ord Set",
    category: "Co-ord Sets",
    price: 2499,
    original_price: 3499,
    description: "Premium lightweight linen blend shirt and shorts co-ord set. Ideal for casual summer getaways, resort wear, or high-street aesthetic styling.",
    images: ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=600&q=80"],
    colors: ["Beige", "Cream", "Navy"],
    sizes: ["M", "L", "XL", "XXL"],
    stock_bhongir: 10,
    stock_jangaon: 14,
    is_trending: true,
    is_new_arrival: true,
    is_featured: false,
    status: "active",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    created_by: "admin@borantrends.com",
    is_sample: false
  },
  {
    id: "ethnic_silk_1",
    name: "Royal Banarasi Silk Kurta Pyjama",
    category: "Ethnic Wear",
    price: 3299,
    original_price: 4999,
    description: "Elegant Banarasi silk blend kurta with intricate embroidery on the collar and button placket, paired with comfortable cotton pyjamas. Perfect for weddings and festive occasions.",
    images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80"],
    colors: ["Maroon", "Navy Blue", "Gold"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock_bhongir: 18,
    stock_jangaon: 15,
    is_trending: false,
    is_new_arrival: true,
    is_featured: true,
    status: "active",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    created_by: "admin@borantrends.com",
    is_sample: false
  },
  {
    id: "jacket_denim_1",
    name: "Vintage Sherpa Denim Jacket",
    category: "Jackets",
    price: 2199,
    original_price: 2999,
    description: "Heavyweight denim jacket featuring a cozy sherpa fleece lining, button closure, chest flap pockets, and handwarmer pockets. The ultimate layering piece for cold weather.",
    images: ["https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&w=600&q=80"],
    colors: ["Classic Blue", "Vintage Black"],
    sizes: ["M", "L", "XL", "XXL"],
    stock_bhongir: 12,
    stock_jangaon: 10,
    is_trending: true,
    is_new_arrival: false,
    is_featured: false,
    status: "active",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    created_by: "admin@borantrends.com",
    is_sample: false
  },
  {
    id: "hoodie_fleece_1",
    name: "Oversized Fleece Hoodie",
    category: "Hoodies",
    price: 1899,
    original_price: 2599,
    description: "Ultra-soft heavyweight cotton fleece hoodie with a relaxed oversized silhouette, drop shoulders, kangaroo pocket, and double-lined hood. Designed for absolute comfort.",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"],
    colors: ["Grey", "Black", "Sage"],
    sizes: ["S", "M", "L", "XL"],
    stock_bhongir: 20,
    stock_jangaon: 18,
    is_trending: false,
    is_new_arrival: true,
    is_featured: true,
    status: "active",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    created_by: "admin@borantrends.com",
    is_sample: false
  },
  {
    id: "footwear_sneaker_1",
    name: "Classic White Leather Sneakers",
    category: "Footwear",
    price: 2799,
    original_price: 3999,
    description: "Minimalist sneakers handcrafted from full-grain leather, featuring a comfortable padded collar, breathable leather lining, and durable rubber cupsole. Perfect for smart-casual wear.",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"],
    colors: ["White", "Tan"],
    sizes: ["7", "8", "9", "10"],
    stock_bhongir: 14,
    stock_jangaon: 16,
    is_trending: true,
    is_new_arrival: true,
    is_featured: true,
    status: "active",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    created_by: "admin@borantrends.com",
    is_sample: false
  },
  {
    id: "access_sunglasses_1",
    name: "Polarized Acetate Wayfarer Sunglasses",
    category: "Accessories",
    price: 999,
    original_price: 1499,
    description: "Classic wayfarer sunglasses crafted from hand-polished acetate, featuring polarized UV400 protective lenses and reinforced metal hinges.",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"],
    colors: ["Black", "Tortoise"],
    sizes: ["One Size"],
    stock_bhongir: 30,
    stock_jangaon: 25,
    is_trending: false,
    is_new_arrival: false,
    is_featured: false,
    status: "active",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    created_by: "admin@borantrends.com",
    is_sample: false
  }
];

// Add seed items
products.push(...newItems);

// Write output
fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
console.log("Database update and seeding completed successfully.");
