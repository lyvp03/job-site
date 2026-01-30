// /src/utils/mapJobData.js
import { JOB_MAPPING_CONFIG } from './jobMappingConfig';

export const mapJobData = (apiResponse) => {
    if (!apiResponse) return null;
    
    console.log('=== MAP JOB DATA DEBUG ===');
    console.log('1. Raw API response:', apiResponse);
    
    // Extract job object từ API response
    let jobData = apiResponse;
    
    if (apiResponse.job) {
        jobData = apiResponse.job;
        console.log('2. Using apiResponse.job');
    } else if (apiResponse.data?.job) {
        jobData = apiResponse.data.job;
        console.log('2. Using apiResponse.data.job');
    } else if (apiResponse.data) {
        jobData = apiResponse.data;
        console.log('2. Using apiResponse.data');
    }
    
    console.log('3. Job data to map:', jobData);
    console.log('4. Salary data:', jobData?.salary);
    console.log('5. Location data:', jobData?.location);
    console.log('6. Job type:', jobData?.jobType);
    console.log('7. Experience:', jobData?.experience);
    console.log('8. Status:', jobData?.status);
    
    if (!jobData || typeof jobData !== 'object') {
        console.warn('Invalid job data for mapping');
        return null;
    }
    
    const mappedData = {};
    const { fields } = JOB_MAPPING_CONFIG;
    
    // 1. Direct mappings
    console.log('=== DIRECT MAPPING ===');
    fields.direct.forEach(field => {
        if (jobData[field] !== undefined) {
            mappedData[field] = jobData[field];
            console.log(`Mapped direct: ${field} =`, jobData[field]);
        }
    });
    
    // 2. Transformed fields - SỬA LẠI PHẦN NÀY
    console.log('=== TRANSFORMED FIELDS ===');
    Object.entries(fields.transformed).forEach(([targetField, config]) => {
        const { source, transform } = config;
        
        // Lấy giá trị từ jobData - FIX source path
        let sourceValue;
        
        // Nếu source là nested path (có dấu chấm)
        if (source && source.includes('.')) {
            const keys = source.split('.');
            sourceValue = keys.reduce((obj, key) => {
                return obj && typeof obj === 'object' ? obj[key] : undefined;
            }, jobData);
        } else {
            // Nếu source là direct field
            sourceValue = jobData[source];
        }
        
        console.log(`Processing ${targetField}:`);
        console.log(`  - Source path: ${source}`);
        console.log(`  - Source value:`, sourceValue);
        console.log(`  - Transform function exists:`, !!transform);
        
        // Kiểm tra xem có phải là function không
        if (transform && typeof transform === 'function') {
            try {
                const transformedValue = transform(sourceValue);
                mappedData[targetField] = transformedValue;
                console.log(`  - Transformed value:`, transformedValue);
            } catch (error) {
                console.error(`  - Transform error for ${targetField}:`, error);
                mappedData[targetField] = sourceValue; // Fallback
            }
        } else {
            console.log(`  - No transform, using source value`);
            mappedData[targetField] = sourceValue;
        }
    });
    
    // 3. Derived fields
    console.log('=== DERIVED FIELDS ===');
    Object.entries(fields.derived).forEach(([targetField, config]) => {
        const { sources, source, transform } = config; // Note: có thể dùng source hoặc sources
        
        // Xử lý cả 2 trường hợp: source (string) hoặc sources (array)
        if (transform && typeof transform === 'function') {
            let transformedValue;
            
            if (source) {
                // Dùng source path
                let sourceValue;
                if (source.includes('.')) {
                    const keys = source.split('.');
                    sourceValue = keys.reduce((obj, key) => {
                        return obj && typeof obj === 'object' ? obj[key] : undefined;
                    }, jobData);
                } else {
                    sourceValue = jobData[source];
                }
                
                try {
                    transformedValue = transform(sourceValue);
                    mappedData[targetField] = transformedValue;
                    console.log(`Derived ${targetField}:`, transformedValue);
                } catch (error) {
                    console.error(`Derived error for ${targetField}:`, error);
                }
            } else if (sources && Array.isArray(sources)) {
                // Dùng multiple sources
                const sourceValues = sources.map(sourcePath => {
                    if (sourcePath.includes('.')) {
                        const keys = sourcePath.split('.');
                        return keys.reduce((obj, key) => {
                            return obj && typeof obj === 'object' ? obj[key] : undefined;
                        }, jobData);
                    }
                    return jobData[sourcePath];
                });
                
                try {
                    transformedValue = transform(...sourceValues);
                    mappedData[targetField] = transformedValue;
                    console.log(`Derived ${targetField}:`, transformedValue);
                } catch (error) {
                    console.error(`Derived error for ${targetField}:`, error);
                }
            }
        }
    });
    
    // 4. Copy remaining fields (trừ các field đặc biệt)
    Object.keys(jobData).forEach(key => {
        if (!mappedData.hasOwnProperty(key) && 
            !['__v'].includes(key)) {
            mappedData[key] = jobData[key];
        }
    });
    
    // 5. Thêm raw data để debug
    mappedData.raw = apiResponse;
    
    console.log('=== FINAL MAPPED DATA ===');
    console.log('Mapped data:', mappedData);
    console.log('==========================');
    
    return mappedData;
};