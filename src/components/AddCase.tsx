import React, { useState, useEffect } from 'react';
import { Case } from '../types';
import { algeriaData } from '../data/algeriaData';
import { judicialBodies } from '../data/judicialBodies';
import { X } from 'lucide-react';
import { parseDateFromInput } from '../utils/dateUtils';

interface AddCaseProps {
  clientId: string | null;
  onClose: () => void;
  onSaveCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddCase: React.FC<AddCaseProps> = ({ clientId, onClose, onSaveCase }) => {
  const [formData, setFormData] = useState<Omit<Case, 'id' | 'clientId' | 'createdAt' | 'updatedAt'> & { sessionDate: string }>({
    level: 'المحكمة (Tribunal)',
    wilaya: '',
    court: '',
    section: '',
    caseNumber: '',
    sessionNumber: '',
    subject: '',
    details: '',
    sessionDate: '',
  });

  const [isWilayaCourtDisabled, setIsWilayaCourtDisabled] = useState(false);

  useEffect(() => {
    if (formData.level === 'مجلس الدولة (Conseil d’État)' || formData.level === 'المحكمة العليا (Cour Suprême)') {
      setFormData(prev => ({
        ...prev,
        wilaya: 'الجزائر',
        court: formData.level,
      }));
      setIsWilayaCourtDisabled(true);
    } else {
      setIsWilayaCourtDisabled(false);
    }
  }, [formData.level]);

  if (!clientId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = {
      ...formData,
      clientId,
      sessionDate: parseDateFromInput(formData.sessionDate),
    };
    onSaveCase(newCase);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sections = judicialBodies[formData.level] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">إضافة قضية جديدة</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">الجهة القضائية</label>
              <select name="level" value={formData.level} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                {Object.keys(judicialBodies).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">الولاية</label>
              <select name="wilaya" value={formData.wilaya} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" disabled={isWilayaCourtDisabled}>
                <option value="">اختر الولاية</option>
                {algeriaData.map(w => <option key={w.code} value={w.ar_name}>{w.ar_name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">المحكمة المختصة</label>
              <input type="text" name="court" value={formData.court} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="مثال: محكمة الجلفة" disabled={isWilayaCourtDisabled} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">القسم/الغرفة</label>
              <select name="section" value={formData.section} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg">
                <option value="">اختر القسم/الغرفة</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">رقم القضية</label>
              <input type="text" name="caseNumber" value={formData.caseNumber} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">رقم الجلسة</label>
              <input type="text" name="sessionNumber" value={formData.sessionNumber} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ الجلسة (اختياري)</label>
              <input type="text" name="sessionDate" value={formData.sessionDate} onChange={handleChange} placeholder="jj/mm/aaaa" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">موضوع القضية</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">تفاصيل إضافية</label>
              <textarea name="details" value={formData.details} onChange={handleChange} rows={4} className="w-full p-3 border border-slate-300 rounded-lg"></textarea>
            </div>

          </div>
          <div className="flex gap-4 pt-6 border-t mt-6">
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              حفظ القضية
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCase;
