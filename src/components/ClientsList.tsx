import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Printer, FileDown, Check } from 'lucide-react';
import { Client, Case } from '../types';
import { formatDateShort } from '../utils/dateUtils';

interface ClientsListProps {
  clients: Client[];
  cases: Case[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onViewClient: (client: Client) => void;
  onPrintClient: (client: Client) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({
  clients,
  cases,
  onEditClient,
  onDeleteClient,
  onViewClient,
  onPrintClient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.documentNumber.includes(searchTerm) ||
      client.phoneNumber.includes(searchTerm) ||
      (client.opposition && 
        (client.opposition.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         client.opposition.lastName.toLowerCase().includes(searchTerm.toLowerCase())));

    if (filterType === 'all') return matchesSearch;
    
    return matchesSearch && client.documentType === filterType;
  });

  const getClientCasesCount = (clientId: string) => {
    return cases.filter(c => c.clientId === clientId).length;
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'id_card': return 'بطاقة التعريف';
      case 'driving_license': return 'رخصة السياقة';
      case 'passport': return 'جواز السفر';
      default: return type;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">قائمة الموكلين</h2>
        <p className="text-slate-600">إدارة وعرض بيانات جميع الموكلين</p>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="البحث بالاسم، رقم الوثيقة، أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الوثائق</option>
              <option value="id_card">بطاقة التعريف</option>
              <option value="driving_license">رخصة السياقة</option>
              <option value="passport">جواز السفر</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول الموكلين */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-right p-4 text-slate-700 font-semibold">الاسم الكامل</th>
                <th className="text-right p-4 text-slate-700 font-semibold">نوع الوثيقة</th>
                <th className="text-right p-4 text-slate-700 font-semibold">رقم الوثيقة</th>
                <th className="text-right p-4 text-slate-700 font-semibold">رقم الهاتف</th>
                <th className="text-right p-4 text-slate-700 font-semibold">الخصم</th>
                <th className="text-right p-4 text-slate-700 font-semibold">عدد القضايا</th>
                <th className="text-right p-4 text-slate-700 font-semibold">تاريخ الإنشاء</th>
                <th className="text-center p-4 text-slate-700 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-slate-800">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-sm text-slate-600">
                          ولد {client.fatherName}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {getDocumentTypeLabel(client.documentType)}
                    </td>
                    <td className="p-4 text-slate-600 font-mono">
                      {client.documentNumber}
                    </td>
                    <td className="p-4 text-slate-600 font-mono">
                      {client.phoneNumber}
                    </td>
                    <td className="p-4 text-slate-600">
                      {client.opposition && <Check size={20} className="text-green-500" />}
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {getClientCasesCount(client.id)}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      {formatDateShort(client.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onViewClient(client)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onEditClient(client)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onPrintClient(client)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="طباعة"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteClient(client.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    {searchTerm ? 'لم يتم العثور على أي موكل يطابق البحث' : 'لا يوجد موكلون بعد'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
            <p className="text-slate-600">إجمالي الموكلين</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{filteredClients.length}</p>
            <p className="text-slate-600">النتائج المعروضة</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{cases.length}</p>
            <p className="text-slate-600">إجمالي القضايا</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {clients.filter(c => getClientCasesCount(c.id) > 0).length}
            </p>
            <p className="text-slate-600">موكلون لديهم قضايا</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsList;