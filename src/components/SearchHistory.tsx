import React from 'react';
import { Clock, X, Search } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SearchHistoryProps {
  onSearchSelect: (searchTerm: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSearchSelect }) => {
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('search_history', []);

  const addToHistory = (searchTerm: string) => {
    if (searchTerm.trim() && !searchHistory.includes(searchTerm)) {
      setSearchHistory(prev => [searchTerm, ...prev.slice(0, 9)]); // Keep only 10 recent searches
    }
  };

  const removeFromHistory = (searchTerm: string) => {
    setSearchHistory(prev => prev.filter(term => term !== searchTerm));
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  // Expose addToHistory function globally for other components to use
  React.useEffect(() => {
    (window as any).addToSearchHistory = addToHistory;
  }, []);

  if (searchHistory.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Clock size={16} />
          عمليات البحث الأخيرة
        </h4>
        <button
          onClick={clearHistory}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          مسح الكل
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searchHistory.map((term, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 rounded-full px-3 py-1 text-sm transition-colors group"
          >
            <button
              onClick={() => onSearchSelect(term)}
              className="flex items-center gap-1 text-slate-700"
            >
              <Search size={12} />
              {term}
            </button>
            <button
              onClick={() => removeFromHistory(term)}
              className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;