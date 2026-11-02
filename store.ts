export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
};

export type StoreSettings = {
  pageName: string;
  latinName: string;
  sponsor: string;
  whatsapp: string;
  phone: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};

export type StoreData = {
  settings: StoreSettings;
  products: Product[];
};

const STORAGE_KEY = "montgk-store-data";
const UPDATE_EVENT = "montgk-store-updated";

export const categoryNames = [
  "توك وإكسسوارات",
  "استانلس 316L",
  "بلاستيكات",
  "رفايع منزل",
  "خردوات",
  "أدوات مدرسية",
  "شغل مواسم",
];

const defaultData: StoreData = {
  settings: {
    pageName: "مـنتـجـكْ",
    latinName: "Montgk",
    sponsor: "MrBoO",
    whatsapp: "",
    phone: "",
    facebook: "",
    instagram: "",
    tiktok: "",
  },
  products: [
    {
      id: "sample-1",
      name: "تشكيلة توك وإكسسوارات",
      category: "توك وإكسسوارات",
      price: "اسأل عن السعر",
      description: "اختيارات بسيطة تتجدد باستمرار.",
      image: "",
    },
    {
      id: "sample-2",
      name: "قطع استانلس 316L",
      category: "استانلس 316L",
      price: "اسأل عن السعر",
      description: "قطع عملية للاستخدام اليومي.",
      image: "",
    },
  ],
};

function cloneDefault(): StoreData {
  return JSON.parse(JSON.stringify(defaultData)) as StoreData;
}

export function getStoreSnapshot(): StoreData {
  if (typeof window === "undefined") return cloneDefault();

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneDefault();
    const parsed = JSON.parse(saved) as Partial<StoreData>;
    return {
      settings: { ...defaultData.settings, ...(parsed.settings ?? {}) },
      products: Array.isArray(parsed.products) ? parsed.products : cloneDefault().products,
    };
  } catch {
    return cloneDefault();
  }
}

export function saveStoreData(data: StoreData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function subscribeToStore(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  window.addEventListener(UPDATE_EVENT, onStorage);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(UPDATE_EVENT, onStorage);
  };
}
