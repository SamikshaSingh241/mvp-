import api from './api';

export const adminService = {
  async getCompanies(status = '') {
    const response = await api.get('/admin/companies', {
      params: status ? { status } : {}
    });
    return response.data;
  },

  async verifyCompany(id, payload) {
    const response = await api.patch(`/admin/companies/${id}/verify`, payload);
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};
