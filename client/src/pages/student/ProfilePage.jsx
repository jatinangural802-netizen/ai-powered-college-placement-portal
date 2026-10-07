import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { studentService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { FIELD_LABELS } from '../../utils/helpers';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [skillsInput, setSkillsInput] = useState('');
  const toast = useToast();
  const { loadUser } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    studentService.getProfile().then(({ data }) => {
      setProfileData(data.data);
      reset({
        fullName: data.data.user.fullName,
        phone: data.data.profile?.phone || '',
        course: data.data.profile?.course || 'B.Tech',
        cgpa: data.data.profile?.cgpa || '',
        githubUrl: data.data.profile?.githubUrl || '',
        linkedinUrl: data.data.profile?.linkedinUrl || '',
        portfolioUrl: data.data.profile?.portfolioUrl || '',
        department: data.data.user.department,
        graduationYear: data.data.user.graduationYear,
      });
      setSkillsInput((data.data.profile?.skills || []).join(', '));
    }).finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (formData) => {
    setSaving(true);
    try {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      await studentService.updateProfile({ ...formData, skills, cgpa: parseFloat(formData.cgpa) || undefined });
      toast.success('Profile updated!');
      await loadUser();
      const { data } = await studentService.getProfile();
      setProfileData(data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        {profileData?.profile && (
          <div className="mt-4 card p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-primary-600">{profileData.profile.profileCompletion}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${profileData.profile.profileCompletion}%` }} />
            </div>
            {profileData.profile.missingFields?.length > 0 && (
              <p className="text-xs text-slate-500 mt-2">Missing: {profileData.profile.missingFields.map((f) => FIELD_LABELS[f] || f).join(', ')}</p>
            )}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Full Name" {...register('fullName')} />
          <Input label="Phone" {...register('phone')} />
          <Input label="Department" {...register('department')} />
          <Input label="Course" {...register('course')} />
          <Input label="CGPA" type="number" step="0.01" min="0" max="10" {...register('cgpa')} />
          <Input label="Graduation Year" type="number" {...register('graduationYear')} />
        </div>
        <div>
          <label className="label">Skills (comma separated)</label>
          <input className="input" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Java, React, Node.js, SQL" />
        </div>
        <Input label="GitHub URL" {...register('githubUrl')} />
        <Input label="LinkedIn URL" {...register('linkedinUrl')} />
        <Input label="Portfolio URL" {...register('portfolioUrl')} />
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button>
      </form>
    </div>
  );
}
