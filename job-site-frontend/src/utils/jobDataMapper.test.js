// /src/utils/jobDataMapper.test.js
import { mapJobData, sanitizeHTML, formatNumber, formatDate } from './jobDataMapper';

// Mock API data theo đúng schema backend
const mockApiData = {
  _id: '67a1b2c3d4e5f67890123456',
  title: 'Senior Frontend Developer',
  companyName: 'Công ty Cổ phần Công Nghệ XYZ',
  description: '<p>Mô tả công việc chi tiết</p><ul><li>Task 1</li><li>Task 2</li></ul>',
  requirements: '<p>Yêu cầu:</p><ol><li>ReactJS</li><li>TypeScript</li></ol>',
  industry: 'Công nghệ phần mềm',
  location: {
    address: 'Tầng 10, Tòa nhà Viettel',
    city: 'Hồ Chí Minh',
    region: 'Miền Nam'
  },
  salary: {
    min: 30000000,
    max: 45000000,
    currency: 'VND'
  },
  jobType: 'full-time',
  experience: 'Từ 3-5 năm',
  deadline: '2024-12-31T00:00:00.000Z',
  views: 1245,
  status: 'active',
  createdBy: {
    name: 'Nguyễn Văn A',
    email: 'hr@techcompany.com'
  },
  createdAt: '2024-03-15T08:30:00.000Z'
};

// Test the mapper
console.log('=== TESTING JOB DATA MAPPER ===');

// Test 1: Map full object
const mappedJob = mapJobData(mockApiData);
console.log('1. Mapped job:', mappedJob);

// Test 2: Verify specific transformations
console.log('\n2. Verification:');
console.log('- Salary:', mappedJob.salary); // Should be "30,000,000 - 45,000,000 VNĐ"
console.log('- Location:', mappedJob.location); // Should be "Tầng 10, Tòa nhà Viettel, Hồ Chí Minh"
console.log('- Job Type:', mappedJob.jobType); // Should be "Toàn thời gian"
console.log('- Experience:', mappedJob.experience); // Should be "3-5 năm kinh nghiệm"
console.log('- Status Text:', mappedJob.statusText); // Should be "Đang tuyển"
console.log('- Deadline:', mappedJob.deadline); // Should be "31/12/2024"
console.log('- Posted Date:', mappedJob.postedDate); // Should be "15/03/2024"
console.log('- Views formatted:', mappedJob.views); // Should be "1.245"

// Test 3: Individual utility functions
console.log('\n3. Utility functions:');
console.log('- Format number 30000000:', formatNumber(30000000));
console.log('- Format date:', formatDate('2024-12-31'));
console.log('- Sanitize HTML:', sanitizeHTML('<script>alert("xss")</script><p>Safe</p>'));

// Test 4: Check for missing/null data
const incompleteData = {
  title: 'Test Job',
  salary: { min: 20000000 }
};
const mappedIncomplete = mapJobData(incompleteData);
console.log('\n4. Incomplete data test:');
console.log('- Salary with only min:', mappedIncomplete?.salary); // Should be "Từ 20,000,000 VND"
console.log('- Location missing:', mappedIncomplete?.location); // Should be "Không xác định"