import React from 'react';
import { Client, Case } from '../types';
import { formatDateLong, formatDateShort } from '../utils/dateUtils';

interface PrintViewProps {
  client: Client | null;
  cases: Case[];
}

const PrintView: React.FC<PrintViewProps> = ({ client, cases }) => {
  if (!client) return null;

  const getCaseLevelLabel = (level: string) => {
    switch (level) {
      case 'المحكمة (Tribunal)': return 'محكمة';
      case 'مجلس القضاء (Cour d’appel)': return 'مجلس';
      case 'المحكمة العليا (Cour Suprême)': return 'المحكمة العليا';
      case 'مجلس الدولة (Conseil d’État)': return 'مجلس الدولة';
      default: return level;
    }
  }

  return (
    <div className="print-container">
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-size: 10pt;
            }
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              font-family: sans-serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px;
              text-align: right;
            }
            th {
              background-color: #eee;
            }
            h1, h2 {
              text-align: center;
              margin-bottom: 10px;
              font-size: 14pt;
            }
            h2 {
              font-size: 12pt;
            }
            .case-details-row td {
              padding: 6px;
              background-color: #f9f9f9;
            }
          }
        `}
      </style>
      <h1>معلومات الموكل</h1>
      <table>
        <tbody>
          <tr>
            <th>الاسم الكامل</th>
            <td>{client.firstName} {client.lastName} بن {client.fatherName}</td>
          </tr>
          <tr>
            <th>اسم الأم</th>
            <td>{client.motherFirstName} {client.motherLastName}</td>
          </tr>
          <tr>
            <th>تاريخ ومكان الميلاد</th>
            <td>{formatDateLong(client.birthDate)} بـ {client.birthPlace}</td>
          </tr>
          <tr>
            <th>وثيقة الهوية</th>
            <td>{client.documentType === 'id_card' ? 'بطاقة تعريف' : client.documentType === 'driving_license' ? 'رخصة سياقة' : 'جواز سفر'} رقم {client.documentNumber}</td>
          </tr>
          <tr>
            <th>صادرة عن</th>
            <td>{client.municipality}, {client.wilaya} بتاريخ {formatDateLong(client.documentIssueDate)}</td>
          </tr>
          <tr>
            <th>رقم الهاتف</th>
            <td>{client.phoneNumber}</td>
          </tr>
          <tr>
            <th>تاريخ الإنشاء</th>
            <td>{formatDateShort(client.createdAt)}</td>
          </tr>
          <tr>
            <th>آخر تحديث</th>
            <td>{formatDateShort(client.updatedAt)}</td>
          </tr>
        </tbody>
      </table>

      {client.opposition && (
        <div>
          <h2>بيانات الخصم</h2>
          <table>
            <tbody>
              <tr>
                <th>الاسم الكامل</th>
                <td>{client.opposition.firstName} {client.opposition.lastName} بن {client.opposition.fatherName}</td>
              </tr>
              <tr>
                <th>اسم الأم</th>
                <td>{client.opposition.motherFirstName} {client.opposition.motherLastName}</td>
              </tr>
              <tr>
                <th>تاريخ ومكان الميلاد</th>
                <td>{formatDateLong(client.opposition.birthDate)} بـ {client.opposition.birthPlace}</td>
              </tr>
              <tr>
                <th>وثيقة الهوية</th>
                <td>{client.opposition.documentType === 'id_card' ? 'بطاقة تعريف' : client.opposition.documentType === 'driving_license' ? 'رخصة سياقة' : 'جواز سفر'} رقم {client.opposition.documentNumber}</td>
              </tr>
              <tr>
                <th>صادرة عن</th>
                <td>{client.opposition.municipality}, {client.opposition.wilaya} بتاريخ {formatDateLong(client.opposition.documentIssueDate)}</td>
              </tr>
              <tr>
                <th>رقم الهاتف</th>
                <td>{client.opposition.phoneNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {cases.length > 0 && (
        <div>
          <h2>قائمة القضايا</h2>
          <table>
            <thead>
              <tr>
                <th>الموضوع</th>
                <th>الجهة القضائية</th>
                <th>القسم</th>
                <th>رقم القضية</th>
                <th>رقم الجلسة</th>
                <th>تاريخ الجلسة</th>
                <th>تاريخ الإنشاء</th>
                <th>آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(caseItem => (
                <React.Fragment key={caseItem.id}>
                  <tr>
                    <td>{caseItem.subject}</td>
                    <td>{getCaseLevelLabel(caseItem.level)} - {caseItem.court}, {caseItem.wilaya}</td>
                    <td>{caseItem.section}</td>
                    <td>{caseItem.caseNumber}</td>
                    <td>{caseItem.sessionNumber}</td>
                    <td>{caseItem.sessionDate ? formatDateLong(caseItem.sessionDate) : 'غير محدد'}</td>
                    <td>{formatDateShort(caseItem.createdAt)}</td>
                    <td>{formatDateShort(caseItem.updatedAt)}</td>
                  </tr>
                  <tr className="case-details-row">
                    <td colSpan={8}>
                      <strong>التفاصيل:</strong> {caseItem.details}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrintView;