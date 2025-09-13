import React from 'react';
import { Plus, Search, FileText, Users, Scale, BookOpen, Download, Settings } from 'lucide-react';

interface QuickActionsProps {
  onPageChange: (page: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onPageChange }) => {
  const quickActions = [
    {
      id: 'add-client',
      label: 'إضافة موكل جديد',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'إضافة موكل جديد إلى النظام'
    },
    {
      id: 'clients',
      label: 'البحث في الموكلين',
      icon: Search,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'البحث وعرض قائمة الموكلين'
    },
    {
      id: 'cases',
      label: 'إدارة القضايا',
      icon: Scale,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'عرض وإدارة جميع القضايا'
    },
    {
      id: 'legal-texts',
      label: 'البحث في القوانين',
      icon: BookOpen,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      description: 'البحث في النصوص القانونية'
    },
    {
      id: 'reports',
      label: 'التقارير',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'عرض التقارير والإحصائيات'
    },
    {
      id: 'export',
      label: 'تصدير البيانات',
      icon: Download,
      color: 'bg-teal-500 hover:bg-teal-600',
      description: 'تصدير البيانات بصيغ مختلفة'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">الإجراءات السريعة</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onPageChange(action.id)}
              className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
            >
              <div className="flex flex-col items-center text-center">
                <Icon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">{action.label}</span>
                <span className="text-xs opacity-90 mt-1 hidden md:block">{action.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;