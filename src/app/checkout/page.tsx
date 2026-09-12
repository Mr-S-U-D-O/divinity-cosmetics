"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/context/CartContext";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const { user, isLoaded } = useUser();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    suburb: "",
    city: "",
    province: "",
    postalCode: "",
  });

  // Since useUser is async-like, update state when it loads
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.primaryEmailAddress?.emailAddress || prev.email,
      }));
    }
  }, [user]);

  if (isLoaded && !user) {
    redirect("/");
  }

  const shippingCost = 100.00;
  const finalTotal = cartTotal + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const orderPayload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      },
      shippingAddress: {
        streetAddress: formData.streetAddress,
        suburb: formData.suburb,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
      },
      cart: items.map(item => ({
        id: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        price: item.product.basePrice,
        quantity: item.quantity
      })),
      totals: {
        subtotal: cartTotal,
        shipping: shippingCost,
        finalTotal: finalTotal
      }
    };

    console.log("ORDER PAYLOAD:", JSON.stringify(orderPayload, null, 2));
    alert("Order payload logged to console! (Check DevTools)");
  };

  if (!isLoaded) return <div className="min-h-screen pt-40 text-center">Loading secure checkout...</div>;

  return (
    <main className="min-h-screen bg-[#fafafa] pt-40 pb-24 px-6 md:px-12 lg:px-24 font-sans text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter mb-16">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column - Forms */}
          <div className="lg:col-span-7 space-y-16">
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-16">
              
              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-medium tracking-tight mb-8">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wider uppercase text-gray-500">First Name</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full border border-gray-200 p-4 rounded-sm bg-white focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wider uppercase text-gray-500">Last Name</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full border border-gray-200 p-4 rounded-sm bg-white focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wider uppercase text-gray-500">Email Address</label>
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full border border-gray-200 p-4 rounded-sm bg-gray-50 text-gray-500 cursor-not-allowed" readOnly />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-2xl font-medium tracking-tight mb-8">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wider uppercase text-gray-500">Street Address</label>
                    <input required name="streetAddress" value={formData.streetAddress} onChange={handleChange} type="text" className="w-full border border-gray-200 p-4 rounded-sm bg-white focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wider uppercase text-gray-500">Suburb</label>
                    <input required name="suburb" value={formData.suburb} onChange={handleChange} type="text" className="w-full border border-gray-200 p-4 rounded-sm bg-white focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wider uppercase text-gray-500">City</label>
                    <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full border border-gray-200 p-4 rounded-sm bg-white focus:outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wider uppercase text-gray-500">Province</label>
                    <div className="relative">
                      <select required name="province" value={formData.province} onChange={handleChange} className="w-full border border-gray-200 p-4 rounded-sm bg-white focus:outline-none focus:border-black transition-colors appearance-none">
                        <option value="" disabled>Select Province</option>
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
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wider uppercase text-gray-500">Postal Code</label>
                    <input required name="postalCode" value={formData.postalCode} onChange={handleChange} type="text" className="w-full border border-gray-200 p-4 rounded-sm bg-white focus:outline-none focus:border-black transition-colors" />
                  </div>
                </div>
              </section>

            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm sticky top-32">
              <h2 className="text-2xl font-medium tracking-tight mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8">
                {items.length === 0 ? (
                  <p className="text-gray-500 italic">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <div className="w-20 h-24 relative bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center z-10">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">R {item.product.basePrice.toFixed(2)}</p>
                      </div>
                      <div className="font-medium text-gray-900">
                        R {(item.product.basePrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>R {shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-8">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-2xl font-medium text-gray-900">R {finalTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={items.length === 0}
                className="w-full block text-center bg-black text-white py-4 font-medium uppercase tracking-wider text-sm hover:bg-[#3d7b32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
