"use client";

import { useState } from "react";

export default function AIPage() {
  const [condition, setCondition] = useState("");
  const [dosha, setDosha] = useState("Pitta");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/ai/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ condition, dosha }),
    });

    const data = await res.json();
    console.log("API RESPONSE:", data);
    setResult(data.ai_response);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Aharasetu AI</h1>
        <p className="text-gray-500">
          Get personalized Ayurvedic diet recommendations
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-lg font-medium">Enter Details</h2>

        <input
          placeholder="Enter condition (e.g. acidity)"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border p-3 rounded-md"
        />

        <select
          value={dosha}
          onChange={(e) => setDosha(e.target.value)}
          className="w-full border p-3 rounded-md"
        >
          <option>Pitta</option>
          <option>Vata</option>
          <option>Kapha</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {loading ? "Generating..." : "Get Recommendation"}
        </button>
      </div>

      {/* RESULT CARD */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-medium mb-3">
            AI Recommendation
          </h2>

          <div className="whitespace-pre-line text-gray-700">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}