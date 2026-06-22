import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Give webhook time to process, then redirect to orders
    setTimeout(() => navigate('/cart'), 3000);
  }, []);

  return (
    <div className="text-center py-5">
      <h4 style={{ color: '#1D9E75' }}>GCash payment successful!</h4>
      <p className="text-muted">Redirecting to your orders...</p>
    </div>
  );
}