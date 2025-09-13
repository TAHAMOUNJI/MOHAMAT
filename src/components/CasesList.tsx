import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Case, Client } from '../types';
import { formatDateShort } from '../utils/dateUtils';

interface CasesListProps {
  cases: Case[];
  clients: Client[];
  onViewClient: (client: Client) => void;
}

const CasesList: React.FC<CasesListProps> = ({ cases, clients, onViewClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'غير محدد';
  };

  const filteredCases = cases.filter(caseItem => {
    const clientName = getClientName(caseItem.clientId).toLowerCase();
    const subject = caseItem.subject.toLowerCase();
    const caseNumber = caseItem.caseNumber;
    const search = searchTerm.toLowerCase();

    const matchesSearch = clientName.includes(search) || subject.includes(search) || caseNumber.includes(search);
    const matchesLevel = filterLevel === 'all' || caseItem.level === filterLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">قائمة جميع القضايا</h2>
        <p className="text-slate-600 dark:text-slate-300">عرض وبحث في جميع القضايا المسجلة</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="البحث باسم الموكل، موضوع القضية، أو رقمها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="md:w-60">
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full pr-10 p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">كل الجهات القضائية</option>
                <option value="المحكمة (Tribunal)">المحكمة (Tribunal)</option>
                <option value="مجلس القضاء (Cour d’appel)">مجلس القضاء (Cour d’appel)</option>
                <option value="المحكمة العليا (Cour Suprême)">المحكمة العليا (Cour Suprême)</option>
                <option value="مجلس الدولة (Conseil d’État)">مجلس الدولة (Conseil d’État)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-right p-4 text-slate-700 dark:text-slate-200 font-semibold">موضوع القضية</th>
                <th className="text-right p-4 text-slate-700 dark:text-slate-200 font-semibold">اسم الموكل</th>
                <th className="text-right p-4 text-slate-700 dark:text-slate-200 font-semibold">الجهة القضائية</th>
                <th className="text-right p-4 text-slate-700 dark:text-slate-200 font-semibold">رقم القضية</th>
                <th className="text-right p-4 text-slate-700 dark:text-slate-200 font-semibold">تاريخ الجلسة</th>
                <th className="text-center p-4 text-slate-700 dark:text-slate-200 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="dark:text-slate-300">
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-slate-100">{caseItem.subject}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{caseItem.court}</p>
                    </td>
                    <td className="p-4">{getClientName(caseItem.clientId)}</td>
                    <td className="p-4">{caseItem.level}</td>
                    <td className="p-4 font-mono">{caseItem.caseNumber}</td>
                    <td className="p-4">{caseItem.sessionDate ? formatDateShort(caseItem.sessionDate) : '-'}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            const client = clients.find(c => c.id === caseItem.clientId);
                            if (client) onViewClient(client);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          عرض ملف الموكل
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    {searchTerm || filterLevel !== 'all' ? 'لم يتم العثور على أي قضية تطابق البحث' : 'لا توجد قضايا بعد'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CasesList;
