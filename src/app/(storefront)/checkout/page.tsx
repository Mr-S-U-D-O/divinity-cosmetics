"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { useUser } from "@clerk/nextjs";
import { 
  WhatsappLogo, 
  ShieldCheck, 
  Truck, 
  Sparkle, 
  ArrowLeft, 
  Copy, 
  Check, 
  EnvelopeSimple, 
  Clock 
} from "@phosphor-icons/react";
import { siteConfig } from "@/lib/config/site";

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

  const [copied, setCopied] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

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

  const shippingCost = cartTotal >= siteConfig.freeShippingThreshold ? 0.0 : siteConfig.standardShippingCost;
  const finalTotal = cartTotal + shippingCost;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      shippingCost === 0 ? "FREE (Orders over R500)" : `R${shippingCost.toFixed(2)}`;

    return `🌿 *NEW ORDER - DIVINITY COSMETICS*
🌐 Website: ${siteConfig.domain}

*CUSTOMER DETAILS:*
• Name: ${formData.firstName} ${formData.lastName}
• WhatsApp/Phone: ${formData.phone || "Provided in chat"}
• Email: ${formData.email || "Not specified"}

*DELIVERY ADDRESS:*
• Address: ${formData.streetAddress || "To be confirmed in chat"}
• Suburb: ${formData.suburb || "-"}
• City: ${formData.city || "-"}
• Province: ${formData.province}
• Postal Code: ${formData.postalCode || "-"}

*ORDER SUMMARY:*
${itemsList}

--------------------------------
• *Subtotal:* R${cartTotal.toFixed(2)}
• *Shipping:* ${shippingText}
• *TOTAL DUE:* R${finalTotal.toFixed(2)}
--------------------------------
${formData.notes ? `*Special Notes:* ${formData.notes}\n` : ""}
Hi Divinity Team! I'm placing this priority order via ${siteConfig.domain}. Please confirm stock availability and send payment / EFT instructions. Thank you!`;
  };

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const rawMessage = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(rawMessage);
    const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;

    setOrderSent(true);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyOrder = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pt-32 md:pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Back to Botanicals</span>
          </Link>
        </div>

        {/* Pre-launch Concierge Announcement Banner */}
        <div className="mb-12 bg-white border border-[#3d7b32]/20 rounded-2xl p-6 md:p-8 shadow-[0_4px_25px_-10px_rgba(61,123,50,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3d7b32]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8efe7] text-[#3d7b32] rounded-full text-[11px] font-bold tracking-widest uppercase">
                <Sparkle size={14} weight="fill" />
                <span>Pre-Launch VIP Concierge · shopdivinitycosmetics.co.za</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900 leading-snug">
                Priority Ordering via Personal WhatsApp Concierge
              </h1>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Direct automated card checkout is undergoing final South African banking security verification for our official launch. In the meantime, we are fulfilling all priority orders personally via our verified <strong>Divinity WhatsApp Concierge</strong> with immediate dispatch.
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Clock size={16} className="text-[#3d7b32]" weight="bold" />
                <span>Fast response (Within 15 minutes)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Truck size={16} className="text-[#3d7b32]" weight="bold" />
                <span>Courier delivery across all 9 provinces</span>
              </div>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Sparkle size={32} weight="light" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-3">Your Cart is Currently Empty</h2>
            <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Discover our botanical formulations, add your preferred items, and return here to complete your priority order.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-[#3d7b32] text-white px-8 py-4 rounded-xl font-medium text-sm uppercase tracking-wider hover:bg-[#2c5a24] transition-colors shadow-sm"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          /* Active Checkout Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Delivery & Contact Form */}
            <div className="lg:col-span-7 space-y-8">
              <form id="concierge-checkout-form" onSubmit={handleWhatsAppCheckout} className="space-y-8">
                
                {/* Contact Information */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-medium tracking-tight text-gray-900">1. Contact Information</h2>
                    <p className="text-xs text-gray-500 mt-1">We will message you on WhatsApp to confirm order availability and dispatch tracking.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Naledi"
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Dlamini"
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel"
                        placeholder="e.g. 082 123 4567"
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        Email Address
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="e.g. naledi@example.com"
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-medium tracking-tight text-gray-900">2. Delivery Address</h2>
                    <p className="text-xs text-gray-500 mt-1">Direct courier delivery straight to your doorstep.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        type="text"
                        placeholder="House / Unit number, Complex or Building, Street name"
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        Suburb <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Sandton / Claremont"
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        City / Town <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. Johannesburg / Cape Town"
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        Province <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all appearance-none cursor-pointer"
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
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        type="text"
                        placeholder="e.g. 2196"
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-gray-600">
                        Special Instructions or Gift Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any gate access code, delivery instructions, or gift packaging notes..."
                        className="w-full border border-gray-200 p-3.5 rounded-lg bg-gray-50/50 text-sm focus:outline-none focus:border-[#3d7b32] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* How It Works Explainer */}
                <div className="bg-[#e8efe7]/40 border border-[#3d7b32]/20 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#3d7b32] flex items-center gap-2">
                    <ShieldCheck size={18} weight="bold" />
                    <span>How Your Priority Order Works</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">1. Instant Connection</p>
                      <p>Clicking the button will open WhatsApp with your full order & delivery address pre-filled.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">2. Simple Payment</p>
                      <p>We provide instant EFT, Capitec Pay, or bank details directly in chat for immediate confirmation.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">3. Priority Dispatch</p>
                      <p>Your items are packed in our signature packaging and shipped via registered courier with tracking.</p>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Right Column: Order Summary & WhatsApp CTA */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-gray-200/80 p-6 md:p-8 rounded-2xl shadow-lg shadow-black/[0.03] sticky top-32 space-y-6">
                
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-medium tracking-tight text-gray-900">Order Summary</h2>
                  <span className="text-xs font-semibold bg-[#e8efe7] text-[#3d7b32] px-2.5 py-1 rounded-full">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-16 h-20 relative bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        {item.product.images[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                        <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-xs text-gray-500">R {item.product.basePrice.toFixed(2)} each</p>
                      </div>
                      <div className="font-semibold text-sm text-gray-900">
                        R {(item.product.basePrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Shipping */}
                <div className="space-y-3 border-t border-gray-100 pt-5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Door-to-Door Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-[#3d7b32] font-semibold">FREE (Over R500)</span>
                    ) : (
                      <span>R {shippingCost.toFixed(2)}</span>
                    )}
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-[11px] text-[#3d7b32] bg-[#e8efe7]/60 p-2 rounded-md">
                      Tip: Add R{(siteConfig.freeShippingThreshold - cartTotal).toFixed(2)} more to qualify for Free Shipping!
                    </p>
                  )}
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-5">
                  <div>
                    <span className="text-base font-bold text-gray-900 block">Total Due</span>
                    <span className="text-xs text-gray-500">Inclusive of VAT & Courier</span>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    R {finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Primary WhatsApp Action Button */}
                <button
                  type="submit"
                  form="concierge-checkout-form"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 px-6 rounded-xl font-bold text-base hover:bg-[#1ebd5a] active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <WhatsappLogo size={24} weight="fill" />
                  <span>Place Order via WhatsApp Concierge</span>
                </button>

                {/* Secondary Option: Copy Order Text */}
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 active:scale-[0.99] transition-all"
                >
                  {copied ? (
                    <>
                      <Check size={16} weight="bold" className="text-[#3d7b32]" />
                      <span>Order Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} weight="bold" />
                      <span>Copy Order Details</span>
                    </>
                  )}
                </button>

                {orderSent && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                    <p className="font-bold">Opening WhatsApp...</p>
                    <p>If WhatsApp didn't open automatically, use the "Copy Order Details" button and send it directly to our support number or email.</p>
                  </div>
                )}

                {/* Reassurance Footer */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
                    <EnvelopeSimple size={16} weight="bold" className="text-[#3d7b32]" />
                    <span>Support: {siteConfig.supportEmail}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Official domain: <span className="font-medium text-gray-600">{siteConfig.domain}</span>. Handcrafted with reverence in South Africa.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
