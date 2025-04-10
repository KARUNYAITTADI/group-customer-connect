
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// This is a redirect page that will default to the dashboard page
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting to Dashboard...</h1>
      </div>
    </div>
  );
};

export default Index;
