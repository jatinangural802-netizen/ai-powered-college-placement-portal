import Button from './Button';
import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false, loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading}>
          {loading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
