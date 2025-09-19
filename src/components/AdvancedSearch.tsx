import React, { useState } from 'react';
import { Search, Filter, X, Calendar, Tag, FileText } from 'lucide-react';
import { SearchFilters, LegalCategory } from '../types';
import { legalCategories, commonTags } from '../data/legalCategories';

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ filters, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const toggleTag = (tag: string) => {
    setLocalFilters(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">البحث المتقدم</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">نوع القانون</label>
              <select
                value={localFilters.category || ''}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  category: e.target.value as LegalCategory || undefined 
                }))}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">جميع الأنواع</option>
                {Object.entries(legalCategories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Article Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">رقم المادة</label>
              <input
                type="text"
                placeholder="مثال: المادة 124"
                value={localFilters.articleNumber || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, articleNumber: e.target.value }))}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Official Gazette Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">رقم الجريدة الرسمية</label>
              <input
                type="text"
                placeholder="مثال: 78"
                value={localFilters.officialGazetteNumber || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, officialGazetteNumber: e.target.value }))}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">نطاق التاريخ</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tags Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">الوسوم</label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    localFilters.tags?.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Tag size={14} className="inline mr-1" />
                  {tag}
                </button>
              ))}
            </div>
            {localFilters.tags && localFilters.tags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-slate-600">الوسوم المحددة: {localFilters.tags.join(', ')}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              onClick={handleApply}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              تطبيق الفلاتر
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              إعادة تعيين
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;