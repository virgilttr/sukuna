import React from "react";
import InsurancePricing from "@/components/Pricing"; // Adjust the import path as necessary
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="flex justify-end mb-6">
        <Link href="/">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
            Back to Home
          </button>
        </Link>
      </div>
      <div className="container mx-auto px-4">
        <InsurancePricing />
      </div>
    </div>
  );
}
