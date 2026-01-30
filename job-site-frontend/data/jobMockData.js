// /src/utils/mock/jobMockData.js

export const mockJobFromAPI = {
  _id: "67a1b2c3d4e5f67890123456",
  title: "Senior Frontend Developer (ReactJS)",
  companyName: "Công ty Cổ phần Công Nghệ TechVision",
  description: `
    <div class="job-description">
      <h3>Vị trí: Senior Frontend Developer</h3>
      <p>Chúng tôi đang tìm kiếm một Senior Frontend Developer xuất sắc để tham gia vào đội ngũ phát triển sản phẩm công nghệ hàng đầu.</p>
      
      <h4>Trách nhiệm chính:</h4>
      <ul>
        <li>Phát triển và duy trì các ứng dụng web sử dụng ReactJS, NextJS</li>
        <li>Tối ưu hóa hiệu suất và trải nghiệm người dùng</li>
        <li>Làm việc với team Backend để tích hợp API</li>
        <li>Tham gia vào quy trình code review và mentoring junior developers</li>
        <li>Nghiên cứu và áp dụng công nghệ mới</li>
      </ul>
      
      <h4>Môi trường làm việc:</h4>
      <ul>
        <li>Làm việc tại văn phòng hiện đại Quận 1</li>
        <li>Có thể remote 2 ngày/tuần</li>
        <li>Giờ làm việc linh hoạt</li>
        <li>Tham gia các hoạt động team building hàng quý</li>
      </ul>
    </div>
  `,
  requirements: `
    <div class="job-requirements">
      <h3>Yêu cầu công việc:</h3>
      
      <h4>Bắt buộc:</h4>
      <ul>
        <li>Tối thiểu 3 năm kinh nghiệm với ReactJS</li>
        <li>Thành thạo HTML5, CSS3, JavaScript (ES6+)</li>
        <li>Kinh nghiệm với Redux/TanStack Query/Context API</li>
        <li>Hiểu biết về RESTful API và GraphQL</li>
        <li>Có kinh nghiệm làm việc với Git</li>
        <li>Tiếng Anh đọc hiểu tài liệu kỹ thuật</li>
      </ul>
      
      <h4>Ưu tiên:</h4>
      <ul>
        <li>Kinh nghiệm với TypeScript</li>
        <li>Đã từng làm việc với NextJS</li>
        <li>Hiểu biết về testing (Jest, React Testing Library)</li>
        <li>Kinh nghiệm với micro-frontend architecture</li>
        <li>Có portfolio hoặc project cá nhân</li>
      </ul>
    </div>
  `,
  industry: "Công nghệ phần mềm",
  location: {
    address: "Tầng 10, Tòa nhà Viettel, 285 Cách Mạng Tháng 8",
    city: "Hồ Chí Minh",
    region: "Miền Nam",
    coordinates: {
      lat: 10.762622,
      lng: 106.660172
    }
  },
  salary: {
    min: 30000000,
    max: 45000000,
    currency: "VND"
  },
  jobType: "full-time",
  experience: "Từ 3-5 năm",
  deadline: "2024-12-31T00:00:00.000Z",
  views: 1245,
  status: "active",
  createdBy: {
    _id: "67a0b1c2d3e4f56789012345",
    name: "Nguyễn Văn A",
    email: "hr@techvision.com",
    phone: "0909123456"
  },
  createdAt: "2024-03-15T08:30:00.000Z",
  updatedAt: "2024-03-15T08:30:00.000Z"
};

// API response format (giống hệt backend trả về)
export const mockJobApiResponse = {
  job: mockJobFromAPI,
  success: true
};

// Additional mock jobs for similar jobs section
export const mockSimilarJobs = [
  {
    _id: "67a1b2c3d4e5f67890123457",
    title: "Frontend Developer (VueJS)",
    companyName: "Công ty TNHH ABC Tech",
    location: {
      address: "Tầng 5, Tòa nhà Bitexco",
      city: "Hà Nội"
    },
    salary: {
      min: 20000000,
      max: 30000000,
      currency: "VND"
    },
    jobType: "full-time",
    experience: "Từ 1-2 năm",
    views: 856,
    createdAt: "2024-03-14T10:20:00.000Z"
  },
  {
    _id: "67a1b2c3d4e5f67890123458",
    title: "React Native Developer",
    companyName: "Startup XYZ",
    location: {
      address: "Khu công nghệ cao",
      city: "Đà Nẵng"
    },
    salary: {
      min: 25000000,
      max: 35000000,
      currency: "VND"
    },
    jobType: "remote",
    experience: "Từ 2-3 năm",
    views: 642,
    createdAt: "2024-03-13T14:15:00.000Z"
  },
  {
    _id: "67a1b2c3d4e5f67890123459",
    title: "Fullstack Developer (NodeJS + React)",
    companyName: "Global Solutions Inc.",
    location: {
      address: "Tầng 8, Tòa nhà Centec",
      city: "Hồ Chí Minh"
    },
    salary: {
      min: 35000000,
      max: 50000000,
      currency: "VND"
    },
    jobType: "full-time",
    experience: "Trên 5 năm",
    views: 923,
    createdAt: "2024-03-12T09:00:00.000Z"
  }
];

// Company jobs (các công việc khác cùng công ty)
export const mockCompanyJobs = [
  {
    _id: "67a1b2c3d4e5f67890123460",
    title: "Backend Developer (Java Spring)",
    companyName: "Công ty Cổ phần Công Nghệ TechVision",
    location: {
      city: "Hồ Chí Minh"
    },
    salary: {
      min: 25000000,
      max: 40000000,
      currency: "VND"
    },
    jobType: "full-time",
    experience: "Từ 3-5 năm",
    views: 721,
    createdAt: "2024-03-10T11:30:00.000Z"
  },
  {
    _id: "67a1b2c3d4e5f67890123461",
    title: "DevOps Engineer",
    companyName: "Công ty Cổ phần Công Nghệ TechVision",
    location: {
      city: "Hồ Chí Minh"
    },
    salary: {
      min: 30000000,
      max: 45000000,
      currency: "VND"
    },
    jobType: "full-time",
    experience: "Từ 2-4 năm",
    views: 534,
    createdAt: "2024-03-05T13:45:00.000Z"
  }
];

// Test data with edge cases
export const mockJobEdgeCases = {
  // Job với salary chỉ có min
  jobWithMinSalaryOnly: {
    ...mockJobFromAPI,
    _id: "min_salary_test",
    salary: {
      min: 30000000,
      currency: "VND"
    }
  },
  
  // Job với salary chỉ có max
  jobWithMaxSalaryOnly: {
    ...mockJobFromAPI,
    _id: "max_salary_test",
    salary: {
      max: 40000000,
      currency: "VND"
    }
  },
  
  // Job không có salary object
  jobWithoutSalary: {
    ...mockJobFromAPI,
    _id: "no_salary_test",
    salary: null
  },
  
  // Job expired
  expiredJob: {
    ...mockJobFromAPI,
    _id: "expired_test",
    deadline: "2024-01-01T00:00:00.000Z",
    status: "expired"
  },
  
  // Job closed
  closedJob: {
    ...mockJobFromAPI,
    _id: "closed_test",
    status: "closed"
  },
  
  // Remote job
  remoteJob: {
    ...mockJobFromAPI,
    _id: "remote_test",
    jobType: "remote",
    location: {
      city: "Remote",
      region: "Toàn quốc"
    }
  },
  
  // Part-time job
  partTimeJob: {
    ...mockJobFromAPI,
    _id: "parttime_test",
    jobType: "part-time",
    salary: {
      min: 15000000,
      max: 20000000,
      currency: "VND"
    }
  }
};