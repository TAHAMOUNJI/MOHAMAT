import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Trash2, Download, Upload } from 'lucide-react';
import { Client, Case } from '../types';

interface SettingsProps {
  clients: Client[];
  cases: Case[];
  setClients: (clients: Client[]) => void;
  setCases: (cases: Case[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ clients, cases, setClients, setCases }) => {
  const { theme, toggleTheme } = useTheme();

  const handleClearData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setClients([]);
      setCases([]);
      alert('تم حذف جميع البيانات بنجاح.');
    }
  };

  const handleBackupData = () => {
    const backupData = {
      clients,
      cases,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target?.result as string);
          if (backupData.clients && backupData.cases) {
            if (window.confirm('هل أنت متأكد من استعادة البيانات؟ سيتم الكتابة فوق جميع البيانات الحالية.')) {
              setClients(backupData.clients);
              setCases(backupData.cases);
              alert('تم استعادة البيانات بنجاح.');
            }
          } else {
            alert('ملف النسخ الاحتياطي غير صالح.');
          }
        } catch {
          alert('حدث خطأ أثناء قراءة ملف النسخ الاحتياطي.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">الإعدادات</h2>
        <p className="text-slate-600 dark:text-slate-300">إدارة مظهر وبيانات التطبيق</p>
      </div>

      <div className="space-y-8">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">إعدادات المظهر</h3>
          <div className="flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-200">الوضع الداكن</span>
            <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-200 dark:bg-slate-700">
              {theme === 'light' ? <Moon className="text-slate-800" /> : <Sun className="text-yellow-400" />}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">إدارة البيانات</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">نسخ احتياطي للبيانات</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">حفظ نسخة من جميع الموكلين والقضايا في ملف JSON.</p>
              </div>
              <button onClick={handleBackupData} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={16} />
                <span>نسخ احتياطي</span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">استعادة البيانات</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">استيراد بيانات من ملف نسخ احتياطي JSON.</p>
              </div>
              <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                <Upload size={16} />
                <span>استعادة</span>
                <input type="file" accept=".json" className="hidden" onChange={handleRestoreData} />
              </label>
            </div>
            <div className="flex items-center justify-between border-t pt-4 border-red-500/20">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">حذف جميع البيانات</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">حذف جميع الموكلين والقضايا بشكل دائم.</p>
              </div>
              <button onClick={handleClearData} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                <Trash2 size={16} />
                <span>حذف البيانات</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
