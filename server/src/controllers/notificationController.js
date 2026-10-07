import * as notificationService from '../services/notificationService.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';

export const getMy = asyncHandler(async (req, res) => {
  const data = await notificationService.getMyNotifications(req.user._id);
  const unreadCount = await notificationService.getUnreadCount(req.user._id);
  sendSuccess(res, { data, meta: { unreadCount } });
});

export const markRead = asyncHandler(async (req, res) => {
  const data = await notificationService.markAsRead(req.params.id, req.user._id);
  sendSuccess(res, { data });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  sendSuccess(res, { message: 'All notifications marked as read' });
});
