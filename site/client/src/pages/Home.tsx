import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  CalendarDays,
  ChevronLeft,
  Facebook,
  Gem,
  House,
  Instagram,
  MessageCircle,
  Package,
  Palette,
  Phone,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { getStoreSnapshot, subscribeToStore, type Product } from "@/lib/store";

type Category = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  soft: string;
  tag: string;
};

const categories: Category[] = [
  {
    title: "توك وإكسسوارات",
    description: "لمسات صغيرة تكمّل كل ستايل",
    icon: Sparkles,
    accent: "#B87961",
    soft: "#F5E5DD",
    tag: "الأكثر طلبًا",
  },
  {
    title: "استانلس 316L",
    description: "قطع أنيقة للاستخدام اليومي",
    icon: Gem,
    accent: "#55766A",
    soft: "#E2EEE8",
    tag: "جودة عملية",
  },
  {
    title: "بلاستيكات",
    description: "اختيارات مفيدة للبيت والشغل",
    icon: Package,
    accent: "#6989A4",
    soft: "#E2ECF4",
    tag: "كل يوم",
  },
  {
    title: "رفايع منزل",
    description: "تفاصيل بسيطة تظبط البيت",
    icon: House,
    accent: "#A78354",
    soft: "#F1E9D9",
    tag: "للبيت",
  },
  {
    title: "خردوات",
    description: "الحاجات الصغيرة وقت ما تحتاجها",
    icon: Wrench,
    accent: "#6A7788",
    soft: "#E6EAF0",
    tag: "متنوع",
  },
  {
    title: "أدوات مدرسية",
    description: "ألوان وأدوات لكل بداية جديدة",
    icon: Palette,
    accent: "#B46D78",
    soft: "#F5E1E5",
    tag: "للدراسة",
  },
  {
    title: "شغل مواسم",
    description: "اختيارات تتجدد مع كل مناسبة",
    icon: CalendarDays,
    accent: "#8A6B89",
    soft: "#EEE3EF",
    tag: "على حسب الموسم",
  },
];

const marqueeItems = [
  "توك وإكسسوارات",
  "استانلس 316L",
  "بلاستيكات",
  "رفايع منزل",
  "خردوات",
  "أدوات مدرسية",
  "شغل مواسم",
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [storeData, setStoreData] = useState(() => getStoreSnapshot());

  useEffect(() => subscribeToStore(() => setStoreData(getStoreSnapshot())), []);

  const filteredCategories = categories.filter((category) => {
    const matchesActive = activeCategory === "الكل" || category.title === activeCategory;
    const query = searchTerm.trim();
    const matchesSearch = !query || `${category.title} ${category.description}`.includes(query);
    return matchesActive && matchesSearch;
  });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="site-shell" dir="rtl">
      <div className="topline">
        <div className="container topline-inner">
          <span>أصناف يومية بأسعار قريبة منك</span>
          <span className="topline-dot" aria-hidden="true" />
          <span>اسألنا عن المتاح الجديد</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#home" aria-label="العودة إلى الرئيسية">
            <span className="brand-mark" aria-hidden="true">
              <Boxes size={21} strokeWidth={1.8} />
            </span>
            <span>
              <strong>{storeData.settings.pageName || "مـنتـجـكْ"}</strong>
              <small>{storeData.settings.latinName || "Montgk"} · برعاية {storeData.settings.sponsor || "MrBoO"}</small>
            </span>
          </a>

          <nav className="main-nav" aria-label="التنقل الرئيسي">
            <a className="active" href="#home">الرئيسية</a>
            <a href="#categories">الأقسام</a>
            <a href="#about">عن المحل</a>
          </nav>

          <button className="header-contact" type="button" onClick={() => scrollTo("contact")}>
            <Phone size={16} />
            <span>كلمنا</span>
          </button>
        </div>
      </header>

      <div className="marquee-wrap" aria-label="الأقسام المتاحة">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span className="marquee-item" key={`${item}-${index}`}>
              {item}
              <i aria-hidden="true">✦</i>
            </span>
          ))}
        </div>
      </div>

      <section id="home" className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> {storeData.settings.pageName || "مـنتـجـكْ"} — اختيارات كتير</div>
            <h1>كل اللي ناقصك<br /><em>في مشوار واحد.</em></h1>
            <p>
              من التوك والإكسسوارات لحد الرفايع والأدوات المدرسية، بنجمعلك أصناف متنوعة تنفع البيت والشغل وكل يوم.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={() => scrollTo("categories")}>
                شوف الأقسام
                <ArrowLeft size={18} />
              </button>
              <button className="text-button" type="button" onClick={() => scrollTo("about")}>
                اعرف عن المحل
                <ChevronLeft size={17} />
              </button>
            </div>
            <div className="hero-note">
              <span className="note-icon"><BadgeCheck size={17} /></span>
              <span>الأصناف بتتجدد باستمرار — اسألنا عن الجديد من لوحة التحكم</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="لمحة عن تنوع الأصناف">
            <div className="paper-shadow paper-shadow-one" />
            <div className="paper-shadow paper-shadow-two" />
            <div className="hero-card">
              <div className="hero-card-top">
                <span className="tiny-label">تشكيلة النهارده</span>
                <span className="hero-card-number">07</span>
              </div>
              <div className="shelf-art" aria-hidden="true">
                <span className="shelf-line shelf-line-one" />
                <span className="shelf-line shelf-line-two" />
                <span className="art-circle art-circle-one"><Gem size={27} /></span>
                <span className="art-circle art-circle-two"><Sparkles size={24} /></span>
                <span className="art-box art-box-one"><Package size={29} /></span>
                <span className="art-box art-box-two"><Palette size={24} /></span>
              </div>
              <div className="hero-card-bottom">
                <span>من البيت للمدرسة</span>
                <span className="card-arrow"><ArrowLeft size={15} /></span>
              </div>
            </div>
            <div className="round-stamp">
              <span>كل يوم</span>
              <strong>صنف</strong>
              <span>جديد</span>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="categories-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span /> اختار اللي يناسبك</div>
              <h2>أقسامنا على السريع</h2>
            </div>
            <p>كل قسم فيه اختيارات كتير، واللي مش موجود النهارده ممكن تلاقيه بكرة.</p>
          </div>

          <div className="filter-row" role="toolbar" aria-label="فلترة الأقسام">
            <div className="search-box">
              <Search size={17} />
              <input
                aria-label="ابحث في الأقسام"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="دور على قسم..."
              />
            </div>
            <div className="filter-pills">
              {["الكل", ...categories.map((category) => category.title)].map((label) => (
                <button
                  className={activeCategory === label ? "filter-pill selected" : "filter-pill"}
                  key={label}
                  type="button"
                  onClick={() => setActiveCategory(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="category-grid">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  className="category-card"
                  type="button"
                  key={category.title}
                  onClick={() => setActiveCategory(category.title)}
                  style={{ "--card-accent": category.accent, "--card-soft": category.soft } as React.CSSProperties}
                >
                  <div className="category-card-head">
                    <span className="category-icon"><Icon size={23} strokeWidth={1.7} /></span>
                    <span className="category-tag">{category.tag}</span>
                  </div>
                  <div className="category-card-copy">
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </div>
                  <span className="category-arrow"><ArrowLeft size={16} /></span>
                </button>
              );
            })}
          </div>
          {filteredCategories.length === 0 && (
            <div className="empty-state">مش لاقيين القسم ده دلوقتي، جرّب كلمة تانية.</div>
          )}
        </div>
      </section>

      <section id="products" className="products-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span /> المعروض حاليًا</div>
              <h2>منتجات نرشحهالك</h2>
            </div>
            <p>المنتجات دي بتتضاف وتتعدل بسهولة من لوحة التحكم.</p>
          </div>
          <div className="product-grid">
            {storeData.products.map((product: Product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  {product.image ? <img src={product.image} alt={product.name} /> : <Package size={31} strokeWidth={1.4} />}
                  <span>{product.category}</span>
                </div>
                <div className="product-card-copy"><h3>{product.name}</h3><p>{product.description || "اختيار عملي من تشكيلة مـنتـجـكْ."}</p><strong>{product.price || "اسأل عن السعر"}</strong></div>
              </article>
            ))}
          </div>
          {storeData.products.length === 0 && <div className="empty-state">المنتجات هتظهر هنا أول ما تضيفها من لوحة التحكم.</div>}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container about-panel">
          <div className="about-mark"><House size={25} strokeWidth={1.6} /></div>
          <div>
            <div className="eyebrow"><span /> عن «{storeData.settings.pageName || "مـنتـجـكْ"}»</div>
            <h2>حاجات صغيرة، بس بتفرق.</h2>
            <p>إحنا بنحب نوفرلك الاختيارات اللي بتدور عليها في مكان قريب وبطريقة سهلة. الصفحة دي بتتحدث من لوحة التحكم، عشان نضيف المنتجات والأسعار وطرق التواصل أول بأول.</p>
          </div>
          <div className="about-stats">
            <div><strong>07</strong><span>أقسام أساسية</span></div>
            <div><strong>∞</strong><span>اختيارات بتتجدد</span></div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container contact-inner">
          <div>
            <div className="eyebrow"><span /> تواصل معانا</div>
            <h2>عايز تسأل عن حاجة؟</h2>
            <p>{storeData.settings.phone || storeData.settings.whatsapp ? "كلمنا أو ابعتلنا على الرقم المسجل عندنا." : "بيانات التواصل هتتضاف هنا من لوحة التحكم."}</p>
          </div>
          <div className="contact-actions">
            {storeData.settings.whatsapp ? <a className="contact-chip" href={`https://wa.me/${storeData.settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> واتساب</a> : <span className="contact-chip muted"><MessageCircle size={18} /> واتساب قريبًا</span>}
            {storeData.settings.phone ? <a className="contact-chip" href={`tel:${storeData.settings.phone}`}><Phone size={18} /> {storeData.settings.phone}</a> : <span className="contact-chip muted"><Phone size={18} /> رقم الهاتف قريبًا</span>}
            {storeData.settings.instagram ? <a className="contact-chip" href={storeData.settings.instagram} target="_blank" rel="noreferrer"><Instagram size={18} /> إنستجرام</a> : null}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© 2026 {storeData.settings.pageName || "مـنتـجـكْ"} · {storeData.settings.latinName || "Montgk"}</span>
          <span>برعاية {storeData.settings.sponsor || "MrBoO"}</span>
          <a className="admin-shortcut" href="/admin">لوحة التحكم</a>
          <div className="socials" aria-label="روابط التواصل الاجتماعي">
            {storeData.settings.facebook ? <a href={storeData.settings.facebook} target="_blank" rel="noreferrer" aria-label="فيسبوك"><Facebook size={16} /></a> : <button type="button" aria-label="فيسبوك"><Facebook size={16} /></button>}
            {storeData.settings.instagram ? <a href={storeData.settings.instagram} target="_blank" rel="noreferrer" aria-label="إنستجرام"><Instagram size={16} /></a> : <button type="button" aria-label="إنستجرام"><Instagram size={16} /></button>}
            {storeData.settings.whatsapp ? <a href={`https://wa.me/${storeData.settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="واتساب"><MessageCircle size={16} /></a> : <button type="button" aria-label="واتساب"><MessageCircle size={16} /></button>}
          </div>
        </div>
      </footer>
    </main>
  );
}
