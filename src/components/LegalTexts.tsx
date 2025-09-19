import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, BookOpen, Star, Eye, Copy, Share2, Download, Bell, Tag, Calendar, FileText, ExternalLink, Moon, Sun } from 'lucide-react';
import { LegalText, SearchFilters, LegalCategory } from '../types';
import { legalCategories, commonTags } from '../data/legalCategories';
import { sampleLegalTexts } from '../data/sampleLegalTexts';
import { formatDateLong } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { default_api, getLegalTexts } from '../api';

const LegalTexts: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | 'all'>('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedText, setSelectedText] = useState<LegalText | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('legal_favorites', []);
  const [personalNotes, setPersonalNotes] = useLocalStorage<Record<string, string>>('legal_notes', {});
  const [showNotifications, setShowNotifications] = useState(false);
  const [onlineResults, setOnlineResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [legalTexts, setLegalTexts] = useLocalStorage<LegalText[]>('legal_texts', sampleLegalTexts);
  const [scrapedTexts, setScrapedTexts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLegalTexts = async () => {
      const texts = await getLegalTexts();
      setScrapedTexts(texts);
    };

    fetchLegalTexts();

    const interval = setInterval(() => {
      fetchLegalTexts();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(interval);
  }, []);

  const handleOnlineSearch = async () => {
    if (!searchTerm) {
      alert('Please enter a search term.');
      return;
    }
    setIsSearching(true);
    const query = `legal texts in Algeria: ${searchTerm}`;
    const results = await default_api.google_web_search({ query });
    setOnlineResults(results.results);
    setIsSearching(false);
  };

  const parseLegalText = (html: string): Partial<LegalText> => {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : '';

    const articleNumberMatch = html.match(/(المادة\s+\d+)/);
    const articleNumber = articleNumberMatch ? articleNumberMatch[1] : '';

    const contentMatch = html.match(/<p>(.*?)<\/p>/);
    const content = contentMatch ? contentMatch[1] : '';

    return {
      title,
      articleNumber,
      content,
    };
  };

  const handleImport = async (url: string) => {
    console.log(`Importing from ${url}`);
    const result = await default_api.web_fetch({ prompt: `fetch ${url}` });
    const html = result.content;
    if (html) {
      const parsedText = parseLegalText(html);
      const newLegalText: LegalText = {
        id: Date.now().toString(),
        category: 'uncategorized',
        title: parsedText.title || 'Untitled',
        articleNumber: parsedText.articleNumber || '',
        content: parsedText.content || 'No content found',
        publishDate: new Date().toISOString(),
        tags: ['imported'],
      };
      setLegalTexts(prev => [newLegalText, ...prev]);
      alert('Legal text imported successfully!');
    } else {
      alert('Failed to fetch content from the URL.');
    }
  };

  // Filter legal texts based on search and filters
  const filteredTexts = useMemo(() => {
    return legalTexts.filter(text => {
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
  }, [searchTerm, selectedCategory, searchFilters, legalTexts]);

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
          <div className={`bg-white rounded-lg shadow-lg p-8 ${theme === 'dark' ? 'dark:bg-slate-800' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{selectedText.title}</h1>
                <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
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
                  onClick={toggleTheme}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
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
              
              <div className={`prose prose-lg max-w-none ${theme === 'dark' ? 'dark:prose-invert' : ''}`}>
                <p className={`leading-relaxed text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {highlightText(selectedText.content, searchTerm)}
                </p>
              </div>
            </div>

            {/* Personal Notes Section */} 
            <div className="border-t pt-6">
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>ملاحظاتي الشخصية</h3>
              <textarea
                value={personalNotes[selectedText.id] || ''}
                onChange={(e) => setPersonalNotes(prev => ({
                  ...prev,
                  [selectedText.id]: e.target.value
                }))}
                placeholder="أضف ملاحظاتك الشخصية هنا..."
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${theme === 'dark' ? 'dark:bg-slate-900' : ''}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>القوانين والنصوص القانونية</h2>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>مكتبة شاملة للقوانين الجزائرية مع إمكانيات بحث متقدمة</p>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-100 text-blue-600'} hover:bg-blue-200`}
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Notifications Panel */} 
        {showNotifications && (
          <div className={`rounded-lg shadow-lg p-4 mb-6 border-l-4 ${theme === 'dark' ? 'bg-slate-800 border-blue-400' : 'bg-white border-blue-500'}`}>
            <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>الإشعارات الحديثة</h3>
            <div className="space-y-2">
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>تم نشر تعديل جديد على قانون الإجراءات المدنية</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>منذ يومين</p>
              </div>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-green-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>صدر مرسوم تنفيذي جديد في القانون الإداري</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>منذ أسبوع</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid */} 
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`p-4 rounded-lg border-2 transition-colors ${selectedCategory === 'all' 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : `border-slate-200 ${theme === 'dark' ? 'bg-slate-800 text-white hover:border-slate-600' : 'bg-white hover:border-slate-300'}`
          }`}
        >
          <div className="text-2xl mb-2">📚</div>
          <div className="font-medium">جميع القوانين</div>
          <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{legalTexts.length} نص</div>
        </button>
        
        {Object.entries(legalCategories).map(([key, category]) => {
          const count = legalTexts.filter(text => text.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as LegalCategory)}
              className={`p-4 rounded-lg border-2 transition-colors ${selectedCategory === key 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : `border-slate-200 ${theme === 'dark' ? 'bg-slate-800 text-white hover:border-slate-600' : 'bg-white hover:border-slate-300'}`
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-sm">{category.name}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{count} نص</div>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */} 
      <div className={`rounded-lg shadow-md p-6 mb-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="البحث في النصوص القانونية، المواد، أو الوسوم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
              />
            </div>
          </div>
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className={`px-4 py-3 rounded-lg border transition-colors ${showAdvancedSearch 
                ? 'bg-blue-600 text-white border-blue-600' 
                : `${theme === 'dark' ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`
            }`}
          >
            <Filter size={20} />
          </button>
          <button
            onClick={handleOnlineSearch}
            className="px-4 py-3 rounded-lg border transition-colors bg-green-600 text-white border-green-600 hover:bg-green-700"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Advanced Search */} 
        {showAdvancedSearch && (
          <div className={`border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${theme === 'dark' ? 'border-slate-700' : ''}`}>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>رقم المادة</label>
              <input
                type="text"
                placeholder="مثال: المادة 124"
                value={searchFilters.articleNumber || ''}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, articleNumber: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>رقم الجريدة الرسمية</label>
              <input
                type="text"
                placeholder="مثال: 78"
                value={searchFilters.officialGazetteNumber || ''}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, officialGazetteNumber: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>من تاريخ</label>
              <input
                type="date"
                value={searchFilters.dateFrom || ''}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>إلى تاريخ</label>
              <input
                type="date"
                value={searchFilters.dateTo || ''}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
              />
            </div>
          </div>
        )}

        {/* Common Tags */} 
        <div className="mt-4">
          <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>الوسوم الشائعة:</p>
          <div className="flex flex-wrap gap-2">
            {commonTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <Tag size={12} className="inline mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Official Gazettes */} 
      <div className={`rounded-lg shadow-md p-6 mb-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Latest Scraped Texts</h3>
        <div className="space-y-4">
          {scrapedTexts.map((text, index) => (
            <div key={index} className="border-b pb-4">
              <a href={text.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {text.title}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Online Search Results */} 
      {isSearching && <div className="text-center p-4">Searching online...</div>}
      {onlineResults.length > 0 && (
        <div className={`rounded-lg shadow-md p-6 mb-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Online Search Results</h3>
          <div className="space-y-4">
            {onlineResults.map((result, index) => (
              <div key={index} className="border-b pb-4">
                <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {result.title}
                </a>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{result.snippet}</p>
                <button
                  onClick={() => handleImport(result.link)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mt-2"
                >
                  Import
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */} 
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            النتائج ({filteredTexts.length})
          </h3>
          <div className="flex gap-2">
            <button className={`px-3 py-1 rounded-lg text-sm ${theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
              المفضلة ({favorites.length})
            </button>
          </div>
        </div>

        {filteredTexts.length > 0 ? (
          <div className="grid gap-4">
            {filteredTexts.map(text => (
              <div key={text.id} className={`rounded-lg shadow-md p-6 transition-shadow ${theme === 'dark' ? 'bg-slate-800 hover:shadow-lg' : 'bg-white hover:shadow-lg'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{text.title}</h3>
                      <span className="text-2xl">{legalCategories[text.category].icon}</span>
                    </div>
                    {text.articleNumber && (
                      <p className="text-blue-600 font-medium mb-2">{text.articleNumber}</p>
                    )}
                    <p className={`mb-3 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {highlightText(text.content, searchTerm)}
                    </p>
                    <div className={`flex items-center gap-4 text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
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
                      className={`p-2 rounded-lg ${favorites.includes(text.id) ? (theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600') : (theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600')} hover:bg-yellow-200`}
                    >
                      <Star size={16} fill={favorites.includes(text.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => setSelectedText(text)}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-blue-100 text-blue-600'} hover:bg-blue-200`}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {text.tags.slice(0, 3).map(tag => (
                    <span key={tag} className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                      {tag}
                    </span>
                  ))}
                  {text.tags.length > 3 && (
                    <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>+{text.tags.length - 3} المزيد</span>
                  )}
                </div>

                {personalNotes[text.id] && (
                  <div className={`border-r-4 p-3 mt-3 ${theme === 'dark' ? 'bg-yellow-900 border-yellow-400' : 'bg-yellow-50 border-yellow-400'}`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
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
            <BookOpen size={48} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <p className={`mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>لم يتم العثور على نصوص قانونية تطابق البحث</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>جرب تغيير كلمات البحث أو الفلاتر</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalTexts;