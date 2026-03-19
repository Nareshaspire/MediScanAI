import { useState } from 'react';
import { Activity, Image as ImageIcon, FileText, Shield, Info, Menu, X } from 'lucide-react';
import { ImagingAnalysis } from './components/ImagingAnalysis';
import { RecordSummarization } from './components/RecordSummarization';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'imaging' | 'records' | 'about';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('imaging');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'imaging', label: 'Imaging Analysis', icon: ImageIcon },
    { id: 'records', label: 'Patient Records', icon: FileText },
    { id: 'about', label: 'About MediScan', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-medical-blue p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-medical-dark">
                MediScan <span className="text-medical-blue">AI</span>
              </h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === item.id
                      ? 'border-medical-blue text-medical-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium ${
                      activeTab === item.id
                        ? 'bg-medical-light text-medical-blue'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'imaging' && <ImagingAnalysis />}
            {activeTab === 'records' && <RecordSummarization />}
            {activeTab === 'about' && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-medical-dark">Intelligent Healthcare Assistance</h2>
                  <p className="text-gray-600 text-lg">
                    MediScan AI leverages the latest advancements in Large Multimodal Models to assist healthcare professionals in processing complex data.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                    <Shield className="w-8 h-8 text-medical-blue mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
                    <p className="text-sm text-gray-500">
                      Data is processed securely. We recommend using anonymized patient data for all AI-assisted tasks.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                    <Activity className="w-8 h-8 text-medical-blue mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Clinical Precision</h3>
                    <p className="text-sm text-gray-500">
                      Powered by Gemini 3.1 Pro, optimized for complex medical reasoning and pattern recognition.
                    </p>
                  </div>
                </div>

                <div className="bg-medical-dark text-white p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-300 leading-relaxed">
                    To empower healthcare providers with cutting-edge AI tools that reduce administrative burden and provide preliminary insights, allowing more time for patient-centered care.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-semibold">MediScan AI</span>
          </div>
          <p className="text-gray-400 text-xs text-center">
            © 2026 MediScan AI. For research and educational purposes only.
          </p>
          <div className="flex gap-6 text-gray-400 text-xs">
            <a href="#" className="hover:text-medical-blue">Privacy Policy</a>
            <a href="#" className="hover:text-medical-blue">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

