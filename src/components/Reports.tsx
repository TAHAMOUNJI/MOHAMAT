import React from 'react';
import { Case, Client } from '../types';
import { BarChart, PieChart, Users } from 'lucide-react';

interface ReportsProps {
  cases: Case[];
  clients: Client[];
}

const Reports: React.FC<ReportsProps> = ({ cases, clients }) => {

  const casesByLevel = cases.reduce((acc, caseItem) => {
    const level = caseItem.level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const casesByWilaya = cases.reduce((acc, caseItem) => {
    const wilaya = caseItem.wilaya;
    acc[wilaya] = (acc[wilaya] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topClients = clients
    .map(client => ({
      ...client,
      caseCount: cases.filter(c => c.clientId === client.id).length
    }))
    .filter(client => client.caseCount > 0)
    .sort((a, b) => b.caseCount - a.caseCount)
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">التقارير والإحصائيات</h2>
        <p className="text-slate-600">تحليلات مفصلة لنشاط المكتب</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Level */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <PieChart className="mr-2" size={20} />
            توزيع القضايا حسب الجهة القضائية
          </h3>
          <div className="space-y-2">
            {Object.entries(casesByLevel).map(([level, count]) => (
              <div key={level} className="flex justify-between items-center">
                <span className="text-slate-700">{level}</span>
                <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Users className="mr-2" size={20} />
            أكثر 5 موكلين لديهم قضايا
          </h3>
          <div className="space-y-3">
            {topClients.map(client => (
              <div key={client.id} className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">{client.firstName} {client.lastName}</span>
                <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">{client.caseCount} قضية</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cases by Wilaya */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <BarChart className="mr-2" size={20} />
            توزيع القضايا حسب الولايات
          </h3>
          <div className="space-y-2">
            {Object.entries(casesByWilaya).sort(([, a], [, b]) => b - a).map(([wilaya, count]) => (
              <div key={wilaya} className="flex items-center">
                <span className="w-24 text-slate-700">{wilaya}</span>
                <div className="flex-1 bg-slate-200 rounded-full h-4">
                  <div 
                    className="bg-purple-600 h-4 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ width: `${(count / Math.max(...Object.values(casesByWilaya))) * 100}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
