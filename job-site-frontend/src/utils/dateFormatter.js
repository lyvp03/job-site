// /src/utils/dateFormatter.js
export const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateStr);
      return dateStr;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};

export const formatDateTimeToDDMMYYYYHHMM = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return dateStr;
  }
};

export const calculateDaysAgo = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const jobDate = new Date(dateStr);
    const today = new Date();
    
    if (isNaN(jobDate.getTime())) {
      return '';
    }
    
    // Reset time to compare only dates
    const jobDateOnly = new Date(jobDate.getFullYear(), jobDate.getMonth(), jobDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const diffTime = Math.abs(todayOnly - jobDateOnly);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    return `${diffDays} ngày trước`;
  } catch (error) {
    console.error('Error calculating days ago:', error);
    return '';
  }
};