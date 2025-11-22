// Local Database using localStorage with IndexedDB-like interface

const DB_PREFIX = 'stockmaster_';

export class LocalDatabase {
  private prefix: string;

  constructor(prefix: string = DB_PREFIX) {
    this.prefix = prefix;
  }

  // Generic CRUD operations
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
      throw error;
    }
  }

  async getAll<T>(keyPrefix: string): Promise<T[]> {
    try {
      const items: T[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix + keyPrefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            items.push(JSON.parse(item));
          }
        }
      }
      return items;
    } catch (error) {
      console.error(`Error getting all ${keyPrefix}:`, error);
      return [];
    }
  }

  // Collection operations (for arrays)
  async getCollection<T>(collectionName: string): Promise<T[]> {
    const data = await this.get<T[]>(collectionName);
    return data || [];
  }

  async addToCollection<T extends { id: string }>(collectionName: string, item: T): Promise<T> {
    const collection = await this.getCollection<T>(collectionName);
    collection.push(item);
    await this.set(collectionName, collection);
    return item;
  }

  async updateInCollection<T extends { id: string }>(
    collectionName: string,
    id: string,
    updates: Partial<T>
  ): Promise<T | null> {
    const collection = await this.getCollection<T>(collectionName);
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) return null;
    collection[index] = { ...collection[index], ...updates };
    await this.set(collectionName, collection);
    return collection[index];
  }

  async deleteFromCollection<T extends { id: string }>(
    collectionName: string,
    id: string
  ): Promise<boolean> {
    const collection = await this.getCollection<T>(collectionName);
    const filtered = collection.filter((item) => item.id !== id);
    await this.set(collectionName, filtered);
    return true;
  }

  async findInCollection<T>(collectionName: string, predicate: (item: T) => boolean): Promise<T[]> {
    const collection = await this.getCollection<T>(collectionName);
    return collection.filter(predicate);
  }

  async findOneInCollection<T>(
    collectionName: string,
    predicate: (item: T) => boolean
  ): Promise<T | null> {
    const collection = await this.getCollection<T>(collectionName);
    return collection.find(predicate) || null;
  }

  // Clear all data
  async clear(): Promise<void> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key);
        }
      }
      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }
}

// Singleton instance
export const db = new LocalDatabase();

// Database collections
export const DB_COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  WAREHOUSES: 'warehouses',
  CATEGORIES: 'categories',
  UOMS: 'uoms',
  RECEIPTS: 'receipts',
  DELIVERIES: 'deliveries',
  TRANSFERS: 'transfers',
  ADJUSTMENTS: 'adjustments',
  STOCK_MOVES: 'stock_moves',
} as const;

