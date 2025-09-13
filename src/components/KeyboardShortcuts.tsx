import React, { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsProps {
  onPageChange: (page: string) => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onPageChange }) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + D', action: 'لوحة التحكم', page: 'dashboard' },
    { key: 'Ctrl + N', action: 'إضافة موكل جديد', page: 'add-client' },
    { key: 'Ctrl + L', action: 'قائمة الموكلين', page: 'clients' },
    { key: 'Ctrl + C', action: 'القضايا', page: 'cases' },
    { key: 'Ctrl + B', action: 'القوانين', page: 'legal-texts' },
    { key: 'Ctrl + R', action: 'التقارير', page: 'reports' },
    { key: 'Ctrl + E', action: 'التصدير', page: 'export' },
    { key: 'Ctrl + S', action: 'الإعدادات', page: 'settings' },
    { key: 'Ctrl + K', action: 'عرض الاختصارات', page: null }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'd':
            event.preventDefault();
            onPageChange('dashboard');
            break;
          case 'n':
            event.preventDefault();
            onPageChange('add-client');
            break;
          case 'l':
            event.preventDefault();
            onPageChange('clients');
            break;
          case 'c':
            event.preventDefault();
            onPageChange('cases');
            break;
          case 'b':
            event.preventDefault();
            onPageChange('legal-texts');
            break;
          case 'r':
            event.preventDefault();
            onPageChange('reports');
            break;
          case 'e':
            event.preventDefault();
            onPageChange('export');
            break;
          case 's':
            event.preventDefault();
            onPageChange('settings');
            break;
          case 'k':
            event.preventDefault();
            setShowShortcuts(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPageChange]);

  return (
    <>
      <button
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-4 left-4 p-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors z-40"
        title="اختصارات لوحة المفاتيح (Ctrl + K)"
      >
        <Keyboard size={20} />
      </button>

      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">اختصارات لوحة المفاتيح</h3>
              <button onClick={() => setShowShortcuts(false)} className="p-2 rounded-full hover:bg-slate-100">
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-700">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts;