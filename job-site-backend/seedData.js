import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';
import Job from './models/Job.js';
import User from './models/User.js';

dotenv.config();

// ============================================
// 1. USERS DATA
// ============================================
const usersData = [
    {
        name: 'Admin System',
        email: 'admin@test.com',
        password: 'Admin123',
        role: 'admin'
    },
    {
        name: 'HR FPT Software',
        email: 'hr.fpt@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR VNG Corporation',
        email: 'hr.vng@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Viettel Software',
        email: 'hr.viettel@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR TMA Solutions',
        email: 'hr.tma@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Shopee Vietnam',
        email: 'hr.shopee@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Grab Vietnam',
        email: 'hr.grab@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR MoMo',
        email: 'hr.momo@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'Nguyễn Văn A',
        email: 'candidate1@test.com',
        password: 'Test123',
        role: 'candidate'
    },
    {
        name: 'Trần Thị B',
        email: 'candidate2@test.com',
        password: 'Test123',
        role: 'candidate'
    }
];

// ============================================
// 2. COMPANIES & JOBS DATA
// ============================================
const companiesWithJobs = [
    {
        company: {
            name: 'FPT Software',
            email: 'hr@fpt.com.vn',
            phone: '02432134567',
            website: 'https://fptsoftware.com',
            address: '17 Duy Tân, Dịch Vọng Hậu',
            city: 'Hà Nội',
            district: 'Cầu Giấy',
            region: 'Miền Bắc',
            description: 'FPT Software là công ty công nghệ hàng đầu Việt Nam với hơn 30 năm kinh nghiệm, chuyên cung cấp các giải pháp chuyển đổi số, phát triển phần mềm và dịch vụ CNTT cho khách hàng toàn cầu. Chúng tôi tự hào là đối tác tin cậy của hơn 1000 doanh nghiệp trên thế giới.',
            overview: 'Công ty công nghệ lớn nhất Việt Nam với hơn 30,000 nhân viên',
            industry: 'IT - Phần mềm',
            size: '1000+',
            foundedYear: 1999,
            isVerified: true
        },
        jobs: [
            {
                title: 'Senior Full Stack Developer (React/Node.js)',
                companyName: 'FPT Software',
                description: 'Chúng tôi đang tìm kiếm Senior Full Stack Developer có kinh nghiệm với React và Node.js để tham gia các dự án lớn cho khách hàng quốc tế. Bạn sẽ làm việc trong môi trường Agile, với đội ngũ chuyên nghiệp và cơ hội phát triển kỹ năng. Dự án sử dụng công nghệ hiện đại nhất và có cơ hội làm việc với các chuyên gia hàng đầu.',
                requirements: 'Tối thiểu 3 năm kinh nghiệm Full Stack Development. Thành thạo React, Node.js, MongoDB/PostgreSQL. Có kinh nghiệm với REST API, GraphQL. Tiếng Anh giao tiếp tốt. Ưu tiên có kinh nghiệm AWS/Azure, Docker, CI/CD.',
                industry: 'IT - Phần mềm',
                location: {
                    address: '17 Duy Tân, Dịch Vọng Hậu, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 20000000, max: 40000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Java Backend Developer (Spring Boot)',
                companyName: 'FPT Software',
                description: 'Tham gia phát triển các hệ thống backend quy mô lớn sử dụng Java Spring Boot cho các dự án banking và fintech. Làm việc với các công nghệ cloud hiện đại và microservices architecture. Môi trường làm việc chuyên nghiệp với cơ hội học hỏi từ senior developers.',
                requirements: 'Kinh nghiệm 2+ năm Java/Spring Boot. Hiểu biết về Microservices, Docker, Kubernetes. Có kinh nghiệm với MySQL, Redis, Kafka. Am hiểu Design Patterns và Clean Code. Có khả năng đọc tài liệu tiếng Anh.',
                industry: 'IT - Phần mềm',
                location: {
                    address: '17 Duy Tân, Dịch Vọng Hậu, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 18000000, max: 35000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'DevOps Engineer (AWS/Kubernetes)',
                companyName: 'FPT Software',
                description: 'Xây dựng và duy trì CI/CD pipeline, quản lý infrastructure trên AWS, triển khai ứng dụng với Kubernetes. Làm việc trong team DevOps chuyên nghiệp với các dự án lớn.',
                requirements: 'Kinh nghiệm 2+ năm DevOps/SRE. Thành thạo AWS, Kubernetes, Docker, Terraform. Có kinh nghiệm với CI/CD tools (Jenkins, GitLab CI). Biết scripting (Bash, Python). Hiểu về monitoring và logging.',
                industry: 'IT - Phần mềm',
                location: {
                    address: '17 Duy Tân, Dịch Vọng Hậu, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 25000000, max: 45000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Junior Frontend Developer (React)',
                companyName: 'FPT Software',
                description: 'Phát triển giao diện web với React cho các dự án khác nhau. Làm việc với senior developers để học best practices và improve kỹ năng. Hỗ trợ maintain codebase.',
                requirements: 'Kinh nghiệm 6+ tháng web development hoặc mới ra trường. Kiến thức cơ bản HTML, CSS, JavaScript. Làm quen với React hooks, component lifecycle. Eager to learn và collaborative mindset.',
                industry: 'IT - Phần mềm',
                location: {
                    address: '17 Duy Tân, Dịch Vọng Hậu, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 8000000, max: 15000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Dưới 1 năm',
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Business Analyst (Part-time)',
                companyName: 'FPT Software',
                description: 'Phân tích requirements từ clients, viết specifications cho development team. Part-time position với flexible schedule. Ideal cho sinh viên hoặc professionals tìm thêm công việc.',
                requirements: 'Kinh nghiệm 1+ năm business analysis hoặc similar role. Strong communication skills và attention to detail. Proficiency with requirements gathering tools. Tiếng Anh đọc hiểu tốt.',
                industry: 'IT - Phần mềm',
                location: {
                    address: '17 Duy Tân, Dịch Vọng Hậu, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 6000000, max: 12000000, currency: 'VND' },
                jobType: 'part-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Remote Technical Writer',
                companyName: 'FPT Software',
                description: 'Viết technical documentation cho software products. Tạo guides, API documentation, troubleshooting articles. Làm việc remote từ mọi nơi.',
                requirements: 'Kinh nghiệm 1+ năm technical writing hoặc software documentation. Strong writing skills, attention to detail. Familiar với Markdown, Git workflows. Background trong IT/software là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: '17 Duy Tân, Dịch Vọng Hậu, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 10000000, max: 20000000, currency: 'VND' },
                jobType: 'remote',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'VNG Corporation',
            email: 'tuyendung@vng.com.vn',
            phone: '02838272280',
            website: 'https://vng.com.vn',
            address: 'Z06, Đường số 13, Tân Thuận Đông',
            city: 'Hồ Chí Minh',
            district: 'Quận 7',
            region: 'Miền Nam',
            description: 'VNG Corporation là tập đoàn công nghệ hàng đầu tại Việt Nam, nổi tiếng với Zalo, ZaloPay, và các sản phẩm game, giải trí trực tuyến. Với sứ mệnh nâng cao chất lượng sống của người dân thông qua công nghệ, VNG không ngừng đổi mới và phát triển.',
            overview: 'Tập đoàn công nghệ với hệ sinh thái sản phẩm đa dạng',
            industry: 'IT - Phần mềm',
            size: '1000+',
            foundedYear: 2004,
            isVerified: true
        },
        jobs: [
            {
                title: 'Senior Mobile Developer (iOS/Android)',
                companyName: 'VNG Corporation',
                description: 'Phát triển và tối ưu ứng dụng Zalo cho iOS/Android. Làm việc với hàng triệu users, xử lý các vấn đề performance và scalability. Cơ hội làm việc với product được yêu thích nhất Việt Nam.',
                requirements: 'Kinh nghiệm 3+ năm phát triển mobile app (iOS Swift hoặc Android Kotlin). Thành thạo UI/UX implementation. Có kinh nghiệm optimize performance. Hiểu biết về security và encryption. Đam mê product và user experience.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Z06, Đường số 13, Tân Thuận Đông, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 25000000, max: 50000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Product Manager (ZaloPay)',
                companyName: 'VNG Corporation',
                description: 'Quản lý product roadmap của ZaloPay, làm việc với engineering và design team để deliver features phục vụ hàng triệu users. Phân tích dữ liệu và đưa ra quyết định product.',
                requirements: 'Kinh nghiệm 2+ năm Product Management trong fintech/payment. Có khả năng phân tích dữ liệu và insights. Hiểu về user experience và product development lifecycle. Strong communication và stakeholder management. MBA là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Z06, Đường số 13, Tân Thuận Đông, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 30000000, max: 60000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Game Developer (Unity)',
                companyName: 'VNG Corporation',
                description: 'Phát triển game mobile với Unity cho VNG Game Studios. Tham gia các dự án game casual và mid-core với hàng triệu downloads. Làm việc với đội ngũ artists và game designers tài năng.',
                requirements: 'Kinh nghiệm 2+ năm Unity game development. Thành thạo C#, Unity APIs. Có kinh nghiệm optimize game performance trên mobile. Hiểu game mechanics và monetization. Portfolio game projects là bắt buộc.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Z06, Đường số 13, Tân Thuận Đông, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 20000000, max: 40000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'UI/UX Designer',
                companyName: 'VNG Corporation',
                description: 'Design user interfaces và user experiences cho Zalo và các products khác của VNG. Collaborate với product teams để tạo innovative solutions. Conduct user research và usability testing.',
                requirements: 'Kinh nghiệm 2+ năm UI/UX design. Thành thạo Figma, Adobe XD. Understanding của mobile design patterns. Strong portfolio demonstrating design process. Knowledge về accessibility standards là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Z06, Đường số 13, Tân Thuận Đông, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 18000000, max: 40000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'DevOps Engineer (Part-time Remote)',
                companyName: 'VNG Corporation',
                description: 'Maintain infrastructure, monitoring, logging systems cho VNG services. Support development teams với deployment. Part-time remote position.',
                requirements: 'Kinh nghiệm 1+ năm DevOps. Familiar với Linux, Docker, container orchestration. Knowledge của CI/CD tools. Good communication skills. Remote-ready.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Z06, Đường số 13, Tân Thuận Đông, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 12000000, max: 22000000, currency: 'VND' },
                jobType: 'part-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Viettel Software',
            email: 'hr@viettel-software.com.vn',
            phone: '02435624680',
            website: 'https://viettel-software.vn',
            address: 'Tầng 7, Tòa nhà VIT, Duy Tân',
            city: 'Hà Nội',
            district: 'Cầu Giấy',
            region: 'Miền Bắc',
            description: 'Viettel Software là công ty phần mềm thuộc Tập đoàn Viettel, chuyên phát triển các giải pháp viễn thông, CNTT cho doanh nghiệp và chính phủ. Chúng tôi tự hào đồng hành cùng quá trình chuyển đổi số quốc gia.',
            overview: 'Công ty phần mềm hàng đầu trong lĩnh vực viễn thông',
            industry: 'IT - Phần mềm',
            size: '501-1000',
            foundedYear: 2007,
            isVerified: true
        },
        jobs: [
            {
                title: 'AI/Machine Learning Engineer',
                companyName: 'Viettel Software',
                description: 'Nghiên cứu và triển khai các giải pháp AI/ML cho telecommunications. Xây dựng models cho network optimization, customer behavior prediction, và fraud detection.',
                requirements: 'Kinh nghiệm 2+ năm ML/AI. Thành thạo Python, TensorFlow/PyTorch. Có kinh nghiệm với NLP, Computer Vision hoặc Time Series. Hiểu về MLOps và model deployment. Publications hoặc kaggle medals là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tầng 7, Tòa nhà VIT, Duy Tân, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 25000000, max: 50000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Security Engineer (Penetration Testing)',
                companyName: 'Viettel Software',
                description: 'Thực hiện penetration testing cho các hệ thống critical của Viettel. Đánh giá và cải thiện security posture. Làm việc với các dự án government và enterprise.',
                requirements: 'Kinh nghiệm 2+ năm security/pentesting. Có certifications (OSCP, CEH, CISSP). Thành thạo security tools (Burp Suite, Metasploit, Nmap). Hiểu về OWASP Top 10, network security. Có khả năng viết exploits và security reports.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tầng 7, Tòa nhà VIT, Duy Tân, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 22000000, max: 45000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Golang Backend Developer (Microservices)',
                companyName: 'Viettel Software',
                description: 'Develop microservices-based systems cho telecom domain. Work với gRPC, message queues, container orchestration. Build scalable solutions.',
                requirements: 'Kinh nghiệm 2+ năm Golang. Understanding của microservices architecture, Kubernetes. Experience với Docker, message queues. Strong problem-solving skills. Telecom domain knowledge là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tầng 7, Tòa nhà VIT, Duy Tân, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 24000000, max: 48000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Junior QA Tester',
                companyName: 'Viettel Software',
                description: 'Test telecom applications, report bugs, create test cases. Learn QA methodologies và tools. Collaborate với development teams.',
                requirements: 'Mới ra trường hoặc dưới 1 năm QA experience. Attention to detail, organized mindset. Basic understanding của software testing. Tiếng Anh đọc hiểu. Willingness to learn new tools.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tầng 7, Tòa nhà VIT, Duy Tân, Cầu Giấy',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 7000000, max: 14000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Dưới 1 năm',
                deadline: new Date(Date.now() + 36 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'TMA Solutions',
            email: 'hr@tmasolutions.com',
            phone: '02839974789',
            website: 'https://tmasolutions.com',
            address: 'TMA Tower, Công viên phần mềm Quang Trung',
            city: 'Hồ Chí Minh',
            district: 'Quận 12',
            region: 'Miền Nam',
            description: 'TMA Solutions là công ty phần mềm lớn tại Việt Nam, cung cấp dịch vụ phát triển phần mềm offshore cho khách hàng quốc tế tại Mỹ, Châu Âu, Úc. Với 25+ năm kinh nghiệm, chúng tôi đã hoàn thành hơn 1000 dự án.',
            overview: 'Chuyên outsourcing phần mềm cho thị trường Mỹ, Châu Âu',
            industry: 'IT - Phần mềm',
            size: '1000+',
            foundedYear: 1997,
            isVerified: true
        },
        jobs: [
            {
                title: '.NET Developer (C# ASP.NET Core)',
                companyName: 'TMA Solutions',
                description: 'Phát triển web applications với .NET Core cho khách hàng Mỹ. Làm việc với Azure cloud services và modern architectures. Team size 5-10 người, scrum methodology.',
                requirements: 'Kinh nghiệm 2+ năm .NET/C#. Thành thạo ASP.NET Core, Entity Framework, SQL Server. Có kinh nghiệm Azure. Hiểu về microservices, RESTful APIs. Tiếng Anh đọc hiểu tốt technical documents.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'TMA Tower, Công viên phần mềm Quang Trung, Quận 12',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 15000000, max: 30000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'QA Automation Engineer (Selenium/Cypress)',
                companyName: 'TMA Solutions',
                description: 'Xây dựng và maintain automation test frameworks. Viết test cases và automate regression testing cho web applications. Review requirements và collaborate với developers.',
                requirements: 'Kinh nghiệm 1+ năm QA Automation. Thành thạo Selenium, Cypress, hoặc Playwright. Biết Java/JavaScript/Python. Có kinh nghiệm CI/CD integration. Hiểu testing best practices và Agile workflow.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'TMA Tower, Công viên phần mềm Quang Trung, Quận 12',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 12000000, max: 25000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Dưới 1 năm',
                deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Business Analyst (Healthcare Domain)',
                companyName: 'TMA Solutions',
                description: 'Phân tích requirements cho healthcare projects từ khách hàng Mỹ. Viết user stories, tạo mockups, communicate với stakeholders. Bridge giữa client và development team.',
                requirements: 'Kinh nghiệm 2+ năm Business Analysis. Có background về healthcare/medical domain là lợi thế lớn. Thành thạo requirements gathering, user stories, use cases. Biết tools như Jira, Confluence. Tiếng Anh communication tốt.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'TMA Tower, Công viên phần mềm Quang Trung, Quận 12',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 18000000, max: 35000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Ruby on Rails Developer (Remote)',
                companyName: 'TMA Solutions',
                description: 'Develop web applications với Ruby on Rails cho international clients. Work remote từ office hoặc home. Contribute to open-source projects.',
                requirements: 'Kinh nghiệm 2+ năm Rails development. Thành thạo Ruby, Rails framework. Familiar với Postgres, Redis. Understanding của RESTful APIs. Strong debugging skills. Remote experience là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'TMA Tower, Công viên phần mềm Quang Trung, Quận 12',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 20000000, max: 40000000, currency: 'VND' },
                jobType: 'remote',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Scrum Master',
                companyName: 'TMA Solutions',
                description: 'Facilitate agile ceremonies, remove blockers, coach teams. Support multiple teams working on different projects. Help teams improve processes.',
                requirements: 'Kinh nghiệm 1+ năm Scrum Master role hoặc agile coaching. CSM certification hoặc similar. Strong interpersonal skills, conflict resolution. Experience với Jira, Confluence. Knowledge của software development lifecycle.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'TMA Tower, Công viên phần mềm Quang Trung, Quận 12',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 16000000, max: 32000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 43 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Shopee Vietnam',
            email: 'careers@shopee.vn',
            phone: '02838272290',
            website: 'https://careers.shopee.vn',
            address: 'Tòa nhà Mapletree, 11-13 Đường Tân Trào',
            city: 'Hồ Chí Minh',
            district: 'Quận 7',
            region: 'Miền Nam',
            description: 'Shopee là nền tảng thương mại điện tử hàng đầu Đông Nam Á và Đài Loan, cung cấp trải nghiệm mua sắm trực tuyến tiện lợi, an toàn và nhanh chóng. Với hơn 300 triệu downloads, Shopee đang thay đổi cách người dùng mua sắm.',
            overview: 'Nền tảng thương mại điện tử số 1 Đông Nam Á',
            industry: 'IT - Phần mềm',
            size: '1000+',
            foundedYear: 2015,
            isVerified: true
        },
        jobs: [
            {
                title: 'Senior Backend Engineer (Golang)',
                companyName: 'Shopee Vietnam',
                description: 'Xây dựng high-performance backend services phục vụ hàng triệu transactions mỗi ngày. Làm việc với distributed systems, message queues, và caching strategies. Scale systems để handle traffic peaks như sale events.',
                requirements: 'Kinh nghiệm 3+ năm backend development với Golang. Thành thạo microservices architecture. Có kinh nghiệm với MySQL, Redis, Kafka. Hiểu về distributed systems, caching, load balancing. Experience với high-traffic systems là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Mapletree, 11-13 Đường Tân Trào, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 30000000, max: 60000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Data Analyst (E-commerce)',
                companyName: 'Shopee Vietnam',
                description: 'Phân tích dữ liệu user behavior, sales trends, và campaign performance. Build dashboards và reports cho business teams. Provide insights để optimize conversion và revenue.',
                requirements: 'Kinh nghiệm 1+ năm Data Analysis, ưu tiên e-commerce. Thành thạo SQL, Python (pandas, numpy). Có kinh nghiệm với BI tools (Tableau, PowerBI). Hiểu về A/B testing và statistics. Strong analytical và presentation skills.',
                industry: 'IT - Dữ liệu & AI',
                location: {
                    address: 'Tòa nhà Mapletree, 11-13 Đường Tân Trào, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 15000000, max: 30000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Dưới 1 năm',
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Frontend Engineer (React)',
                companyName: 'Shopee Vietnam',
                description: 'Phát triển và tối ưu Shopee web platform. Implement new features, improve performance, và enhance user experience. Collaborate với designers và backend engineers để deliver high-quality products.',
                requirements: 'Kinh nghiệm 2+ năm React development. Thành thạo JavaScript/TypeScript, HTML5, CSS3. Có kinh nghiệm với Redux, React Hooks. Hiểu về web performance optimization. Portfolio hoặc Github profile có projects là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Mapletree, 11-13 Đường Tân Trào, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 20000000, max: 40000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Seller Operations Manager',
                companyName: 'Shopee Vietnam',
                description: 'Manage seller operations, resolve issues, support seller success. Build relationships với top sellers. Implement policies để improve seller experience.',
                requirements: 'Kinh nghiệm 2+ năm e-commerce operations hoặc seller management. Strong communication skills, problem-solving. Data analysis capability. Vietnamese language fluency, English proficiency.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Mapletree, 11-13 Đường Tân Trào, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 16000000, max: 35000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 41 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Android Developer (Part-time)',
                companyName: 'Shopee Vietnam',
                description: 'Develop and maintain Shopee mobile app untuk Android. Implement new features, fix bugs. Part-time flexibility untuk passive income.',
                requirements: 'Kinh nghiệm 2+ năm Android development (Kotlin hoặc Java). Familiar với Android Architecture Components. Knowledge của mobile security, performance optimization. Can commit part-time hours.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Mapletree, 11-13 Đường Tân Trào, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 10000000, max: 22000000, currency: 'VND' },
                jobType: 'part-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 58 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Grab Vietnam',
            email: 'recruitment@grab.com',
            phone: '02431234560',
            website: 'https://grab.careers',
            address: 'Tòa nhà Vincom Center, Bà Triệu',
            city: 'Hà Nội',
            district: 'Hai Bà Trưng',
            region: 'Miền Bắc',
            description: 'Grab là nền tảng siêu ứng dụng hàng đầu Đông Nam Á, cung cấp dịch vụ gọi xe, giao đồ ăn, thanh toán và nhiều dịch vụ khác. Với 187 triệu người dùng, Grab đang thay đổi cuộc sống hàng triệu người.',
            overview: 'Siêu ứng dụng với 187 triệu người dùng',
            industry: 'IT - Phần mềm',
            size: '1000+',
            foundedYear: 2012,
            isVerified: true
        },
        jobs: [
            {
                title: 'Software Engineer (Backend - Microservices)',
                companyName: 'Grab Vietnam',
                description: 'Xây dựng và scale microservices cho Grab transport và food delivery. Xử lý millions of requests mỗi ngày với high availability và low latency.',
                requirements: 'Kinh nghiệm 2+ năm backend development. Thành thạo Go, Java, hoặc Node.js. Hiểu về microservices, message queues, caching. Có kinh nghiệm với cloud platforms (AWS/GCP). Strong problem-solving skills.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Vincom Center, Bà Triệu, Hai Bà Trưng',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 25000000, max: 50000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Data Engineer (Big Data)',
                companyName: 'Grab Vietnam',
                description: 'Build và maintain data pipelines xử lý petabytes of data. Work với Spark, Kafka, Airflow để support analytics và machine learning teams.',
                requirements: 'Kinh nghiệm 2+ năm Data Engineering. Thành thạo Python, SQL, Spark. Có kinh nghiệm với Kafka, Airflow, Hadoop ecosystem. Hiểu về data modeling và ETL processes.',
                industry: 'IT - Dữ liệu & AI',
                location: {
                    address: 'Tòa nhà Vincom Center, Bà Triệu, Hai Bà Trưng',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 28000000, max: 55000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'iOS Developer (Grab App)',
                companyName: 'Grab Vietnam',
                description: 'Develop Grab mobile app cho iOS. Implement features để improve user experience. Optimize app performance, maintain code quality.',
                requirements: 'Kinh nghiệm 2+ năm iOS development (Swift, Objective-C). Familiar với iOS frameworks, libraries. Understanding của mobile architecture patterns. Experience với Xcode, Git. Strong problem-solving.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Vincom Center, Bà Triệu, Hai Bà Trưng',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 24000000, max: 48000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 51 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Customer Support Specialist (Remote)',
                companyName: 'Grab Vietnam',
                description: 'Provide customer support via chat, email, phone. Troubleshoot issues, resolve complaints. Work remote with flexible schedule.',
                requirements: 'No experience required, training provided. Excellent communication skills. Patience, empathy, problem-solving mindset. Vietnamese language fluency. Can work flexible hours.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Vincom Center, Bà Triệu, Hai Bà Trưng',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 8000000, max: 16000000, currency: 'VND' },
                jobType: 'remote',
                experience: 'Không yêu cầu',
                deadline: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'MoMo',
            email: 'tuyendung@momo.vn',
            phone: '02836547890',
            website: 'https://momo.vn',
            address: 'Lầu 6, Tòa nhà Phú Mỹ Hưng Tower',
            city: 'Hồ Chí Minh',
            district: 'Quận 7',
            region: 'Miền Nam',
            description: 'MoMo là ví điện tử và nền tảng thanh toán số một tại Việt Nam với hơn 30 triệu người dùng. Chúng tôi đang dẫn đầu cuộc cách mạng thanh toán không tiền mặt tại Việt Nam.',
            overview: 'Ví điện tử số 1 Việt Nam',
            industry: 'Tài chính - Ngân hàng',
            size: '501-1000',
            foundedYear: 2007,
            isVerified: true
        },
        jobs: [
            {
                title: 'Senior Backend Engineer (Payment Systems)',
                companyName: 'MoMo',
                description: 'Phát triển core payment processing systems với yêu cầu cao về security và reliability. Handle millions of transactions mỗi ngày với 99.99% uptime.',
                requirements: 'Kinh nghiệm 3+ năm backend development, ưu tiên fintech/payment. Thành thạo Java/Go và microservices. Hiểu về transaction processing, idempotency, distributed transactions. Strong security mindset.',
                industry: 'Tài chính - Ngân hàng',
                location: {
                    address: 'Lầu 6, Tòa nhà Phú Mỹ Hưng Tower, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 35000000, max: 70000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Security Engineer (Application Security)',
                companyName: 'MoMo',
                description: 'Đảm bảo security cho ứng dụng và APIs của MoMo. Conduct security assessments, penetration testing, và implement security best practices.',
                requirements: 'Kinh nghiệm 2+ năm Application Security. Có certifications (OSCP, CEH). Thành thạo security testing tools và methodologies. Hiểu về OWASP, secure coding practices. Experience với fintech security là lợi thế lớn.',
                industry: 'Tài chính - Ngân hàng',
                location: {
                    address: 'Lầu 6, Tòa nhà Phú Mỹ Hưng Tower, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 30000000, max: 60000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Product Manager (Financial Products)',
                companyName: 'MoMo',
                description: 'Quản lý product roadmap cho các sản phẩm tài chính như vay, tiết kiệm, bảo hiểm. Work với stakeholders để launch features phục vụ millions of users.',
                requirements: 'Kinh nghiệm 2+ năm Product Management trong fintech. Hiểu về financial products và regulations. Strong analytical và communication skills. MBA hoặc finance background là lợi thế.',
                industry: 'Tài chính - Ngân hàng',
                location: {
                    address: 'Lầu 6, Tòa nhà Phú Mỹ Hưng Tower, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 35000000, max: 70000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Compliance Officer (Fintech)',
                companyName: 'MoMo',
                description: 'Ensure compliance với financial regulations. Monitor transactions, detect fraud, implement compliance policies. Work với legal team.',
                requirements: 'Kinh nghiệm 2+ năm compliance hoặc financial audit. Knowledge của Vietnamese financial regulations, AML/KYC. Strong analytical skills, attention to detail. Legal background là lợi thế.',
                industry: 'Tài chính - Ngân hàng',
                location: {
                    address: 'Lầu 6, Tòa nhà Phú Mỹ Hưng Tower, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 22000000, max: 48000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 39 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'UX Researcher',
                companyName: 'MoMo',
                description: 'Conduct user research, usability testing, gather insights. Create user personas, journey maps. Influence product direction with research findings.',
                requirements: 'Kinh nghiệm 1+ năm UX research hoặc user research. Familiar với research methodologies, tools (Figma, UserTesting). Strong presentation skills, data analysis. Fintech knowledge là lợi thế.',
                industry: 'Tài chính - Ngân hàng',
                location: {
                    address: 'Lầu 6, Tòa nhà Phú Mỹ Hưng Tower, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 18000000, max: 38000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000)
            }
        ]
    }
];

// ============================================
// ADDITIONAL USERS DATA (10 new employers)
// ============================================
const additionalUsersData = [
    {
        name: 'HR Techcombank',
        email: 'hr.techcombank@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Sapo',
        email: 'hr.sapo@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Zalo Marketing',
        email: 'hr.zalomarketing@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Sendo',
        email: 'hr.sendo@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR TopDev',
        email: 'hr.topdev@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Agora',
        email: 'hr.agora@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Dcard',
        email: 'hr.dcard@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Sun Asterisk',
        email: 'hr.sunasterisk@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR Viet A Bank',
        email: 'hr.vietabank@test.com',
        password: 'Test123',
        role: 'employer'
    },
    {
        name: 'HR CloudKitchens',
        email: 'hr.cloudkitchens@test.com',
        password: 'Test123',
        role: 'employer'
    }
];

// ============================================
// ADDITIONAL COMPANIES & JOBS DATA (10 new companies with 2 jobs each)
// ============================================
const additionalCompaniesWithJobs = [
    {
        company: {
            name: 'Techcombank',
            email: 'hr@techcombank.com.vn',
            phone: '02835554444',
            website: 'https://techcombank.com.vn',
            address: '191 Đường Báo Chí, Phường Võ Thị Sáu',
            city: 'Hồ Chí Minh',
            district: 'Quận 1',
            region: 'Miền Nam',
            description: 'Techcombank là ngân hàng hàng đầu Việt Nam, tiên phong trong ứng dụng công nghệ số. Với hơn 2 triệu khách hàng, chúng tôi cung cấp các dịch vụ ngân hàng hiện đại, an toàn và tiện lợi.',
            overview: 'Ngân hàng số hàng đầu Việt Nam',
            industry: 'Tài chính - Ngân hàng',
            size: '501-1000',
            foundedYear: 2006,
            isVerified: true
        },
        jobs: [
            {
                title: 'Senior Java Developer (Banking Core Systems)',
                companyName: 'Techcombank',
                description: 'Phát triển core banking systems với Java Spring Boot. Làm việc với large-scale transactions và high-reliability requirements. Collaborate với teams khác để ensure system stability.',
                requirements: 'Kinh nghiệm 3+ năm Java development cho banking/fintech. Thành thạo Spring Boot, Hibernate, Oracle/PostgreSQL. Hiểu về ACID transactions, security protocols. Knowledge về PCI DSS compliance là lợi thế.',
                industry: 'Tài chính - Ngân hàng',
                location: {
                    address: '191 Đường Báo Chí, Phường Võ Thị Sáu, Quận 1',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 28000000, max: 55000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Credit Risk Analyst',
                companyName: 'Techcombank',
                description: 'Phân tích credit risk cho personal loans, SME loans. Xây dựng credit scoring models. Present risk analysis đến management team.',
                requirements: 'Kinh nghiệm 2+ năm credit analysis hoặc risk management. Thành thạo Excel, SQL. Có kiến thức về statistical analysis hoặc machine learning. Degree trong Finance/Economics/Statistics.',
                industry: 'Tài chính - Ngân hàng',
                location: {
                    address: '191 Đường Báo Chí, Phường Võ Thị Sáu, Quận 1',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 16000000, max: 32000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Sapo',
            email: 'careers@sapo.vn',
            phone: '02437777777',
            website: 'https://sapo.vn',
            address: 'Tòa nhà Sapo, Đường Thái Hà',
            city: 'Hà Nội',
            district: 'Đống Đa',
            region: 'Miền Bắc',
            description: 'Sapo là nền tảng quản lý bán hàng #1 Việt Nam cho SMEs và retailers. Với hơn 300,000 users, Sapo đang giúp các tiểu thương số hóa kinh doanh.',
            overview: 'Nền tảng quản lý bán hàng số 1 Việt Nam',
            industry: 'IT - Phần mềm',
            size: '201-500',
            foundedYear: 2011,
            isVerified: true
        },
        jobs: [
            {
                title: 'Full Stack Developer (Vue.js + Node.js)',
                companyName: 'Sapo',
                description: 'Phát triển features cho Sapo POS và online store platform. Build user-friendly interfaces và robust APIs. Collaborate với product teams để optimize UX.',
                requirements: 'Kinh nghiệm 2+ năm full stack development. Thành thạo Vue.js, Node.js, Express. Có kinh nghiệm MongoDB, MySQL. Understanding của e-commerce workflows là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Sapo, Đường Thái Hà, Đống Đa',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 18000000, max: 38000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Marketing Executive (SaaS)',
                companyName: 'Sapo',
                description: 'Execute marketing campaigns để acquire SME customers. Manage content, email marketing, partnerships. Analyze metrics và optimize conversion.',
                requirements: 'Kinh nghiệm 1+ năm SaaS marketing hoặc B2B marketing. Strong data analysis skills. Knowledge của SME market Việt Nam là lợi thế. Excellent communication skills.',
                industry: 'Marketing',
                location: {
                    address: 'Tòa nhà Sapo, Đường Thái Hà, Đống Đa',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 12000000, max: 28000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Dưới 1 năm',
                deadline: new Date(Date.now() + 39 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Zalo Marketing Solutions',
            email: 'recruitment@zalomkt.vn',
            phone: '02838888888',
            website: 'https://zalomkt.vn',
            address: 'Tòa nhà VNG, Đường số 13, Tân Thuận Đông',
            city: 'Hồ Chí Minh',
            district: 'Quận 7',
            region: 'Miền Nam',
            description: 'Zalo Marketing Solutions cung cấp công cụ marketing tích hợp cho businesses trên Zalo. Giúp doanh nghiệp tối ưu hóa customer engagement và ROI.',
            overview: 'Platform marketing trên Zalo hàng đầu',
            industry: 'Marketing',
            size: '51-200',
            foundedYear: 2018,
            isVerified: false
        },
        jobs: [
            {
                title: 'Growth Hacker',
                companyName: 'Zalo Marketing Solutions',
                description: 'Drive user acquisition và engagement cho Zalo Marketing platform. Experiment với various growth channels. Build dashboards để track KPIs.',
                requirements: 'Kinh nghiệp 1+ năm growth hacking hoặc marketing. Strong analytical skills, proficiency với data analytics. Knowledge của Zalo ecosystem là lợi thế. Entrepreneurial mindset.',
                industry: 'Marketing',
                location: {
                    address: 'Tòa nhà VNG, Đường số 13, Tân Thuận Đông, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 14000000, max: 30000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Dưới 1 năm',
                deadline: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Python Backend Developer',
                companyName: 'Zalo Marketing Solutions',
                description: 'Build backend APIs cho Zalo Marketing platform. Integrate với Zalo APIs. Optimize database queries for performance.',
                requirements: 'Kinh nghiệm 2+ năm Python backend development. Thành thạo Django/FastAPI, PostgreSQL. Understanding của REST APIs, microservices. Experience với Zalo API là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà VNG, Đường số 13, Tân Thuận Đông, Quận 7',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 16000000, max: 35000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Sendo',
            email: 'recruitment@sendo.vn',
            phone: '02832123456',
            website: 'https://sendo.vn',
            address: 'Tòa nhà Sendo, Phố Thái Hà',
            city: 'Hà Nội',
            district: 'Đống Đa',
            region: 'Miền Bắc',
            description: 'Sendo là sàn thương mại điện tử hàng đầu Việt Nam, kết nối hàng triệu người mua và bán. Chúng tôi cung cấp nền tảng tiện lợi, an toàn và công bằng cho tất cả.',
            overview: 'Sàn TMĐT hàng đầu Việt Nam',
            industry: 'IT - Phần mềm',
            size: '501-1000',
            foundedYear: 2012,
            isVerified: true
        },
        jobs: [
            {
                title: 'Senior Golang Engineer (Microservices)',
                companyName: 'Sendo',
                description: 'Xây dựng microservices cho Sendo marketplace platform. Design và implement scalable systems. Work với AWS infrastructure.',
                requirements: 'Kinh nghiệm 3+ năm Golang development. Strong knowledge về microservices, Docker, Kubernetes. Experience với AWS services. Understanding của distributed systems.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Sendo, Phố Thái Hà, Đống Đa',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 32000000, max: 65000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'UX/UI Designer',
                companyName: 'Sendo',
                description: 'Design user interfaces cho Sendo web at mobile app. Conduct user research. Create wireframes và high-fidelity prototypes.',
                requirements: 'Kinh nghiệm 2+ năm UX/UI design, ưu tiên e-commerce. Proficiency với Figma hoặc Sketch. Portfolio with strong design work. Understanding của web và mobile platforms.',
                industry: 'Thiết kế',
                location: {
                    address: 'Tòa nhà Sendo, Phố Thái Hà, Đống Đa',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 14000000, max: 32000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'TopDev',
            email: 'careers@topdev.com.vn',
            phone: '02439999999',
            website: 'https://topdev.vn',
            address: 'Tòa nhà TopDev, Đường Bà Triệu',
            city: 'Hà Nội',
            district: 'Hai Bà Trưng',
            region: 'Miền Bắc',
            description: 'TopDev là nền tảng kết nối talent công nghệ với các công ty tech hàng đầu. Chúng tôi tìm kiếm các top developers cho các dự án innovation.',
            overview: 'Nền tảng recruitment cho developers',
            industry: 'Kinh doanh / Bán hàng',
            size: '51-200',
            foundedYear: 2016,
            isVerified: true
        },
        jobs: [
            {
                title: 'Talent Acquisition Manager (Tech)',
                companyName: 'TopDev',
                description: 'Recruit top developers từ cộng đồng. Build relationships với candidates. Manage recruitment pipeline và negotiations.',
                requirements: 'Kinh nghiệm 2+ năm tech recruitment hoặc talent acquisition. Deep understanding về tech industry at developer market. Excellent communication skills.',
                industry: 'Nhân sự',
                location: {
                    address: 'Tòa nhà TopDev, Đường Bà Triệu, Hai Bà Trưng',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 15000000, max: 35000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 36 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Content Marketing Manager',
                companyName: 'TopDev',
                description: 'Create technical content để attract developers. Manage blog, social media, newsletters. Optimize SEO for tech keywords.',
                requirements: 'Kinh nghiệm 2+ năm technical content marketing. Strong writing skills, especially về technology. Understanding về developer community. SEO knowledge.',
                industry: 'Sáng tạo nội dung',
                location: {
                    address: 'Tòa nhà TopDev, Đường Bà Triệu, Hai Bà Trưng',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 13000000, max: 28000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 43 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Agora Studios',
            email: 'hr@agorastudios.com.vn',
            phone: '02837654321',
            website: 'https://agorastudios.vn',
            address: 'Studio Agora, Hẻm 368 Bis Nguyễn Hữu Cảnh',
            city: 'Hồ Chí Minh',
            district: 'Bình Thạnh',
            region: 'Miền Nam',
            description: 'Agora Studios là studio game development chuyên tạo ra các tựa game mobile casual. Với đội ngũ 50+ developers, chúng tôi đã phát hành hơn 15 games thành công.',
            overview: 'Game development studio hàng đầu Việt Nam',
            industry: 'IT - Phần mềm',
            size: '51-200',
            foundedYear: 2015,
            isVerified: false
        },
        jobs: [
            {
                title: 'Unity Game Developer',
                companyName: 'Agora Studios',
                description: 'Develop casual mobile games với Unity. Implement game mechanics, UI, animations. Optimize performance cho mobile devices.',
                requirements: 'Kinh nghiệm 2+ năm game development với Unity. Strong C# programming skills. Knowledge về game optimization. Portfolio with published games.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Studio Agora, Hẻm 368 Bis Nguyễn Hữu Cảnh, Bình Thạnh',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 16000000, max: 36000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
            },
            {
                title: '2D Artist / Animator',
                companyName: 'Agora Studios',
                description: 'Create 2D assets, characters, animations cho mobile games. Work with game designers. Maintain art style consistency across projects.',
                requirements: 'Kinh nghiệm 1+ năm 2D art/animation. Proficiency với Photoshop, Aseprite, hoặc tương tự. Understanding về animation principles. Portfolio with game assets.',
                industry: 'Thiết kế',
                location: {
                    address: 'Studio Agora, Hẻm 368 Bis Nguyễn Hữu Cảnh, Bình Thạnh',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 12000000, max: 28000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Dưới 1 năm',
                deadline: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Dcard',
            email: 'recruitment@dcard.tw',
            phone: '02841111111',
            website: 'https://dcard.vn',
            address: 'Tòa nhà Dcard Vietnam, Đường Nguyễn Hữu Cảnh',
            city: 'Hồ Chí Minh',
            district: 'Bình Thạnh',
            region: 'Miền Nam',
            description: 'Dcard là nền tảng social networking lớn nhất Đông Nam Á, nơi hàng triệu người chia sẻ và kết nối. Chúng tôi xây dựng hệ sinh thái digital communities.',
            overview: 'Nền tảng social networking số 1 Đông Nam Á',
            industry: 'IT - Phần mềm',
            size: '201-500',
            foundedYear: 2011,
            isVerified: true
        },
        jobs: [
            {
                title: 'Senior Backend Engineer (Python/Go)',
                companyName: 'Dcard',
                description: 'Build scalable APIs cho Dcard platform. Optimize database queries. Implement caching strategies for millions of users.',
                requirements: 'Kinh nghiệm 3+ năm backend development, Python hoặc Go. Deep understanding về system design. Experience với MySQL, Redis, message queues. Strong problem-solving abilities.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Dcard Vietnam, Đường Nguyễn Hữu Cảnh, Bình Thạnh',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 33000000, max: 70000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Frontend Engineer (React/TypeScript)',
                companyName: 'Dcard',
                description: 'Develop Dcard web platform features. Improve UI/UX. Collaborate with product teams for better user experience.',
                requirements: 'Kinh nghiệm 2+ năm React/TypeScript development. Strong CSS/HTML skills. Experience với state management. Portfolio with quality projects.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Dcard Vietnam, Đường Nguyễn Hữu Cảnh, Bình Thạnh',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 18000000, max: 42000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 46 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Sun Asterisk Vietnam',
            email: 'recruitment@sun-asterisk.com.vn',
            phone: '02843333333',
            website: 'https://sun-asterisk.vn',
            address: 'Tòa nhà Sun Asterisk, Đường Cao Thắng',
            city: 'Hà Nội',
            district: 'Đống Đa',
            region: 'Miền Bắc',
            description: 'Sun Asterisk là công ty công nghệ Nhật Bản với chi nhánh tại Việt Nam, chuyên phát triển phần mềm cho thị trường Nhật Bản. Chúng tôi tìm kiếm top developers.',
            overview: 'Công ty công nghệ Nhật Bản với chi nhánh tại Việt Nam',
            industry: 'IT - Phần mềm',
            size: '51-200',
            foundedYear: 2015,
            isVerified: true
        },
        jobs: [
            {
                title: 'Ruby on Rails Developer',
                companyName: 'Sun Asterisk Vietnam',
                description: 'Develop web applications với Ruby on Rails cho khách hàng Nhật Bản. Work in Japanese development standards. Collaborate with Japanese teams.',
                requirements: 'Kinh nghiệm 2+ năm Ruby on Rails development. Strong understanding về MVC patterns. Experience với PostgreSQL, Redis. Japanese language level N3+ là lợi thế lớn.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Sun Asterisk, Đường Cao Thắng, Đống Đa',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 17000000, max: 40000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'QA Engineer (Manual & Automation)',
                companyName: 'Sun Asterisk Vietnam',
                description: 'Perform manual testing và automation testing cho web applications. Write test cases based on requirements. Report bugs and create documentation.',
                requirements: 'Kinh nghiệm 1+ năm QA testing. Knowledge về automation testing tools (Selenium hoặc tương tự). Understanding về software testing best practices. Japanese communication skills là lợi thế.',
                industry: 'IT - Phần mềm',
                location: {
                    address: 'Tòa nhà Sun Asterisk, Đường Cao Thắng, Đống Đa',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 13000000, max: 30000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Dưới 1 năm',
                deadline: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'Viet A Bank',
            email: 'hr@vietabank.com.vn',
            phone: '02835555555',
            website: 'https://vietabank.com.vn',
            address: '89 Đường Trần Hưng Đạo',
            city: 'Hà Nội',
            district: 'Hoàn Kiếm',
            region: 'Miền Bắc',
            description: 'Viet A Bank là ngân hàng thương mại cổ phần Việt Nam, cung cấp dịch vụ ngân hàng toàn diện cho cá nhân và doanh nghiệp.',
            overview: 'Ngân hàng thương mại hàng đầu',
            industry: 'Tài chính - Ngân hàng',
            size: '201-500',
            foundedYear: 2003,
            isVerified: true
        },
        jobs: [
            {
                title: 'IT System Administrator',
                companyName: 'Viet A Bank',
                description: 'Manage và maintain banking IT infrastructure, đảm bảo system availability at security. Provide support cho users, troubleshoot issues. Implement backup strategies và disaster recovery plans. Monitor system performance.',
                requirements: 'Kinh nghiệm 2+ năm system administration. Knowledge về Windows Server, Linux. Understanding về network infrastructure. IT security awareness. Experience với banking systems.',
                industry: 'IT - Phần cứng & Mạng',
                location: {
                    address: '89 Đường Trần Hưng Đạo, Hoàn Kiếm',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 14000000, max: 30000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 41 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Financial Controller',
                companyName: 'Viet A Bank',
                description: 'Oversee financial operations at các department. Prepare comprehensive financial reports and analysis. Manage compliance với banking regulations at accounting standards. Review budgets at expenditures. Collaborate with audit teams.',
                requirements: 'Kinh nghiệm 3+ năm accounting hoặc financial management. Strong knowledge về banking operations at regulations. CPA hoặc equivalent certification. Vietnamese accounting standards knowledge. Leadership experience.',
                industry: 'Kế toán - Kiểm toán',
                location: {
                    address: '89 Đường Trần Hưng Đạo, Hoàn Kiếm',
                    city: 'Hà Nội',
                    region: 'Miền Bắc'
                },
                salary: { min: 25000000, max: 50000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 51 * 24 * 60 * 60 * 1000)
            }
        ]
    },
    {
        company: {
            name: 'CloudKitchens Vietnam',
            email: 'careers@cloudkitchens.vn',
            phone: '02846666666',
            website: 'https://cloudkitchens.com',
            address: '456 Đường Cộng Hòa, Tân Bình',
            city: 'Hồ Chí Minh',
            district: 'Tân Bình',
            region: 'Miền Nam',
            description: 'CloudKitchens là nền tảng giao thức ăn hàng đầu do Uber Eats xây dựng, kết nối với hàng ngàn nhà hàng. Chúng tôi revolutionizing delivery industry.',
            overview: 'Nền tảng giao thức ăn của Uber Eats',
            industry: 'IT - Phần mềm',
            size: '201-500',
            foundedYear: 2017,
            isVerified: true
        },
        jobs: [
            {
                title: 'Senior Full Stack Engineer (Delivery Logistics)',
                companyName: 'CloudKitchens Vietnam',
                description: 'Build comprehensive systems để optimize delivery logistics, routing algorithms, at real-time order tracking. Implement AI-based recommendations. Manage database performance at scaling. Work with machine learning team.',
                requirements: 'Kinh nghiệm 3+ năm full stack development. Strong backend knowledge (Node.js hoặc Python). Experience với geolocation APIs at mapping services. Understanding về logistics systems at optimization algorithms. AWS experience.',
                industry: 'IT - Phần mềm',
                location: {
                    address: '456 Đường Cộng Hòa, Tân Bình, Tân Bình',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 30000000, max: 60000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 3-5 năm',
                deadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Operations Manager',
                companyName: 'CloudKitchens Vietnam',
                description: 'Manage delivery operations at resource allocation. Communicate với restaurant partners về performance metrics at improvements. Handle escalations từ customer service. Optimize delivery times at reduce costs.',
                requirements: 'Kinh nghiệm 2+ năm operations management, ưu tiên logistics hoặc delivery sector. Strong organizational skills at attention to detail. Experience với operational metrics at KPI tracking. Leadership abilities at team management skills.',
                industry: 'Quản lý',
                location: {
                    address: '456 Đường Cộng Hòa, Tân Bình, Tân Bình',
                    city: 'Hồ Chí Minh',
                    region: 'Miền Nam'
                },
                salary: { min: 16000000, max: 36000000, currency: 'VND' },
                jobType: 'full-time',
                experience: 'Từ 1-2 năm',
                deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
            }
        ]
    }
];

// ============================================
// MAIN SEED FUNCTION
// ============================================
const seedDatabase = async () => {
    try {
        console.log('Bắt đầu seed database...\n');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Đã kết nối MongoDB\n');

        // NOTE: Không xóa dữ liệu cũ - thêm dữ liệu mới
        console.log('Thêm dữ liệu mới (không xóa dữ liệu cũ)...\n');

        // ============================================
        // STEP 1: Create Additional Users (10 new employers)
        // ============================================
        console.log('Đang tạo/kiểm tra users mới...');
        
        // Create new users, bỏ qua nếu đã tồn tại
        const newUsers = [];
        for (const userData of additionalUsersData) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: userData.email });
                if (existingUser) {
                    console.log(`User ${userData.email} đã tồn tại, bỏ qua`);
                    newUsers.push(existingUser);
                } else {
                    const user = await User.create(userData);
                    newUsers.push(user);
                    console.log(`Tạo user mới: ${userData.email}`);
                }
            } catch (error) {
                if (error.code === 11000) {
                    // Duplicate key error, try to find existing user
                    const existingUser = await User.findOne({ email: userData.email });
                    if (existingUser) {
                        newUsers.push(existingUser);
                        console.log(`User ${userData.email} đã tồn tại, sử dụng user cũ`);
                    }
                } else {
                    throw error;
                }
            }
        }
        console.log(`Đã xử lý ${newUsers.length} users\n`);

        // Map new users by email for easy lookup
        const newUserMap = {};
        newUsers.forEach(user => {
            newUserMap[user.email] = user;
        });

        // ============================================
        // STEP 2: Create Additional Companies & Jobs
        // ============================================
        let totalNewCompanies = 0;
        let totalNewJobs = 0;

        for (let i = 0; i < additionalCompaniesWithJobs.length; i++) {
            const item = additionalCompaniesWithJobs[i];
            
            // Get corresponding employer user
            const employerEmail = additionalUsersData[i].email;
            const employer = newUserMap[employerEmail];

            if (!employer) {
                console.log(`Không tìm thấy user cho ${item.company.name}`);
                continue;
            }

            console.log(`Đang tạo công ty: ${item.company.name}...`);

            // Create company
            const company = await Company.create({
                ...item.company,
                createdBy: employer._id,
                owner: employer._id
            });

            totalNewCompanies++;
            console.log(`Đã tạo công ty ${company.name}`);

            // Create jobs for this company
            console.log(`Đang tạo ${item.jobs.length} jobs cho ${company.name}...`);
            
            const jobsWithCompany = item.jobs.map(job => ({
                ...job,
                createdBy: employer._id
            }));

            const createdJobs = await Job.insertMany(jobsWithCompany);
            totalNewJobs += createdJobs.length;
            
            console.log(`Đã tạo ${createdJobs.length} jobs\n`);

            // Update company totalJobs
            company.totalJobs = createdJobs.length;
            await company.save();
        }

        // ============================================
        // SUMMARY
        // ============================================
        console.log('\n' + '='.repeat(50));
        console.log('HOÀN THÀNH THÊMM DỮ LIỆU');
        console.log('='.repeat(50));
        console.log(`Users Mới Tạo: ${newUsers.length}`);
        console.log(`   - Employers: ${newUsers.filter(u => u.role === 'employer').length}`);
        console.log(`Companies Mới: ${totalNewCompanies}`);
        console.log(`Jobs Mới: ${totalNewJobs}`);
        console.log('='.repeat(50));
        console.log('\nTHÔNG TIN ĐĂNG NHẬP (Employers Mới):');
        additionalUsersData.forEach(u => {
            console.log(`   - ${u.email} / Test123`);
        });
        console.log('\nThêm dữ liệu hoàn tất! Bạn có thể đăng nhập với các tài khoản trên.\n');

        // Close connection
        await mongoose.connection.close();
        console.log('Đã đóng kết nối MongoDB');
        
        process.exit(0);
    } catch (error) {
        console.error('\nLỖI:', error.message);
        console.error(error);
        process.exit(1);
    }
};

// Run seed
seedDatabase();