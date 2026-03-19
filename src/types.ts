export interface AnalysisResult {
  summary: string;
  findings: string[];
  recommendations: string[];
  confidence: number;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  history: string;
}
