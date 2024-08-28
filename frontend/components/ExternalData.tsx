"use client";
import React, { useState } from "react";

interface ExternalDatalsProps {
  extractedInfo: {
    construction: string;
    occupancy: string;
    protection: string;
    exposure: string;
  };
}

const ExternalData: React.FC<ExternalDatalsProps> = ({ extractedInfo }) => {
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const generateZoningLetter = async () => {
    setIsGeneratingLetter(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGeneratingLetter(false);
    alert("Zoning verification letter generated!");
  };

  const environmentalImpact = {
    title: "Environmental Impact Overview",
    airQuality: "45 (Good)",
    waterQuality: "Safe for all uses, minimal contaminants detected",
    hazardousSites: [
      {
        name: "Old Chemical Plant",
        distance: "3 miles away",
        status: "Remediation ongoing",
      },
      {
        name: "Abandoned Gas Station",
        distance: "4.5 miles away",
        status: "No significant risk",
      },
    ],
    compliance: [
      { act: "Clean Air Act Compliance", status: "Fully compliant" },
      { act: "Clean Water Act Compliance", status: "Fully compliant" },
      {
        act: "Hazardous Waste Management",
        status: "Requires updated disposal plan by end of the year",
      },
    ],
  };

  const comparableSales = [
    {
      name: "Tech Plaza Tower",
      location: "1234 Innovation Lane, New York, NY",
      size: "200,000 sq ft",
      salePrice: "$120,000,000",
      capRate: "6.5%",
      yearBuilt: "2018",
      source: "MLS",
    },
    {
      name: "Silicon Gateway Center",
      location: "5678 Enterprise Blvd, New York, NY",
      size: "180,000 sq ft",
      salePrice: "$110,000,000",
      capRate: "6.8%",
      yearBuilt: "2017",
      source: "State Records",
    },
    {
      name: "Digital Hub Building",
      location: "9102 Tech Park Ave, New York, NY",
      size: "220,000 sq ft",
      salePrice: "$130,000,000",
      capRate: "6.3%",
      yearBuilt: "2019",
      source: "MLS",
    },
  ];

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">External Data</h2>

      {/* Environmental Impact Overview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">
          Environmental Protection Agency (EPA)
        </h3>
        <div className="bg-gray-700 rounded-md p-4">
          <h4 className="text-md font-semibold mb-2 text-gray-300">
            {environmentalImpact.title}
          </h4>
          <ul className="list-none space-y-2 text-gray-300">
            <li>
              🌬️ Air Quality Index (AQI): {environmentalImpact.airQuality}
            </li>
            <li>💧 Water Quality Report: {environmentalImpact.waterQuality}</li>
            <li>
              ⚠️ Hazardous Waste Sites:{" "}
              {environmentalImpact.hazardousSites.length} nearby sites within 5
              miles
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {environmentalImpact.hazardousSites.map((site, index) => (
                  <li key={index}>
                    {site.name} ({site.distance}) - {site.status}
                  </li>
                ))}
              </ul>
            </li>
            <li>
              📋 Environmental Regulations Compliance:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {environmentalImpact.compliance.map((item, index) => (
                  <li key={index}>
                    {item.act}: {item.status}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Comparable Sales */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">
          Comparable Market Data
        </h3>
        <div className="bg-gray-700 rounded-md p-4">
          <h4 className="text-md font-semibold mb-2 text-gray-300">
            Comparable Property Market Analysis
          </h4>
          {comparableSales.map((property, index) => (
            <div key={index} className="mb-4">
              <h5 className="text-gray-300 font-semibold">{property.name}:</h5>
              <ul className="list-disc pl-5 text-gray-300">
                <li>Location: {property.location}</li>
                <li>Size: {property.size}</li>
                <li>Sale Price: {property.salePrice}</li>
                <li>Cap Rate: {property.capRate}</li>
                <li>Year Built: {property.yearBuilt}</li>
                <li>Source: {property.source}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Zoning Information (unchanged) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">
          Zoning Information
        </h3>
        <div className="bg-gray-700 rounded-md p-4">
          <h4 className="text-md font-semibold mb-2 text-gray-300">
            Coastal Keys Resort Hotel
          </h4>
          <table className="w-full text-gray-300">
            <tbody>
              <tr>
                <td className="font-semibold pr-4">Address:</td>
                <td>123 Ocean Drive, San Diego, CA 92101</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Zoning District:</td>
                <td>CR (Commercial Resort)</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Allowed Uses:</td>
                <td>Hotels, Resorts, Restaurants, Recreational Facilities</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Height Limit:</td>
                <td>120 feet</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Setback Requirements:</td>
                <td>Front: 20 ft, Side: 10 ft, Rear: 15 ft</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Zoning Letter Generation (unchanged) */}
      <button
        onClick={generateZoningLetter}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
        disabled={isGeneratingLetter}
      >
        {isGeneratingLetter
          ? "Generating Letter..."
          : "Generate Zoning Verification Letter"}
      </button>
    </div>
  );
};

export default ExternalData;
