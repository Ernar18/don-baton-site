"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const ADMIN_PASSWORD = "123123";
const SITE_SLUG = "main";
const SITE_TABLE = "site_content";
const IMAGE_BUCKET = "site-images";
const DOC_BUCKET = "site-docs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const placeholderImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop stop-color="#fff7ed" offset="0%"/>
        <stop stop-color="#fde68a" offset="100%"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)" rx="24"/>
    <g fill="#b45309" opacity="0.9">
      <circle cx="400" cy="220" r="80"/>
      <rect x="250" y="330" width="300" height="36" rx="18"/>
      <rect x="300" y="385" width="200" height="24" rx="12" opacity="0.6"/>
    </g>
    <text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#92400e">Фото товара</text>
  </svg>
`);

const makeId = () => Math.random().toString(36).slice(2, 10);

const sanitizeFileName = (fileName) =>
  String(fileName || "file")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toLowerCase();

const makeFilePath = (folder, fileName) =>
  `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${sanitizeFileName(fileName)}`;

function SvgIcon({
  children,
  className = "h-5 w-5",
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.8,
  viewBox = "0 0 24 24",
  style,
}) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {children}
    </svg>
  );
}

const BreadIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M7 8c-2 0-4 1.8-4 4.2C3 16.6 6 20 10 20h4c4 0 7-3.4 7-7.8C21 9.8 19 8 17 8" />
    <path d="M7 8c0-2.2 1.8-4 4-4 1.4 0 2.5.6 3.2 1.7" />
    <path d="M9 11v2" />
    <path d="M13 10.5V13" />
    <path d="M17 11v2" />
  </SvgIcon>
);

const CakeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M5 10h14v8H5z" />
    <path d="M7 10c0-1.7 1.2-3 2.8-3 .9 0 1.7.4 2.2 1 .5-.6 1.3-1 2.2-1C15.8 7 17 8.3 17 10" />
    <path d="M12 7V4" />
    <path d="M11 4h2" />
    <path d="M5 14c1 1 2 1 3 0 1 1 2 1 3 0 1 1 2 1 3 0 1 1 2 1 3 0" />
  </SvgIcon>
);

const CookieIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="9" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="15" cy="14" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="10" cy="15" r="0.9" fill="currentColor" stroke="none" />
  </SvgIcon>
);

const ChefHatIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M7 10a3.5 3.5 0 0 1 3-5 4 4 0 0 1 7 2 3 3 0 1 1 0 6H7a3 3 0 1 1 0-3Z" />
    <path d="M8 13v5h8v-5" />
  </SvgIcon>
);

const BowlIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 12h16c0 4.4-3.6 8-8 8s-8-3.6-8-8Z" />
    <path d="M7 9c1-1 2.2-1 3.2 0 1-1 2.2-1 3.2 0 1-1 2.2-1 3.2 0" />
    <path d="M12 4v4" />
  </SvgIcon>
);

const PackageIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z" />
    <path d="M12 20v-7" />
    <path d="M4 8.5l8 4.5 8-4.5" />
  </SvgIcon>
);

const PhoneIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M7 5h3l1 4-2 1.5a14 14 0 0 0 4.5 4.5L15 13l4 1v3c0 1.1-.9 2-2 2C10.9 19 5 13.1 5 6c0-1.1.9-2 2-2Z" />
  </SvgIcon>
);

const MapPinIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Z" />
    <circle cx="12" cy="10" r="2.2" />
  </SvgIcon>
);

const InstagramIcon = (props) => (
  <SvgIcon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
  </SvgIcon>
);

const FileIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M8 3h6l4 4v14H8z" />
    <path d="M14 3v4h4" />
    <path d="M10 12h6" />
    <path d="M10 16h6" />
  </SvgIcon>
);

const ShieldIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3 6 5v5c0 4.2 2.4 8 6 10 3.6-2 6-5.8 6-10V5z" />
  </SvgIcon>
);

const PlusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </SvgIcon>
);

const MinusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M5 12h14" />
  </SvgIcon>
);

const CartIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="17" cy="19" r="1.5" />
    <path d="M4 5h2l2 9h9l2-6H8" />
  </SvgIcon>
);

const SaveIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M5 4h11l3 3v13H5z" />
    <path d="M8 4v5h7V4" />
    <path d="M8 18h8" />
  </SvgIcon>
);

const EditIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 20h4l10-10-4-4L4 16z" />
    <path d="m12 6 4 4" />
  </SvgIcon>
);

const TrashIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 7h16" />
    <path d="M9 7V5h6v2" />
    <path d="M7 7l1 12h8l1-12" />
  </SvgIcon>
);

const ChevronDownIcon = (props) => (
  <SvgIcon {...props}>
    <path d="m6 9 6 6 6-6" />
  </SvgIcon>
);

const ChevronUpIcon = (props) => (
  <SvgIcon {...props}>
    <path d="m6 15 6-6 6 6" />
  </SvgIcon>
);

const StoreIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M4 10h16v9H4z" />
    <path d="M5 10 7 5h10l2 5" />
    <path d="M9 19v-4h6v4" />
  </SvgIcon>
);

const SparklesIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2z" />
    <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z" />
    <path d="M5 14l.7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7z" />
  </SvgIcon>
);

const iconMap = {
  breads: BreadIcon,
  cakes: CakeIcon,
  pastry: CookieIcon,
  culinary: ChefHatIcon,
  salads: BowlIcon,
  dumplings: PackageIcon,
};

const defaultData = {
  company: {
    name: "Don Baton",
    slogan: "Печём для Вас с любовью!",
    instagram: "don_baton.kz",
    whatsapp: "+77712848464",
    whatsappDisplay: "+7 771 284 8464",
    address: "г. Кызылорда, Училищная 21",
    heroTitle: "Свежая выпечка и готовая продукция для магазинов",
    heroSubtitle:
      "Оформляйте заявки быстро и удобно. Выбирайте товары по категориям, указывайте количество и отправляйте заказ сразу в WhatsApp.",
    primaryColor: "#b45309",
    secondaryColor: "#7c2d12",
    accentColor: "#f59e0b",
    backgroundColor: "#fffaf5",
    heroImage: "",
    logo: "",
    pricePdfName: "",
    pricePdfUrl: "",
    catalogPdfName: "",
    catalogPdfUrl: "",
  },
  categories: [
    {
      id: "breads",
      name: "Хлебные изделия",
      description: "Свежий хлеб и фирменная выпечка для ежедневных поставок.",
      icon: "breads",
      products: [],
      sections: [
        {
          id: makeId(),
          name: "Хлебы премиум класса",
          products: [
            {
              id: makeId(),
              name: "Бородинский премиум",
              price: 420,
              unit: "шт",
              image: placeholderImage,
              description: "Плотный ароматный хлеб на закваске.",
            },
            {
              id: makeId(),
              name: "Зерновой премиум",
              price: 450,
              unit: "шт",
              image: placeholderImage,
              description: "Хлеб с семенами и золотистой корочкой.",
            },
          ],
        },
      ],
    },
    {
      id: "cakes",
      name: "Торты",
      description: "Торты для витрин, заказов и праздничных продаж.",
      icon: "cakes",
      products: [],
      sections: [
        {
          id: makeId(),
          name: "Основная категория",
          products: [
            {
              id: makeId(),
              name: "Медовый торт",
              price: 6500,
              unit: "кг",
              image: placeholderImage,
              description: "Нежные коржи и медовый крем.",
            },
          ],
        },
      ],
    },
    {
      id: "pastry",
      name: "Кондитерские изделия",
      description: "Пирожные, булочки, слойки и сладкая витрина.",
      icon: "pastry",
      products: [],
      sections: [
        {
          id: makeId(),
          name: "Основная категория",
          products: [
            {
              id: makeId(),
              name: "Эклер классический",
              price: 380,
              unit: "шт",
              image: placeholderImage,
              description: "Заварное пирожное с кремом.",
            },
          ],
        },
      ],
    },
    {
      id: "culinary",
      name: "Кулинария",
      description: "Готовые блюда и горячая витрина для магазинов.",
      icon: "culinary",
      products: [],
      sections: [
        {
          id: makeId(),
          name: "Основная категория",
          products: [
            {
              id: makeId(),
              name: "Самса с мясом",
              price: 420,
              unit: "шт",
              image: placeholderImage,
              description: "Сочная самса для горячей витрины.",
            },
          ],
        },
      ],
    },
    {
      id: "salads",
      name: "Салаты",
      description: "Салаты для готовой кулинарной витрины.",
      icon: "salads",
      products: [],
      sections: [
        {
          id: makeId(),
          name: "Основная категория",
          products: [
            {
              id: makeId(),
              name: "Оливье",
              price: 1800,
              unit: "кг",
              image: placeholderImage,
              description: "Классический салат для ежедневных продаж.",
            },
          ],
        },
      ],
    },
    {
      id: "dumplings",
      name: "Пельмени",
      description: "Замороженные полуфабрикаты и фирменные пельмени.",
      icon: "dumplings",
      products: [],
      sections: [
        {
          id: makeId(),
          name: "Основная категория",
          products: [
            {
              id: makeId(),
              name: "Пельмени домашние",
              price: 2200,
              unit: "кг",
              image: placeholderImage,
              description: "Классические пельмени ручной лепки.",
            },
          ],
        },
      ],
    },
  ],
};

function sanitizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function buildWhatsAppMessageText(siteData, customer, selectedProducts, cart) {
  const lines = [];
  lines.push(`Здравствуйте! Хочу оформить заявку в ${siteData.company.name}.`);
  lines.push("");
  lines.push(`Магазин: ${customer.storeName}`);
  lines.push(`Адрес магазина: ${customer.address}`);
  lines.push(`Контакты: ${customer.contact}`);
  if (customer.comment.trim()) {
    lines.push(`Комментарий: ${customer.comment}`);
  }
  lines.push("");
  lines.push("Товары:");
  selectedProducts.forEach((product, index) => {
    lines.push(
      `${index + 1}. ${product.name} — ${cart[product.id]} ${product.unit} | ${product.price} ₸ / ${product.unit} | ${product.categoryName} / ${product.sectionName}`
    );
  });
  return lines.join("\n");
}

function buildWhatsAppUrl(phone, text) {
  return `https://wa.me/${sanitizePhone(phone)}?text=${encodeURIComponent(text)}`;
}

function runSelfChecks() {
  const phone = sanitizePhone("+7 771 284 84 64");
  console.assert(phone === "77712848464", "sanitizePhone should keep digits only");

  const sampleSite = { company: { name: "Don Baton" } };
  const sampleCustomer = {
    storeName: "Магазин А",
    address: "Кызылорда",
    contact: "8777",
    comment: "срочно",
  };
  const sampleProducts = [
    {
      id: "1",
      name: "Хлеб",
      unit: "шт",
      price: 400,
      categoryName: "Хлебные изделия",
      sectionName: "Премиум",
    },
  ];
  const sampleCart = { "1": 3 };
  const message = buildWhatsAppMessageText(sampleSite, sampleCustomer, sampleProducts, sampleCart);
  console.assert(message.includes("Магазин: Магазин А"), "message should include store name");
  console.assert(message.includes("1. Хлеб — 3 шт"), "message should include product quantity");
  console.assert(buildWhatsAppUrl("+7 777 123 45 67", "Привет").includes("77771234567"), "whatsapp url should sanitize number");
  console.assert((process.env.NEXT_PUBLIC_SUPABASE_URL || "") === SUPABASE_URL, "env url should be readable");
  console.assert((process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "") === SUPABASE_ANON_KEY, "env key should be readable");
}

function ProductCard({ product, quantity, onPlus, onMinus, colors }) {
  return (
    <motion.div layout>
      <Card className="group overflow-hidden rounded-[28px] border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative overflow-hidden bg-stone-50">
          <div className="aspect-[1/1] w-full min-h-[180px] overflow-hidden bg-white sm:min-h-[240px] lg:min-h-[340px]">
            <img
              src={product.image || placeholderImage}
              alt={product.name}
              className="h-full w-full scale-110 object-contain object-center p-1 transition-transform duration-300"
            />
          </div>
          <div className="absolute left-3 top-3">
            <Badge
              className="rounded-full border-0 px-3 py-1 text-xs font-semibold text-white shadow-sm"
              style={{ backgroundColor: colors.primary }}
            >
              {product.price} ₸ / {product.unit}
            </Badge>
          </div>
        </div>

        <CardContent className="space-y-4 p-3 sm:p-5">
          <div>
            <h4 className="line-clamp-2 text-base font-bold leading-snug text-stone-900 sm:text-lg break-words">
              {product.name}
            </h4>
            <p className="mt-2 line-clamp-2 text-sm text-stone-500">{product.description}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium text-stone-500">Ед. изм.: {product.unit}</div>
            <div className="ml-auto flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 sm:ml-0">
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={onMinus}>
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="min-w-8 text-center text-sm font-semibold">{quantity || 0}</span>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={onPlus}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AdminInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function DonBatonSite() {
  const [siteData, setSiteData] = useState(defaultData);
  const [cart, setCart] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [adminOpenCategories, setAdminOpenCategories] = useState({});
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [brandTapCount, setBrandTapCount] = useState(0);
  const [customer, setCustomer] = useState({
    storeName: "",
    address: "",
    contact: "",
    comment: "",
  });
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [connectionWarning, setConnectionWarning] = useState("");
  const tapTimer = useRef(null);

  useEffect(() => {
    runSelfChecks();
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadSiteData() {
      if (!supabase) {
        setConnectionWarning("Supabase ещё не подключён. Сайт показывает стартовые данные.");
        setIsBootLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from(SITE_TABLE)
        .select("slug, content")
        .eq("slug", SITE_SLUG)
        .maybeSingle();

      if (ignore) return;

      if (error) {
        console.error("Ошибка загрузки данных из Supabase", error);
        setConnectionWarning("Не удалось загрузить данные сайта из Supabase.");
        setIsBootLoading(false);
        return;
      }

      if (data?.content) {
        setSiteData(data.content);
      } else {
        setConnectionWarning(
          "В Supabase пока нет сохранённых данных. Нажмите «Сохранить изменения», чтобы создать сайт в базе."
        );
      }

      setIsBootLoading(false);
    }

    loadSiteData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const initialCategories = {};
    const initialSections = {};
    const initialAdminCategories = {};

    siteData.categories.forEach((category) => {
      if (openCategories[category.id] === undefined) {
        initialCategories[category.id] = false;
      }

      if (adminOpenCategories[category.id] === undefined) {
        initialAdminCategories[category.id] = false;
      }

      category.sections.forEach((section) => {
        const sectionKey = `${category.id}__${section.id}`;
        if (openSections[sectionKey] === undefined) {
          initialSections[sectionKey] = false;
        }
      });
    });

    if (Object.keys(initialCategories).length) {
      setOpenCategories((prev) => ({ ...initialCategories, ...prev }));
    }

    if (Object.keys(initialSections).length) {
      setOpenSections((prev) => ({ ...initialSections, ...prev }));
    }

    if (Object.keys(initialAdminCategories).length) {
      setAdminOpenCategories((prev) => ({ ...initialAdminCategories, ...prev }));
    }
  }, [siteData.categories, openCategories, openSections, adminOpenCategories]);

  const colors = useMemo(
    () => ({
      primary: siteData.company.primaryColor,
      secondary: siteData.company.secondaryColor,
      accent: siteData.company.accentColor,
      background: siteData.company.backgroundColor,
    }),
    [siteData.company]
  );

  const allProducts = useMemo(
    () =>
      siteData.categories.flatMap((category) => {
        const directProducts = (category.products || []).map((product) => ({
          ...product,
          categoryName: category.name,
          sectionName: "Без раздела",
        }));

        const sectionProducts = category.sections.flatMap((section) =>
          section.products.map((product) => ({
            ...product,
            categoryName: category.name,
            sectionName: section.name,
          }))
        );

        return [...directProducts, ...sectionProducts];
      }),
    [siteData]
  );

  const selectedProducts = useMemo(
    () => allProducts.filter((product) => (cart[product.id] || 0) > 0),
    [allProducts, cart]
  );

  const totalItems = selectedProducts.reduce((sum, p) => sum + (cart[p.id] || 0), 0);

  async function uploadToBucket(bucketName, folderName, file) {
  if (!supabase) {
    alert("Сначала подключите Supabase");
    return null;
  }

  if (!file) {
    alert("Файл не выбран");
    return null;
  }

  const filePath = makeFilePath(folderName, file.name);

  try {
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || undefined,
    });

    if (uploadError) {
      console.error("Ошибка загрузки файла", uploadError);
      const details = [uploadError.message, uploadError.name, uploadError.statusCode]
        .filter(Boolean)
        .join(" | ");
      alert(`Не удалось загрузить файл в ${bucketName}. ${details}`);
      return null;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      alert("Файл загружен, но не удалось получить публичную ссылку");
      return null;
    }

    return data.publicUrl;
  } catch (error) {
    console.error("Непредвиденная ошибка загрузки", error);
    alert(`Не удалось загрузить файл. ${error?.message || "Неизвестная ошибка"}`);
    return null;
  }
}

  const saveSiteData = async () => {
    if (!supabase) {
      alert("Supabase не подключён. Добавьте ключи и повторите.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage("");

      const payload = {
        slug: SITE_SLUG,
        content: siteData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from(SITE_TABLE).upsert(payload, { onConflict: "slug" });

      if (error) {
        console.error("Ошибка сохранения", error);
        alert("Не удалось сохранить изменения в Supabase");
        return;
      }

      setConnectionWarning("");
      setSaveMessage("Изменения сохранены и видны всем");
      alert("Изменения сохранены и видны всем");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBrandTap = () => {
    setBrandTapCount((prev) => prev + 1);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setBrandTapCount(0), 900);
  };

  useEffect(() => {
    if (brandTapCount >= 3) {
      setShowAdminLogin(true);
      setBrandTapCount(0);
    }
  }, [brandTapCount]);

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Неверный пароль");
    }
  };

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (categoryId, sectionId) => {
    const sectionKey = `${categoryId}__${sectionId}`;
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const toggleAdminCategory = (categoryId) => {
    setAdminOpenCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const changeQty = (productId, delta) => {
    setCart((prev) => {
      const next = Math.max(0, (prev[productId] || 0) + delta);
      return { ...prev, [productId]: next };
    });
  };

  const updateCompany = (field, value) => {
    setSiteData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value,
      },
    }));
  };

  const addSection = (categoryId) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              sections: [...category.sections, { id: makeId(), name: "Новый раздел", products: [] }],
            }
          : category
      ),
    }));
  };

  const updateCategory = (categoryId, field, value) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId ? { ...category, [field]: value } : category
      ),
    }));
  };

  const updateSection = (categoryId, sectionId, field, value) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              sections: category.sections.map((section) =>
                section.id === sectionId ? { ...section, [field]: value } : section
              ),
            }
          : category
      ),
    }));
  };

  const removeSection = (categoryId, sectionId) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              sections: category.sections.filter((section) => section.id !== sectionId),
            }
          : category
      ),
    }));
  };

  const addProduct = (categoryId, sectionId) => {
    const newProduct = {
      id: makeId(),
      name: "Новый товар",
      price: 0,
      unit: "шт",
      image: placeholderImage,
      description: "Описание товара",
    };
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              sections: category.sections.map((section) =>
                section.id === sectionId ? { ...section, products: [...section.products, newProduct] } : section
              ),
            }
          : category
      ),
    }));
  };

  const addDirectProduct = (categoryId) => {
    const newProduct = {
      id: makeId(),
      name: "Новый товар",
      price: 0,
      unit: "шт",
      image: placeholderImage,
      description: "Описание товара",
    };
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: [...(category.products || []), newProduct],
            }
          : category
      ),
    }));
  };

  const updateProduct = (categoryId, sectionId, productId, field, value) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              sections: category.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      products: section.products.map((product) =>
                        product.id === productId ? { ...product, [field]: value } : product
                      ),
                    }
                  : section
              ),
            }
          : category
      ),
    }));
  };

  const updateDirectProduct = (categoryId, productId, field, value) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: (category.products || []).map((product) =>
                product.id === productId ? { ...product, [field]: value } : product
              ),
            }
          : category
      ),
    }));
  };

  const removeProduct = (categoryId, sectionId, productId) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              sections: category.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      products: section.products.filter((product) => product.id !== productId),
                    }
                  : section
              ),
            }
          : category
      ),
    }));
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const removeDirectProduct = (categoryId, productId) => {
    setSiteData((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              products: (category.products || []).filter((product) => product.id !== productId),
            }
          : category
      ),
    }));
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const handleImageUpload = async (file, callback) => {
    if (!file) return;
    if (!supabase) {
      alert("Сначала подключите Supabase");
      return;
    }

    const publicUrl = await uploadToBucket(IMAGE_BUCKET, "images", file);
    if (publicUrl) callback(publicUrl);
  };

  const handlePdfUpload = async (file, target) => {
    if (!file) return;
    if (!supabase) {
      alert("Сначала подключите Supabase");
      return;
    }

    const publicUrl = await uploadToBucket(DOC_BUCKET, "docs", file);
    if (!publicUrl) return;

    if (target === "price") {
      updateCompany("pricePdfName", file.name);
      updateCompany("pricePdfUrl", publicUrl);
    } else {
      updateCompany("catalogPdfName", file.name);
      updateCompany("catalogPdfUrl", publicUrl);
    }
  };

  const sendToWhatsApp = () => {
    if (!customer.storeName.trim() || !customer.address.trim() || !customer.contact.trim()) {
      alert("Заполните название магазина, адрес и контакты");
      return;
    }
    if (!selectedProducts.length) {
      alert("Выберите хотя бы один товар");
      return;
    }
    const text = buildWhatsAppMessageText(siteData, customer, selectedProducts, cart);
    const url = buildWhatsAppUrl(siteData.company.whatsapp, text);
    window.open(url, "_blank");
  };

  if (isBootLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
          <p className="text-lg font-semibold text-stone-900">Загрузка сайта...</p>
          <p className="mt-2 text-sm text-stone-500">Подключаем данные из Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-stone-900"
      style={{
        background: `linear-gradient(180deg, ${colors.background} 0%, #ffffff 100%)`,
      }}
    >
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-2xl bg-amber-100 shadow-sm ring-1 ring-amber-200">
              {siteData.company.logo ? (
                <img src={siteData.company.logo} alt="Логотип" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <BreadIcon className="h-6 w-6" style={{ color: colors.primary }} />
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={handleBrandTap}
                className="text-left text-lg font-bold tracking-tight sm:text-xl"
              >
                {siteData.company.name}
              </button>
              <p className="text-xs text-stone-500 sm:text-sm">{siteData.company.slogan}</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`https://instagram.com/${siteData.company.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm shadow-sm"
            >
              <InstagramIcon className="h-4 w-4" /> @{siteData.company.instagram}
            </a>
            <a
              href={`https://wa.me/${sanitizePhone(siteData.company.whatsapp)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm"
              style={{ backgroundColor: colors.primary }}
            >
              <PhoneIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {(connectionWarning || saveMessage) && (
          <div className="mb-6 space-y-2">
            {connectionWarning && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {connectionWarning}
              </div>
            )}
            {saveMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {saveMessage}
              </div>
            )}
          </div>
        )}

        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl">
              <div className="grid gap-6 bg-white p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
                <div className="flex flex-col justify-center">
                  <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
                    <SparklesIcon className="h-4 w-4" /> {siteData.company.slogan}
                  </div>
                  <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                    {siteData.company.heroTitle}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                    {siteData.company.heroSubtitle}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <MapPinIcon className="h-4 w-4" style={{ color: colors.primary }} /> Адрес
                      </div>
                      <p className="mt-2 text-sm text-stone-600">{siteData.company.address}</p>
                    </div>
                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <PhoneIcon className="h-4 w-4" style={{ color: colors.primary }} /> WhatsApp
                      </div>
                      <p className="mt-2 text-sm text-stone-600">{siteData.company.whatsappDisplay}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {siteData.company.pricePdfUrl && (
                      <a
                        href={siteData.company.pricePdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-medium shadow-sm"
                      >
                        <FileIcon className="h-4 w-4" /> Прайс-лист PDF
                      </a>
                    )}
                    {siteData.company.catalogPdfUrl && (
                      <a
                        href={siteData.company.catalogPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-medium shadow-sm"
                      >
                        <FileIcon className="h-4 w-4" /> Каталог PDF
                      </a>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[24px] bg-amber-50">
                  <img
                    src={siteData.company.heroImage || placeholderImage}
                    alt="Витрина Don Baton"
                    className="h-full min-h-[260px] w-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Категории товаров</h2>
              <p className="text-sm text-stone-500">Нажмите на категорию, чтобы открыть или закрыть список товаров.</p>
            </div>
          </div>

          <div className="space-y-4">
            {siteData.categories.map((category) => {
              const CategoryIcon = iconMap[category.icon] || BreadIcon;
              const isOpen = openCategories[category.id];
              return (
                <Card key={category.id} className="overflow-hidden rounded-[28px] border-0 bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
                      >
                        <CategoryIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold sm:text-xl">{category.name}</h3>
                        <p className="text-sm text-stone-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-stone-500">
                      {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <Separator />
                        <div className="space-y-6 p-5 sm:p-6">
                          {!!(category.products || []).length && (
                            <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white">
                              <div className="p-4">
                                <h4 className="text-lg font-semibold">Товары без раздела</h4>
                                <p className="text-sm text-stone-500">Товары, добавленные напрямую в категорию</p>
                              </div>
                              <Separator />
                              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                {(category.products || []).map((product) => (
                                  <ProductCard
                                    key={product.id}
                                    product={product}
                                    quantity={cart[product.id] || 0}
                                    onPlus={() => changeQty(product.id, 1)}
                                    onMinus={() => changeQty(product.id, -1)}
                                    colors={colors}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {category.sections.map((section) => {
                            const sectionKey = `${category.id}__${section.id}`;
                            const isSectionOpen = openSections[sectionKey];

                            return (
                              <div key={section.id} className="overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/40">
                                <button
                                  type="button"
                                  onClick={() => toggleSection(category.id, section.id)}
                                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                                >
                                  <div>
                                    <h4 className="text-lg font-semibold">{section.name}</h4>
                                    <p className="text-sm text-stone-500">Нажмите, чтобы открыть или закрыть товары раздела</p>
                                  </div>
                                  <div className="text-stone-500">
                                    {isSectionOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                                  </div>
                                </button>

                                <AnimatePresence initial={false}>
                                  {isSectionOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <Separator />
                                      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                        {section.products.map((product) => (
                                          <ProductCard
                                            key={product.id}
                                            product={product}
                                            quantity={cart[product.id] || 0}
                                            onPlus={() => changeQty(product.id, 1)}
                                            onMinus={() => changeQty(product.id, -1)}
                                            colors={colors}
                                          />
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-[28px] border-0 bg-white shadow-xl">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <StoreIcon className="h-5 w-5" style={{ color: colors.primary }} />
                  <h2 className="text-xl font-bold">Данные для заявки</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Название магазина</Label>
                    <Input
                      value={customer.storeName}
                      onChange={(e) => setCustomer((prev) => ({ ...prev, storeName: e.target.value }))}
                      placeholder="Например: Магазин Аружан"
                    />
                  </div>
                  <div>
                    <Label>Адрес магазина</Label>
                    <Input
                      value={customer.address}
                      onChange={(e) => setCustomer((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Введите адрес"
                    />
                  </div>
                  <div>
                    <Label>Контакты</Label>
                    <Input
                      value={customer.contact}
                      onChange={(e) => setCustomer((prev) => ({ ...prev, contact: e.target.value }))}
                      placeholder="Телефон или имя менеджера"
                    />
                  </div>
                  <div>
                    <Label>Комментарий</Label>
                    <Textarea
                      value={customer.comment}
                      onChange={(e) => setCustomer((prev) => ({ ...prev, comment: e.target.value }))}
                      placeholder="Дополнительная информация к заявке"
                      rows={4}
                    />
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-semibold">
                          <CartIcon className="h-4 w-4" /> Выбрано товаров
                        </div>
                        <p className="mt-1 text-sm text-stone-600">Всего позиций: {totalItems}</p>
                      </div>
                      <Button
                        type="button"
                        className="rounded-full px-5 text-white"
                        style={{ backgroundColor: colors.primary }}
                        onClick={sendToWhatsApp}
                      >
                        Отправить в WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <Card className="rounded-[28px] border-0 bg-white shadow-lg">
  <CardContent className="p-5">
    <div className="flex items-center gap-3 font-semibold">
      <InstagramIcon className="h-5 w-5" style={{ color: colors.primary }} /> Instagram
    </div>
    <a
      href={`https://instagram.com/${siteData.company.instagram}`}
      target="_blank"
      rel="noreferrer"
      className="mt-2 inline-block text-stone-600 underline"
    >
      @{siteData.company.instagram}
    </a>
  </CardContent>
</Card>
          <Card className="rounded-[28px] border-0 bg-white shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 font-semibold">
                <PhoneIcon className="h-5 w-5" style={{ color: colors.primary }} /> WhatsApp
              </div>
              <p className="mt-2 text-stone-600">{siteData.company.whatsappDisplay}</p>
            </CardContent>
          </Card>
          <Card className="rounded-[28px] border-0 bg-white shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 font-semibold">
                <MapPinIcon className="h-5 w-5" style={{ color: colors.primary }} /> Адрес
              </div>
              <p className="mt-2 text-stone-600">{siteData.company.address}</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <AnimatePresence>
        {showAdminLogin && !isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
            >
              <Card className="w-full max-w-md rounded-[28px] border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <ShieldIcon className="h-5 w-5" /> Вход в админку
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Пароль</Label>
                      <Input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Введите пароль"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" className="flex-1" onClick={handleAdminLogin}>
                        Войти
                      </Button>
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAdminLogin(false)}>
                        Закрыть
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-xl border-l border-stone-200 bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4 sm:p-5">
                <div>
                  <h3 className="text-lg font-bold">Админка</h3>
                  <p className="text-sm text-stone-500">Редактирование всего сайта</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAdmin(false)}>
                    Закрыть
                  </Button>
                  <Button
                    type="button"
                    disabled={isSaving}
                    className="text-white"
                    style={{ backgroundColor: colors.primary }}
                    onClick={saveSiteData}
                  >
                    <SaveIcon className="mr-2 h-4 w-4" /> {isSaving ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-8 p-4 sm:p-5">
                  <section className="space-y-4 rounded-3xl border p-4">
                    <div className="flex items-center gap-2 text-lg font-bold">
                      <EditIcon className="h-5 w-5" /> Общая информация
                    </div>
                    <AdminInput label="Название" value={siteData.company.name} onChange={(v) => updateCompany("name", v)} />
                    <AdminInput label="Девиз" value={siteData.company.slogan} onChange={(v) => updateCompany("slogan", v)} />
                    <AdminInput
                      label="Заголовок главного блока"
                      value={siteData.company.heroTitle}
                      onChange={(v) => updateCompany("heroTitle", v)}
                    />
                    <div className="space-y-2">
                      <Label>Описание главного блока</Label>
                      <Textarea
                        value={siteData.company.heroSubtitle}
                        onChange={(e) => updateCompany("heroSubtitle", e.target.value)}
                        rows={4}
                      />
                    </div>
                    <AdminInput label="Instagram" value={siteData.company.instagram} onChange={(v) => updateCompany("instagram", v)} />
                    <AdminInput label="WhatsApp номер" value={siteData.company.whatsapp} onChange={(v) => updateCompany("whatsapp", v)} />
                    <AdminInput
                      label="WhatsApp как показывать"
                      value={siteData.company.whatsappDisplay}
                      onChange={(v) => updateCompany("whatsappDisplay", v)}
                    />
                    <AdminInput label="Адрес" value={siteData.company.address} onChange={(v) => updateCompany("address", v)} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <AdminInput
                        label="Основной цвет"
                        type="color"
                        value={siteData.company.primaryColor}
                        onChange={(v) => updateCompany("primaryColor", v)}
                      />
                      <AdminInput
                        label="Второй цвет"
                        type="color"
                        value={siteData.company.secondaryColor}
                        onChange={(v) => updateCompany("secondaryColor", v)}
                      />
                      <AdminInput
                        label="Акцентный цвет"
                        type="color"
                        value={siteData.company.accentColor}
                        onChange={(v) => updateCompany("accentColor", v)}
                      />
                      <AdminInput
                        label="Фон сайта"
                        type="color"
                        value={siteData.company.backgroundColor}
                        onChange={(v) => updateCompany("backgroundColor", v)}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Логотип с компьютера</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) =>
                            handleImageUpload(e.target.files?.[0], (data) => updateCompany("logo", data))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Главное фото / обои</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) =>
                            handleImageUpload(e.target.files?.[0], (data) => updateCompany("heroImage", data))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Прайс-лист PDF</Label>
                        <Input type="file" accept="application/pdf" onChange={(e) => handlePdfUpload(e.target.files?.[0], "price")} />
                        {siteData.company.pricePdfName && (
                          <p className="text-xs text-stone-500">Загружено: {siteData.company.pricePdfName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Каталог PDF</Label>
                        <Input type="file" accept="application/pdf" onChange={(e) => handlePdfUpload(e.target.files?.[0], "catalog")} />
                        {siteData.company.catalogPdfName && (
                          <p className="text-xs text-stone-500">Загружено: {siteData.company.catalogPdfName}</p>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-5 rounded-3xl border p-4">
                    <div className="text-lg font-bold">Категории, разделы и товары</div>
                    {siteData.categories.map((category) => {
                      const isAdminCategoryOpen = adminOpenCategories[category.id];

                      return (
                        <div key={category.id} className="overflow-hidden rounded-3xl border bg-stone-50">
                          <button
                            type="button"
                            onClick={() => toggleAdminCategory(category.id)}
                            className="flex w-full items-center justify-between gap-3 p-4 text-left"
                          >
                            <div>
                              <h4 className="text-base font-bold sm:text-lg">{category.name}</h4>
                              <p className="text-sm text-stone-500">
                                Нажмите, чтобы открыть или скрыть редактирование категории
                              </p>
                            </div>
                            <div className="text-stone-500">
                              {isAdminCategoryOpen ? (
                                <ChevronUpIcon className="h-5 w-5" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5" />
                              )}
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isAdminCategoryOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <Separator />
                                <div className="p-4">
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <AdminInput
                                      label="Название категории"
                                      value={category.name}
                                      onChange={(v) => updateCategory(category.id, "name", v)}
                                    />
                                    <AdminInput
                                      label="Описание категории"
                                      value={category.description}
                                      onChange={(v) => updateCategory(category.id, "description", v)}
                                    />
                                  </div>

                                  <div className="mt-4 space-y-4">
                                    <div className="rounded-2xl border bg-white p-4 shadow-sm">
                                      <div className="mb-3 flex items-center justify-between gap-3">
                                        <div>
                                          <h4 className="text-base font-semibold">Товары без раздела</h4>
                                          <p className="text-sm text-stone-500">
                                            Можно добавлять товары напрямую в категорию
                                          </p>
                                        </div>
                                        <Button type="button" variant="outline" onClick={() => addDirectProduct(category.id)}>
                                          <PlusIcon className="mr-2 h-4 w-4" /> Добавить товар без раздела
                                        </Button>
                                      </div>

                                      <div className="space-y-4">
                                        {(category.products || []).map((product) => (
                                          <div key={product.id} className="rounded-2xl border border-dashed p-4">
                                            <div className="grid gap-3 sm:grid-cols-2">
                                              <AdminInput
                                                label="Название товара"
                                                value={product.name}
                                                onChange={(v) => updateDirectProduct(category.id, product.id, "name", v)}
                                              />
                                              <AdminInput
                                                label="Описание"
                                                value={product.description}
                                                onChange={(v) =>
                                                  updateDirectProduct(category.id, product.id, "description", v)
                                                }
                                              />
                                              <AdminInput
                                                label="Цена"
                                                type="number"
                                                value={String(product.price)}
                                                onChange={(v) =>
                                                  updateDirectProduct(category.id, product.id, "price", Number(v || 0))
                                                }
                                              />
                                              <AdminInput
                                                label="Ед. измерения"
                                                value={product.unit}
                                                onChange={(v) => updateDirectProduct(category.id, product.id, "unit", v)}
                                              />
                                            </div>

                                            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px_auto] sm:items-end">
                                              <div className="space-y-2">
                                                <Label>Фото товара</Label>
                                                <Input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={async (e) =>
                                                    handleImageUpload(e.target.files?.[0], (data) =>
                                                      updateDirectProduct(category.id, product.id, "image", data)
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl bg-stone-100">
                                                <img
                                                  src={product.image || placeholderImage}
                                                  alt={product.name}
                                                  className="h-full w-full object-contain object-center"
                                                />
                                              </div>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => removeDirectProduct(category.id, product.id)}
                                              >
                                                <TrashIcon className="mr-2 h-4 w-4" /> Удалить товар
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {category.sections.map((section) => (
                                      <div key={section.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                          <AdminInput
                                            label="Название раздела"
                                            value={section.name}
                                            onChange={(v) => updateSection(category.id, section.id, "name", v)}
                                          />
                                          <Button type="button" variant="outline" onClick={() => removeSection(category.id, section.id)}>
                                            <TrashIcon className="mr-2 h-4 w-4" /> Удалить раздел
                                          </Button>
                                        </div>

                                        <div className="space-y-4">
                                          {section.products.map((product) => (
                                            <div key={product.id} className="rounded-2xl border border-dashed p-4">
                                              <div className="grid gap-3 sm:grid-cols-2">
                                                <AdminInput
                                                  label="Название товара"
                                                  value={product.name}
                                                  onChange={(v) => updateProduct(category.id, section.id, product.id, "name", v)}
                                                />
                                                <AdminInput
                                                  label="Описание"
                                                  value={product.description}
                                                  onChange={(v) =>
                                                    updateProduct(category.id, section.id, product.id, "description", v)
                                                  }
                                                />
                                                <AdminInput
                                                  label="Цена"
                                                  type="number"
                                                  value={String(product.price)}
                                                  onChange={(v) =>
                                                    updateProduct(
                                                      category.id,
                                                      section.id,
                                                      product.id,
                                                      "price",
                                                      Number(v || 0)
                                                    )
                                                  }
                                                />
                                                <AdminInput
                                                  label="Ед. измерения"
                                                  value={product.unit}
                                                  onChange={(v) =>
                                                    updateProduct(category.id, section.id, product.id, "unit", v)
                                                  }
                                                />
                                              </div>

                                              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px_auto] sm:items-end">
                                                <div className="space-y-2">
                                                  <Label>Фото товара</Label>
                                                  <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) =>
                                                      handleImageUpload(e.target.files?.[0], (data) =>
                                                        updateProduct(category.id, section.id, product.id, "image", data)
                                                      )
                                                    }
                                                  />
                                                </div>
                                                <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl bg-stone-100">
                                                  <img
                                                    src={product.image || placeholderImage}
                                                    alt={product.name}
                                                    className="h-full w-full object-contain object-center"
                                                  />
                                                </div>
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  onClick={() => removeProduct(category.id, section.id, product.id)}
                                                >
                                                  <TrashIcon className="mr-2 h-4 w-4" /> Удалить товар
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                          <Button type="button" variant="outline" onClick={() => addProduct(category.id, section.id)}>
                                            <PlusIcon className="mr-2 h-4 w-4" /> Добавить товар
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mt-4">
                                    <Button type="button" variant="outline" onClick={() => addSection(category.id)}>
                                      <PlusIcon className="mr-2 h-4 w-4" /> Добавить раздел
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
