import React from 'react';
import { Users, Scale, Calendar, FileText } from 'lucide-react';
import { formatDateShort } from '../utils/dateUtils';

interface DashboardProps {
  clients: any[];
  cases: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients, cases }) => {
  const upcomingSessions = cases.filter(c => c.sessionDate && new Date(c.sessionDate) > new Date());
  
  const stats = [
    {
      title: 'إجمالي الموكلين',
      value: clients.length,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'إجمالي القضايا',
      value: cases.length,
      icon: Scale,
      color: 'bg-green-500'
    },
    {
      title: 'الجلسات القادمة',
      value: upcomingSessions.length,
      icon: Calendar,
      color: 'bg-orange-500'
    },
    {
      title: 'القضايا النشطة',
      value: cases.filter(c => !c.sessionDate || new Date(c.sessionDate) > new Date()).length,
      icon: FileText,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">لوحة التحكم</h2>
        <p className="text-slate-600">نظرة عامة على نشاط المكتب</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* الجلسات القادمة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">الجلسات القادمة</h3>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 5).map((caseItem) => {
                const client = clients.find(c => c.id === caseItem.clientId);
                return (
                  <div key={caseItem.id} className="border-r-4 border-orange-500 pr-4 py-2">
                    <p className="font-medium text-slate-800">
                      {client?.firstName} {client?.lastName}
                    </p>
                    <p className="text-sm text-slate-600">{caseItem.subject}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateShort(caseItem.sessionDate!)} - {caseItem.wilaya}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">لا توجد جلسات قادمة</p>
          )}
        </div>

        {/* آخر الموكلين المضافين */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">آخر الموكلين المضافين</h3>
          {clients.length > 0 ? (
            <div className="space-y-3">
              {clients.slice(0, 5).map((client) => (
                <div key={client.id} className="border-r-4 border-blue-500 pr-4 py-2">
                  <p className="font-medium text-slate-800">
                    {client.firstName} {client.lastName}
                  </p>
                  <p className="text-sm text-slate-600">{client.phoneNumber}</p>
                  <p className="text-xs text-slate-500">
                    {formatDateShort(client.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">لا يوجد موكلون بعد</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;