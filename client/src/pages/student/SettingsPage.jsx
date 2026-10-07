import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../../services';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function SettingsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword(data);
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Current Password" type="password" {...register('currentPassword', { required: true })} />
          <Input label="New Password" type="password" {...register('newPassword', { required: true, minLength: 6 })} />
          <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
        </form>
      </div>
    </div>
  );
}
