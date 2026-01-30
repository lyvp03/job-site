import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testAdmin = async () => {
    try {
        console.log('🔍 Kiểm tra tài khoản admin...\n');
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Kết nối MongoDB thành công\n');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@test.com' });
        
        if (!admin) {
            console.log('❌ KHÔNG TÌM THẤY TÀI KHOẢN ADMIN!');
            console.log('   Hãy chạy: node seedData.js\n');
        } else {
            console.log('✅ TÌM THẤY TÀI KHOẢN ADMIN:');
            console.log('   Name:', admin.name);
            console.log('   Email:', admin.email);
            console.log('   Role:', admin.role);
            console.log('   isActive:', admin.isActive);
            console.log('   Password Hash:', admin.password.substring(0, 20) + '...\n');
            
            // Test password matching
            console.log('🔐 TEST MATCH PASSWORD:');
            const isMatch = await admin.matchPassword('Admin123');
            console.log('   Password "Admin123" match:', isMatch ? '✅ YES' : '❌ NO\n');
            
            if (!isMatch) {
                console.log('⚠️  PROBLEM: Mật khẩu không match!');
                console.log('   Hãy kiểm tra lại seedData.js');
            }
        }

        // List all users
        console.log('📋 DANH SÁCH TẤT CẢ USERS:');
        const allUsers = await User.find({}).select('name email role');
        allUsers.forEach(u => {
            console.log(`   - ${u.email} (${u.role})`);
        });

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ LỖI:', error.message);
        process.exit(1);
    }
};

testAdmin();
