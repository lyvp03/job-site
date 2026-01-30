import React from 'react';
import Header from '../components/layout/Header';

const TestHeader= () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />
      
      {/* Content để test */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Header Test Page
          </h1>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Header đã hiển thị trên cùng
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Color Check */}
              <div className="p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Màu nền</h3>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: '#1D212B' }}
                  ></div>
                  <code className="text-sm">#1D212B</code>
                </div>
              </div>
              
              {/* Logo Check */}
              <div className="p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Logo Gradient</h3>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#574AE2] via-[#AB81CD] to-[#E2ADF2] rounded-xl"></div>
                </div>
              </div>
              
              {/* Text Color Check */}
              <div className="p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Màu chữ</h3>
                <div className="space-y-2">
                  <div className="text-white bg-gray-800 px-3 py-1 rounded">White Text</div>
                  <div className="text-gray-300 bg-gray-800 px-3 py-1 rounded">Gray-300 Text</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Test Responsive */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Test Responsive
            </h3>
            <p className="text-gray-600 mb-4">
              Thay đổi kích thước cửa sổ để xem header trên mobile/desktop
            </p>
            <div className="flex justify-center space-x-4">
            
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestHeader;