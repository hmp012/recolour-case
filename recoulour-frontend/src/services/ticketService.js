import api from './api'

export const ticketService = {
  getAll: () => api.get('/tickets'),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.patch(`/tickets/${id}`, data), // backend uses PATCH for updates
  delete: (id) => api.delete(`/tickets/${id}`),
  getByStatus: (status) => api.get(`/tickets?status=${status}`)
}
