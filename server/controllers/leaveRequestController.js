const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");

// Create Leave Request
const createLeaveRequest = async (req, res) => {
    try {
        const {
            employeeId,
            startDate,
            endDate,
            reason
        } = req.body;

        // Check employee
        const employee = await User.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // Find Team Lead
        const teamLead = await User.findOne({
            role: "Team Lead"
        });

        if (!teamLead) {
            return res.status(404).json({
                message: "No Team Lead found"
            });
        }

        // Create leave request
        const leaveRequest = await LeaveRequest.create({
            employeeId,
            startDate,
            endDate,
            reason,
            status: "Pending",
            currentApprover: teamLead._id
        });

        res.status(201).json({
            message: "Leave request created successfully",
            leaveRequest
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get All Leave Requests
const getLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find()
            .populate("employeeId", "name role profileImage")
            .populate("currentApprover", "name role");

        res.status(200).json(leaveRequests);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get Single Leave Request
const getLeaveRequestById = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id)
            .populate("employeeId", "name role profileImage")
            .populate("currentApprover", "name role");

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json(leaveRequest);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update Leave Request
const updateLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json(leaveRequest);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Delete Leave Request
const deleteLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findByIdAndDelete(
            req.params.id
        );

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            message: "Leave request deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createLeaveRequest,
    getLeaveRequests,
    getLeaveRequestById,
    updateLeaveRequest,
    deleteLeaveRequest
};