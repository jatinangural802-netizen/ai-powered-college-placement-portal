import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  studentId: z.string().min(1, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  graduationYear: z.coerce.number().min(2020).max(2035),
});

const departments = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EEE', 'Other'];

export default function RegisterPage() {
  const { register: reg } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: { graduationYear: 2026 },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await reg(data);
      toast.success('Registration successful!');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold">CB</span>
            </div>
            <span className="font-bold text-xl">CareerBridge</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Student Registration</h1>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
            <Input label="Student ID" {...register('studentId')} error={errors.studentId?.message} />
            <Select label="Department" {...register('department')} error={errors.department?.message}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Input label="Graduation Year" type="number" {...register('graduationYear')} error={errors.graduationYear?.message} />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
