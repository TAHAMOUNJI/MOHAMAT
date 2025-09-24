// دوال مساعدة للتواريخ والأرقام العربية
export const formatDateToArabic = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  
  return dateObj.toLocaleDateString('ar-DZ-u-nu-latn', options);
};

export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  };
  
  return dateObj.toLocaleDateString('ar-DZ-u-nu-latn', options);
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return dateObj.toLocaleString('ar-DZ-u-nu-latn', options);
};

export const formatDateLong = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return dateObj.toLocaleDateString('ar-DZ-u-nu-latn', options);
};

// New functions for input formatting
export const formatDateForInput = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

export const parseDateFromInput = (formattedDate: string): string => {
  if (!formattedDate) return '';
  const parts = formattedDate.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }
  return formattedDate; // Return original if format is not as expected
};