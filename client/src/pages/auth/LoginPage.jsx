import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('role') === 'admin';
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success('Login successful!');
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold">CB</span>
            </div>
            <span className="font-bold text-xl">CareerBridge</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{isAdmin ? 'Admin Login' : 'Student Login'}</h1>
          <p className="text-sm text-slate-500 mt-2">Sign in to your account</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message}
              placeholder={isAdmin ? 'admin@example.com' : 'student@example.com'} />
            <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          {!isAdmin && (
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account? <Link to="/register" className="text-primary-600 font-medium">Register</Link>
            </p>
          )}
          <p className="text-center text-sm text-slate-500 mt-3">
            {isAdmin ? <Link to="/login" className="text-primary-600">Student Login</Link> :
              <Link to="/login?role=admin" className="text-primary-600">Admin Login</Link>}
          </p>
        </div>
      </div>
    </div>
  );
}
