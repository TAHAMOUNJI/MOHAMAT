import React, { useState } from 'react';
import { GitCompare, X, Calendar, FileText } from 'lucide-react';
import { LegalText, Amendment } from '../types';
import { formatDateLong } from '../utils/dateUtils';

interface LegalTextComparisonProps {
  originalText: LegalText;
  amendments: Amendment[];
  onClose: () => void;
}

const LegalTextComparison: React.FC<LegalTextComparisonProps> = ({ originalText, amendments, onClose }) => {
  const [selectedAmendment, setSelectedAmendment] = useState<Amendment | null>(
    amendments.length > 0 ? amendments[0] : null
  );

  const highlightDifferences = (original: string, amended: string) => {
    // Simple diff highlighting - in a real app, you'd use a proper diff library
    const originalWords = original.split(' ');
    const amendedWords = amended.split(' ');
    
    return {
      original: originalWords.map((word, index) => (
        <span key={index} className={amendedWords[index] !== word ? 'bg-red-200 px-1 rounded' : ''}>
          {word}{' '}
        </span>
      )),
      amended: amendedWords.map((word, index) => (
        <span key={index} className={originalWords[index] !== word ? 'bg-green-200 px-1 rounded' : ''}>
          {word}{' '}
        </span>
      ))
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GitCompare size={24} />
            مقارنة النصوص القانونية
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-600" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Amendment Selection */}
          {amendments.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">اختر التعديل للمقارنة</label>
              <select
                value={selectedAmendment?.id || ''}
                onChange={(e) => setSelectedAmendment(amendments.find(a => a.id === e.target.value) || null)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {amendments.map(amendment => (
                  <option key={amendment.id} value={amendment.id}>
                    تعديل {formatDateLong(amendment.amendmentDate)} - ج.ر رقم {amendment.officialGazetteNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Comparison View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Text */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-red-600" size={20} />
                <h3 className="text-lg font-semibold text-red-800">النص الأصلي</h3>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm text-red-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDateLong(originalText.publishDate)}
                  </span>
                  {originalText.officialGazetteNumber && (
                    <span>ج.ر رقم {originalText.officialGazetteNumber}</span>
                  )}
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-slate-700 leading-relaxed">
                  {selectedAmendment 
                    ? highlightDifferences(originalText.content, selectedAmendment.amendmentContent).original
                    : originalText.content
                  }
                </p>
              </div>
            </div>

            {/* Amended Text */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-green-600" size={20} />
                <h3 className="text-lg font-semibold text-green-800">النص المعدل</h3>
              </div>
              {selectedAmendment ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-4 text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDateLong(selectedAmendment.amendmentDate)}
                      </span>
                      <span>ج.ر رقم {selectedAmendment.officialGazetteNumber}</span>
                    </div>
                    {selectedAmendment.description && (
                      <p className="text-sm text-green-700 mt-2 font-medium">
                        {selectedAmendment.description}
                      </p>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-slate-700 leading-relaxed">
                      {highlightDifferences(originalText.content, selectedAmendment.amendmentContent).amended}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">لا توجد تعديلات متاحة للمقارنة</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">مفتاح الألوان:</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-red-200 px-2 py-1 rounded">نص محذوف</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-200 px-2 py-1 rounded">نص مضاف</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalTextComparison;