import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ExternalLink,
  ImagePlus,
  Link2,
  PackagePlus,
  Pencil,
  Phone,
  Save,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import {
  categoryNames,
  getStoreSnapshot,
  saveStoreData,
  type Product,
  type StoreData,
  type StoreSettings,
} from "@/lib/store";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: categoryNames[0],
  price: "",
  description: "",
  image: "",
};

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `product-${Date.now()}`;
}

export default function Admin() {
  const [data, setData] = useState<StoreData>(() => getStoreSnapshot());
  const [tab, setTab] = useState<"products" | "settings">("products");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

  const productCountLabel = useMemo(() => `${data.products.length} منتج`, [data.products.length]);

  const showSaved = (message: string) => {
    setSavedMessage(message);
    window.setTimeout(() => setSavedMessage(""), 2500);
  };

  const persist = (next: StoreData, message: string) => {
    setData(next);
    saveStoreData(next);
    showSaved(message);
  };

  const handleProductSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productForm.name.trim()) return;

    const nextProducts = editingId
      ? data.products.map((product) => product.id === editingId ? { ...product, ...productForm, name: productForm.name.trim() } : product)
      : [{ ...productForm, id: makeId(), name: productForm.name.trim() }, ...data.products];

    persist({ ...data, products: nextProducts }, editingId ? "تم تعديل المنتج" : "تمت إضافة المنتج");
    setProductForm(emptyProduct);
    setEditingId(null);
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = (id: string) => {
    if (!window.confirm("تحب تمسح المنتج ده من الموقع؟")) return;
    persist({ ...data, products: data.products.filter((product) => product.id !== id) }, "تم حذف المنتج");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProductForm(emptyProduct);
  };

  const updateSetting = (key: keyof StoreSettings, value: string) => {
    setData((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  const saveSettings = () => {
    persist(data, "تم حفظ بيانات الصفحة");
  };

  const field = (label: string, key: keyof StoreSettings, placeholder: string, icon: ReactNode) => (
    <label className="admin-field">
      <span>{icon}{label}</span>
      <input value={data.settings[key]} onChange={(event) => updateSetting(key, event.target.value)} placeholder={placeholder} />
    </label>
  );

  return (
    <main className="admin-shell" dir="rtl">
      <header className="admin-header">
        <div className="admin-container admin-header-inner">
          <a className="admin-brand" href="/">
            <span className="admin-brand-mark">م</span>
            <span><strong>لوحة تحكم {data.settings.pageName || "مـنتـجـكْ"}</strong><small>برعاية {data.settings.sponsor || "MrBoO"}</small></span>
          </a>
          <a className="admin-preview-link" href="/"><ExternalLink size={16} /> مشاهدة الموقع</a>
        </div>
      </header>

      <section className="admin-intro admin-container">
        <div>
          <div className="admin-kicker">إدارة سهلة من مكان واحد</div>
          <h1>أهلاً بيك في لوحة التحكم</h1>
          <p>ضيف منتج، عدّل بيانات التواصل، واحفظ. التغيير بيظهر على الصفحة الرئيسية فورًا.</p>
        </div>
        <div className="admin-stat"><strong>{productCountLabel}</strong><span>ظاهرين في الموقع</span></div>
      </section>

      <div className="admin-container admin-tabs" role="tablist" aria-label="أقسام لوحة التحكم">
        <button className={tab === "products" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("products")} type="button"><PackagePlus size={18} /> المنتجات</button>
        <button className={tab === "settings" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("settings")} type="button"><Settings2 size={18} /> بيانات الصفحة والتواصل</button>
      </div>

      <div className="admin-container admin-content">
        {tab === "products" ? (
          <div className="admin-layout">
            <section className="admin-panel product-form-panel">
              <div className="admin-panel-heading"><div><span className="admin-panel-icon"><PackagePlus size={19} /></span><div><h2>{editingId ? "تعديل منتج" : "إضافة منتج جديد"}</h2><p>اكتب البيانات الأساسية وسيظهر المنتج مباشرة.</p></div></div>{editingId && <button className="icon-button" type="button" onClick={cancelEdit} aria-label="إلغاء التعديل"><X size={17} /></button>}</div>
              <form onSubmit={handleProductSubmit}>
                <label className="admin-field"><span>اسم المنتج</span><input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="مثال: سلسلة استانلس" /></label>
                <div className="admin-field-row"><label className="admin-field"><span>القسم</span><select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>{categoryNames.map((category) => <option key={category}>{category}</option>)}</select></label><label className="admin-field"><span>السعر</span><input value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} placeholder="مثال: 50 جنيه" /></label></div>
                <label className="admin-field"><span>وصف قصير</span><textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="وصف بسيط للمنتج" rows={3} /></label>
                <label className="admin-field"><span><ImagePlus size={15} /> رابط صورة المنتج <small>اختياري</small></span><input dir="ltr" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} placeholder="https://..." /></label>
                <button className="admin-save-button" type="submit"><Save size={17} /> {editingId ? "حفظ التعديل" : "إضافة المنتج"}</button>
              </form>
            </section>

            <section className="admin-panel product-list-panel">
              <div className="admin-panel-heading"><div><span className="admin-panel-icon green"><Check size={19} /></span><div><h2>المنتجات الحالية</h2><p>تقدر تعدّل أو تمسح أي منتج في أي وقت.</p></div></div></div>
              <div className="admin-product-list">
                {data.products.map((product) => <article className="admin-product-row" key={product.id}><div className="admin-product-thumb">{product.image ? <img src={product.image} alt="" /> : <PackagePlus size={20} />}</div><div className="admin-product-info"><strong>{product.name}</strong><span>{product.category} · {product.price || "بدون سعر"}</span></div><div className="admin-row-actions"><button type="button" onClick={() => editProduct(product)} aria-label={`تعديل ${product.name}`}><Pencil size={15} /></button><button type="button" onClick={() => deleteProduct(product.id)} aria-label={`حذف ${product.name}`}><Trash2 size={15} /></button></div></article>)}
                {data.products.length === 0 && <div className="admin-empty">لسه مفيش منتجات. أضف أول منتج من النموذج.</div>}
              </div>
            </section>
          </div>
        ) : (
          <section className="admin-panel settings-panel">
            <div className="admin-panel-heading"><div><span className="admin-panel-icon"><Settings2 size={19} /></span><div><h2>بيانات الصفحة والتواصل</h2><p>البيانات دي بتظهر للزوار في الهيدر والفوتر وقسم التواصل.</p></div></div></div>
            <div className="settings-grid">
              {field("اسم الصفحة بالعربي", "pageName", "مـنتـجـكْ", <Settings2 size={15} />)}
              {field("الاسم بالإنجليزي", "latinName", "Montgk", <Link2 size={15} />)}
              {field("برعاية", "sponsor", "MrBoO", <Check size={15} />)}
              {field("رقم واتساب", "whatsapp", "201xxxxxxxxx", <Phone size={15} />)}
              {field("رقم الهاتف", "phone", "01xxxxxxxxx", <Phone size={15} />)}
              {field("رابط فيسبوك", "facebook", "https://facebook.com/...", <Link2 size={15} />)}
              {field("رابط إنستجرام", "instagram", "https://instagram.com/...", <Link2 size={15} />)}
              {field("رابط تيك توك", "tiktok", "https://tiktok.com/@...", <Link2 size={15} />)}
            </div>
            <div className="settings-note">نصيحة: اكتب رقم الواتساب بصيغة دولية بدون علامة +، مثال مصر: <b>2010xxxxxxxx</b></div>
            <button className="admin-save-button settings-save" type="button" onClick={saveSettings}><Save size={17} /> حفظ بيانات الصفحة</button>
          </section>
        )}
      </div>

      {savedMessage && <div className="saved-toast"><Check size={17} /> {savedMessage}</div>}
      <footer className="admin-footer"><a href="/">← الرجوع للموقع</a><span>مـنتـجـكْ · Montgk — برعاية MrBoO</span></footer>
    </main>
  );
}
