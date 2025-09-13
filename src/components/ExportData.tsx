import React from 'react';
import { Download, FileSpreadsheet, Database } from 'lucide-react';
import { Client, Case } from '../types';
import { formatDateShort, formatDateTime } from '../utils/dateUtils';

interface ExportDataProps {
  clients: Client[];
  cases: Case[];
}

const ExportData: React.FC<ExportDataProps> = ({ clients, cases }) => {

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportClients = () => {
    const clientsData = clients.map(client => ({
      'معرف الموكل': client.id,
      'الاسم الأول': client.firstName,
      'اللقب': client.lastName,
      'اسم الأب': client.fatherName,
      'اسم الأم': client.motherFirstName,
      'لقب الأم': client.motherLastName,
      'تاريخ الميلاد': formatDateShort(client.birthDate),
      'مكان الميلاد': client.birthPlace,
      'نوع الوثيقة': client.documentType,
      'رقم الوثيقة': client.documentNumber,
      'تاريخ إصدار الوثيقة': formatDateShort(client.documentIssueDate),
      'ولاية الإصدار': client.wilaya,
      'بلدية الإصدار': client.municipality,
      'رقم الهاتف': client.phoneNumber,
      'تاريخ الإنشاء': formatDateTime(client.createdAt),
      'معرف الخصم': client.opposition?.id || '',
      'الاسم الأول للخصم': client.opposition?.firstName || '',
      'لقب الخصم': client.opposition?.lastName || '',
      'اسم أب الخصم': client.opposition?.fatherName || '',
      'اسم أم الخصم': client.opposition?.motherFirstName || '',
      'لقب أم الخصم': client.opposition?.motherLastName || '',
      'تاريخ ميلاد الخصم': client.opposition ? formatDateShort(client.opposition.birthDate) : '',
      'مكان ميلاد الخصم': client.opposition?.birthPlace || '',
      'نوع وثيقة الخصم': client.opposition?.documentType || '',
      'رقم وثيقة الخصم': client.opposition?.documentNumber || '',
      'تاريخ إصدار وثيقة الخصم': client.opposition ? formatDateShort(client.opposition.documentIssueDate) : '',
      'ولاية إصدار وثيقة الخصم': client.opposition?.wilaya || '',
      'بلدية إصدار وثيقة الخصم': client.opposition?.municipality || '',
      'رقم هاتف الخصم': client.opposition?.phoneNumber || '',
    }));

    if (clientsData.length === 0) {
        alert('لا يوجد موكلين لتصديرهم.');
        return;
    }

    const csvContent = '\uFEFF' + 
      Object.keys(clientsData[0]).join(',') + '\n' + 
      clientsData.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
    
    downloadFile(csvContent, 'clients.csv', 'text/csv;charset=utf-8;');
  };

  const handleExportCases = () => {
    const casesData = cases.map(caseItem => {
      const client = clients.find(c => c.id === caseItem.clientId);
      return {
        'معرف القضية': caseItem.id,
        'اسم الموكل': client ? `${client.firstName} ${client.lastName}` : 'غير محدد',
        'الجهة القضائية': caseItem.level,
        'المحكمة': caseItem.court,
        'القسم/الغرفة': caseItem.section,
        'رقم القضية': caseItem.caseNumber,
        'رقم الجلسة': caseItem.sessionNumber,
        'موضوع القضية': caseItem.subject,
        'تاريخ الجلسة': caseItem.sessionDate ? formatDateShort(caseItem.sessionDate) : 'غير محدد',
        'تاريخ الإنشاء': formatDateTime(caseItem.createdAt),
      };
    });

    if (casesData.length === 0) {
        alert('لا توجد قضايا لتصديرها.');
        return;
    }

    const csvContent = '\uFEFF' + 
      Object.keys(casesData[0]).join(',') + '\n' + 
      casesData.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');

    downloadFile(csvContent, 'cases.csv', 'text/csv;charset=utf-8;');
  };

  const handleExportSql = () => {
    let sql = `-- SQL Backup - ${new Date().toLocaleString('ar-DZ-u-nu-latn')}\n\n`;
    
    sql += `CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, firstName TEXT, lastName TEXT, fatherName TEXT, motherFirstName TEXT, motherLastName TEXT, birthDate TEXT, birthPlace TEXT, documentType TEXT, documentNumber TEXT, documentIssueDate TEXT, wilaya TEXT, municipality TEXT, phoneNumber TEXT, createdAt TEXT, updatedAt TEXT, opposition TEXT);
`;
    clients.forEach(client => {
      const oppositionData = client.opposition ? JSON.stringify(client.opposition) : 'NULL';
      sql += `INSERT INTO clients VALUES('${client.id}','${client.firstName}','${client.lastName}','${client.fatherName}','${client.motherFirstName}','${client.motherLastName}','${client.birthDate}','${client.birthPlace}','${client.documentType}','${client.documentNumber}','${client.documentIssueDate}','${client.wilaya}','${client.municipality}','${client.phoneNumber}','${client.createdAt}','${client.updatedAt}','${oppositionData}');
`;
    });

    sql += `
CREATE TABLE IF NOT EXISTS cases (id TEXT PRIMARY KEY, clientId TEXT, caseNumber TEXT, sessionNumber TEXT, level TEXT, wilaya TEXT, court TEXT, section TEXT, subject TEXT, details TEXT, sessionDate TEXT, createdAt TEXT, updatedAt TEXT);
`;
    cases.forEach(caseItem => {
        sql += `INSERT INTO cases VALUES('${Object.values(caseItem).join('","')}');
`;
    });

    downloadFile(sql, 'database_backup.sql', 'text/sql;charset=utf-8;');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">تصدير البيانات</h2>
        <p className="text-slate-600 dark:text-slate-300">تصدير بيانات الموكلين والقضايا بصيغ مختلفة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Excel Export */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <FileSpreadsheet className="mr-2 text-green-600" size={20} />
            تصدير إلى Excel (CSV)
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">تصدير البيانات إلى ملفات CSV منفصلة يمكن فتحها بواسطة Excel.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleExportClients} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download size={16} />
              <span>تصدير الموكلين ({clients.length})</span>
            </button>
            <button onClick={handleExportCases} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download size={16} />
              <span>تصدير القضايا ({cases.length})</span>
            </button>
          </div>
        </div>

        {/* SQL Export */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
            <Database className="mr-2 text-blue-600" size={20} />
            تصدير قاعدة البيانات
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">تصدير جميع البيانات إلى ملف SQL واحد.</p>
          <button onClick={handleExportSql} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} />
            <span>تصدير ملف SQL</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportData;

