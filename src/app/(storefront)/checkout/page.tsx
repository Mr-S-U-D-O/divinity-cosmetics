"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { useUser } from "@clerk/nextjs";
import { 
  ShieldCheck, 
  Truck, 
  Clock,
  Sparkle, 
  ArrowLeft, 
  LockSimple, 
  Spinner, 
  WarningCircle, 
  CreditCard, 
  WhatsappLogo, 
  Check, 
  Copy 
} from "@phosphor-icons/react";
import { siteConfig } from "@/lib/config/site";
import { initiateCheckoutWithPaystackAction, getShippingRatesAction } from "@/lib/domain/orders/actions";
import { ShippingRateOption } from "@/lib/domain/shipping/rates";

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    streetAddress: "",
    suburb: "",
    city: "",
    province: "Gauteng",
    postalCode: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live The Courier Guy Shipping Options via Shiplogic Rates API
  const [shippingRates, setShippingRates] = useState<ShippingRateOption[]>([
    {
      code: "ECO",
      name: "Economy Delivery",
      description: "The Courier Guy Road Freight (2–4 Business Days)",
      rate: 142.0,
      currency: "ZAR",
      estimatedDelivery: "2–4 Business Days",
      isCheapest: true,
    },
    {
      code: "ONX",
      name: "Premium Overnight Express",
      description: "Priority Air Freight Dispatch (Next Business Day)",
      rate: 210.0,
      currency: "ZAR",
      estimatedDelivery: "1–2 Business Days",
      isCheapest: false,
    },
    {
      code: "SDX",
      name: "Same Day Local Express",
      description: "Direct Local Courier from Wright Crossing Hub (Gauteng Only)",
      rate: 295.0,
      currency: "ZAR",
      estimatedDelivery: "Same Day (Orders before 11:00)",
      isCheapest: false,
    },
  ]);
  const [selectedRateCode, setSelectedRateCode] = useState<string>("ECO");
  const [isChangingShipping, setIsChangingShipping] = useState<boolean>(false);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);

  // Selected option & dynamic price calculation
  const selectedOption =
    shippingRates.find((r) => r.code === selectedRateCode) ||
    shippingRates.find((r) => r.isCheapest) ||
    shippingRates[0];

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = selectedOption ? selectedOption.rate : 142.0;
  const finalTotal = cartTotal + shippingCost;

  // Auto-fill customer details from Clerk if signed in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.primaryEmailAddress?.emailAddress || prev.email,
        phone: user.primaryPhoneNumber?.phoneNumber || prev.phone,
      }));
    }
  }, [user]);

  // Fetch live rates from Shiplogic when delivery location or item count changes
  useEffect(() => {
    if (!formData.suburb.trim() && !formData.postalCode.trim()) return;

    let isActive = true;
    const timer = setTimeout(async () => {
      setIsLoadingRates(true);
      console.log(
        "%c[🚚 COURIER RATES]%c Fetching rates for:",
        "background: #047857; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        "color: #047857; font-weight: bold;",
        {
          suburb: formData.suburb.trim(),
          city: formData.city.trim(),
          province: formData.province,
          postalCode: formData.postalCode.trim(),
          itemCount: totalItemCount,
        }
      );

      try {
        const res = await getShippingRatesAction({
          suburb: formData.suburb.trim(),
          postalCode: formData.postalCode.trim(),
          city: formData.city.trim(),
          province: formData.province,
          itemCount: totalItemCount,
        });

        if (!isActive) return;

        if (res.success && res.rates && res.rates.length > 0) {
          console.log(
            "%c[🚚 COURIER RATES]%c Live options loaded:",
            "background: #047857; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
            "color: #047857;",
            res.rates
          );
          setShippingRates(res.rates);
          const cheapest = res.rates.find((r) => r.isCheapest) || res.rates[0];
          setSelectedRateCode((prev) =>
            res.rates.some((r) => r.code === prev) ? prev : cheapest.code
          );
        }
      } catch (err) {
        if (isActive) {
          console.warn("[🚚 COURIER RATES ERROR]:", err);
        }
      } finally {
        if (isActive) {
          setIsLoadingRates(false);
        }
      }
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [formData.suburb, formData.postalCode, formData.city, formData.province, totalItemCount]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Primary Paystack Checkout Handler
  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderData = {
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        shippingAddress: {
          streetAddress: formData.streetAddress.trim(),
          suburb: formData.suburb.trim(),
          city: formData.city.trim(),
          province: formData.province,
          postalCode: formData.postalCode.trim(),
          country: "South Africa",
        },
        shippingMethod: `${selectedOption.name} (${selectedOption.code})`,
        shippingServiceCode: selectedOption.code,
        shippingQuoteToken: selectedOption.quoteToken,
        customerNotes: formData.notes.trim() || undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          name: item.product.name,
        })),
      };

      console.log(
        "%c[💳 PAYSTACK CHECKOUT]%c Submitting order with selected courier:",
        "background: #2563eb; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
        "color: #2563eb; font-weight: bold;",
        {
          method: `${selectedOption.name} (${selectedOption.code})`,
          shippingCost: `R ${shippingCost.toFixed(2)}`,
          cartSubtotal: `R ${cartTotal.toFixed(2)}`,
          finalTotal: `R ${finalTotal.toFixed(2)}`,
          orderData,
        }
      );

      const origin = typeof window !== "undefined" ? window.location.origin : undefined;
      const result = await initiateCheckoutWithPaystackAction(orderData, origin);

      if (result.success && result.authorizationUrl) {
        console.log(
          "%c[💳 PAYSTACK REDIRECT]%c Authorization URL ready. Redirecting customer:",
          "background: #2563eb; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
          "color: inherit;",
          result.authorizationUrl
        );
        // Redirect directly to the Paystack secure checkout page
        window.location.href = result.authorizationUrl;
      } else {
        setErrorMessage(result.error || "Unable to initiate payment with Paystack. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      console.error("Checkout submission failed:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred during checkout."
      );
      setIsSubmitting(false);
    }
  };

  // Optional WhatsApp Backup Message
  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map(
        (item, index) =>
          `${index + 1}. *${item.product.name}* (Qty: ${item.quantity}) - R${(
            item.product.basePrice * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const shippingText =
      shippingCost === 0 ? "FREE" : `R${shippingCost.toFixed(2)}`;

    return `🌿 *MANUAL ORDER REQUEST - DIVINITY COSMETICS*
🌐 Website: ${siteConfig.domain}

*CUSTOMER DETAILS:*
• Name: ${formData.firstName} ${formData.lastName}
• Phone: ${formData.phone || "Not provided"}
• Email: ${formData.email || "Not specified"}

*DELIVERY ADDRESS:*
• Address: ${formData.streetAddress || "-"}
• Suburb: ${formData.suburb || "-"}
• City: ${formData.city || "-"}
• Province: ${formData.province}
• Postal Code: ${formData.postalCode || "-"}

*ORDER SUMMARY:*
${itemsList}

• *Subtotal:* R${cartTotal.toFixed(2)}
• *Shipping:* ${shippingText}
• *TOTAL DUE:* R${finalTotal.toFixed(2)}

Hi Divinity Team! I would like to complete this order via EFT or direct assistance. Thank you!`;
  };

  const handleCopyOrder = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6]/40 pt-32 md:pt-36 pb-24 px-6 md:px-12 lg:px-24 font-sans text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-green transition-colors"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Back to Shop</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-black">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Order Checkout
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Enter your delivery details and complete your order with secure South African payment.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 bg-white border border-black px-3.5 py-2 rounded-full shadow-sm w-fit">
            <ShieldCheck size={16} weight="bold" className="text-green" />
            <span>256-Bit Bank Level Encryption</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-500 rounded-2xl flex items-center justify-between gap-3 text-red-900 text-sm">
            <div className="flex items-center gap-3">
              <WarningCircle size={22} weight="fill" className="text-red-500 shrink-0" />
              <p className="font-medium">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-red-700 underline shrink-0 hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white border border-black rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 border border-black">
              <Sparkle size={32} weight="light" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your Cart is Currently Empty</h2>
            <p className="text-gray-500 text-xs md:text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Discover our botanical formulations, add your preferred items, and return here to complete your checkout.
            </p>
            <Link
              href="/shop"
              className="btn-primary"
            >
              Explore Formulations
            </Link>
          </div>
        ) : (
          /* Active Checkout Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Delivery & Contact Form */}
            <div className="lg:col-span-7 space-y-6">
              <form id="paystack-checkout-form" onSubmit={handlePaystackCheckout} className="space-y-6">
                
                {/* 1. Customer Details */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-sm space-y-5">
                  <div className="border-b-2 border-black pb-3 flex justify-between items-start sm:items-center gap-3">
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-gray-900">1. Customer Contact</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Paystack payment receipts and order status will be sent here.</p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-[10px] sm:text-xs font-bold text-green uppercase tracking-wider bg-green/10 px-2.5 py-1 rounded-full border-2 border-black">
                      Step 1 of 2
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Naledi"
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Dlamini"
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="e.g. naledi@example.com"
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel"
                        placeholder="e.g. 082 123 4567"
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Address */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-sm space-y-5">
                  <div className="border-b-2 border-black pb-3 flex justify-between items-start sm:items-center gap-3">
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-gray-900">2. Delivery Address</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Reliable door-to-door courier delivery across South Africa.</p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-[10px] sm:text-xs font-bold text-green uppercase tracking-wider bg-green/10 px-2.5 py-1 rounded-full border-2 border-black">
                      Step 2 of 2
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        type="text"
                        placeholder="Building / Complex, Unit Number, Street Name"
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        Suburb <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Sandton / Rosebank"
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        City / Town <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Johannesburg / Durban"
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        Province <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="Northern Cape">Northern Cape</option>
                        <option value="North West">North West</option>
                        <option value="Western Cape">Western Cape</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. 2196"
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider uppercase text-gray-700">
                        Delivery Notes or Special Instructions (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Gate code, reception drop-off instructions, or custom requests..."
                        className="w-full border-2 border-black p-3 rounded-xl bg-gray-50/50 text-xs font-medium focus:outline-none focus:border-green focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Dynamic The Courier Guy Shipping Options from Shiplogic Rates API */}
                  <div className="mt-5 pt-5 border-t-2 border-black">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Clock size={16} weight="bold" className="text-black" />
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Estimated Delivery Time
                        </span>
                        {isLoadingRates && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-normal">
                            <Spinner size={12} className="animate-spin text-green" />
                            <span>Checking live rates...</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest hidden sm:inline">
                        Door-to-Door Courier
                      </span>
                    </div>

                    {/* Default Initial Display: Selected option + Highlighted 'Change this' link */}
                    <div className="bg-[#FAF8F5] border-2 border-black p-4 rounded-2xl flex flex-col gap-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0 text-black">
                            <Truck size={16} weight="bold" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
                                {selectedOption.name} ({selectedOption.estimatedDelivery})
                              </span>
                              <span className="text-xs font-bold text-green bg-green/10 px-2.5 py-0.5 rounded-full border-2 border-black">
                                R {selectedOption.rate.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {selectedOption.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsChangingShipping((prev) => !prev)}
                          className="text-xs font-bold text-black underline underline-offset-4 hover:text-green transition-colors self-start sm:self-auto cursor-pointer shrink-0"
                        >
                          {isChangingShipping ? "Done" : "Change this"}
                        </button>
                      </div>

                      {/* Centered 'Powered by The Courier Guy' with official brand logo */}
                      <div className="pt-2.5 border-t-2 border-black/10 flex items-center justify-center gap-2 text-center">
                        <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 tracking-wide">
                          Powered by
                        </span>
                        <Image
                          src="/images/the-courier-guy-logo.png"
                          alt="The Courier Guy"
                          width={92}
                          height={26}
                          className="h-4 sm:h-4.5 w-auto object-contain"
                        />
                      </div>
                    </div>

                    {/* Expandable radio-button list showing other live options */}
                    {isChangingShipping && (
                      <div className="mt-3 p-3 bg-white border-2 border-black rounded-2xl space-y-2 shadow-sm animate-in fade-in duration-200">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2 pt-1">
                          Select Available Delivery Speed:
                        </div>
                        {shippingRates.map((option) => {
                          const isSelected = option.code === selectedRateCode;
                          return (
                            <label
                              key={option.code}
                              onClick={() => {
                                setSelectedRateCode(option.code);
                                console.log(
                                  `%c[🚚 SHIPPING SELECTED]%c ${option.name} (${option.code}) - R${option.rate.toFixed(2)} | Recalculated Total: R${(cartTotal + option.rate).toFixed(2)}`,
                                  "background: #047857; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
                                  "color: #047857; font-weight: bold;"
                                );
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? "border-black bg-stone-50/90 shadow-xs ring-1 ring-black"
                                  : "border-black/20 hover:border-black/50 hover:bg-gray-50/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="shippingSpeedOption"
                                  checked={isSelected}
                                  onChange={() => setSelectedRateCode(option.code)}
                                  className="w-4 h-4 accent-black text-black cursor-pointer"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-900">
                                      {option.name}
                                    </span>
                                    {option.isCheapest && (
                                      <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-black text-white">
                                        Best Value
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    {option.description}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0 pl-3">
                                <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                                  R {option.rate.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {option.estimatedDelivery}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Accepted Payment Methods Showcase */}
                <div className="bg-white/95 p-5 md:p-6 rounded-3xl border-2 border-black shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0 border-2 border-black">
                      <LockSimple size={20} weight="bold" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 tracking-tight">Accepted South African Payment Methods</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Zero surcharge • PCI-DSS Level 1 certified gateway</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                    <div className="h-9 px-3 rounded-xl bg-[#faf9f6] border-2 border-black flex items-center justify-center hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]" title="Visa">
                      <Image
                        src="/images/payments/visa.svg"
                        alt="Visa"
                        width={42}
                        height={14}
                        className="h-3.5 w-auto object-contain"
                      />
                    </div>
                    <div className="h-9 px-3 rounded-xl bg-[#faf9f6] border-2 border-black flex items-center justify-center hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]" title="Mastercard">
                      <Image
                        src="/images/payments/mastercard.svg"
                        alt="Mastercard"
                        width={28}
                        height={18}
                        className="h-4.5 w-auto object-contain"
                      />
                    </div>
                    <div className="h-9 px-3 rounded-xl bg-[#faf9f6] border-2 border-black flex items-center justify-center hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]" title="Capitec Pay">
                      <Image
                        src="/images/payments/capitec-pay.svg"
                        alt="Capitec Pay"
                        width={68}
                        height={14}
                        className="h-3 w-auto object-contain"
                      />
                    </div>
                    <div className="h-9 px-3 rounded-xl bg-[#faf9f6] border-2 border-black flex items-center justify-center hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]" title="Ozow Instant EFT">
                      <Image
                        src="/images/payments/ozow.png"
                        alt="Ozow Instant EFT"
                        width={52}
                        height={15}
                        className="h-3.5 w-auto object-contain"
                      />
                    </div>
                    <div className="h-9 px-3 rounded-xl bg-[#faf9f6] border-2 border-black flex items-center justify-center hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]" title="Apple Pay">
                      <Image
                        src="/images/payments/apple-pay.svg"
                        alt="Apple Pay"
                        width={38}
                        height={16}
                        className="h-3.5 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Right Column: Order Summary & Paystack Action */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-black p-6 md:p-8 rounded-3xl shadow-lg shadow-black/[0.03] sticky top-36 space-y-5">
                
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <h2 className="text-lg font-bold tracking-tight text-gray-900">Order Summary</h2>
                  <span className="text-xs font-bold bg-green/10 text-green px-2.5 py-0.5 rounded-full border-2 border-black">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3.5 py-2 border-b-2 border-black/10 last:border-0">
                      <div className="w-14 h-16 relative bg-gray-50 rounded-lg overflow-hidden shrink-0 border-2 border-black">
                        <Image
                          src={item.product.images?.[0] || "/images/marula-baobab-body-lotion.jpg"}
                          alt={item.product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                        <span className="absolute top-1 right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-[11px] text-gray-500">R {item.product.basePrice.toFixed(2)} each</p>
                      </div>
                      <div className="font-bold text-xs text-gray-900">
                        R {(item.product.basePrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Shipping */}
                <div className="space-y-2.5 border-t-2 border-black pt-4 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">R {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-start text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{selectedOption.name}</span>
                      <span className="text-[10px] text-gray-500">The Courier Guy • {selectedOption.estimatedDelivery}</span>
                    </div>
                    <span className="font-semibold text-gray-900">R {shippingCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center border-t-2 border-black pt-4 gap-4">
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Total Due</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Inclusive of VAT &amp; Courier</span>
                  </div>
                  <span className="shrink-0 whitespace-nowrap text-xl sm:text-2xl font-serif font-bold text-black text-right">
                    R {finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Primary Paystack Checkout Button */}
                <button
                  type="submit"
                  form="paystack-checkout-form"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center !py-3.5 sm:!py-4 text-xs sm:text-sm tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size={18} className="animate-spin text-white" />
                      <span>Redirecting to Paystack...</span>
                    </>
                  ) : (
                    <>
                      <LockSimple size={18} weight="bold" />
                      <span>Pay R{finalTotal.toFixed(2)} with Paystack</span>
                    </>
                  )}
                </button>

                <div className="pt-1 flex flex-col items-center justify-center gap-1.5 text-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 font-medium tracking-wide">Processed securely by</span>
                    <Image
                      src="/images/payments/paystack.svg"
                      alt="Paystack"
                      width={84}
                      height={16}
                      className="h-3.5 w-auto object-contain opacity-90"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                    <ShieldCheck size={13} weight="bold" className="text-green" />
                    <span>256-Bit SSL Encryption • PCI-DSS Level 1 Certified</span>
                  </p>
                </div>

                {/* Collapsible WhatsApp Backup */}
                <div className="pt-2 border-t-2 border-black">
                  <button
                    type="button"
                    onClick={() => setShowWhatsAppFallback(!showWhatsAppFallback)}
                    className="w-full text-center text-xs text-gray-700 hover:text-[#25D366] font-semibold transition-colors flex items-center justify-center gap-1.5 py-1"
                  >
                    <WhatsappLogo size={16} weight="fill" style={{ color: "#25D366" }} />
                    <span>Prefer manual EFT or WhatsApp assistance?</span>
                  </button>

                  {showWhatsAppFallback && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-2xl border-2 border-black text-xs space-y-3">
                      <p className="text-gray-600 leading-relaxed">
                        If you prefer to arrange payment via direct EFT or speak with a concierge consultant:
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyOrder}
                        className="btn-secondary w-full justify-center"
                      >
                        {copied ? (
                          <>
                            <Check size={14} weight="bold" className="text-green" />
                            <span>Order Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <WhatsappLogo size={15} weight="fill" style={{ color: "#25D366" }} />
                            <span>Copy Order to WhatsApp</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
