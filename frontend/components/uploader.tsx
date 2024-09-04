"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import MockChat from "@/components/MockChat"; // Make sure to create this file in the same directory

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
  const [showMockChat, setShowMockChat] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prompt, setPrompt] = useState<string>(`
Premium Pricing Analysis:
Based on the provided documents, calculate and provide an estimated premium range for insuring the property. Consider the risk factors, claims history, and COPE analysis in your calculation. Clearly state the factors that have the most significant impact on the premium and explain any assumptions made during the estimation.You are an experienced insurance underwriting analyst. Please only include information that is explicitly stated in the documents. Based on the provided documents, write a detailed property insurance underwriting assessment in the following format:Risk Quality Score:
Give the score a 4, a premium Pricing of $250,000 - $300,000 annually and provide a short sentence on the overall recommendation. 
OVERVIEW:
Provide a comprehensive summary of the insurance underwriting opportunity, highlighting key elements that would immediately interest an underwriter. The risks and exposure section should be exhaustive.RISK AND EXPOSURE:
Summarize the potential risks and exposures of the property, focusing on the factors most likely to impact the insurance underwriting decision. Include specific data points and observations from the documents. Do not generalize. Ensure that each point is directly tied to information in the documents, but it is acceptable to make inferences based on your understanding of commercial property insurance.
COPE ANALYSIS:
Perform a detailed COPE analysis, covering:	•	Construction: Evaluate the materials, structural integrity, and overall build quality of the property.
	•	Occupancy: Discuss the property's use and occupancy, including any tenants, their operations, and the implications for insurance coverage.
	•	Protection: Analyze the property's fire protection systems, security measures, and other safety features.
	•	Exposure: Identify external risks, such as environmental factors, neighboring properties, and natural disaster potential.PROPERTY METRICS:
Extract the following property metrics, if available; otherwise, indicate “Not available”:	•	Year Built
	•	Square Footage
	•	Construction Type
	•	Occupancy Type
	•	Protection Systems (e.g., fire alarms, sprinklers)
	•	External Exposure RisksCLAIMS HISTORY:
Review and summarize any past insurance claims related to the property. Focus on the nature of the claims, frequency, and severity, as well as any patterns that could impact future risk assessments.RECOMMENDATION:
Provide a (1-5) score on the property based on the following scale:	•	5: If the risks are well-mitigated, and the property is a favorable underwriting opportunity.
	•	4: If risks are present but manageable with standard precautions.
	•	3: If risks and rewards seem to be balanced.
	•	2: If the risks are concerning and may require significant mitigation.
	•	1: If the risks are high, making the property a poor underwriting candidate.Do not recommend whether to insure or not insure. Instead, suggest a priority score (1-5) on further analyzing the property or continuing with the underwriting process based on the provided documents.ADDITIONAL GUIDELINES:	•	Use specific data and figures from the provided documents wherever possible. If certain information is not available, please indicate this in your report.
	•	Ensure that descriptions are specific and reference actual data from the documents. Avoid broad or vague statements.
	•	Use the knowledge base for general inferences but avoid making major assumptions. If the information is not available, state “Not available.”
	•	Avoid hallucinations and guesses. Only include information present in the documents.
	•	Cite sources for each inference, either the name of the property document or general advice.
	•	Use your understanding of commercial property insurance to highlight additional key insights based on the information from the reports.
	•	The risks and exposures are the most important part, so the bullets for this section should be extensive.Example Format:
The following is just an example format. Do not use these figures; only use it as a template:
Preliminary Insurance Underwriting Brief
Risk Quality Score: 4 - Recommend further analysis of Empire Tech Tower.
Recommended Premium Pricing:
$250,000 - $300,000 annually
OVERVIEW:
Empire Tech Tower is a 25-story office building located at 330 Hudson Street, New York, NY, fully leased to a major tech corporation. The building includes a private fitness center and executive lounges. Built in 2020, the property spans 1.5 acres and is strategically located in a high-demand area.
RISK AND EXPOSURE:	
•	Risks:
	•	Recent fire damage to the server room due to faulty wiring (Source: Loss Run Report).
	•	Water damage from a burst pipe affecting multiple floors (Source: Loss Run Report).
	•	Theft of high-value tech equipment from a secure room (Source: Loss Run Report).
	•	Windstorm causing structural damage to the facade (Source: Loss Run Report).
	•	Explosion in a backup generator causing extensive damage to the mechanical room and nearby areas (Source: Loss Run Report).COPE ANALYSIS:	•	Construction: The building is made of steel and glass with reinforced concrete foundations. Recent fire and windstorm damage have been reported, indicating potential vulnerabilities (Source: Inspection Report).
	•	Occupancy: Single tenant (tech corporation) with high-value equipment and data servers. The occupancy type increases the risk profile due to the sensitive nature of the tenant’s operations (Source: Lease Agreement).
	•	Protection: Fire alarms, sprinklers, and 24/7 security personnel are in place, but the recent theft incident raises concerns about the effectiveness of the security measures (Source: Inspection Report).
	•	Exposure: Located in an urban area with moderate risk of windstorms. A nearby river presents a flooding risk that has affected the lower levels and electrical systems in the past (Source: Environmental Report).PROPERTY METRICS:	•	Year Built: 2020
	•	Square Footage: 450,000 sq ft
	•	Construction Type: Steel frame with reinforced concrete
	•	Occupancy Type: Single tenant, tech corporation
	•	Protection Systems: Fire alarms, sprinklers, security personnel
	•	External Exposure Risks: Flooding, windstormsCLAIMS HISTORY:	•	Fire damage to server room due to faulty wiring.
	•	Water damage from burst pipe affecting multiple floors.
	•	Theft of high-value tech equipment from a secure room.
	•	Windstorm causing structural damage to the facade.
	•	Explosion in a backup generator causing extensive damage to the mechanical room.RECOMMENDATION:
Score: 4 - Recommend further analysis of Empire Tech Tower. The property is well-constructed and modern but has experienced several incidents that may increase its risk profile. Further investigation into recent damages and the effectiveness of existing protection measures is warranted.This version includes the “Risk Quality Score” and “Recommended Premium Pricing” sections, with a dummy premium figure to demonstrate to viewers what the product will generate.
`);
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
      setShowMockChat(true); // Show the mock chat after processing
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
      <MockChat isVisible={showMockChat} />
    </div>
  );
};

export default FileUpload;
