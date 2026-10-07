import { PlacementDrive } from '../models/PlacementDrive.js';
import { Company } from '../models/Company.js';
import { ApiError } from '../utils/helpers.js';

export const listDrives = async ({ page, limit, skip, status, company }) => {
  const filter = {};
  if (status) filter.status = status;
  if (company) filter.company = company;

  const [data, total] = await Promise.all([
    PlacementDrive.find(filter)
      .populate('company', 'name logo location')
      .populate('jobs', 'title salary status')
      .sort({ driveDate: -1 })
      .skip(skip)
      .limit(limit),
    PlacementDrive.countDocuments(filter),
  ]);
  return { data, total };
};

export const getDrive = async (id) => {
  const drive = await PlacementDrive.findById(id)
    .populate('company')
    .populate('jobs');
  if (!drive) throw new ApiError(404, 'Placement drive not found');
  return drive;
};

export const createDrive = async (data, userId) => {
  const company = await Company.findById(data.company);
  if (!company) throw new ApiError(404, 'Company not found');
  return PlacementDrive.create({ ...data, createdBy: userId });
};

export const updateDrive = async (id, data) => {
  const drive = await PlacementDrive.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('company')
    .populate('jobs');
  if (!drive) throw new ApiError(404, 'Placement drive not found');
  return drive;
};

export const deleteDrive = async (id) => {
  const drive = await PlacementDrive.findByIdAndUpdate(id, { status: 'closed' }, { new: true });
  if (!drive) throw new ApiError(404, 'Placement drive not found');
  return drive;
};
