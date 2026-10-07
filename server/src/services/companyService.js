import { Company } from '../models/Company.js';
import { Application } from '../models/Application.js';
import { ApiError } from '../utils/helpers.js';

export const listCompanies = async ({ page, limit, skip, search, industry, status }) => {
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (industry) filter.industry = industry;
  if (status) filter.status = status;
  else if (!status) filter.status = 'Active';

  const [data, total] = await Promise.all([
    Company.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Company.countDocuments(filter),
  ]);
  return { data, total };
};

export const getCompany = async (id) => {
  const company = await Company.findById(id);
  if (!company) throw new ApiError(404, 'Company not found');
  return company;
};

export const createCompany = async (data, userId) => {
  return Company.create({ ...data, createdBy: userId });
};

export const updateCompany = async (id, data) => {
  const company = await Company.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!company) throw new ApiError(404, 'Company not found');
  return company;
};

export const deleteCompany = async (id) => {
  const appCount = await Application.countDocuments({ company: id });
  if (appCount > 0) {
    const company = await Company.findByIdAndUpdate(id, { status: 'Inactive' }, { new: true });
    if (!company) throw new ApiError(404, 'Company not found');
    return { company, deactivated: true };
  }
  const company = await Company.findByIdAndDelete(id);
  if (!company) throw new ApiError(404, 'Company not found');
  return { company, deactivated: false };
};

export const adminListCompanies = async ({ page, limit, skip, search, status }) => {
  const filter = {};
  if (search) filter.name = { $regex: search, $options: 'i' };
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    Company.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Company.countDocuments(filter),
  ]);
  return { data, total };
};
