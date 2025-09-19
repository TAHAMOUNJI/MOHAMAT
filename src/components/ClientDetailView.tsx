import React from 'react';
import { Client, Case } from '../types';
import { User, FileText, Calendar, Landmark, Gavel, PlusCircle, Printer } from 'lucide-react';
import { formatDateLong } from '../utils/dateUtils';

interface ClientDetailViewProps {
  client: Client;
  cases: Case[];
  onAddCase: (clientId: string) => void;
  onEditCase: (caseData: Case) => void;
  onDeleteCase: (caseId: string) => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, cases, onAddCase, onEditCase, onDeleteCase }) => {

  const getCaseLevelLabel = (level: string) => {
    switch (level) {
      case 'المحكمة (Tribunal)': return 'محكمة';
      case 'مجلس القضاء (Cour d’appel)': return 'مجلس';
      case 'المحكمة العليا (Cour Suprême)': return 'المحكمة العليا';
      case 'مجلس الدولة (Conseil d’État)': return 'مجلس الدولة';
      default: return level;
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 printable-area">
      {/* Client Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4 no-print">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{client.firstName} {client.lastName}</h2>
              <p className="text-slate-600">ملف الموكل</p>
            </div>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors no-print"
          >
            <Printer size={20} />
            طباعة
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center">
            <FileText size={20} className="text-slate-500 mr-3" />
            <div>
              <p className="text-sm text-slate-500">الاسم الكامل</p>
              <p className="font-medium text-slate-800">{client.firstName} {client.lastName} بن {client.fatherName}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar size={20} className="text-slate-500 mr-3" />
            <div>
              <p className="text-sm text-slate-500">تاريخ ومكان الميلاد</p>
              <p className="font-medium text-slate-800">{formatDateLong(client.birthDate)} بـ {client.birthPlace}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FileText size={20} className="text-slate-500 mr-3" />
            <div>
              <p className="text-sm text-slate-500">وثيقة الهوية</p>
              <p className="font-medium text-slate-800">{client.documentType === 'id_card' ? 'بطاقة تعريف' : 'رخصة سياقة'} رقم {client.documentNumber}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Landmark size={20} className="text-slate-500 mr-3" />
            <div>
              <p className="text-sm text-slate-500">صادرة عن</p>
              <p className="font-medium text-slate-800">{client.municipality}, {client.wilaya} بتاريخ {formatDateLong(client.documentIssueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Opposition Info Card */}
      {client.opposition && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-3 rounded-full mr-4 no-print">
              <User size={32} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{client.opposition.firstName} {client.opposition.lastName}</h2>
              <p className="text-slate-600">بيانات الخصم</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center">
              <FileText size={20} className="text-slate-500 mr-3" />
              <div>
                <p className="text-sm text-slate-500">الاسم الكامل</p>
                <p className="font-medium text-slate-800">{client.opposition.firstName} {client.opposition.lastName} بن {client.opposition.fatherName}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar size={20} className="text-slate-500 mr-3" />
              <div>
                <p className="text-sm text-slate-500">تاريخ ومكان الميلاد</p>
                <p className="font-medium text-slate-800">{formatDateLong(client.opposition.birthDate)} بـ {client.opposition.birthPlace}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText size={20} className="text-slate-500 mr-3" />
              <div>
                <p className="text-sm text-slate-500">وثيقة الهوية</p>
                <p className="font-medium text-slate-800">{client.opposition.documentType === 'id_card' ? 'بطاقة تعريف' : 'رخصة سياقة'} رقم {client.opposition.documentNumber}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Landmark size={20} className="text-slate-500 mr-3" />
              <div>
                <p className="text-sm text-slate-500">صادرة عن</p>
                <p className="font-medium text-slate-800">{client.opposition.municipality}, {client.opposition.wilaya} بتاريخ {formatDateLong(client.opposition.documentIssueDate)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cases List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6 no-print">
          <h3 className="text-2xl font-bold text-slate-800">قائمة القضايا</h3>
          <button 
            onClick={() => onAddCase(client.id)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={20} />
            إضافة قضية جديدة
          </button>
        </div>
        
        {cases.length > 0 ? (
          <div className="space-y-4">
            {cases.map(caseItem => (
              <div key={caseItem.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-slate-800">{caseItem.subject}</p>
                    <div className="flex items-center text-sm text-slate-600 mt-2 gap-4">
                      <span className="flex items-center gap-1"><Gavel size={14} /> {getCaseLevelLabel(caseItem.level)} - {caseItem.section}</span>
                      <span className="flex items-center gap-1"><Landmark size={14} /> {caseItem.court}, {caseItem.wilaya}</span>
                      <span className="font-mono">رقم: {caseItem.caseNumber}</span>
                      {caseItem.sessionDate && <span className="flex items-center gap-1"><Calendar size={14} /> جلسة يوم: {formatDateLong(caseItem.sessionDate)}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 no-print">
                     <button onClick={() => onEditCase(caseItem)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">تعديل</button>
                     <button onClick={() => onDeleteCase(caseItem.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-slate-400" />
            <p className="mt-4 text-slate-600">لا توجد قضايا لهذا الموكل حتى الآن.</p>
            <p className="text-sm text-slate-500">يمكنك إضافة قضية جديدة بالضغط على الزر أعلاه.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetailView;
