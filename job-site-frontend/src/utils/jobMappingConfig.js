// /src/utils/jobMappingConfig.js - Phiên bản đơn giản để debug
import {formatDateToDDMMYYYY} from './dateFormatter';
export const JOB_MAPPING_CONFIG = {
  fields: {
    // Direct mappings
    direct: ['_id', 'title', 'companyName', 'companyId', 'company', 'industry', 'views', 
             'description', 'requirements', 'status'],
    
    // Transformed fields - ĐƠN GIẢN HÓA ĐỂ TEST
    transformed: {
      // Salary - test với function đơn giản
      salary: {
        source: 'salary',
        transform: (salaryObj) => {
          console.log('Salary transform called with:', salaryObj);
          
          if (!salaryObj) {
            console.log('Salary object is null/undefined');
            return 'Thương lượng';
          }
          
          // Kiểm tra cấu trúc
          console.log('Salary structure:', {
            min: salaryObj.min,
            max: salaryObj.max,
            currency: salaryObj.currency,
            type: typeof salaryObj
          });
          
          const { min, max, currency = 'VND' } = salaryObj;
          
          // FORMAT số
          const format = (num) => {
            if (!num && num !== 0) return '';
            return new Intl.NumberFormat('vi-VN').format(num);
          };
          
          if (min !== undefined && max !== undefined) {
            return `${format(min)} - ${format(max)} ${currency}`;
          }
          if (min !== undefined) {
            return `Từ ${format(min)} ${currency}`;
          }
          
          return 'Thương lượng';
        }
      },
      createdAt:{
        source:'createdAt',
        transform:(createdAtObj)=>{
          console.log('Created at',formatDateToDDMMYYYY(createdAtObj));
          return formatDateToDDMMYYYY(createdAtObj);
        }
      },
      updatedAt:{
        source:'updatedAt',
        transform:(updatedAtObj)=>{
          console.log('Updated at',formatDateToDDMMYYYY(updatedAtObj));
          return formatDateToDDMMYYYY(updatedAtObj);
        }
      },
      
      // Location - test đơn giản
      location: {
        source: 'location',
        transform: (locationObj) => {
          console.log('Location transform called with:', locationObj);
          
          if (!locationObj) {
            console.log('Location object is null');
            return 'Không xác định';
          }
          
          if (typeof locationObj === 'string') {
            return locationObj;
          }
          
          // Kiểm tra cấu trúc
          console.log('Location structure:', locationObj);
          
          const { address, city } = locationObj;
          if (address && city) {
            return `${address}, ${city}`;
          }
          if (city) {
            return city;
          }
          
          return address || 'Không xác định';
        }
      },
      
      // Job type - test đơn giản
      jobType: {
        source: 'jobType',
        transform: (jobType) => {
          console.log('JobType transform called with:', jobType);
          
          if (!jobType) {
            console.log('JobType is null/undefined');
            return 'Chưa xác định';
          }
          
          const mapping = {
            'full-time': 'Toàn thời gian',
            'part-time': 'Bán thời gian', 
            'remote': 'Làm việc từ xa'
          };
          
          const result = mapping[jobType] || jobType;
          console.log('JobType result:', result);
          return result;
        }
      },
      
      // Experience - test đơn giản
      experience: {
        source: 'experience',
        transform: (exp) => {
          console.log('Experience transform called with:', exp);
          
          if (!exp) {
            console.log('Experience is null/undefined');
            return 'Chưa xác định';
          }
          
          const mapping = {
            'Không yêu cầu': 'Không yêu cầu',
            'Dưới 1 năm': 'Dưới 1 năm',
            'Từ 1-2 năm': '1-2 năm',
            'Từ 3-5 năm': '3-5 năm',
            'Trên 5 năm': 'Trên 5'
          };
          
          const result = mapping[exp] || exp;
          console.log('Experience result:', result);
          return result;
        }
      },
      
      // Status text
      statusText: {
        source: 'status',
        transform: (status) => {
          console.log('Status transform called with:', status);
          
          const mapping = {
            'active': 'Đang tuyển',
            'expired': 'Đã hết hạn',
            'closed': 'Đã đóng'
          };
          
          return mapping[status] || status;
        }
      }
    },
    
    // Derived fields - tạm bỏ qua hoặc đơn giản hóa
    derived: {
      address: {
        source: 'location.address',
        transform: (address) => {
          console.log('Address transform called with:', address);
          return address || 'Chưa xác định';
        }
      },
      
      city: {
        source: 'location.city',
        transform: (city) => {
          console.log('City transform called with:', city);
          return city || 'Chưa xác định';
        }
      },
      
      deadline: {
        source: 'deadline',
        transform: (dateStr) => {
          console.log('Deadline transform called with:', dateStr);
          
          if (!dateStr) return 'Không có hạn nộp';
          try {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          } catch (e) {
            console.error('Date formatting error:', e);
            return dateStr;
          }
        }
      }
    }
  }
};