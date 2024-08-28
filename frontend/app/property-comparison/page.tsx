import PropertyDataComparison from "@/components/PropertyDataComparison";
import Link from "next/link";

export default function PropertyComparisonPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="flex justify-end mb-6">
        <Link href="/">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
            Back to Home
          </button>
        </Link>
      </div>
      <PropertyDataComparison />
    </div>
  );
}
