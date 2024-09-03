"use client";
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AlertCircle, Info } from "lucide-react";
import ClaimsHistory from "@/components/ClaimsHistory";

type RiskCategory = "lowRisk" | "mediumRisk" | "highRisk";

type ActuarialTable = {
  [key in RiskCategory]: { basePremium: number; multiplier: number };
};

type RiskFactorContribution = {
  name: string;
  contribution: number;
};

type RiskExposure = {
  [key: string]: { value: string; hasInfo: boolean };
};

const InsurancePricing: React.FC = () => {
  const riskScore = 4; // Risk score out of 5
  const riskQualityRecommendation = "Recommend further analysis";

  const riskFactorContributions: RiskFactorContribution[] = [
    { name: "Natural Disasters", contribution: 20 },
    { name: "Cyber Threats", contribution: 25 },
    { name: "Operational Risks", contribution: 15 },
    { name: "Financial Stability", contribution: 10 },
    { name: "Industry Volatility", contribution: 5 },
  ];

  const actuarialTable: ActuarialTable = {
    lowRisk: { basePremium: 1000, multiplier: 1.2 },
    mediumRisk: { basePremium: 1500, multiplier: 1.5 },
    highRisk: { basePremium: 2000, multiplier: 2.0 },
  };

  const riskExposure: RiskExposure = {
    naturalDisasters: { value: "Medium", hasInfo: true },
    cyberThreats: { value: "High", hasInfo: true },
    operationalRisks: { value: "Low", hasInfo: true },
    supplychainDisruption: { value: "Unknown", hasInfo: false },
  };

  const copeAnalysis = {
    construction: "Fire-resistant",
    occupancy: "Office space",
    protection: "Sprinkler system installed",
    exposure: "No adjacent hazards",
  };

  const competitorsPricing = {
    Progressive: 600000,
    Berkshire: 650000,
    Allstate: 750000,
  };

  const premiumPricing = "$250,000 - $300,000";

  const getRiskScoreColor = (score: number): string => {
    if (score <= 2) return "bg-red-600";
    if (score <= 4) return "bg-yellow-600";
    return "bg-blue-600";
  };

  const getRiskScoreWidth = (score: number): string => {
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-300">
        Insurance Pricing Analysis
      </h1>
      <Card className="mb-8 bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="bg-blue-700 text-white">
          <h2 className="text-2xl font-semibold">Risk Quality Score</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="w-full bg-gray-700 rounded-full h-8 mr-4">
              <div
                className={`h-full rounded-full ${getRiskScoreColor(
                  riskScore
                )}`}
                style={{ width: getRiskScoreWidth(riskScore) }}
              ></div>
            </div>
            <span className="text-5xl font-bold text-blue-300 ml-4">
              {riskScore}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            0-2: High Risk, 3-4: Medium Risk, 5: Low Risk
          </p>
          <p className="text-lg font-semibold text-blue-300 mb-4">
            Recommendation: {riskQualityRecommendation}
          </p>
          <h3 className="text-xl font-semibold mb-2 text-blue-300">
            Risk Factor Contributions
          </h3>
          <ul className="space-y-2">
            {riskFactorContributions.map((factor, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-white"
              >
                <span>{factor.name}:</span>
                <span className="font-semibold text-blue-200">
                  {factor.contribution}%
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-400 mt-2">
            The percentages show the contribution of each risk factor to the
            overall risk score.
          </p>
        </CardContent>
      </Card>
      <Card className="mb-8 bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="bg-green-600 text-white">
          <h2 className="text-2xl font-semibold">
            Recommended Premium Pricing
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold mb-4 text-green-300">
            {premiumPricing}
          </p>
          <h3 className="text-xl font-semibold mb-2 text-green-200">
            Pricing Explanation:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
            <li>Base premium from actuarial tables</li>
            <li>Adjusted for risk quality score</li>
            <li>Refined based on client-specific risk factors</li>
          </ul>
        </CardContent>
      </Card>
      <div className="mb-8">
        <ClaimsHistory />
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader className="bg-purple-600 text-white">
            <h2 className="text-2xl font-semibold">
              Client-Specific Risks and Exposure
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(riskExposure).map(([key, { value, hasInfo }]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize text-gray-300">
                    {key.replace(/([A-Z])/g, " $1").trim()}:
                  </span>
                  {hasInfo ? (
                    <span className="font-semibold text-purple-300">
                      {value}
                    </span>
                  ) : (
                    <a
                      href="#"
                      className="text-blue-300 hover:text-blue-100 flex items-center"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Requesting information from broker...");
                      }}
                    >
                      Request from broker
                      <Info className="ml-1 w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start space-x-2 text-yellow-300">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                These risks are provided by the client. Our analysis is
                customized based on these specific factors.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader className="bg-orange-500 text-white">
            <h2 className="text-2xl font-semibold">COPE Analysis</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(copeAnalysis).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="capitalize text-gray-300">{key}:</span>
                  <span className="font-semibold text-orange-300">{value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardHeader className="bg-yellow-600 text-white">
            <h2 className="text-2xl font-semibold">Competitors Pricing</h2>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            <ul className="space-y-2">
              {" "}
              {Object.entries(competitorsPricing).map(([competitor, price]) => (
                <li key={competitor} className="flex justify-between">
                  {" "}
                  <span className="text-gray-300">{competitor}:</span>{" "}
                  <span className="font-semibold text-yellow-300">
                    {" "}
                    ${price}{" "}
                  </span>{" "}
                </li>
              ))}{" "}
            </ul>{" "}
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
    </div>
  );
};

export default InsurancePricing;
