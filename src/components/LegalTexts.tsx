import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, Filter, BookOpen, Star, Eye, Copy, Share2, Download, Bell, Tag, Calendar, 
  FileText, ExternalLink, Moon, Sun, RefreshCw, Bookmark, History, Globe, 
  AlertTriangle, CheckCircle, Clock, Zap, Archive, Database, Settings,
  TrendingUp, BarChart3, Users, MessageSquare, Heart, Shield, Wifi, WifiOff
} from 'lucide-react';
import { LegalText, SearchFilters, LegalCategory, Notification } from '../types';
import { legalCategories, commonTags } from '../data/legalCategories';
import { sampleLegalTexts } from '../data/sampleLegalTexts';
import { formatDateLong, formatDateTime } from '../utils/dateUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AdvancedSearch from './AdvancedSearch';
import SearchHistory from './SearchHistory';
import LegalTextComparison from './LegalTextComparison';
<<<<<<< HEAD
import ImportLegalTexts from './ImportLegalTexts';
=======
>>>>>>> c6a0b11296b8accf34e0030393a3e93797657dcc

// Enhanced API service for fetching Algerian laws
class AlgerianLegalAPI {
  private static instance: AlgerianLegalAPI;
  private baseUrl = 'https://www.joradp.dz';
  private cache = new Map();
  private lastSync = 0;
  private syncInterval = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): AlgerianLegalAPI {
    if (!AlgerianLegalAPI.instance) {
      AlgerianLegalAPI.instance = new AlgerianLegalAPI();
    }
    return AlgerianLegalAPI.instance;
  }

  async fetchLatestLaws(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/latest-laws`);
      if (!response.ok) {
        // Fallback to mock data for demo
        return this.getMockLegalTexts();
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch laws:', error);
      return this.getMockLegalTexts();
    }
  }

  async searchLaws(query: string, filters?: SearchFilters): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters
      });
      const response = await fetch(`${this.baseUrl}/api/search?${params}`);
      if (!response.ok) {
        return this.mockSearch(query);
      }
      return await response.json();
    } catch (error) {
      console.error('Search failed:', error);
      return this.mockSearch(query);
    }
  }

  async getLawByArticle(articleNumber: string): Promise<LegalText | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/article/${articleNumber}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch article:', error);
      return null;
    }
  }

  private getMockLegalTexts(): LegalText[] {
    return [
      {
        id: Date.now().toString(),
        title: 'قانون الإجراءات المدنية والإدارية الجديد',
        category: 'procedural_law',
        articleNumber: 'المادة 15',
        content: 'تحديث جديد على قانون الإجراءات المدنية والإدارية يتضمن تبسيط الإجراءات القضائية وتسريع البت في القضايا.',
        publishDate: new Date().toISOString(),
        officialGazetteNumber: '85',
        tags: ['إجراءات', 'تحديث', 'قضاء'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: (Date.now() + 1).toString(),
        title: 'مرسوم تنفيذي جديد للقانون التجاري',
        category: 'commercial_law',
        articleNumber: 'المادة 42',
        content: 'مرسوم تنفيذي جديد ينظم التجارة الإلكترونية والمعاملات الرقمية في الجزائر.',
        publishDate: new Date(Date.now() - 86400000).toISOString(),
        officialGazetteNumber: '84',
        tags: ['تجارة إلكترونية', 'مرسوم', 'رقمنة'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private mockSearch(query: string): LegalText[] {
    return sampleLegalTexts.filter(text => 
      text.title.toLowerCase().includes(query.toLowerCase()) ||
      text.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  needsSync(): boolean {
    return Date.now() - this.lastSync > this.syncInterval;
  }

  markSynced(): void {
    this.lastSync = Date.now();
  }
}

const LegalTexts: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | 'all'>('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedText, setSelectedText] = useState<LegalText | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('legal_favorites', []);
  const [personalNotes, setPersonalNotes] = useLocalStorage<Record<string, string>>('legal_notes', {});
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('legal_bookmarks', []);
  const [readingHistory, setReadingHistory] = useLocalStorage<string[]>('reading_history', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('legal_notifications', []);
  const [legalTexts, setLegalTexts] = useLocalStorage<LegalText[]>('legal_texts', sampleLegalTexts);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useLocalStorage<string>('last_sync_time', '');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category' | 'relevance'>('date');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonTexts, setComparisonTexts] = useState<LegalText[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [autoSync, setAutoSync] = useLocalStorage<boolean>('auto_sync', true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent_searches', []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const api = AlgerianLegalAPI.getInstance();

  // Feature 1: Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineMode(false);
      if (autoSync) {
        handleSync();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSync]);

  // Feature 2: Auto-sync with background service
  useEffect(() => {
    if (autoSync && isOnline && api.needsSync()) {
      handleSync();
    }

    const syncInterval = setInterval(() => {
      if (autoSync && isOnline && api.needsSync()) {
        handleSync();
      }
    }, 30 * 60 * 1000); // Check every 30 minutes

    return () => clearInterval(syncInterval);
  }, [autoSync, isOnline]);

  // Feature 3: Enhanced sync functionality
  const handleSync = useCallback(async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    setSyncStatus('syncing');
    
    try {
      const latestLaws = await api.fetchLatestLaws();
      
      // Merge with existing texts, avoiding duplicates
      const existingIds = new Set(legalTexts.map(text => text.id));
      const newTexts = latestLaws.filter(text => !existingIds.has(text.id));
      
      if (newTexts.length > 0) {
        setLegalTexts(prev => [...newTexts, ...prev]);
        
        // Create notifications for new laws
        const newNotifications: Notification[] = newTexts.map(text => ({
          id: Date.now().toString() + Math.random(),
          title: 'قانون جديد',
          message: `تم إضافة: ${text.title}`,
          type: 'new_law',
          isRead: false,
          createdAt: new Date().toISOString(),
          relatedLegalTextId: text.id
        }));
        
        setNotifications(prev => [...newNotifications, ...prev]);
      }
      
      api.markSynced();
      setLastSyncTime(new Date().toISOString());
      setSyncStatus('success');
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, legalTexts, setLegalTexts, setNotifications, setLastSyncTime]);

  // Feature 4: Smart search with suggestions
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    if (value.length > 2) {
      const suggestions = legalTexts
        .filter(text => 
          text.title.toLowerCase().includes(value.toLowerCase()) ||
          text.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
        )
        .slice(0, 5)
        .map(text => text.title);
      
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [legalTexts]);

  // Feature 5: Advanced filtering and sorting
  const filteredTexts = useMemo(() => {
    let filtered = legalTexts.filter(text => {
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

    // Sort results
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'relevance':
        if (searchTerm) {
          filtered.sort((a, b) => {
            const aScore = (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
                          (a.content.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0);
            const bScore = (b.title.toLowerCase().includes(searchTerm.toLowerCase()) ? 2 : 0) +
                          (b.content.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0);
            return bScore - aScore;
          });
        }
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, searchFilters, legalTexts, sortBy]);

  // Feature 6: Reading history tracking
  const handleViewText = useCallback((text: LegalText) => {
    setSelectedText(text);
    setReadingHistory(prev => {
      const updated = [text.id, ...prev.filter(id => id !== text.id)];
      return updated.slice(0, 50); // Keep last 50 items
    });
  }, [setReadingHistory]);

  // Feature 7: Enhanced favorites and bookmarks
  const toggleFavorite = useCallback((textId: string) => {
    setFavorites(prev => 
      prev.includes(textId) 
        ? prev.filter(id => id !== textId)
        : [...prev, textId]
    );
  }, [setFavorites]);

  const toggleBookmark = useCallback((textId: string) => {
    setBookmarks(prev => 
      prev.includes(textId) 
        ? prev.filter(id => id !== textId)
        : [...prev, textId]
    );
  }, [setBookmarks]);

  // Feature 8: Export functionality
  const exportText = useCallback((text: LegalText, format: 'pdf' | 'docx' | 'txt') => {
    const content = `${text.title}\n${text.articleNumber || ''}\n\n${text.content}\n\nتاريخ النشر: ${formatDateLong(text.publishDate)}`;
    
    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${text.title}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // For PDF/DOCX, show message about future implementation
      alert(`تصدير ${format.toUpperCase()} سيتم تطويره قريباً`);
    }
  }, []);

  // Feature 9: Share functionality
  const shareText = useCallback((text: LegalText) => {
    const shareData = {
      title: text.title,
      text: `${text.articleNumber}: ${text.content}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
      alert('تم نسخ النص إلى الحافظة');
    }
  }, []);

  // Feature 10: Statistics calculation
  const stats = useMemo(() => {
    const totalTexts = legalTexts.length;
    const favoriteCount = favorites.length;
    const bookmarkCount = bookmarks.length;
    const categoryCounts = legalTexts.reduce((acc, text) => {
      acc[text.category] = (acc[text.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostPopularCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalTexts,
      favoriteCount,
      bookmarkCount,
      categoryCounts,
      mostPopularCategory: mostPopularCategory ? mostPopularCategory[0] : null,
      recentlyAdded: legalTexts.filter(text => 
        new Date(text.createdAt || text.publishDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length
    };
  }, [legalTexts, favorites, bookmarks]);

  // Feature 11: Notification management
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  }, [setNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

<<<<<<< HEAD
  const handleImport = (importedData: LegalText[]) => {
    const existingIds = new Set(legalTexts.map(text => text.id));
    const newTexts = importedData.filter(text => !existingIds.has(text.id));

    if (newTexts.length > 0) {
      setLegalTexts(prev => [...prev, ...newTexts]);
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'Importation réussie',
        message: `تم استيراد ${newTexts.length} نص قانوني جديد بنجاح.`,
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

=======
>>>>>>> c6a0b11296b8accf34e0030393a3e93797657dcc
  // Feature 12: Quick actions
  const quickActions = [
    { id: 'recent', label: 'المضافة حديثاً', icon: Clock, count: stats.recentlyAdded },
    { id: 'favorites', label: 'المفضلة', icon: Star, count: favorites.length },
    { id: 'bookmarks', label: 'المحفوظة', icon: Bookmark, count: bookmarks.length },
    { id: 'history', label: 'المقروءة', icon: History, count: readingHistory.length }
  ];

  // Feature 13: Advanced search modal
  const handleAdvancedSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
    setShowAdvancedSearch(false);
  }, []);

  // Feature 14: Text comparison
  const handleCompareTexts = useCallback((texts: LegalText[]) => {
    setComparisonTexts(texts);
    setShowComparison(true);
  }, []);

  // Feature 15: Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'f':
            event.preventDefault();
            document.getElementById('search-input')?.focus();
            break;
          case 'r':
            event.preventDefault();
            handleSync();
            break;
          case 's':
            event.preventDefault();
            setShowStats(!showStats);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSync, showStats]);

  // Feature 16: Voice search (placeholder)
  const handleVoiceSearch = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'ar-DZ';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
      };
      recognition.start();
    } else {
      alert('البحث الصوتي غير مدعوم في هذا المتصفح');
    }
  }, []);

  // Feature 17: Auto-save notes
  const handleNoteChange = useCallback((textId: string, note: string) => {
    setPersonalNotes(prev => ({
      ...prev,
      [textId]: note
    }));
  }, [setPersonalNotes]);

  // Feature 18: Quick filter buttons
  const quickFilters = [
    { id: 'today', label: 'اليوم', filter: () => new Date().toDateString() },
    { id: 'week', label: 'هذا الأسبوع', filter: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toDateString() },
    { id: 'month', label: 'هذا الشهر', filter: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toDateString() }
  ];

  // Feature 19: Bulk operations
  const [selectedTexts, setSelectedTexts] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  const handleBulkAction = useCallback((action: 'favorite' | 'bookmark' | 'export' | 'delete') => {
    switch (action) {
      case 'favorite':
        setFavorites(prev => [...new Set([...prev, ...selectedTexts])]);
        break;
      case 'bookmark':
        setBookmarks(prev => [...new Set([...prev, ...selectedTexts])]);
        break;
      case 'export':
        // Export selected texts
        const textsToExport = legalTexts.filter(text => selectedTexts.includes(text.id));
        const content = textsToExport.map(text => 
          `${text.title}\n${text.articleNumber || ''}\n\n${text.content}\n\n---\n\n`
        ).join('');
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'selected-legal-texts.txt';
        link.click();
        URL.revokeObjectURL(url);
        break;
    }
    setSelectedTexts([]);
    setBulkMode(false);
  }, [selectedTexts, legalTexts, setFavorites, setBookmarks]);

  // Feature 20: AI-powered suggestions (placeholder)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const getAISuggestions = useCallback(async (text: LegalText) => {
    // Placeholder for AI integration
    const mockSuggestions = [
      'قوانين ذات صلة بنفس الموضوع',
      'تعديلات حديثة على هذا القانون',
      'قضايا مشابهة في المحاكم'
    ];
    setAiSuggestions(mockSuggestions);
  }, []);

  if (selectedText) {
    return (
      <div className={`p-6 ${theme === 'dark' ? 'dark:bg-slate-900' : ''}`}>
        <div className="mb-6">
          <button 
            onClick={() => setSelectedText(null)}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← العودة إلى القائمة
          </button>
          <div className={`bg-white rounded-lg shadow-lg p-8 ${theme === 'dark' ? 'dark:bg-slate-800' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  {selectedText.title}
                </h1>
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
              <div className="flex gap-2 flex-wrap">
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
                  onClick={() => toggleBookmark(selectedText.id)}
                  className={`p-2 rounded-lg ${bookmarks.includes(selectedText.id) ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'} hover:bg-blue-200`}
                >
                  <Bookmark size={20} fill={bookmarks.includes(selectedText.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(`${selectedText.articleNumber}: ${selectedText.content}`)}
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
                <div className="relative group">
                  <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                    <Download size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => exportText(selectedText, 'txt')} className="block px-4 py-2 text-sm hover:bg-slate-100 w-full text-right">
                      تصدير TXT
                    </button>
                    <button onClick={() => exportText(selectedText, 'pdf')} className="block px-4 py-2 text-sm hover:bg-slate-100 w-full text-right">
                      تصدير PDF
                    </button>
                    <button onClick={() => exportText(selectedText, 'docx')} className="block px-4 py-2 text-sm hover:bg-slate-100 w-full text-right">
                      تصدير DOCX
                    </button>
                  </div>
                </div>
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
                  {selectedText.content}
                </p>
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="border-t pt-6 mb-6">
                <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  <Zap size={20} className="inline mr-2" />
                  اقتراحات ذكية
                </h3>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Notes Section */} 
            <div className="border-t pt-6">
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                ملاحظاتي الشخصية
              </h3>
              <textarea
                value={personalNotes[selectedText.id] || ''}
                onChange={(e) => handleNoteChange(selectedText.id, e.target.value)}
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
      {/* Header with enhanced features */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              القوانين والنصوص القانونية
            </h2>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              مكتبة شاملة للقوانين الجزائرية مع إمكانيات بحث متقدمة
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Online/Offline Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
              {isOnline ? 'متصل' : 'غير متصل'}
            </div>
            
            {/* Sync Status */}
            <button
              onClick={handleSync}
              disabled={isSyncing || !isOnline}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                syncStatus === 'success' ? 'bg-green-100 text-green-800' :
                syncStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'جاري المزامنة...' : 
               syncStatus === 'success' ? 'تم التحديث' :
               syncStatus === 'error' ? 'فشل التحديث' : 'تحديث'}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className={`relative p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-100 text-blue-600'} hover:bg-blue-200`}>
                <Bell size={20} />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
            </div>

            {/* Settings */}
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'} hover:bg-slate-200`}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Last sync info */}
        {lastSyncTime && (
          <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            آخر تحديث: {formatDateTime(lastSyncTime)}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {quickActions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={`p-4 rounded-lg border-2 transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Icon size={20} className="mb-2" />
                  <div className="text-sm font-medium">{action.label}</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{action.count}</div>
              </div>
            </button>
          );
        })}
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

      {/* Enhanced Search and Filters */} 
      <div className={`rounded-lg shadow-md p-6 mb-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                id="search-input"
                type="text"
                placeholder="البحث في النصوص القانونية، المواد، أو الوسوم... (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full pr-10 pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
              />
              <button
                onClick={handleVoiceSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                🎤
              </button>
            </div>
            
            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(suggestion)}
                    className={`block w-full text-right px-4 py-2 hover:bg-slate-100 ${theme === 'dark' ? 'hover:bg-slate-600 text-white' : ''}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className={`px-4 py-3 rounded-lg border transition-colors ${showAdvancedSearch 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : `${theme === 'dark' ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`
              }`}
            >
              <Filter size={20} />
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
            >
              <option value="date">ترتيب بالتاريخ</option>
              <option value="title">ترتيب بالعنوان</option>
              <option value="category">ترتيب بالفئة</option>
              <option value="relevance">ترتيب بالصلة</option>
            </select>
            
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className={`px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
            >
              {viewMode === 'list' ? '⊞' : '☰'}
            </button>
            
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className={`px-4 py-3 rounded-lg border ${bulkMode ? 'bg-orange-600 text-white' : `${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}`}
            >
              تحديد متعدد
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickFilters.map(filter => (
            <button
              key={filter.id}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

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

<<<<<<< HEAD
      <ImportLegalTexts onImport={handleImport} />

=======
>>>>>>> c6a0b11296b8accf34e0030393a3e93797657dcc
      {/* Bulk Actions Bar */}
      {bulkMode && selectedTexts.length > 0 && (
        <div className={`rounded-lg p-4 mb-6 ${theme === 'dark' ? 'bg-orange-900' : 'bg-orange-100'}`}>
          <div className="flex justify-between items-center">
            <span className={`${theme === 'dark' ? 'text-orange-200' : 'text-orange-800'}`}>
              تم تحديد {selectedTexts.length} نص
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('favorite')}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                إضافة للمفضلة
              </button>
              <button
                onClick={() => handleBulkAction('bookmark')}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إضافة للمحفوظات
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                تصدير
              </button>
              <button
                onClick={() => setSelectedTexts([])}
                className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Panel */}
      {showStats && (
        <div className={`rounded-lg shadow-md p-6 mb-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <BarChart3 size={20} className="inline mr-2" />
            إحصائيات المكتبة القانونية
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTexts}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>إجمالي النصوص</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.favoriteCount}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>المفضلة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.bookmarkCount}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>المحفوظة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.recentlyAdded}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>المضافة حديثاً</div>
            </div>
          </div>
        </div>
      )}

      {/* Search History */}
      <SearchHistory onSearchSelect={setSearchTerm} />

      {/* Results */} 
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            النتائج ({filteredTexts.length})
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowStats(!showStats)}
              className={`px-3 py-1 rounded-lg text-sm ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'}`}
            >
              <TrendingUp size={14} className="inline mr-1" />
              إحصائيات
            </button>
            <button className={`px-3 py-1 rounded-lg text-sm ${theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}`}>
              <Star size={14} className="inline mr-1" />
              المفضلة ({favorites.length})
            </button>
            <button className={`px-3 py-1 rounded-lg text-sm ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
              <Bookmark size={14} className="inline mr-1" />
              المحفوظة ({bookmarks.length})
            </button>
          </div>
        </div>

        {filteredTexts.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid gap-4'}>
            {filteredTexts.map(text => (
              <div key={text.id} className={`rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {bulkMode && (
                        <input
                          type="checkbox"
                          checked={selectedTexts.includes(text.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTexts(prev => [...prev, text.id]);
                            } else {
                              setSelectedTexts(prev => prev.filter(id => id !== text.id));
                            }
                          }}
                          className="mr-2"
                        />
                      )}
                      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {text.title}
                      </h3>
                      <span className="text-2xl">{legalCategories[text.category].icon}</span>
                    </div>
                    {text.articleNumber && (
                      <p className="text-blue-600 font-medium mb-2">{text.articleNumber}</p>
                    )}
                    <p className={`mb-3 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {text.content}
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
                      onClick={() => toggleBookmark(text.id)}
                      className={`p-2 rounded-lg ${bookmarks.includes(text.id) ? (theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600') : (theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600')} hover:bg-blue-200`}
                    >
                      <Bookmark size={16} fill={bookmarks.includes(text.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => handleViewText(text)}
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

                {readingHistory.includes(text.id) && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                    <CheckCircle size={12} />
                    تم قراءته
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

      {/* Modals */}
      {showAdvancedSearch && (
        <AdvancedSearch
          filters={searchFilters}
          onFiltersChange={handleAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
        />
      )}

      {showComparison && comparisonTexts.length > 0 && (
        <LegalTextComparison
          originalText={comparisonTexts[0]}
          amendments={[]}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        ↑
      </button>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-6 right-6 text-xs text-slate-500">
        <div>Ctrl+F: البحث | Ctrl+R: تحديث | Ctrl+S: إحصائيات</div>
      </div>
    </div>
  );
};

export default LegalTexts;