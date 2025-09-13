import React from 'react';
import { 
  Home, 
  UserPlus, 
  Users, 
  Settings, 
  Download,
  FileText,
  Scale,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'add-client', label: 'إضافة موكل', icon: UserPlus },
    { id: 'clients', label: 'قائمة الموكلين', icon: Users },
    { id: 'cases', label: 'القضايا', icon: Scale },
    { id: 'legal-texts', label: 'القوانين', icon: BookOpen },
    { id: 'reports', label: 'التقارير', icon: FileText },
    { id: 'export', label: 'التصدير', icon: Download },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-center mb-2">إدارة الموكلين</h2>
        <div className="text-center text-sm text-slate-300">
          مكتب الأستاذ عباس عبد القادر
        </div>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full text-right p-3 rounded-lg transition-colors flex items-center gap-3 ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Icon size={20} className="ml-auto" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="text-center text-xs text-slate-400 mt-8">
          <p>عباس طه منجي 2025</p>
        </div>
    </div>
  );
};

export default Sidebar;