import api from "./api";

// USERS
export const getUsers = async () => {
  return api.get("/user/web-users").then((res) => res.data);
};

export const updateUser = async (id: string, data: any) => {
  return api.patch(`/user/${id}`, data).then((res) => res.data);
};

export const getAdmins = async () => {
  return api.get("/user/admins").then((res) => res.data);
};

// RESERVATIONS
export const getReservations = async () => {
  return api.get("/reservations/all").then((res) => res.data);
};

export const addReservation = async (data: any) => {
  return api.post("/reservations", data).then((res) => res.data);
};

export const editReservation = async (id: string, data: any) => {
  return api.put(`/reservations/${id}`, data).then((res) => res.data);
};

export const deleteReservation = async (id: string) => {
  return api.delete(`/reservations/${id}`).then((res) => res.data);
};

export const updateReservationStatus = async (
  id: string,
  status:
    | "Pending"
    | "EmailSent"
    | "UserConfirmed"
    | "Confirmed"
    | "Declined"
    | "Cancelled"
    | "Done",
) => {
  return api
    .patch(`/reservations/${id}/status`, { status })
    .then((res) => res.data);
};

// FAQs
export const getFAQs = async () => {
  return api.get("/faq").then((res) => res.data);
};

export const addFAQ = async (data: any) => {
  return api.post("/faq", data).then((res) => res.data);
};

export const editFAQ = async (id: string, data: any) => {
  return api.put(`/faq/${id}`, data).then((res) => res.data);
};

export const deleteFAQ = async (id: string) => {
  return api.delete(`/faq/${id}`).then((res) => res.data);
};

// SERVICES
export const getServices = async () => {
  return api.get("/services").then((res) => res.data);
};

export const addService = async (data: any) => {
  return api.post("/services", data).then((res) => res.data);
};

export const editService = async (id: string, data: any) => {
  return api.put(`/services/${id}`, data).then((res) => res.data);
};

export const deleteService = async (id: string) => {
  return api.delete(`/services/${id}`).then((res) => res.data);
};

// CONTACT INFO
export const getContactInfos = async () => {
  return api.get("/contact-info/all").then((res) => res.data);
};

export const addContactInfo = async (data: any) => {
  return api.post("/contact-info", data).then((res) => res.data);
};

export const updateContactInfo = async (id: string, data: any) => {
  return api.patch(`/contact-info/${id}`, data).then((res) => res.data);
};

export const deleteContactInfo = async (id: string) => {
  return api.delete(`/contact-info/${id}`).then((res) => res.data);
};

export const updateReservationStatusWithReason = async (
  id: string,
  status: "Declined" | "Cancelled",
  reason: string,
) => {
  return api.patch(`/reservations/${id}/status-with-reason`, {
    status,
    reason,
  });
};

// PROMOTIONS
export const getAllPromotions = async () => {
  return api.get("/promotions/all").then((res) => res.data);
};

export const addPromotion = async (data: any) => {
  return api.post("/promotions", data).then((res) => res.data);
};

export const updatePromotion = async (id: string, data: any) => {
  return api.patch(`/promotions/${id}`, data).then((res) => res.data);
};

// ADMIN ACTIVITY
export const getAllAdminActivities = async () => {
  return api.get("/admin-activity/all").then((res) => res.data);
};

export const getAdminActivities = async (id: string) => {
  return api.get(`/admin-activity/${id}`).then((res) => res.data);
};

export const addAdminActivity = async (id: string, data: any) => {
  return api.post(`/admin-activity/${id}`, data).then((res) => res.data);
};
