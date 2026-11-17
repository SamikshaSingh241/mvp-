import api from './api';

export const candidateService = {
  async getProfile() {
    const response = await api.get('/candidate/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/candidate/profile', data);
    return response.data;
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/candidate/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async getDashboard() {
    const response = await api.get('/candidate/dashboard');
    return response.data;
  },

  async applyJob(jobId, notes = '') {
    const response = await api.post(`/candidate/apply/${jobId}`, { notes });
    return response.data;
  },

  async getApplications() {
    const response = await api.get('/candidate/applications');
    return response.data;
  }
};
