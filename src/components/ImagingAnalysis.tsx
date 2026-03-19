import React, { useState } from 'react';
import { Upload, FileText, Search, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { analyzeMedicalImage } from '../services/gemini';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export const ImagingAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMimeType(file.type);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeMedicalImage(image, mimeType);
      setAnalysis(result || "No analysis generated.");
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please ensure your API key is configured correctly.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMimeType(file.type);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-medical-blue" />
          Medical Imaging Analysis
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-medical-blue transition-colors cursor-pointer relative"
              onClick={() => document.getElementById('file-upload')?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {image ? (
                <img src={image} alt="Medical Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
              ) : (
                <div className="py-12">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-sm">X-ray, MRI, CT Scan (JPG, PNG)</p>
                </div>
              )}
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="w-full py-3 bg-medical-blue text-white rounded-xl font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? 'Analyzing...' : 'Run AI Analysis'}
            </button>
          </div>

          <div className="bg-medical-light/50 rounded-xl p-6 min-h-[300px] border border-black/5">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-medical-blue" />
                  <p className="animate-pulse">Processing medical imagery...</p>
                </motion.div>
              ) : analysis ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="markdown-body text-sm"
                >
                  <Markdown>{analysis}</Markdown>
                </motion.div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-red-500 p-4 text-center">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p>{error}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p>Analysis report will appear here</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          <strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. AI analysis can be inaccurate. Always consult with a qualified medical professional for diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};
