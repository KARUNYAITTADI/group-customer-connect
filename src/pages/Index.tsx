
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// This is just a redirect page since we'll default to the customers page
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/customers');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting to Customer Management...</h1>
      </div>
    </div>
  );
};

export default Index;
