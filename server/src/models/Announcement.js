import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ['Normal', 'Important', 'Urgent'], default: 'Normal' },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ priority: 1 });

export const Announcement = mongoose.model('Announcement', announcementSchema);
