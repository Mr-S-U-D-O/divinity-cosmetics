"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

export function ResellerForm() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state for inputs not provided by Clerk
  const [formData, setFormData] = useState({
    phoneNumber: "",
    businessName: "",
    primaryChannel: "",
    reason: "",
  });

  // Handle loading and unauthenticated states
  if (!isLoaded) {
    return (
      <div className="w-full flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#3d7b32] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    // This state ideally won't be seen because the page should be protected, 
    // but just in case it leaks through or flashes.
    return (
      <div className="w-full text-center py-24 text-gray-500">
        Please sign in to apply.
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build the payload
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.primaryEmailAddress?.emailAddress,
      ...formData
    };

    // Console log the complete payload as requested
    console.log("RESELLER APPLICATION PAYLOAD:", payload);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-10 md:p-16 text-center border border-black/5 shadow-xl shadow-black/[0.02]"
      >
        <div className="flex justify-center mb-6 text-[#3d7b32]">
          <CheckCircle size={64} weight="duotone" />
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-4 text-[#111]">Application Received.</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Our team will review your details and be in touch within 48 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit} 
      className="bg-white rounded-3xl p-8 md:p-12 border border-black/5 shadow-xl shadow-black/[0.02] flex flex-col gap-6"
    >
      <div className="border-b border-black/5 pb-6 mb-2">
        <h3 className="text-xl font-bold text-[#111] mb-2">Your Details</h3>
        <p className="text-sm text-gray-500">Your basic information is pulled securely from your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">First Name</label>
          <input 
            type="text" 
            value={user.firstName || ""} 
            disabled 
            className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed" 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Last Name</label>
          <input 
            type="text" 
            value={user.lastName || ""} 
            disabled 
            className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
        <input 
          type="email" 
          value={user.primaryEmailAddress?.emailAddress || ""} 
          disabled 
          className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none cursor-not-allowed" 
        />
      </div>

      <div className="border-b border-black/5 pb-6 pt-4 mb-2 mt-2">
        <h3 className="text-xl font-bold text-[#111] mb-2">Business Details</h3>
        <p className="text-sm text-gray-500">Tell us about your retail channels.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNumber" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
        <input 
          type="tel" 
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="+1 (555) 000-0000"
          required
          className="w-full bg-white border border-gray-300 text-[#111] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3d7b32] focus:ring-1 focus:ring-[#3d7b32] transition-colors" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="businessName" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Business Name / Social Media Handle <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          placeholder="e.g. Aura Wellness Spa or @aurawellness"
          required
          className="w-full bg-white border border-gray-300 text-[#111] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3d7b32] focus:ring-1 focus:ring-[#3d7b32] transition-colors" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="primaryChannel" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Primary Sales Channel <span className="text-red-500">*</span></label>
        <div className="relative">
          <select 
            id="primaryChannel"
            name="primaryChannel"
            value={formData.primaryChannel}
            onChange={handleInputChange}
            required
            className="w-full bg-white border border-gray-300 text-[#111] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3d7b32] focus:ring-1 focus:ring-[#3d7b32] transition-colors appearance-none cursor-pointer"
          >
            <option value="" disabled>Select a channel...</option>
            <option value="Retail Store">Retail Store</option>
            <option value="Salon/Spa">Salon/Spa</option>
            <option value="Online/Social Media">Online/Social Media</option>
            <option value="Direct to Network">Direct to Network</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reason" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Why do you want to partner with Divinity Cosmetics? <span className="text-red-500">*</span></label>
        <textarea 
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          placeholder="Tell us a bit about your clientele and why Divinity is a good fit..."
          required
          rows={4}
          className="w-full bg-white border border-gray-300 text-[#111] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3d7b32] focus:ring-1 focus:ring-[#3d7b32] transition-colors resize-none"
        ></textarea>
      </div>

      <div className="pt-4 mt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111] text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#3d7b32] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : (
            <>Submit Application <ArrowRight weight="bold" /></>
          )}
        </button>
      </div>
    </motion.form>
  );
}
