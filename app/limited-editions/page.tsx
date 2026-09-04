"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import ButtonShader, { useHoverInteraction } from "../components/ButtonShader";
import CountdownTimer, { CountdownTimerProps } from "../components/CountdownTimer";
import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import { type SanityImageSource } from "@sanity/image-url";

export interface LimitedEditionItem {
  id?: string;
  name: string;
  status: string;
  image: string;
  price?: number;
  totalStock?: number;
  availableStock?: number;
  isUpcoming?: boolean;
  description?: string;
  dimensions?: string;
  materials?: string;
}

export type FilterType = "all" | "available" | "upcoming" | "sold";

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface OrderSuccessData {
  paymentId: string;
  orderId: string;
  productName: string;
  quantity: number;
  amount: number;
  customerName?: string;
  customerCity?: string;
}


const DEFAULT_ITEMS: LimitedEditionItem[] = [
  {
    id: "le-1",
    name: "Mayu Lamp",
    status: "5 Left",
    image: "/limited-1.png",
    description: "Organic luminaire sculpted with dense structural mycelium tissue, emitting a warm diffuse glow through natural fibrous grain contours.",
    dimensions: "32cm × 18cm × 18cm",
    materials: "100% Pure Ganoderma Mycelium, Brass Fixture",
  },
  {
    id: "le-2",
    name: "Mycelium Wall Sculpture",
    status: "2 Left",
    image: "/limited-2.png",
    description: "Multi-tiered parametric relief tile providing tactile acoustic absorption and natural organic texture grown over hemp byproduct substrate.",
    dimensions: "60cm × 60cm × 8cm",
    materials: "Pleurotus Mycelium, Agricultural Hemp Shives",
  },
  {
    id: "le-3",
    name: "Parametric Table Object",
    status: "Sold Out",
    image: "/limited-3.png",
    description: "Freeform organic centerpiece grown inside a custom parametric chamber, finished with natural non-toxic plant-based bio-wax.",
    dimensions: "28cm × 22cm × 15cm",
    materials: "Bio-Composite Mycelium, Natural Bio-Wax",
  },
  {
    id: "le-4",
    name: "Cultivated Biomaterial Luminaire",
    status: "3 Left",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop",
    description: "Ambient directional lamp featuring a living fungal growth shade mounted on a matte black steel arm.",
    dimensions: "45cm × 25cm × 20cm",
    materials: "Living Fungal Matrix, Coated Steel Frame",
  },
  {
    id: "le-5",
    name: "Growing...",
    status: "Growing",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    description: "Sculpted bio-composite piece cultivated from living fungal tissue.",
    dimensions: "TBD",
    materials: "Mycelium Bio-Composite",
  },
  {
    id: "le-6",
    name: "Growing...",
    status: "Growing",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    description: "Sculpted bio-composite piece cultivated from living fungal tissue.",
    dimensions: "TBD",
    materials: "Compressed Structural Mycelium",
  },
];

const formatStatus = (status: string) => {
  const parts = status.trim().split(/\s+/);
  if (parts.length === 2) {
    const isNum = !isNaN(Number(parts[0]));
    return (
      <div className="flex flex-col items-center justify-center font-black text-black">
        <span className={isNum ? "text-xs sm:text-sm leading-none font-black" : "text-[9.5px] sm:text-[11px] leading-tight tracking-wider font-black"}>
          {parts[0]}
        </span>
        <span className="text-[7.5px] sm:text-[9px] tracking-wider leading-none uppercase mt-0.5 font-black">
          {parts[1]}
        </span>
      </div>
    );
  }
  return <span className="text-[9.5px] sm:text-[11.5px] font-black leading-tight tracking-wider capitalize text-black">{status}</span>;
};



function ShaderLinkButton({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const { isHovered, handlers } = useHoverInteraction();

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...handlers}
        className={`group relative overflow-hidden font-sans text-xs uppercase tracking-wider border border-white text-white rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${className}`}
      >
        <ButtonShader isHovered={isHovered} colorA="#12110E" colorB="#ffffff" />
        <span className={`relative z-10 transition-colors duration-700 group-hover:duration-200 font-semibold flex items-center gap-2 ${isHovered ? "text-black" : "text-white"}`}>
          {children}
        </span>
      </a>
    );
  }

  return (
    <Link
      href={href}
      {...handlers}
      className={`group relative overflow-hidden font-sans text-xs uppercase tracking-wider border border-white text-white rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${className}`}
    >
      <ButtonShader isHovered={isHovered} colorA="#12110E" colorB="#ffffff" />
      <span className={`relative z-10 transition-colors duration-700 group-hover:duration-200 font-semibold flex items-center gap-2 ${isHovered ? "text-black" : "text-white"}`}>
        {children}
      </span>
    </Link>
  );
}

function QuantityCircleButton({
  onClick,
  disabled = false,
  children,
  ariaLabel,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const { isHovered, handlers } = useHoverInteraction();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...handlers}
      aria-label={ariaLabel}
      className="group relative overflow-hidden w-8 h-8 sm:w-9 sm:h-9 border border-white/20 hover:border-white disabled:opacity-25 disabled:hover:border-white/20 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shrink-0"
    >
      <ButtonShader isHovered={!disabled && isHovered} colorA="#12110E" colorB="#ffffff" />
      <span
        className={`relative z-10 transition-colors duration-500 text-sm sm:text-base font-medium leading-none flex items-center justify-center ${
          !disabled && isHovered ? "text-black" : "text-white"
        }`}
      >
        {children}
      </span>
    </button>
  );
}

function ModalSubmitButton({
  isProcessing,
  amount,
}: {
  isProcessing: boolean;
  amount: number;
}) {
  const { isHovered, handlers } = useHoverInteraction();

  return (
    <button
      type="submit"
      disabled={isProcessing}
      {...handlers}
      className="group relative overflow-hidden w-full mt-3.5 py-3.5 px-6 rounded-full border border-white text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
    >
      <ButtonShader isHovered={!isProcessing && isHovered} colorA="#12110E" colorB="#ffffff" />
      <span
        className={`relative z-10 font-semibold text-xs uppercase tracking-wider transition-colors duration-700 group-hover:duration-200 flex items-center gap-1.5 ${
          isHovered ? "text-black" : "text-white"
        }`}
      >
        {isProcessing ? "Initializing Secure Gateway..." : `Proceed to Payment (₹${amount.toLocaleString("en-IN")}) →`}
      </span>
    </button>
  );
}

function ModalCloseButton({
  onClick,
  ariaLabel = "Close modal",
  className = "",
}: {
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}) {
  const { isHovered, handlers } = useHoverInteraction();

  return (
    <button
      type="button"
      onClick={onClick}
      {...handlers}
      aria-label={ariaLabel}
      className={`group absolute top-4 right-4 sm:top-5 sm:right-5 left-auto overflow-hidden w-9 h-9 sm:w-10 sm:h-10 border border-white/20 hover:border-white rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer z-30 shrink-0 ${className}`}
    >
      <ButtonShader isHovered={isHovered} colorA="#12110E" colorB="#ffffff" />
      <span
        className={`relative z-10 transition-colors duration-500 text-xs sm:text-sm font-medium flex items-center justify-center ${
          isHovered ? "text-black" : "text-white"
        }`}
      >
        ✕
      </span>
    </button>
  );
}

function SuccessCloseButton({ onClick }: { onClick: () => void }) {
  const { isHovered, handlers } = useHoverInteraction();

  return (
    <button
      type="button"
      onClick={onClick}
      {...handlers}
      className="group relative overflow-hidden w-full py-3.5 px-6 rounded-full border border-white text-white transition-all duration-300 flex items-center justify-center cursor-pointer"
    >
      <ButtonShader isHovered={isHovered} colorA="#12110E" colorB="#ffffff" />
      <span
        className={`relative z-10 font-semibold text-xs uppercase tracking-wider transition-colors duration-700 group-hover:duration-200 flex items-center gap-1.5 ${
          isHovered ? "text-black" : "text-white"
        }`}
      >
        Continue Exploring &rarr;
      </span>
    </button>
  );
}

function ImageLightboxModal({
  item,
  onClose,
}: {
  item: LimitedEditionItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} specimen preview`}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Right Fixed Close Button */}
      <div 
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalCloseButton onClick={onClose} />
      </div>

      {/* Pure High-Res Specimen Image (No extra background / no clutter) */}
      <div
        className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] rounded-xl sm:rounded-2xl"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />
      </div>
    </div>
  );
}

function ProductCard({
  item,
  onAcquire,
  onPreviewImage,
  isProcessing = false,
}: {
  item: LimitedEditionItem;
  onAcquire: (item: LimitedEditionItem, quantity: number) => void;
  onPreviewImage?: (item: LimitedEditionItem) => void;
  isProcessing?: boolean;
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const { isHovered: isBtnHovered, handlers: btnHandlers } = useHoverInteraction();
  const isSoldOut = item.status.toLowerCase().includes("sold");
  const isUpcoming = item.status.toLowerCase().includes("upcoming") || item.status.toLowerCase().includes("growing") || !!item.isUpcoming;

  return (
    <div className="group relative bg-[#181613] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-white/25">
      {/* Top Image Box (Click to enlarge / zoom) */}
      <div 
        onClick={() => onPreviewImage?.(item)}
        className="relative w-full aspect-4/3 bg-[#0d0c0a] overflow-hidden cursor-zoom-in group/img"
        title="Click to view specimen image"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 will-change-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Exclusivity Splat Badge */}
        <div className="absolute top-3 right-3 z-10 w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] rotate-12">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full fill-[#FF5500]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M50,15 C40,5 30,12 25,22 C20,32 5,30 8,42 C11,54 2,62 10,72 C18,82 22,72 32,82 C42,92 52,98 62,90 C72,82 82,92 88,82 C94,72 90,62 95,52 C100,42 92,34 88,24 C84,14 74,22 64,12 C54,2 60,25 50,15 Z" />
            <circle cx="20" cy="18" r="3" />
            <circle cx="85" cy="80" r="2.5" />
            <circle cx="15" cy="78" r="2" />
            <circle cx="82" cy="20" r="3.5" />
          </svg>
          <div className="relative text-black text-center select-none tracking-[0.03em]">
            {formatStatus(item.status)}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col justify-between grow">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="text-white text-lg sm:text-xl font-semibold font-kodchasan tracking-tight leading-snug">
              {item.name}
            </h3>
            {item.price && item.price > 0 && (
              <span className="text-[#FF5500] font-kodchasan font-semibold text-sm sm:text-base shrink-0">
                ₹{item.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <p className="text-[#D4D0C9] text-xs sm:text-sm font-avenir-next font-light leading-relaxed line-clamp-2 mb-4">
            {item.description || "Sculpted bio-composite piece cultivated from living fungal tissue."}
          </p>
        </div>

        {/* Action Button & Quantity Selector */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2.5 sm:gap-3">
          {/* Circular Quantity Controls or Status */}
          {isSoldOut || isUpcoming ? (
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/40 font-avenir-next font-medium">
              {isUpcoming && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF5500]"></span>
                </span>
              )}
              <span>{isSoldOut ? "Archived" : "Cultivating"}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <QuantityCircleButton
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1 || isProcessing}
                ariaLabel="Decrease quantity"
              >
                &minus;
              </QuantityCircleButton>

              <div className="relative flex items-center justify-center">
                <input
                  type="number"
                  min={1}
                  max={item.availableStock || 99}
                  value={quantity}
                  disabled={isProcessing}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const maxStock = item.availableStock || 99;
                    if (isNaN(val)) {
                      setQuantity(1);
                    } else {
                      setQuantity(Math.max(1, Math.min(maxStock, val)));
                    }
                  }}
                  className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-white bg-transparent focus:outline-none focus:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-pointer select-all disabled:opacity-50"
                  aria-label="Quantity amount"
                />
              </div>

              <QuantityCircleButton
                onClick={() => setQuantity((prev) => Math.max(1, Math.min(item.availableStock || 99, prev + 1)))}
                disabled={isProcessing || (item.availableStock !== undefined && quantity >= item.availableStock)}
                ariaLabel="Increase quantity"
              >
                &#43;
              </QuantityCircleButton>
            </div>
          )}

          {isSoldOut ? (
            <div
              className="text-[11px] sm:text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 border border-white/20 text-white/50 rounded-full bg-white/3 select-none flex items-center justify-center shrink-0 cursor-default"
            >
              <span className="font-semibold flex items-center gap-1.5 text-white/60">
                Sold Out
              </span>
            </div>
          ) : isUpcoming ? (
            <div
              className="text-[11px] sm:text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 border border-white/20 text-white/60 rounded-full bg-white/3 select-none flex items-center justify-center shrink-0 cursor-default"
            >
              <span className="font-semibold flex items-center gap-1.5 text-[#D4D0C9]">
                Growing...
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAcquire(item, quantity)}
              disabled={isProcessing}
              {...btnHandlers}
              className="group relative overflow-hidden text-[11px] sm:text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 border border-white text-white rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-50"
            >
              <ButtonShader isHovered={!isProcessing && isBtnHovered} colorA="#12110E" colorB="#ffffff" />
              <span className={`relative z-10 transition-colors duration-700 group-hover:duration-200 font-semibold flex items-center gap-1.5 ${
                isBtnHovered ? "text-black" : "text-white"
              }`}>
                {isProcessing ? "Processing..." : "Acquire Piece"} &rarr;
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LimitedEditionsPage() {
  const [items, setItems] = useState<LimitedEditionItem[]>(DEFAULT_ITEMS);
  const [timerSettings, setTimerSettings] = useState<CountdownTimerProps | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [previewImageItem, setPreviewImageItem] = useState<LimitedEditionItem | null>(null);
  
  // Checkout & Customer Data States
  const [checkoutItem, setCheckoutItem] = useState<{ item: LimitedEditionItem; quantity: number } | null>(null);
  const [customerForm, setCustomerForm] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null);

  const [activeTabStyle, setActiveTabStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const { isHovered: isBackHovered, handlers: backHandlers } = useHoverInteraction();

  const tabs: { id: FilterType; label: string }[] = [
    { id: "all", label: `All Works (${items.length})` },
    { id: "available", label: `Available Now (${items.filter((i) => !i.status.toLowerCase().includes("sold") && !i.status.toLowerCase().includes("upcoming") && !i.status.toLowerCase().includes("growing") && !i.isUpcoming).length})` },
    { id: "upcoming", label: `Growing (${items.filter((i) => i.status.toLowerCase().includes("upcoming") || i.status.toLowerCase().includes("growing") || !!i.isUpcoming).length})` },
    { id: "sold", label: `Sold Out (${items.filter((i) => i.status.toLowerCase().includes("sold")).length})` },
  ];

  useEffect(() => {
    const updateStyle = () => {
      const tabIds = ["all", "available", "upcoming", "sold"];
      const activeIndex = tabIds.indexOf(activeFilter);
      const activeElement = tabsRef.current[activeIndex];
      if (activeElement) {
        setActiveTabStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
          opacity: 1
        });
      }
    };
    
    const timeoutId = setTimeout(updateStyle, 50);
    window.addEventListener("resize", updateStyle);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateStyle);
    };
  }, [activeFilter, items.length]);

  const loadData = useCallback(async () => {
    try {
      const [editionsData, settingsData] = await Promise.all([
        client.fetch(`*[_type == "limitedEdition"]`),
        client.fetch(`*[_type == "limitedEditionSettings"][0]`),
      ]);

      if (editionsData && editionsData.length > 0) {
        const parsed: LimitedEditionItem[] = editionsData.map((item: { 
          _id?: string; 
          name: string; 
          image: SanityImageSource; 
          price?: number;
          totalStock?: number;
          availableStock?: number;
          isUpcoming?: boolean;
          description?: string; 
          dimensions?: string; 
          materials?: string; 
          _updatedAt: string 
        }) => {
          let imgUrl = "";
          if (item.image) {
            try {
              imgUrl = urlFor(item.image).url();
            } catch {
              imgUrl = "";
            }
          }

          let derivedStatus = "Growing";
          if (item.isUpcoming) {
            derivedStatus = "Growing";
          } else if (item.availableStock !== undefined && item.availableStock !== null) {
            if (item.availableStock <= 0) {
              derivedStatus = "Sold Out";
            } else {
              derivedStatus = `${item.availableStock} Left`;
            }
          } else {
            derivedStatus = "Growing";
          }

          return {
            id: item._id,
            name: item.name,
            status: derivedStatus,
            image: imgUrl || "/limited-1.png",
            price: item.price,
            totalStock: item.totalStock,
            availableStock: item.availableStock,
            isUpcoming: item.isUpcoming,
            description: item.description,
            dimensions: item.dimensions,
            materials: item.materials,
          };
        });
        setItems(parsed);
      }

      if (settingsData) {
        setTimerSettings({
          launchDate: settingsData.launchDate,
          timerTitle: settingsData.timerTitle,
          showTimer: settingsData.showTimer,
          expiredMessage: settingsData.expiredMessage,
        });
      }
    } catch (err) {
      console.error("Failed to load Sanity limited edition data:", err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      if (isMounted) {
        await loadData();
      }
    };

    void initData();

    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleStartCheckout = (item: LimitedEditionItem, quantity: number = 1) => {
    setCheckoutItem({ item, quantity });
  };

const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
        resolve(true);
        return;
      }
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

  const handleAcquirePiece = async (item: LimitedEditionItem, quantity: number = 1, customer: CustomerDetails) => {
    try {
      setProcessingId(item.id || item.name);

      // Validate Indian phone number (10 digits starting with 6-9)
      const cleanPhone = customer.phone.replace(/\D/g, "");
      if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        alert("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
        setProcessingId(null);
        return;
      }

      // Validate Indian PIN code (6 digits, first digit 1-9)
      const cleanPostal = customer.postalCode.replace(/\D/g, "");
      if (cleanPostal.length !== 6 || !/^[1-9]\d{5}$/.test(cleanPostal)) {
        alert("Acquisitions are currently restricted to Indian delivery addresses. Please enter a valid 6-digit Indian PIN code (e.g. 110001).");
        setProcessingId(null);
        return;
      }

      const isSDKLoaded = await loadRazorpaySDK();
      if (!isSDKLoaded || typeof window === "undefined" || !(window as unknown as { Razorpay?: unknown }).Razorpay) {
        alert("Payment gateway is loading or blocked by your browser shield/adblocker. Please allow scripts for this page and try again.");
        setProcessingId(null);
        return;
      }

      // 1. Create order on backend with customer data
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.id,
          quantity,
          amount: item.price,
          customer: {
            ...customer,
            phone: cleanPhone,
            postalCode: cleanPostal,
          },
        }),
      });

      const orderData = await res.json();

      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to initialize acquisition order.");
      }

      // Close the delivery details form as Razorpay opens
      setCheckoutItem(null);

      // 2. Open Razorpay Checkout Modal pre-filled with customer details
      const options = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Mycelius Bio-Lab",
        description: `Acquisition of ${quantity}x ${orderData.productName || item.name}`,
        image: "https://www.myceliuslab.com/mycelius-logo.png",
        order_id: orderData.order_id || orderData.orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // 3. Verify Payment on Backend & Auto-update Stock
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId: item.id,
                quantity,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setOrderSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                productName: item.name,
                quantity,
                amount: orderData.amount / 100,
                customerName: customer.name,
                customerCity: customer.city,
              });

              // Refresh Sanity catalog to reflect updated stock / Sold Out badge immediately
              await loadData();
            } else {
              alert(verifyData.error || "Payment verification could not be completed.");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            alert("Payment completed, but verification failed to reach server. Please contact support with Payment ID: " + response.razorpay_payment_id);
          } finally {
            setProcessingId(null);
          }
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: cleanPhone,
        },
        notes: {
          productId: item.id || "custom",
          productName: item.name,
          quantity: quantity.toString(),
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: cleanPhone,
          shippingAddress: customer.address,
          city: customer.city,
          postalCode: cleanPostal,
        },
        theme: {
          color: "#FF5500",
          backdrop_color: "#12110E",
        },
        modal: {
          ondismiss: function () {
            setProcessingId(null);
          },
        },
      };

      const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: typeof options) => { open: () => void; on: (event: string, handler: (res: { error?: { description?: string } }) => void) => void } }).Razorpay;
      const rzpInstance = new RazorpayConstructor(options);

      rzpInstance.on("payment.failed", function (response: { error?: { description?: string } }) {
        alert(`Payment declined: ${response.error?.description || "Transaction failed."}`);
        setProcessingId(null);
      });

      rzpInstance.open();
    } catch (err: unknown) {
      const errorMsg = (err as { message?: string })?.message || "Could not complete request.";
      alert(errorMsg);
      setProcessingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const status = item.status.toLowerCase();
    const isUp = status.includes("upcoming") || status.includes("growing") || !!item.isUpcoming;
    const isSold = status.includes("sold");
    if (activeFilter === "available") return !isSold && !isUp;
    if (activeFilter === "upcoming") return isUp;
    if (activeFilter === "sold") return isSold;
    return true;
  });

  return (
    <main className="min-h-screen w-full bg-[#12110E] text-white selection:bg-[#FF6118] selection:text-black overflow-x-hidden relative flex flex-col justify-between">
      {/* Razorpay Standard Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      {/* Fixed/Floating Top Header Bar */}
      <header className="fixed top-0 left-0 w-full p-5 sm:p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none bg-transparent">
        {/* Back Button */}
        <div className="pointer-events-auto">
          <Link
            href="/"
            {...backHandlers}
            aria-label="Back to home"
            className="group relative overflow-hidden w-11 h-11 md:w-12 md:h-12 border border-white/20 hover:border-white rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer pointer-events-auto"
          >
            <ButtonShader isHovered={isBackHovered} colorA="#12110E" colorB="#ffffff" />
            <span className={`relative z-10 transition-colors duration-500 text-lg md:text-xl font-medium ${isBackHovered ? "text-black" : "text-white"}`}>
              &larr;
            </span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <ShaderLinkButton href="/collab" className="px-4 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs">
            Collab
          </ShaderLinkButton>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 px-4 sm:px-8 md:px-14 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-[9vw] xs:text-[8vw] sm:text-[6.5vw] md:text-[4.5vw] font-extralight font-kodchasan tracking-tight leading-[1.15] text-center mb-4 sm:mb-6">
          <span className="inline-block text-white">
            Limited&nbsp;
          </span>
          <span className="inline-block text-[#FF5500]">
            Editions
          </span>
        </h1>

        <p className="text-[#D4D0C9] text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light font-avenir-next tracking-[0.04em] leading-relaxed text-center">
          A small collection, grown one piece at a time. Which one will only ever belong to you?
        </p>

        {/* Drop Countdown Timer */}
        <CountdownTimer {...timerSettings} />
      </section>

      {/* Filter Tabs Section */}
      <section className="px-4 sm:px-8 md:px-14 max-w-7xl mx-auto w-full mb-8 sm:mb-12 flex justify-center">
        <div className="relative flex items-center p-1.5 bg-[#181613] border border-white/10 rounded-full max-w-fit shadow-inner">
          <div
            className="absolute top-1.5 bottom-1.5 rounded-full transition-all duration-300 ease-out shadow-md bg-[#FF5500]"
            style={{
              left: activeTabStyle.left,
              width: activeTabStyle.width,
              opacity: activeTabStyle.opacity,
            }}
          />
          {tabs.map((tab, idx) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabsRef.current[idx] = el;
                }}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`relative z-10 px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-colors duration-300 cursor-pointer ${
                  isActive ? "text-black" : "text-white/70 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 sm:px-8 md:px-14 max-w-7xl mx-auto w-full mb-20 sm:mb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <ProductCard
              key={item.id || index}
              item={item}
              onAcquire={(prod, qty) => handleStartCheckout(prod, qty)}
              onPreviewImage={(prod) => setPreviewImageItem(prod)}
              isProcessing={processingId === (item.id || item.name)}
            />
          ))}
        </div>
      </section>



      {/* Collector & Delivery Details Modal */}
      {checkoutItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setCheckoutItem(null)}
        >
          <div
            className="relative bg-[#161412] border border-white/15 rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <ModalCloseButton onClick={() => setCheckoutItem(null)} />

            {/* Header */}
            <span className="text-[10px] uppercase tracking-widest text-[#FF5500] font-semibold block mb-1">
              Collector & Delivery Details
            </span>
            <h3
              id="checkout-modal-title"
              className="text-xl sm:text-2xl font-semibold font-kodchasan text-white truncate max-w-[calc(100%-48px)] block mb-1"
              title={`Acquire ${checkoutItem.item.name}`}
            >
              Acquire {checkoutItem.item.name}
            </h3>
            <p className="text-white/60 text-xs font-avenir-next truncate max-w-[calc(100%-48px)] block mb-5">
              Enter your shipping details for white-glove bio-packaging & fulfillment.
            </p>

            {/* Order Summary Pill */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between mb-5 text-xs">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0d0c0a] shrink-0 border border-white/10">
                  <Image
                    src={checkoutItem.item.image || "/limited-1.png"}
                    alt={checkoutItem.item.name || "Product"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4
                    className="text-white font-medium truncate max-w-42.5 sm:max-w-52.5 block"
                    title={checkoutItem.item.name}
                  >
                    {checkoutItem.item.name}
                  </h4>
                  <span className="text-white/50 text-[11px] block mt-0.5">Quantity: {checkoutItem.quantity}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-white/50 uppercase tracking-wider block">Total Amount</span>
                <span className="text-sm font-semibold text-[#FF5500]">
                  ₹{((checkoutItem.item.price || 25000) * checkoutItem.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Domestic Shipping Badge */}
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/3 border border-white/10 text-[11px] font-avenir-next mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF5500]"></span>
                </span>
                <span className="text-white/80 font-medium text-[11px] tracking-wide">
                  Pan-India Domestic Fulfillment
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#FF5500] font-semibold">
                India Only
              </span>
            </div>

            {/* Customer Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAcquirePiece(checkoutItem.item, checkoutItem.quantity, customerForm);
              }}
              className="space-y-3.5"
            >
              <div>
                <label htmlFor="customer-name" className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customer-name"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="e.g. Gauri Gautam"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 focus:border-[#FF5500] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="customer-email" className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="customer-email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="collector@gmail.com"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 focus:border-[#FF5500] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="customer-phone" className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    id="customer-phone"
                    name="tel"
                    autoComplete="tel"
                    required
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    placeholder="e.g. 9876543210"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }))}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 focus:border-[#FF5500] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customer-address" className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Delivery / Shipping Address *
                </label>
                <textarea
                  id="customer-address"
                  name="street-address"
                  autoComplete="street-address"
                  required
                  rows={2}
                  placeholder="Flat / House No., Apartment or Street Name, Landmark"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 focus:border-[#FF5500] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="customer-city" className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    id="customer-city"
                    name="address-level2"
                    autoComplete="address-level2"
                    required
                    placeholder="e.g. New Delhi"
                    value={customerForm.city}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 focus:border-[#FF5500] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="customer-postal" className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    id="customer-postal"
                    name="postal-code"
                    autoComplete="postal-code"
                    required
                    maxLength={6}
                    pattern="[1-9][0-9]{5}"
                    placeholder="e.g. 110001"
                    value={customerForm.postalCode}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, postalCode: e.target.value.replace(/\D/g, "") }))}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 focus:border-[#FF5500] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <ModalSubmitButton
                isProcessing={processingId !== null}
                amount={(checkoutItem.item.price || 25000) * checkoutItem.quantity}
              />
            </form>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {previewImageItem && (
        <ImageLightboxModal
          item={previewImageItem}
          onClose={() => setPreviewImageItem(null)}
        />
      )}

      {/* Acquisition Celebration Modal */}
      {orderSuccess && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setOrderSuccess(null)}
        >
          <div 
            className="relative bg-[#161412] border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col items-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Orange Checkmark Badge */}
            <div className="w-12 h-12 rounded-full bg-[#FF5500] text-white flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <span className="text-[10px] uppercase tracking-widest text-[#FF5500] font-semibold block mb-1.5">
              Acquisition Confirmed
            </span>

            <h3 
              id="success-modal-title"
              className="text-xl sm:text-2xl font-semibold font-kodchasan text-white mb-2 truncate max-w-full block"
              title={orderSuccess.productName}
            >
              {orderSuccess.productName}
            </h3>

            <p className="text-white/65 text-xs font-avenir-next font-light max-w-sm mx-auto mb-6 leading-relaxed">
              Secured for <span className="text-white font-medium">{orderSuccess.customerName || "Collector"}</span>
              {orderSuccess.customerCity ? ` (${orderSuccess.customerCity})` : ""}. Payment receipt dispatched to your email.
            </p>

            {/* Receipt Table */}
            <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-left text-xs font-avenir-next space-y-2.5 mb-6 text-white/80">
              <div className="flex justify-between items-center">
                <span className="text-white/50">Amount Paid:</span>
                <span className="font-semibold text-[#FF5500] text-sm">₹{orderSuccess.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Payment ID:</span>
                <span className="font-mono text-[11px] text-white/90">{orderSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50">Order ID:</span>
                <span className="font-mono text-[11px] text-white/90">{orderSuccess.orderId}</span>
              </div>
            </div>

            <SuccessCloseButton onClick={() => setOrderSuccess(null)} />
          </div>
        </div>
      )}
    </main>
  );
}
