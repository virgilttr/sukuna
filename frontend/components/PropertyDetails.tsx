import React, { useState } from "react";

interface PropertyDetailsProps {
  extractedInfo: {
    construction: string;
    occupancy: string;
    protection: string;
    exposure: string;
  };
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ extractedInfo }) => {
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const generateZoningLetter = async () => {
    setIsGeneratingLetter(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGeneratingLetter(false);
    alert("Zoning verification letter generated!");
  };

  // Dummy inspection report data
  const inspectionReport = {
    date: "June 15, 2024",
    inspector: "John Doe",
    overallCondition: "Good",
    items: [
      {
        name: "Foundation",
        condition: "Excellent",
        notes: "No signs of settling or cracking",
      },
      {
        name: "Roof",
        condition: "Good",
        notes: "Minor wear, estimated 5-7 years of life remaining",
      },
      {
        name: "Electrical Systems",
        condition: "Good",
        notes: "Up to code, no major issues detected",
      },
      {
        name: "Plumbing",
        condition: "Fair",
        notes: "Some pipes showing age, may need replacement in 3-5 years",
      },
      {
        name: "HVAC",
        condition: "Excellent",
        notes: "Recently replaced, energy-efficient systems",
      },
    ],
    recommendations:
      "Schedule regular maintenance for plumbing systems. Consider budgeting for future roof replacement.",
  };

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">
        Property Details
      </h2>

      {/* Extracted Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">
          Key Property Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(extractedInfo).map(([key, value]) => (
            <div key={key} className="bg-gray-700 p-3 rounded-md">
              <h4 className="text-gray-300 font-semibold capitalize">{key}</h4>
              <p className="text-gray-400">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Zoning Information */}
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

      {/* Inspection Report */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">
          Inspection Report
        </h3>
        <div className="bg-gray-700 rounded-md p-4">
          <p className="text-gray-300">
            <span className="font-semibold">Date:</span> {inspectionReport.date}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Inspector:</span>{" "}
            {inspectionReport.inspector}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold">Overall Condition:</span>{" "}
            {inspectionReport.overallCondition}
          </p>

          <h4 className="text-md font-semibold mt-4 mb-2 text-gray-300">
            Inspection Items
          </h4>
          <table className="w-full text-gray-300">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-left">Condition</th>
                <th className="text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {inspectionReport.items.map((item, index) => (
                <tr key={index}>
                  <td className="pr-4">{item.name}</td>
                  <td className="pr-4">{item.condition}</td>
                  <td>{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-md font-semibold mt-4 mb-2 text-gray-300">
            Recommendations
          </h4>
          <p className="text-gray-300">{inspectionReport.recommendations}</p>
        </div>
      </div>

      {/* Zoning Letter Generation */}
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

export default PropertyDetails;
