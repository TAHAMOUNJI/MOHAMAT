import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Star, Eye, Copy, Share2, Download, Bell, Tag, Calendar, FileText, ExternalLink } from 'lucide-react';
import { LegalText, SearchFilters, LegalCategory } from '../types';
import { legalCategories, commonTags } from '../data/legalCategories';
import { sampleLegalTexts } from '../data/sampleLegalTexts';
import { formatDateLong } from '../utils/dateUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LegalTexts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | 'all'>('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedText, setSelectedText] = useState<LegalText | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('legal_favorites', []);
  const [personalNotes, setPersonalNotes] = useLocalStorage<Record<string, string>>('legal_notes', {});
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter legal texts based on search and filters
  const filteredTexts = useMemo(() => {
    return sampleLegalTexts.filter(text => {
      const matchesSearch = searchTerm === '' || 
        text.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        text.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        text.articleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        text.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || text.category === selectedCategory;

      const matchesFilters = 
        (!searchFilters.articleNumber || text.articleNumber?.includes(searchFilters.articleNumber)) &&
        (!searchFilters.officialGazetteNumber || text.officialGazetteNumber?.includes(searchFilters.officialGazetteNumber)) &&
        (!searchFilters.dateFrom || new Date(text.publishDate) >= new Date(searchFilters.dateFrom)) &&
        (!searchFilters.dateTo || new Date(text.publishDate) <= new Date(searchFilters.dateTo)) &&
        (!searchFilters.tags?.length || searchFilters.tags.some(tag => text.tags.includes(tag)));

      return matchesSearch && matchesCategory && matchesFilters;
    });
  }, [searchTerm, selectedCategory, searchFilters]);

  const toggleFavorite = (textId: string) => {
    setFavorites(prev => 
      prev.includes(textId) 
        ? prev.filter(id => id !== textId)
        : [...prev, textId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ النص إلى الحافظة');
  };

  const shareText = (text: LegalText) => {
    if (navigator.share) {
      navigator.share({
        title: text.title,
        text: `${text.articleNumber}: ${text.content}`,
        url: window.location.href
      });
    } else {
      copyToClipboard(`${text.title}\n${text.articleNumber}: ${text.content}`);
    }
  };

  const exportToPDF = (text: LegalText) => {
    // This would integrate with a PDF library
    alert('سيتم تصدير النص إلى PDF قريباً');
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
    );
  };

  if (selectedText) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button 
            onClick={() => setSelectedText(null)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← العودة إلى القائمة
          </button>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedText.title}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatDateLong(selectedText.publishDate)}
                  </span>
                  {selectedText.officialGazetteNumber && (
                    <span className="flex items-center gap-1">
                      <FileText size={16} />
                      الجريدة الرسمية رقم {selectedText.officialGazetteNumber}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(selectedText.id)}
                  className={`p-2 rounded-lg ${favorites.includes(selectedText.id) ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'} hover:bg-yellow-200`}
                >
                  <Star size={20} fill={favorites.includes(selectedText.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => copyToClipboard(`${selectedText.articleNumber}: ${selectedText.content}`)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <Copy size={20} />
                </button>
                <button
                  onClick={() => shareText(selectedText)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <Share2 size={20} />
                </button>
                <button
                  onClick={() => exportToPDF(selectedText)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <Download size={20} />
                </button>
                {selectedText.officialGazetteUrl && (
                  <a
                    href={selectedText.officialGazetteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedText.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              {selectedText.articleNumber && (
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-slate-800 mb-2">{selectedText.articleNumber}</h3>
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-700 leading-relaxed text-lg">
                  {highlightText(selectedText.content, searchTerm)}
                </p>
              </div>
            </div>

            {/* Personal Notes Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">ملاحظاتي الشخصية</h3>
              <textarea
                value={personalNotes[selectedText.id] || ''}
                onChange={(e) => setPersonalNotes(prev => ({
                  ...prev,
                  [selectedText.id]: e.target.value
                }))}
                placeholder="أضف ملاحظاتك الشخصية هنا..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">القوانين والنصوص القانونية</h2>
            <p className="text-slate-600">مكتبة شاملة للقوانين الجزائرية مع إمكانيات بحث متقدمة</p>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border-l-4 border-blue-500">
            <h3 className="font-semibold text-slate-800 mb-3">الإشعارات الحديثة</h3>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">تم نشر تعديل جديد على قانون الإجراءات المدنية</p>
                <p className="text-xs text-blue-600">منذ يومين</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">صدر مرسوم تنفيذي جديد في القانون الإداري</p>
                <p className="text-xs text-green-600">منذ أسبوع</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedCategory === 'all' 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-2xl mb-2">📚</div>
          <div className="font-medium">جميع القوانين</div>
          <div className="text-sm text-slate-500">{sampleLegalTexts.length} نص</div>
        </button>
        
        {Object.entries(legalCategories).map(([key, category]) => {
          const count = sampleLegalTexts.filter(text => text.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as LegalCategory)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedCategory === key 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-sm">{category.name}</div>
              <div className="text-xs text-slate-500">{count} نص</div>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="البحث في النصوص القانونية، المواد، أو الوسوم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              showAdvancedSearch 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Advanced Search */}
        {showAdvancedSearch && (
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">رقم المادة</label>
              <input
                type="text"
                placeholder="مثال: المادة 124"
                value={searchFilters.articleNumber || ''}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, articleNumber: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">رقم الجريدة الرسمية</label>
              <input
                type="text"
                placeholder="مثال: 78"
                value={searchFilters.officialGazetteNumber || ''}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, officialGazetteNumber: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">من تاريخ</label>
              <input
                type="date"
                value={searchFilters.dateFrom || ''}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">إلى تاريخ</label>
              <input
                type="date"
                value={searchFilters.dateTo || ''}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Common Tags */}
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">الوسوم الشائعة:</p>
          <div className="flex flex-wrap gap-2">
            {commonTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors"
              >
                <Tag size={12} className="inline mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">
            النتائج ({filteredTexts.length})
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
              المفضلة ({favorites.length})
            </button>
          </div>
        </div>

        {filteredTexts.length > 0 ? (
          <div className="grid gap-4">
            {filteredTexts.map(text => (
              <div key={text.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{text.title}</h3>
                      <span className="text-2xl">{legalCategories[text.category].icon}</span>
                    </div>
                    {text.articleNumber && (
                      <p className="text-blue-600 font-medium mb-2">{text.articleNumber}</p>
                    )}
                    <p className="text-slate-600 mb-3 line-clamp-2">
                      {highlightText(text.content, searchTerm)}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDateLong(text.publishDate)}
                      </span>
                      {text.officialGazetteNumber && (
                        <span className="flex items-center gap-1">
                          <FileText size={14} />
                          ج.ر رقم {text.officialGazetteNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(text.id)}
                      className={`p-2 rounded-lg ${favorites.includes(text.id) ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'} hover:bg-yellow-200`}
                    >
                      <Star size={16} fill={favorites.includes(text.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => setSelectedText(text)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {text.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {text.tags.length > 3 && (
                    <span className="text-slate-500 text-xs">+{text.tags.length - 3} المزيد</span>
                  )}
                </div>

                {personalNotes[text.id] && (
                  <div className="bg-yellow-50 border-r-4 border-yellow-400 p-3 mt-3">
                    <p className="text-sm text-yellow-800">
                      <strong>ملاحظتي:</strong> {personalNotes[text.id].substring(0, 100)}
                      {personalNotes[text.id].length > 100 && '...'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-2">لم يتم العثور على نصوص قانونية تطابق البحث</p>
            <p className="text-sm text-slate-500">جرب تغيير كلمات البحث أو الفلاتر</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalTexts;