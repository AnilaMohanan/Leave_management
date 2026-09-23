import axios from "axios";

const API_URL = "http://localhost:5000/api/leave-requests";

// Get all leave requests
export const getLeaveRequests = () => {
    return axios.get(API_URL);
};

// Get one leave request
export const getLeaveRequestById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// Create leave request
export const createLeaveRequest = (data) => {
    return axios.post(API_URL, data);
};

// Approve leave request
export const approveLeaveRequest = (id, approverId) => {
    return axios.put(
        `${API_URL}/${id}/approve`,
        {
            approverId
        }
    );
};

// Reject leave request
export const rejectLeaveRequest = (id, approverId) => {
    return axios.put(
        `${API_URL}/${id}/reject`,
        {
            approverId
        }
    );
};