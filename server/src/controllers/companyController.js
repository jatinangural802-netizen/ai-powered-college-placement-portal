import * as companyService from '../services/companyService.js';
import { asyncHandler, sendSuccess, getPagination, buildPaginationMeta } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const listFn = req.user?.role === 'ADMIN' ? companyService.adminListCompanies : companyService.listCompanies;
  const { data, total } = await listFn({ ...req.query, page, limit, skip });
  sendSuccess(res, { data, meta: buildPaginationMeta(total, page, limit) });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await companyService.getCompany(req.params.id);
  sendSuccess(res, { data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await companyService.createCompany(req.body, req.user._id);
  sendSuccess(res, { statusCode: 201, message: 'Company created', data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await companyService.updateCompany(req.params.id, req.body);
  sendSuccess(res, { message: 'Company updated', data });
});

export const remove = asyncHandler(async (req, res) => {
  const result = await companyService.deleteCompany(req.params.id);
  sendSuccess(res, {
    message: result.deactivated ? 'Company deactivated (has applications)' : 'Company deleted',
    data: result.company,
  });
});
