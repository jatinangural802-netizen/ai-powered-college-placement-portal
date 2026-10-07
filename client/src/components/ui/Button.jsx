import { cn } from '../../utils/cn';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn text-slate-600 hover:bg-slate-100 focus:ring-primary-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'px-6 py-3 text-base',
};

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button className={cn(variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
