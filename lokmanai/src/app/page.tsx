'use client';

import React, { useState } from "react";
import { askAi } from "@/services/aiApi";

const Home = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await askAi(question);
      setResponse(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="border border-neutral-200 rounded-lg p-6 bg-white">
          <h1 className="text-2xl font-bold mb-6 text-center">AI Soru-Cevap</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Sorunuz:
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Örnek: Lokman Firmalar"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Gönderiliyor..." : "Gönder"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
              <p className="text-red-700">Hata: {error}</p>
            </div>
          )}

          {response && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Cevap:</h3>
              <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-sm">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
