import React from 'react';
import Button from '../common/Button'
import { Link , useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#1C2238] py-2 px-10  flex">

      <div className="flex items-center">
        {/* logo and slogan*/}
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                  <img 
                  src="/image/logo.png" 
                  alt="5Jobs - Job Matching 5.0" 
                  className="h-20 w-auto"
                />
        <img
                  src="/image/slogan.png"
                  alt=""
                  className="h-10 w-auto"
                />
        </Link>
      </div>

      <div className="flex items-center gap-3 ml-auto ">
          <Button 
            as="a" 
            href="/auth/login"
            variant="primary"
            className="px-3 py-3"
            onClick={() => navigate('/auth/login')}
          >
            Đăng nhập
          </Button>
          
          <Button 
            as="a" 
            href="/auth/register"
            variant="outline"
            className="px-3 py-3 border-2 border-blue-600 text-blue-600"
            onClick={() => navigate('/auth/register')}
          >
            Đăng ký
          </Button>
          
        </div>

      
    </div>
  );
};

export default Header;