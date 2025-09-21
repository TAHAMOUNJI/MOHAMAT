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
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
};

export const parseDateFromInput = (formattedDate: string): string => {
  if (!formattedDate) return '';
    const parts = formattedDate.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      
      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
        const date = new Date(yearNum, monthNum - 1, dayNum);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      return `${year}-${month}-${day}`;
    }
  }
    return '';
  } catch {
    return '';
  }
};