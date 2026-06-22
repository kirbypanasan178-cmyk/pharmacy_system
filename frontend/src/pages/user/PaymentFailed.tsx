import { useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
  const navigate = useNavigate();
  return (
    <div className="text-center py-5">
      <h4 className="text-danger">Payment failed</h4>
      <p className="text-muted">Something went wrong with your GCash payment.</p>
      <button className="btn" style={{ background: '#1D9E75', color: '#fff' }}
        onClick={() => navigate('/cart')}>
        Back to cart
      </button>
    </div>
  );
}