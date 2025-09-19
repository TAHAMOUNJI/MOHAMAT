import React, { useState, useEffect } from 'react';
import { Client, Opposition } from '../types';
import { algeriaData } from '../data/algeriaData';
import { X } from 'lucide-react';
import { formatDateForInput, parseDateFromInput } from '../utils/dateUtils';

interface EditClientProps {
  client: Client | null;
  onClose: () => void;
  onUpdateClient: (client: Client) => void;
}

const EditClient: React.FC<EditClientProps> = ({ client, onClose, onUpdateClient }) => {
  const [formData, setFormData] = useState<Client | null>(null);
  const [withOpposition, setWithOpposition] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedOppositionWilaya, setSelectedOppositionWilaya] = useState('');

  useEffect(() => {
    if (client) {
      const clientWilaya = algeriaData.find(w => w.ar_name === client.wilaya);
      const oppositionWilaya = client.opposition ? algeriaData.find(w => w.ar_name === client.opposition.wilaya) : undefined;

      setFormData({
        ...client,
        birthDate: formatDateForInput(client.birthDate),
        documentIssueDate: formatDateForInput(client.documentIssueDate),
        wilaya: clientWilaya?.code || '',
        opposition: client.opposition ? {
          ...client.opposition,
          birthDate: formatDateForInput(client.opposition.birthDate),
          documentIssueDate: formatDateForInput(client.opposition.documentIssueDate),
          wilaya: oppositionWilaya?.code || '',
        } : undefined,
      });
      setWithOpposition(!!client.opposition);
      if (clientWilaya) {
        setSelectedWilaya(clientWilaya.code);
      }
      if (oppositionWilaya) {
        setSelectedOppositionWilaya(oppositionWilaya.code);
      }
    }
  }, [client]);

  if (!client || !formData) return null;

  const municipalities = algeriaData.find(w => w.code === selectedWilaya)?.communes || [];
  const oppositionMunicipalities = algeriaData.find(w => w.code === selectedOppositionWilaya)?.communes || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
        const wilayaName = algeriaData.find(w => w.code === formData.wilaya)?.ar_name || formData.wilaya;
        const municipalityName = municipalities.find(m => m.name === formData.municipality)?.ar_name || formData.municipality;
        const oppositionWilayaName = algeriaData.find(w => w.code === formData.opposition?.wilaya)?.ar_name || formData.opposition?.wilaya;
        const oppositionMunicipalityName = oppositionMunicipalities.find(m => m.name === formData.opposition?.municipality)?.ar_name || formData.opposition?.municipality;

        onUpdateClient({ 
            ...formData, 
            birthDate: parseDateFromInput(formData.birthDate),
            documentIssueDate: parseDateFromInput(formData.documentIssueDate),
            wilaya: wilayaName,
            municipality: municipalityName,
            opposition: withOpposition && formData.opposition ? {
              ...formData.opposition,
              birthDate: parseDateFromInput(formData.opposition.birthDate),
              documentIssueDate: parseDateFromInput(formData.opposition.documentIssueDate),
              wilaya: oppositionWilayaName,
              municipality: oppositionMunicipalityName,
            } : undefined,
            updatedAt: new Date().toISOString() 
        });
        onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
    if (name === 'wilaya') {
        setSelectedWilaya(value);
        setFormData(prev => prev ? { ...prev, municipality: '' } : null);
    }
  };

  const handleOppositionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? {
      ...prev,
      opposition: {
        ...(prev.opposition || {}),
        [name]: value,
      } as Opposition,
    } : null);
    if (name === 'wilaya') {
      setSelectedOppositionWilaya(value);
      setFormData(prev => prev ? {
        ...prev,
        opposition: {
          ...(prev.opposition || {}),
          municipality: '',
        } as Opposition,
      } : null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">تعديل بيانات الموكل</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X size={24} className="text-slate-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Personal Data */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">البيانات الشخصية</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">الاسم الأول *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">اللقب *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">اسم الأب *</label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">اسم الأم *</label>
              <input type="text" name="motherFirstName" value={formData.motherFirstName} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">لقب الأم *</label>
              <input type="text" name="motherLastName" value={formData.motherLastName} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">رقم الهاتف *</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            {/* Birth Info */}
            <div className="lg:col-span-3 mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">معلومات الميلاد</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ الميلاد *</label>
              <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} required placeholder="jj/mm/aaaa" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">مكان الميلاد *</label>
              <input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            {/* Identity Documents */}
            <div className="lg:col-span-3 mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">وثائق الهوية</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">نوع الوثيقة *</label>
              <select name="documentType" value={formData.documentType} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg">
                <option value="id_card">بطاقة التعريف</option>
                <option value="driving_license">رخصة السياقة</option>
                <option value="passport">جواز السفر</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">رقم الوثيقة *</label>
              <input type="text" name="documentNumber" value={formData.documentNumber} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ الإصدار *</label>
              <input type="text" name="documentIssueDate" value={formData.documentIssueDate} onChange={handleChange} required placeholder="jj/mm/aaaa" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ولاية الإصدار *</label>
                <select
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg"
                >
                    <option value="">اختر الولاية</option>
                    {algeriaData.map((wilaya) => (
                        <option key={wilaya.code} value={wilaya.code}>{wilaya.ar_name}</option>
                    ))}
                </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">بلدية الإصدار *</label>
              <select
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                required
                className="w-full p-3 border border-slate-300 rounded-lg"
                disabled={!selectedWilaya}
              >
                <option value="">اختر البلدية</option>
                {municipalities.map((municipality) => (
                  <option key={municipality.name} value={municipality.name}>
                    {municipality.ar_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Opposition Data */}
          <div className="lg:col-span-3 mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="withOpposition"
                checked={withOpposition}
                onChange={(e) => setWithOpposition(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="withOpposition" className="ml-2 block text-sm text-gray-900">
                إضافة خصم
              </label>
            </div>
          </div>

          {withOpposition && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 border-t pt-6">
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
                  بيانات الخصم
                </h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الاسم الأول للخصم
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.opposition?.firstName || ''}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  لقب الخصم
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.opposition?.lastName || ''}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم أب الخصم
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.opposition?.fatherName || ''}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم أم الخصم
                </label>
                <input
                  type="text"
                  name="motherFirstName"
                  value={formData.opposition?.motherFirstName || ''}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  لقب أم الخصم
                </label>
                <input
                  type="text"
                  name="motherLastName"
                  value={formData.opposition?.motherLastName || ''}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  رقم هاتف الخصم
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.opposition?.phoneNumber || ''}
                  placeholder="0555123456"
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
                  معلومات ميلاد الخصم
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  تاريخ ميلاد الخصم
                </label>
                <input
                  type="text"
                  name="birthDate"
                  value={formData.opposition?.birthDate || ''}
                  onChange={handleOppositionChange}
                  placeholder="jj/mm/aaaa"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  مكان ميلاد الخصم
                </label>
                <input
                  type="text"
                  name="birthPlace"
                  value={formData.opposition?.birthPlace || ''}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
                  وثائق هوية الخصم
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  نوع وثيقة الخصم
                </label>
                <select
                  name="documentType"
                  value={formData.opposition?.documentType || 'id_card'}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="id_card">بطاقة التعريف</option>
                  <option value="driving_license">رخصة السياقة</option>
                  <option value="passport">جواز السفر</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  رقم وثيقة الخصم
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.opposition?.documentNumber || ''}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  تاريخ إصدار وثيقة الخصم
                </label>
                <input
                  type="text"
                  name="documentIssueDate"
                  value={formData.opposition?.documentIssueDate || ''}
                  onChange={handleOppositionChange}
                  placeholder="jj/mm/aaaa"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ولاية إصدار وثيقة الخصم
                </label>
                <select
                  name="wilaya"
                  value={formData.opposition?.wilaya || ''}
                  onChange={handleOppositionChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر الولاية</option>
                  {algeriaData.map((wilaya) => (
                    <option key={wilaya.code} value={wilaya.code}>{wilaya.ar_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  بلدية إصدار وثيقة الخصم
                </label>
                <select
                  name="municipality"
                  value={formData.opposition?.municipality || ''}
                  onChange={handleOppositionChange}
                  disabled={!selectedOppositionWilaya}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر البلدية</option>
                  {oppositionMunicipalities.map((municipality) => (
                    <option key={municipality.name} value={municipality.name}>
                      {municipality.ar_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t">
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              حفظ التعديلات
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

export default EditClient;