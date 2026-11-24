import * as domoApi from "@/API/domoApi";
import { SEED_RESTAURANTS, SEED_MENU_ITEMS, SEED_COUPONS, SEED_RIDERS } from "./mockData";

const STORAGE_PREFIX = "foodie_appdb_";

// Helper to initialize local storage with mock data if empty
const initCollection = (name, initialData) => {
  const key = `${STORAGE_PREFIX}${name}`;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialData));
  }
};

// Initialize default collections
export const initLocalData = () => {
  initCollection("Foodie_Restaurants_v1", SEED_RESTAURANTS);
  initCollection("Foodie_MenuItems_v1", SEED_MENU_ITEMS);
  initCollection("Foodie_Coupons_v1", SEED_COUPONS);
  initCollection("Foodie_DeliveryPartnerProfiles_v1", SEED_RIDERS);
  initCollection("Foodie_Orders_v1", []);
  initCollection("Foodie_Bookmarks_v1", []);
  initCollection("Foodie_Complaints_v1", []);
  initCollection("Foodie_GroupOrders_v1", []);
  initCollection("Foodie_RestaurantStatusLogs_v1", []);
};

// Generic read
export const getCollectionDocuments = async (collectionName) => {
  try {
    const docs = await domoApi.ListDocuments(collectionName);
    if (Array.isArray(docs) && docs.length > 0) {
      return docs.map(d => ({ id: d.id, ...d.content }));
    }
  } catch (err) {
    // In local dev without live Domo AppDB, silently fall through to local fallback
    console.debug(`[AppDB] Falling back to local store for ${collectionName}:`, err.message || err);
  }

  // Local fallback
  initLocalData();
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${collectionName}`);
  return raw ? JSON.parse(raw) : [];
};

// Generic create
export const saveDocument = async (collectionName, data) => {
  try {
    const res = await domoApi.CreateDocument(collectionName, data);
    if (res && res.id) {
      return { id: res.id, ...data };
    }
  } catch (err) {
    console.debug(`[AppDB] Local store save for ${collectionName}`);
  }

  // Local storage save
  initLocalData();
  const key = `${STORAGE_PREFIX}${collectionName}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  const newDoc = { id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, ...data };
  existing.unshift(newDoc);
  localStorage.setItem(key, JSON.stringify(existing));
  return newDoc;
};

// Generic update
export const updateDocument = async (collectionName, docId, updatedFields) => {
  try {
    await domoApi.UpdateDocument(collectionName, docId, updatedFields);
  } catch (err) {
    console.debug(`[AppDB] Local store update for ${collectionName}`);
  }

  // Local storage update
  const key = `${STORAGE_PREFIX}${collectionName}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  const index = existing.findIndex(d => (d.id === docId || d.orderId === docId || d.restaurantId === docId));
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updatedFields };
    localStorage.setItem(key, JSON.stringify(existing));
    return existing[index];
  }
  return updatedFields;
};
