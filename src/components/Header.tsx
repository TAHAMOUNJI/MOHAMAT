import React from 'react';
import { formatDateToArabic } from '../utils/dateUtils';

const Header: React.FC = () => {
  const currentDate = formatDateToArabic(new Date());

  return (
    <div className="bg-white shadow-sm border-b border-slate-200 p-4">
      <div className="max-w-full mx-auto flex justify-between items-center">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            مكتب الأستاذ: عباس عبد القادر
          </h1>
          <p className="text-slate-600 text-sm mb-2">
            محامٍ معتمد لدى المحكمة العليا ومجلس الدولة
          </p>
          <div className="text-slate-500 text-sm space-y-1">
            <p>العنوان: حي بنات بلكحل، بناية 16/41، رقم 01، الجلفة</p>
            <p>الهاتف: 0778085093</p>
          </div>
        </div>
        
        <div className="text-left">
          <div className="bg-slate-100 px-4 py-2 rounded-lg">
            <p className="text-slate-600 text-sm font-medium">التاريخ</p>
            <p className="text-slate-800 font-bold">{currentDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;