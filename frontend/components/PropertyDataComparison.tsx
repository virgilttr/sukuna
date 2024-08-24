"use client";

import React from "react";

interface DataSource {
  name: string;
  data: {
    [key: string]: string | number;
  };
  confidence: number;
}

interface Discrepancy {
  field: string;
  sources: string[];
  values: (string | number)[];
  suggestion: string;
}

const PropertyDataComparison: React.FC = () => {
  const dataSources: DataSource[] = [
    {
      name: "Government Tax Records",
      data: {
        address: "123 Main St, Anytown, USA",
        sqft: 2500,
        bedrooms: 4,
        bathrooms: 3,
        yearBuilt: 1985,
      },
      confidence: 0.9,
    },
    {
      name: "Assessor Records",
      data: {
        address: "123 Main St, Anytown, USA",
        sqft: 2450,
        bedrooms: 4,
        bathrooms: 3,
        yearBuilt: 1986,
      },
      confidence: 0.85,
    },
    {
      name: "Broker Information",
      data: {
        address: "123 Main St, Anytown, USA",
        sqft: 2500,
        bedrooms: 5,
        bathrooms: 3.5,
        yearBuilt: 1985,
      },
      confidence: 0.75,
    },
  ];

  const findDiscrepancies = (sources: DataSource[]): Discrepancy[] => {
    const discrepancies: Discrepancy[] = [];
    const fields = Object.keys(sources[0].data);

    fields.forEach((field) => {
      const values = sources.map((source) => source.data[field]);
      const uniqueValues = Array.from(new Set(values));

      if (uniqueValues.length > 1) {
        discrepancies.push({
          field,
          sources: sources.map((source) => source.name),
          values: uniqueValues,
          suggestion: `Verify ${field} with on-site inspection or contact the relevant authorities for clarification.`,
        });
      }
    });

    return discrepancies;
  };

  const discrepancies = findDiscrepancies(dataSources);

  const getFieldClass = (source: DataSource, field: string) => {
    const isDiscrepancy = discrepancies.some((d) => d.field === field);
    return isDiscrepancy ? "text-red-500 font-semibold" : "";
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-900 rounded-2xl shadow-2xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-100 text-center">
        Property Data Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {dataSources.map((source, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">
              {source.name}
            </h2>
            <div className="mb-4 flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${source.confidence * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-300">
                {(source.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <ul className="space-y-2">
              {Object.entries(source.data).map(([key, value]) => (
                <li
                  key={key}
                  className={`${getFieldClass(source, key)} text-gray-300`}
                >
                  <span className="font-medium text-gray-400">{key}:</span>{" "}
                  {value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {discrepancies.length > 0 && (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-100">
            Discrepancies
          </h2>
          <div className="space-y-6">
            {discrepancies.map((discrepancy, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="text-xl font-semibold mb-2 text-red-400">
                  Discrepancy in {discrepancy.field}
                </h3>
                <p className="mb-2 text-gray-300">
                  <span className="font-medium text-gray-400">Sources:</span>{" "}
                  {discrepancy.sources.join(", ")}
                </p>
                <p className="mb-2 text-gray-300">
                  <span className="font-medium text-gray-400">Values:</span>{" "}
                  {discrepancy.values.join(", ")}
                </p>
                <p className="text-sm italic text-gray-400">
                  Suggestion: {discrepancy.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDataComparison;
