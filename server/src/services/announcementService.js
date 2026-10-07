import { Announcement } from '../models/Announcement.js';
import { ApiError } from '../utils/helpers.js';

export const listAnnouncements = async ({ page, limit, skip, activeOnly = true }) => {
  const filter = {};
  if (activeOnly) {
    filter.isActive = true;
    filter.$or = [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }];
  }

  const [data, total] = await Promise.all([
    Announcement.find(filter).sort({ priority: -1, createdAt: -1 }).skip(skip).limit(limit),
    Announcement.countDocuments(filter),
  ]);
  return { data, total };
};

export const createAnnouncement = async (data, userId) => {
  return Announcement.create({ ...data, createdBy: userId });
};

export const updateAnnouncement = async (id, data) => {
  const announcement = await Announcement.findByIdAndUpdate(id, data, { new: true });
  if (!announcement) throw new ApiError(404, 'Announcement not found');
  return announcement;
};

export const deleteAnnouncement = async (id) => {
  const announcement = await Announcement.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!announcement) throw new ApiError(404, 'Announcement not found');
  return announcement;
};
