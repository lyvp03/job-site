// Tạo file test tạm: /src/test-mapping.js
import { mapJobData } from './utils/jobDataMapper.js';

// Copy-paste mockApiData từ trên vào đây
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
    currency: 'VNĐ'
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
};;

const result = mapJobData(mockApiData);
console.log('Mapping Result:', JSON.stringify(result, null, 2));

// Kiểm tra từng field quan trọng
const checks = [
  { field: 'salary', expected: '30,000,000 - 45,000,000 VNĐ' },
  { field: 'jobType', expected: 'Toàn thời gian' },
  { field: 'location', expected: 'Tầng 10, Tòa nhà Viettel, Hồ Chí Minh' }
];

checks.forEach(check => {
  const actual = result[check.field];
  const passed = actual === check.expected;
  console.log(`${check.field}: ${actual} ${passed ? '✓' : '✗ (expected: ' + check.expected + ')'}`);
});