// Mock Product Service
import type { 
  Product, 
  ProductFilters, 
  ProductStats, 
  CreateProductRequest, 
  UpdateProductRequest,
  Category 
} from "@/types/products";

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Signature Jollof Rice",
    description: "Our famous smoky party jollof rice",
    productCode: "PRD-001",
    category: "Mains",
    categoryId: "cat-1",
    price: 2500,
    sellingPrice: 3500,
    sku: "JOL-001",
    stock: 45,
    status: true,
    supplier: "Fresh Farms Ltd",
    supplierId: "sup-1",
    prepTime: 25,
    taxOption: "Standard VAT",
    discountOption: "None",
    visibility: ["pos", "storefront"],
    ingredients: [
      { id: "ing-1", ingredientId: "raw-1", name: "Basmati Rice", unit: "kg", quantity: 0.3 },
      { id: "ing-2", ingredientId: "raw-2", name: "Tomato Paste", unit: "tin", quantity: 0.5 },
    ],
    variations: [
      { id: "var-1", name: "Small", sku: "JOL-001-S", price: 2000, sellingPrice: 2500 },
      { id: "var-2", name: "Large", sku: "JOL-001-L", price: 3000, sellingPrice: 4000 },
    ],
    addons: ["Extra Protein", "Sides"],
    storeId: "store-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
  {
    id: "2",
    name: "Peppered Chicken",
    description: "Crispy fried chicken with spicy pepper sauce",
    productCode: "PRD-002",
    category: "Mains",
    categoryId: "cat-1",
    price: 2000,
    sellingPrice: 2800,
    sku: "PPC-001",
    stock: 28,
    status: true,
    supplier: "Quality Meats",
    supplierId: "sup-2",
    prepTime: 20,
    taxOption: "Standard VAT",
    discountOption: "WELCOME20",
    visibility: ["pos", "storefront", "ubereats"],
    ingredients: [
      { id: "ing-3", ingredientId: "raw-3", name: "Chicken (Whole)", unit: "kg", quantity: 0.5 },
    ],
    variations: [],
    addons: ["Sides", "Drinks"],
    storeId: "store-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
  {
    id: "3",
    name: "Suya Platter",
    description: "Thinly sliced beef skewers with suya spice",
    productCode: "PRD-003",
    category: "Specialties",
    categoryId: "cat-2",
    price: 3500,
    sellingPrice: 4500,
    sku: "SUY-001",
    stock: 0,
    status: false,
    supplier: "Quality Meats",
    supplierId: "sup-2",
    prepTime: 30,
    taxOption: "Standard VAT",
    discountOption: "None",
    visibility: ["pos"],
    ingredients: [
      { id: "ing-4", ingredientId: "raw-4", name: "Suya Spice Mix", unit: "kg", quantity: 0.1 },
    ],
    variations: [],
    addons: [],
    storeId: "store-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
  {
    id: "4",
    name: "Fried Rice",
    description: "Nigerian style fried rice with vegetables",
    productCode: "PRD-004",
    category: "Mains",
    categoryId: "cat-1",
    price: 2200,
    sellingPrice: 3000,
    sku: "FRD-001",
    stock: 35,
    status: true,
    supplier: "Fresh Farms Ltd",
    supplierId: "sup-1",
    prepTime: 20,
    taxOption: "Standard VAT",
    discountOption: "None",
    visibility: ["pos", "storefront", "ubereats"],
    ingredients: [],
    variations: [
      { id: "var-3", name: "Regular", sku: "FRD-001-R", price: 2200, sellingPrice: 3000 },
      { id: "var-4", name: "Large", sku: "FRD-001-L", price: 2800, sellingPrice: 3800 },
    ],
    addons: ["Extra Protein"],
    storeId: "store-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
  {
    id: "5",
    name: "Chapman",
    description: "Classic Nigerian cocktail drink",
    productCode: "PRD-005",
    category: "Drinks",
    categoryId: "cat-3",
    price: 800,
    sellingPrice: 1200,
    sku: "CHP-001",
    stock: 100,
    status: true,
    prepTime: 5,
    taxOption: "No VAT",
    discountOption: "None",
    visibility: ["pos", "storefront"],
    ingredients: [],
    variations: [],
    addons: [],
    storeId: "store-1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
];

const mockCategories: Category[] = [
  { id: "cat-1", name: "Mains", emoji: "🍚", description: "Main dishes", productCount: 3, isActive: true, storeId: "store-1" },
  { id: "cat-2", name: "Specialties", emoji: "⭐", description: "Chef specials", productCount: 1, isActive: true, storeId: "store-1" },
  { id: "cat-3", name: "Drinks", emoji: "🍹", description: "Beverages", productCount: 1, isActive: true, storeId: "store-1" },
  { id: "cat-4", name: "Starters", emoji: "🥗", description: "Appetizers", productCount: 0, isActive: true, storeId: "store-1" },
  { id: "cat-5", name: "Desserts", emoji: "🍰", description: "Sweet treats", productCount: 0, isActive: true, storeId: "store-1" },
];

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Product Service API
export const productService = {
  // Get all products
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    await delay(300);
    
    let result = [...mockProducts];
    
    if (filters?.categoryId) {
      result = result.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters?.status !== undefined) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters?.visibility) {
      result = result.filter(p => p.visibility.includes(filters.visibility!));
    }
    if (filters?.storeId) {
      result = result.filter(p => p.storeId === filters.storeId);
    }
    if (filters?.inStock) {
      result = result.filter(p => p.stock > 0);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.productCode.toLowerCase().includes(search)
      );
    }
    
    return result;
  },

  // Get single product
  async getProduct(id: string): Promise<Product | null> {
    await delay(200);
    return mockProducts.find(p => p.id === id) || null;
  },

  // Create product
  async createProduct(data: CreateProductRequest): Promise<Product> {
    await delay(500);
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: data.name,
      description: data.description,
      productCode: `PRD-${Date.now().toString().slice(-3)}`,
      category: "",
      categoryId: data.categoryId,
      price: data.price,
      sellingPrice: data.sellingPrice,
      sku: data.sku || `SKU-${Date.now()}`,
      stock: data.stock || 0,
      status: true,
      supplierId: data.supplierId,
      prepTime: data.prepTime || 15,
      taxOption: data.taxOption || "Standard VAT",
      discountOption: "None",
      visibility: data.visibility || ["pos"],
      ingredients: (data.ingredients || []).map((ing, idx) => ({ ...ing, id: `ing-${idx}` })),
      variations: (data.variations || []).map((v, idx) => ({ ...v, id: `var-${idx}` })),
      addons: data.addons || [],
      storeId: data.storeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.unshift(newProduct);
    return newProduct;
  },

  // Update product
  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product | null> {
    await delay(300);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockProducts[index];
  },

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    await delay(300);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    mockProducts.splice(index, 1);
    return true;
  },

  // Toggle product status
  async toggleStatus(id: string): Promise<Product | null> {
    await delay(200);
    const product = mockProducts.find(p => p.id === id);
    if (!product) return null;
    product.status = !product.status;
    product.updatedAt = new Date().toISOString();
    return product;
  },

  // Get stats
  async getStats(storeId?: string): Promise<ProductStats> {
    await delay(200);
    const products = storeId ? mockProducts.filter(p => p.storeId === storeId) : mockProducts;
    const categories = storeId ? mockCategories.filter(c => c.storeId === storeId) : mockCategories;
    
    return {
      total: products.length,
      active: products.filter(p => p.status).length,
      outOfStock: products.filter(p => p.stock === 0).length,
      categories: categories.length,
    };
  },

  // Category methods
  async getCategories(storeId?: string): Promise<Category[]> {
    await delay(200);
    return storeId ? mockCategories.filter(c => c.storeId === storeId) : mockCategories;
  },

  async createCategory(data: Omit<Category, 'id' | 'productCount'>): Promise<Category> {
    await delay(300);
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };
    mockCategories.push(newCategory);
    return newCategory;
  },
};
