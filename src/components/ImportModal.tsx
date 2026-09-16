import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import type { Question, TopicType } from '../types';
import { parseDocxFile, parseMcqRawText } from '../utils/docxParser';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportQuestions: (newQuestions: Question[]) => void;
}

export const ImportModal = ({
  isOpen,
  onClose,
  onImportQuestions,
}: ImportModalProps) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [selectedTopic, setSelectedTopic] = useState<TopicType>('Percentage');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setPreviewQuestions(parsed);
        } else {
          setErrorMsg('JSON file must contain an array of question objects.');
        }
      } else if (file.name.endsWith('.docx')) {
        const result = await parseDocxFile(file, selectedTopic);
        if (result.questions.length === 0) {
          setErrorMsg('Could not find questions with options (A-D) in this docx file.');
        } else {
          setPreviewQuestions(result.questions);
          setSelectedTopic(result.topic);
        }
      } else {
        setErrorMsg('Please upload a .docx or .json file.');
      }
    } catch (err: unknown) {
      setErrorMsg(`Failed to parse file: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParseText = () => {
    if (!pasteText.trim()) {
      setErrorMsg('Please paste some question text first.');
      return;
    }
    setErrorMsg(null);
    const parsed = parseMcqRawText(pasteText, selectedTopic);
    if (parsed.length === 0) {
      setErrorMsg('Could not find valid questions. Ensure questions have numbers and options (A-D).');
    } else {
      setPreviewQuestions(parsed);
    }
  };

  const handleConfirmImport = () => {
    if (previewQuestions.length === 0) return;
    onImportQuestions(previewQuestions);
    setPreviewQuestions([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Import Questions / Documents</h3>
              <p className="text-xs text-slate-500">Upload docx or paste text to add questions directly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'file' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload .DOCX or .JSON
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste Text with Answer Key
          </button>
        </div>

        {/* Topic selector */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="font-semibold text-slate-700">Target Topic:</span>
          {(['Percentage', 'Ratio & Proportion', 'Profit & Loss', 'DSA'] as TopicType[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedTopic === t 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {activeTab === 'file' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {isProcessing ? 'Reading document...' : 'Click to select or drag .docx / .json here'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports &quot;Percentage_New.docx&quot;, &quot;DSA_300_MCQ_Medium.docx&quot;, etc.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste questions here...
1. What is 20% of 150?
A) 25
B) 30
C) 35
D) 40

Answer Key:
1. B"
                className="w-full h-44 p-3.5 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
              <button
                onClick={handleParseText}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all"
              >
                Parse Questions
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview of Parsed Questions */}
          {previewQuestions.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Parsed {previewQuestions.length} Questions Ready!</span>
                </div>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs">
                {previewQuestions.slice(0, 5).map((q, idx) => (
                  <div key={q.id || idx} className="p-2 bg-white rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-800">{q.id}: {q.question}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Correct: ({q.correctAnswer})</p>
                  </div>
                ))}
                {previewQuestions.length > 5 && (
                  <p className="text-center text-slate-500 text-[11px] pt-1">
                    ...and {previewQuestions.length - 5} more questions
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          {previewQuestions.length > 0 && (
            <button
              onClick={handleConfirmImport}
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add {previewQuestions.length} Questions to Portal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
