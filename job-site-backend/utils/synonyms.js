// utils/synonyms.js
const synonymGroups = [
  // Ngành nghề IT
  ['công nghệ thông tin', 'it', 'cntt', 'information technology', 'tech'],
  
  // Ngôn ngữ
  ['tiếng hoa', 'tiếng trung', 'chinese', 'trung quốc'],
  ['tiếng anh', 'anh văn', 'english'],
  ['tiếng nhật', 'nhật bản', 'japanese'],
  ['tiếng hàn', 'hàn quốc', 'korean'],
  
  // Ngành nghề khác
  ['kinh tế', 'economics', 'economy', 'kinh doanh'],
  ['kế toán', 'accounting', 'accountant'],
  ['marketing', 'tiếp thị', 'quảng cáo'],
  ['nhân sự', 'hr', 'human resources'],
  ['thiết kế', 'design', 'designer'],
  ['lập trình', 'programming', 'developer', 'dev', 'coder'],
  
  // Job types
  ['full time', 'fulltime', 'toàn thời gian', 'full-time'],
  ['part time', 'parttime', 'bán thời gian', 'part-time'],
  ['remote', 'từ xa', 'làm từ xa', 'work from home', 'wfh'],
  ['internship', 'thực tập', 'intern'],
  
  // Thêm các nhóm khác theo nhu cầu project của bạn...
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