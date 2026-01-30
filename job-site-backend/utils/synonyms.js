// utils/synonyms.js
const synonymGroups = [
    // ===== IT & TECHNOLOGY =====
  [
    'công nghệ thông tin',
    'it',
    'cntt',
    'information technology',
    'tech',
    'it - phần mềm',
    'it - phần cứng & mạng',
    'it - dữ liệu & ai',
    'software',
    'developer',
    'programmer',
    'lập trình'
  ],

  // ===== LANGUAGES =====
  ['tiếng hoa', 'tiếng trung', 'chinese', 'trung quốc'],
  ['tiếng anh', 'anh văn', 'english'],
  ['tiếng nhật', 'nhật bản', 'japanese'],
  ['tiếng hàn', 'hàn quốc', 'korean'],

  // ===== BUSINESS & FINANCE =====
  [
    'kinh tế',
    'economics',
    'economy',
    'kinh doanh',
    'business',
    'bán hàng',
    'sales',
    'kinh doanh / bán hàng'
  ],
  [
    'tài chính',
    'ngân hàng',
    'finance',
    'banking',
    'tài chính - ngân hàng'
  ],
  [
    'kế toán',
    'accounting',
    'accountant',
    'kiểm toán',
    'auditing',
    'kế toán - kiểm toán'
  ],
  [
    'marketing',
    'tiếp thị',
    'quảng cáo',
    'digital marketing',
    'seo',
    'content marketing'
  ],

  // ===== MANAGEMENT & ADMIN =====
  [
    'nhân sự',
    'hr',
    'human resources',
    'recruitment',
    'tuyển dụng'
  ],
  [
    'quản lý',
    'management',
    'manager',
    'leader'
  ],
  [
    'hành chính',
    'administration',
    'admin'
  ],

  // ===== CREATIVE =====
  [
    'thiết kế',
    'design',
    'designer',
    'ui',
    'ux',
    'graphic design'
  ],
  [
    'sáng tạo nội dung',
    'content',
    'content creator',
    'copywriter'
  ],

  // ===== ENGINEERING & TECHNICAL =====
  [
    'kỹ thuật',
    'engineering',
    'engineer'
  ],
  [
    'xây dựng',
    'construction',
    'civil'
  ],

  // ===== SERVICES =====
  [
    'khách sạn',
    'du lịch',
    'hotel',
    'tourism',
    'khách sạn - du lịch'
  ],
  [
    'dịch vụ khách hàng',
    'customer service',
    'cs',
    'support'
  ],

  // ===== PROFESSIONAL FIELDS =====
  [
    'y tế',
    'dược',
    'healthcare',
    'medical',
    'y tế - dược'
  ],
  [
    'giáo dục',
    'education',
    'teacher',
    'giảng viên'
  ],
  [
    'pháp lý',
    'luật',
    'legal',
    'law'
  ],

  // ===== OTHER INDUSTRIES =====
  [
    'nông nghiệp',
    'agriculture',
    'farming'
  ],
  [
    'bất động sản',
    'real estate',
    'property'
  ],
  [
    'logistics',
    'chuỗi cung ứng',
    'supply chain'
  ],
  [
    'sản xuất',
    'manufacturing',
    'factory'
  ],

  // ===== JOB TYPES =====
  ['full time', 'fulltime', 'toàn thời gian', 'full-time'],
  ['part time', 'parttime', 'bán thời gian', 'part-time'],
  ['remote', 'từ xa', 'làm từ xa', 'work from home', 'wfh'],
  ['internship', 'thực tập', 'intern']
];



// Tạo map để tra cứu nhanh O(1)
const synonymMap = {};
synonymGroups.forEach(group => {
  group.forEach(word => {
    synonymMap[word.toLowerCase()] = group;
  });
});

/**
 * Mở rộng keyword thành tất cả các từ đồng nghĩa
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {string[]} - Mảng các từ đồng nghĩa
 */
export const expandSearchKeyword = (keyword) => {
  if (!keyword) return [];
  
  const lowerKeyword = keyword.toLowerCase().trim();
  
  // Tìm nhóm từ đồng nghĩa
  const synonyms = synonymMap[lowerKeyword];
  
  if (synonyms) {
    return synonyms;
  }
  
  // Nếu không có synonym, trả về keyword gốc
  return [keyword];
};

/**
 * Build $or query cho multiple synonyms
 * @param {string[]} synonyms - Mảng từ đồng nghĩa
 * @returns {object[]} - Mảng điều kiện $or cho MongoDB
 */
export const buildSynonymQuery = (synonyms) => {
  return synonyms.flatMap(syn => [
    { title: { $regex: syn, $options: "i" } },
    { description: { $regex: syn, $options: "i" } }
  ]);
};