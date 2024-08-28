"use client";

import React from "react";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, children }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-zinc-900 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          {/* Content */}
          <div className="mt-4 flex-1">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Property Comparison
            </h2>
            <p className="text-gray-300 mb-6">
              Compare property data from various sources and identify
              discrepancies seamlessly.
            </p>
            <Link href="/property-comparison">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
              >
                Go to Comparison Page
              </button>
            </Link>
          </div>
          {/* Additional Links or Content */}
          <div className="mt-auto">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a href="/support" className="text-blue-500 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
