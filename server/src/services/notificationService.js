import { Notification } from '../models/Notification.js';

export const createNotification = async ({ user, title, message, type = 'system', link }) => {
  return Notification.create({ user, title, message, type, link });
};

export const getMyNotifications = async (userId, { limit = 20 } = {}) => {
  return Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);
};

export const markAsRead = async (id, userId) => {
  return Notification.findOneAndUpdate({ _id: id, user: userId }, { isRead: true }, { new: true });
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
};

export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, isRead: false });
};
