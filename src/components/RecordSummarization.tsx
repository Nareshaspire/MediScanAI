import React, { useState } from 'react';
import { FileText, Clipboard, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { summarizePatientRecord } from '../services/gemini';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export const RecordSummarization = () => {
  const [record, setRecord] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!record.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await summarizePatientRecord(record);
      setSummary(result || "No summary generated.");
    } catch (err) {
      console.error(err);
      setError("Failed to summarize record. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleExample = () => {
    setRecord(`Patient: John Doe, 45-year-old male.
Chief Complaint: Persistent cough and mild chest pain for 2 weeks.
History: Non-smoker, history of asthma in childhood. No recent travel.
Vitals: BP 120/80, HR 72, Temp 98.6F, SpO2 98% on room air.
Exam: Clear lungs bilaterally, no wheezing. Mild tenderness on chest wall.
Plan: Ordered chest X-ray, prescribed albuterol PRN, follow up in 1 week.`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-medical-blue" />
          Patient Record Summarization
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={record}
                onChange={(e) => setRecord(e.target.value)}
                placeholder="Paste complex patient records, clinical notes, or lab results here..."
                className="w-full h-80 p-4 bg-medical-light/30 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-blue focus:border-transparent outline-none resize-none text-sm font-mono"
              />
              <button 
                onClick={handleExample}
                className="absolute bottom-4 right-4 text-xs bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 text-gray-500"
              >
                Load Example
              </button>
            </div>
            
            <button
              onClick={handleSummarize}
              disabled={!record.trim() || loading}
              className="w-full py-3 bg-medical-blue text-white rounded-xl font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Summarizing...' : 'Generate Clinical Summary'}
            </button>
          </div>

          <div className="bg-medical-light/50 rounded-xl p-6 min-h-[300px] border border-black/5 overflow-y-auto max-h-[500px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-medical-blue" />
                  <p className="animate-pulse">Synthesizing clinical data...</p>
                </motion.div>
              ) : summary ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="markdown-body text-sm"
                >
                  <Markdown>{summary}</Markdown>
                </motion.div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-red-500 p-4 text-center">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                  <Clipboard className="w-12 h-12 mb-4 opacity-20" />
                  <p>Clinical summary will appear here</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> You can paste raw text from EMR systems, unstructured clinical notes, or even patient-reported symptoms for a structured summary.
        </p>
      </div>
    </div>
  );
};
