import React, { useState, useEffect } from "react";
import {
  Shield,
  Calendar,
  Award,
  Building2,
  Clock,
  FileCheck,
  Globe2,
  TrendingUp,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

interface YahooFinanceData {
  debtToEquity: number;
  priceToBook: number;
  enterpriseValue: number;
  forwardPE: number;
  trailingPE: number;
  profitMargins: number;
  totalRevenue: number;
}

function App() {
  const [urlSafetyScore, setUrlSafetyScore] = useState<number | null>(null);
  const [yahooData, setYahooData] = useState<YahooFinanceData | null>(null);
  const [fraudAnalysis, setFraudAnalysis] = useState<string | null>(null);

  useEffect(() => {
    analyzeCurrentUrl();
  }, []);

  const analyzeCurrentUrl = async () => {
    try {
      // Step 1: Get current URL
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const currentUrl = tabs[0].url;

      await Swal.fire({
        title: "Step 1",
        text: "Analyzing URL safety...",
        icon: "info",
        timer: 1500,
        showConfirmButton: false,
      });

      // Step 2: Analyze URL safety
      const safetyResponse = await axios.post(
        "https://your-api-endpoint/analyze-url",
        {
          url: currentUrl,
        }
      );
      setUrlSafetyScore(safetyResponse.data.safetyScore);

      await Swal.fire({
        title: "Step 2",
        text: "Fetching company financial data...",
        icon: "info",
        timer: 1500,
        showConfirmButton: false,
      });

      // Step 3: Get Yahoo Finance Data
      const yahooResponse = await axios.get(
        `https://yahoo-finance-api.example.com/v1/finance/quoteSummary/${extractCompanySymbol(
          currentUrl
        )}`,
        {
          params: {
            modules: "financialData,defaultKeyStatistics",
          },
        }
      );

      const financialData: YahooFinanceData = {
        debtToEquity: yahooResponse.data.debtToEquity,
        priceToBook: yahooResponse.data.priceToBook,
        enterpriseValue: yahooResponse.data.enterpriseValue,
        forwardPE: yahooResponse.data.forwardPE,
        trailingPE: yahooResponse.data.trailingPE,
        profitMargins: yahooResponse.data.profitMargins,
        totalRevenue: yahooResponse.data.totalRevenue,
      };
      setYahooData(financialData);

      await Swal.fire({
        title: "Step 3",
        text: "Analyzing fraud potential...",
        icon: "info",
        timer: 1500,
        showConfirmButton: false,
      });

      // Step 4: Send to fraud analysis API
      const fraudResponse = await axios.post(
        "https://your-fraud-api-endpoint/analyze",
        {
          urlData: safetyResponse.data,
          financialData: financialData,
        }
      );
      setFraudAnalysis(fraudResponse.data.result);

      await Swal.fire({
        title: "Analysis Complete",
        text: "All checks completed successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      await Swal.fire({
        title: "Error",
        text: "An error occurred during analysis",
        icon: "error",
      });
    }
  };

  const extractCompanySymbol = (url: string): string => {
    // This is a placeholder function - implement proper company symbol extraction logic
    return "AAPL"; // Default fallback
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ width: "800px" }}>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Domain Analysis Results
          </h1>
        </header>

        {/* URL Safety Score */}
        {urlSafetyScore !== null && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  URL Safety Score
                </h2>
              </div>
              <div className="text-2xl font-bold">
                <span
                  className={`${
                    urlSafetyScore > 70 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {urlSafetyScore}% Safe
                </span>
              </div>
            </div>
          </div>
        )}

        {/* WHOIS Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              WHOIS Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Registration Date</p>
                  <p className="font-medium">Sat Mar 18 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Expiration Date</p>
                  <p className="font-medium">Thu Mar 18 2027</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Registrar</p>
                  <p className="font-medium">Google LLC</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">2 years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Data */}
        {yahooData && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Financial Metrics
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Debt-to-Equity</p>
                <p className="text-lg font-semibold">
                  {yahooData.debtToEquity?.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Price-to-Book</p>
                <p className="text-lg font-semibold">
                  {yahooData.priceToBook?.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Enterprise Value</p>
                <p className="text-lg font-semibold">
                  ${(yahooData.enterpriseValue / 1e9).toFixed(2)}B
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Forward P/E</p>
                <p className="text-lg font-semibold">
                  {yahooData.forwardPE?.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Trailing P/E</p>
                <p className="text-lg font-semibold">
                  {yahooData.trailingPE?.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Profit Margins</p>
                <p className="text-lg font-semibold">
                  {(yahooData.profitMargins * 100).toFixed(2)}%
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-lg font-semibold">
                  ${(yahooData.totalRevenue / 1e9).toFixed(2)}B
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Analysis Result */}
        {fraudAnalysis && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Fraud Analysis
                </h2>
              </div>
              <div className="text-lg font-semibold">
                <span
                  className={`px-4 py-2 rounded-full ${
                    fraudAnalysis === "SAFE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {fraudAnalysis}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
