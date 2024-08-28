"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";

type ExtractedInfo = {
  construction: string;
  occupancy: string;
  protection: string;
  exposure: string;
};

const FileUpload: React.FC = () => {
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB in bytes

  const [files, setFiles] = useState<File[]>([]);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const [useSonnet, setUseSonnet] = useState(true);
  const [oversizedFiles, setOversizedFiles] = useState<Set<string>>(new Set());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [invalidFiles, setInvalidFiles] = useState<Set<string>>(new Set());
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(
    null
  );
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prompt, setPrompt] =
    useState<string>(`You are an experienced real estate analyst. Please only include information that is explicitly stated in the documents. Based on the provided documents, write a detailed investment report in the following format:
Score # - Provide short sentence on recommendation.
OVERVIEW
Provide a comprehensive summary of the investment opportunity, highlighting key elements that would immediately interest an investor. The risks and rewards section should be exhaustive.
RISK AND REWARDS
Summarize the potential risks and rewards of the investment, focusing on the factors most likely to impact returns. Include specific data points and observations from the documents. Do not generalize. Ensure that each point is directly tied to information in the documents, but it is ok to make inference based on your understanding of commercial real estate investment.
LEASE TERMS SUMMARY
Extract and summarize the key lease terms for the property, focusing on factors critical to the investment decision. Include the tenant's strength, lease duration, rent escalations, operating expenses, and any other relevant terms. If multiple leases exist, first summarize the consistent terms and then identify any unique terms.
INVESTMENT CASH FLOW ANALYSIS
Create a detailed list of projected net investment cash flows (operating and finance) for the entire investment term, not a table. Indicate if certain information is not available. Ensure that the sum of these cash flows represents the total net cash flows for the investor over the investment period. Indicate if certain information is not available.
PROPERTY METRICS
Extract the following property metrics, if available, otherwise indicate “Not available”:
Property purchase price
Future Appreciated Value
Year 1 operating income
Year 1 operating expenses
Year 1 net operating income
INVESTMENT METRICS
Extract the following investment metrics, if available, otherwise indicate “Not available”:
Investment term
Loan term
Property value inflation rate
Rental inflation rate
Interest rate on debt
Discount rate
RETURN METRICS
Extract the following return metrics, if available, otherwise indicate “Not available”:
Discounted Cash Flow
Equity Multiple (MOIC)
Average Cap-Rate
Internal Rate of Return
Average Cash on Cash
KEY ASSUMPTIONS
List any major assumptions made in this analysis.
RECOMMENDATION
Provide a (1-5) score on the property based on the following scale:
5: if rewards strongly outweigh risks
4: if risks seem to outweigh risks
3: if rewards and risks seem to be equal
2: if risks seem to outweigh rewards
1: if risks strongly outweigh rewards
Do not recommend to invest or not invest. Instead, suggest a priority score (1-5) on further analyzing the property or continuing with the underwriting process based on the provided documents.  
ADDITIONAL GUIDELINES
Use specific data and figures from the provided documents wherever possible. If certain information is not available, please indicate this in your report.
Ensure the descriptions are specific and reference actual data from the documents. Avoid broad or vague statements.
Use the knowledge base for general inferences but avoid making major assumptions. If the information is not available, state "Not available."
Avoid hallucinations and guesses. Only include information present in the documents.
Cite sources for each inference, either the name of the property document or general advice.
Use your understanding of commercial real estate investment to highlight additional key insights based on the information from the reports. 
The risks and rewards are the most important part so the bullets for this section should be extensive.
The following is just an example format. Do not use these figures; only use it as a template: 
Preliminary Investment Brief
Score: 4 - Recommend further analysis of the Coastal Keys Resort.
OVERVIEW
The Coastal Keys Resort presents a prime investment opportunity as a luxury boutique hotel in San Diego, CA, featuring 200 rooms, ocean views, a full-service spa, a gourmet restaurant, and a private beach. The property has shown consistent revenue growth and is projected to generate $12,150,000 in revenue next year with $8,000,000 in expenses.
RISK AND REWARDS
- Risks:
- Recent hurricane damage requiring repairs within six months (Source: Lease Agreement Addendum).
- High dependency on tourism, which can be volatile (Source: Property Appraisal).
- Increasing operational expenses over the past three years (Source: Historical Financials).
- Potential for increased competition from new hotels in the area (Source: Market Analysis).
- Environmental regulations impacting coastal properties (Source: Environmental Report).
- Rewards:
- Prime location with ocean views and luxury amenities driving high occupancy rates (Source: Property Appraisal).
- Significant revenue growth, with projections indicating continued upward trends (Source: Historical Financials).
- Opportunity for rent increases aligned with market trends (Source: Market Analysis).
- Strong brand presence and reputation enhancing guest loyalty (Source: Property Appraisal).
- Diverse revenue streams including room bookings, spa services, and dining (Source: Income Statement).
- High guest satisfaction and positive reviews supporting future growth (Source: Market Analysis).
- Exclusive property with no immediate competitors in the vicinity (Source: Property Appraisal).
- Favorable economic conditions boosting tourism and travel (Source: Market Analysis).
LEASE TERMS SUMMARY
- Tenant Strength: The Coastal Keys Resort is operated by a well-established hotel chain with a strong credit rating and financial stability. The tenant has a proven track record of managing similar properties successfully (Source: Lease Agreement).
- Lease Duration: The lease term is for 15 years, beginning January 2021 and ending December 2035, with two 5-year renewal options (Source: Lease Agreement).
- Rent Escalations: The lease includes annual rent escalations of 3%, adjusted every January (Source: Lease Agreement).
- Operating Expenses: The lease is structured as a triple net lease, with the tenant responsible for all operating expenses, including property taxes, insurance, and maintenance (Source: Lease Agreement).
- Unique Clauses: The lease includes an exclusivity clause that prevents the landlord from leasing any other nearby properties to competing hotel brands. There is also an early termination clause that allows the tenant to exit the lease after 10 years with a significant penalty (Source: Lease Agreement).
PROPERTY METRICS
- Property Purchase Price: $50,000,000
- Future Appreciated Value: $62,000,000
- Year 1 Rental Income: $12,150,000
- Year 1 Operating Expenses: $8,000,000
- Year 1 Net Operating Income: $4,150,000
INVESTMENT METRICS
- Investment term: 10 years
- Property value inflation rate: 2.5%
- Rental inflation rate: 3%
- Loan term: 10 years
- Interest rate on debt: 4%
- Discount rate: 6%
RETURN METRICS
- Discounted Cash Flow: $8,000,000
- Equity Multiple (MOIC): 2.5x
- Average Cap-Rate: 6.5%
- Internal Rate of Return: 12%
- Average Cash on Cash: 10%
INVESTMENT CASH FLOWS:
- Year 1: ($54,150,000)
- Year 2: $4,274,500
- Year 3: $4,402,735
- Year 4: $4,534,817
- Year 5: $4,670,862
- Year 6-10: Not available
KEY ASSUMPTIONS
- The property will undergo repairs for hurricane damage within six months.
- Continued growth in the tourism sector will sustain high occupancy rates.
- Operational expenses will stabilize following recent increases.
- No significant changes in local environmental regulations.
- Competitor hotels will not significantly impact occupancy rates.
RECOMMENDATION
Score: 4 - Recommend further analysis of the Coastal Keys Resort. The property shows strong revenue projections and is located in a prime area with high demand. However, the recent hurricane damage and the need for repairs pose a significant risk that must be thoroughly evaluated. The potential for increased competition and environmental regulations also warrants further investigation. Given these factors, a detailed examination of the repair costs and timelines for hurricane damage is essential before proceeding with the full underwriting process. The overall strong performance metrics and favorable location suggest that with proper due diligence, this property could be a valuable investment.`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFiles([]);
    setSummaryUrl(null);
    setIsSummarizing(false);
    setSummary("");
    setShowSummary(false);
    setOversizedFiles(new Set());
    setInvalidFiles(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      // Check if the total number of files exceeds the limit
      if (files.length + newFiles.length > MAX_FILES) {
        alert(`You can only upload a maximum of ${MAX_FILES} files.`);
        return;
      }

      // Check each file's size and name validity
      const newOversizedFiles = new Set(oversizedFiles);
      const newInvalidFiles = new Set(invalidFiles);
      newFiles.forEach((file) => {
        console.log(`Processed ${file.name}: ${file.size} bytes`);
        if (file.size > MAX_FILE_SIZE) {
          newOversizedFiles.add(file.name);
        }
        if (!isValidFileName(file.name)) {
          newInvalidFiles.add(file.name);
        }
      });

      // Append all new files to existing files
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setOversizedFiles(newOversizedFiles);
      setInvalidFiles(newInvalidFiles);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType: string) => {
    const iconMap: { [key: string]: string } = {
      "application/pdf": "📄",
      "text/plain": "📝",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "📘",
      "application/msword": "📘",
      "text/csv": "📊",
      "application/vnd.ms-excel": "📊",
      "image/jpeg": "🖼️",
      "image/jpg": "🖼️",
      "image/png": "🖼️",
      "image/webp": "🖼️",
    };
    return iconMap[fileType] || "📁";
  };

  const isValidFileName = (fileName: string): boolean => {
    // TODO: Check if the file name contains only allowed characters TODO
    // const validCharacters = /^[a-zA-Z0-9\s\-\(\)\[\]]+$/;

    // Check if the file name doesn't contain consecutive whitespace characters
    const noConsecutiveWhitespace = /\S+(\s\S+)*$/;

    return noConsecutiveWhitespace.test(fileName);
  };

  const downloadAsPdf = async () => {
    try {
      setIsGeneratingPdf(true);

      let logoContent = null;
      let logoType = null;
      if (logo) {
        const logoArrayBuffer = await logo.arrayBuffer();
        logoContent = Array.from(new Uint8Array(logoArrayBuffer));
        logoType = logo.type;
      }

      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary,
          logo: logoContent,
          logoType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "investment_report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const requestSummary = async () => {
    setIsSummarizing(true);
    setShowSummary(true);
    setSummary("Generating summary...");
    try {
      const fileContents = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return {
            name: file.name,
            type: file.type,
            content: Array.from(new Uint8Array(arrayBuffer)),
          };
        })
      );

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: fileContents,
          prompt: prompt,
          useSonnet: useSonnet,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }
      const data = await response.json();
      setSummary(data.summary || "No summary generated");
      setSummaryUrl(data.summaryUrl);
      setExtractedInfo({
        construction:
          "High-quality materials used, structural integrity sound, overall build quality excellent.",
        occupancy:
          "Fully operational luxury hotel with 200 rooms, spa, and restaurant. High occupancy rates.",
        protection:
          "Advanced fire suppression system, 24/7 security, emergency response protocols in place.",
        exposure:
          "Coastal location with potential for hurricanes. Neighboring properties are mostly residential.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.txt,.xlsx,.docx,.doc,.csv,.xls,.jpeg,.png,.webp,.jpg,.gif"
      />
      <button
        onClick={handleButtonClick}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
        disabled={files.length >= MAX_FILES}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        {files.length >= MAX_FILES ? "File limit reached" : "Select Files"}
      </button>
      <button
        onClick={handleReset}
        className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
        disabled={files.length === 0 && !summary}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Reset
      </button>{" "}
      <div className="mb-4">
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition duration-200 ease-in-out cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {logo ? "Change Logo" : "Upload Logo"}
        </label>
        {logo && (
          <div className="mt-2 text-sm text-gray-300 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {logo.name}
          </div>
        )}
      </div>
      {files.length > 0 && (
        <p className="text-gray-500 text-sm text-center">
          {files.length} file{files.length !== 1 ? "s" : ""} selected (
          {files.length}/{MAX_FILES})
        </p>
      )}
      {oversizedFiles.size > 0 && (
        <p className="text-red-500 text-sm text-center">
          Files exceeding 4.5 MB cannot be processed.
        </p>
      )}
      {invalidFiles.size > 0 && (
        <div className="text-red-500 text-sm text-center">
          <p>Some files have invalid names and cannot be processed.</p>
          <p>
            File names can only contain alphanumeric characters, single spaces,
            hyphens, parentheses, and square brackets.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.name}
            className={`text-gray-300 text-center p-4 bg-gray-800 rounded-md ${
              oversizedFiles.has(file.name) || invalidFiles.has(file.name)
                ? "border-2 border-red-500"
                : ""
            }`}
          >
            <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
            <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {file.name}
            </div>
            {oversizedFiles.has(file.name) && (
              <div className="text-xs text-red-500 mt-1">
                Exceeds 4.5 MB limit
              </div>
            )}
            {invalidFiles.has(file.name) && (
              <div className="text-xs text-red-500 mt-1">Invalid file name</div>
            )}
          </div>
        ))}
      </div>{" "}
      {oversizedFiles.size > 0 && (
        <p className="text-red-500 text-sm text-center">
          Some files exceed the 4.5 MB size limit and cannot be processed.
        </p>
      )}
      {showPromptInput && (
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-40 p-2 border rounded-md bg-gray-700 text-gray-300"
            placeholder="Enter AI prompt here..."
          />
        </div>
      )}
      <button
        onClick={() => setShowPromptInput(!showPromptInput)}
        className="w-full mb-4 bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
      >
        {showPromptInput ? "Hide Prompt Input" : "Show Prompt Input"}
      </button>
      <div className="flex space-x-2">
        <button
          onClick={requestSummary}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
          disabled={
            files.length === 0 ||
            isSummarizing ||
            prompt.trim() === "" ||
            oversizedFiles.size > 0 ||
            invalidFiles.size > 0
          }
        >
          {isSummarizing ? "Generating Summary..." : "Generate Summary"}
        </button>{" "}
      </div>
      {summaryUrl && (
        <Link
          href={summaryUrl}
          className="block w-full text-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
        >
          Download Summary
        </Link>
      )}
      {summary && (
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
        >
          {showSummary ? "Hide Summary" : "Show Summary"}
        </button>
      )}
      {showSummary && summary && (
        <div className="mt-4 p-4 bg-gray-800 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">Summary</h3>
          <textarea
            className="w-full h-64 p-2 border rounded-md bg-gray-700 text-gray-300"
            value={summary}
            readOnly
          />
          <div className="mt-2 space-x-2">
            {summary && (
              <button
                onClick={downloadAsPdf}
                className={`w-full ${
                  summary && summary !== "Generating summary..."
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white px-4 py-2 rounded-md transition duration-200 ease-in-out`}
                disabled={
                  !summary ||
                  summary === "Generating summary..." ||
                  isGeneratingPdf
                }
              >
                {isGeneratingPdf ? "Generating PDF..." : "Download as PDF"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
