const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");


// ==============================
// APPROVE LEAVE REQUEST
// ==============================

const approveLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approverId } = req.body;

        // Find leave request
        const leaveRequest = await LeaveRequest.findById(id);

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        // Check whether request is already processed
        if (leaveRequest.status !== "Pending") {
            return res.status(400).json({
                message: "This leave request has already been processed"
            });
        }

        // Find approver
        const approver = await User.findById(approverId);

        if (!approver) {
            return res.status(404).json({
                message: "Approver not found"
            });
        }

        // Check whether this user is the current approver
        if (
            leaveRequest.currentApprover &&
            leaveRequest.currentApprover.toString() !== approverId
        ) {
            return res.status(403).json({
                message: "You are not the current approver for this leave request"
            });
        }

        // Find employee
        const employee = await User.findById(leaveRequest.employeeId);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // Determine next approver
        let nextApproverRole = null;


        // Team Lead → Project Lead
        if (approver.role === "Team Lead") {
            nextApproverRole = "Project Lead";
        }

        // Project Lead → HR
        else if (approver.role === "Project Lead") {
            nextApproverRole = "HR";
        }

        // HR → CEO
        else if (approver.role === "HR") {
            nextApproverRole = "CEO";
        }

        // CEO → Final approval
        else if (approver.role === "CEO") {

            leaveRequest.status = "Approved";
            leaveRequest.currentApprover = null;

            await leaveRequest.save();

            return res.status(200).json({
                message: "Leave request approved successfully",
                leaveRequest
            });
        }

        // Invalid role
        else {
            return res.status(403).json({
                message: "This user is not authorized to approve leave requests"
            });
        }


        // Find next approver
        const nextApprover = await User.findOne({
            role: nextApproverRole
        });

        if (!nextApprover) {
            return res.status(404).json({
                message: `No ${nextApproverRole} found`
            });
        }


        // Assign next approver
        leaveRequest.currentApprover = nextApprover._id;

        await leaveRequest.save();


        res.status(200).json({
            message: `Leave approved by ${approver.role}`,

            nextApprover: {
                id: nextApprover._id,
                name: nextApprover.name,
                role: nextApprover.role
            },

            leaveRequest
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// ==============================
// REJECT LEAVE REQUEST
// ==============================

const rejectLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approverId } = req.body;


        // Find leave request
        const leaveRequest = await LeaveRequest.findById(id);

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }


        // Check whether already processed
        if (leaveRequest.status !== "Pending") {
            return res.status(400).json({
                message: "This leave request has already been processed"
            });
        }


        // Find approver
        const approver = await User.findById(approverId);

        if (!approver) {
            return res.status(404).json({
                message: "Approver not found"
            });
        }


        // Check current approver
        if (
            leaveRequest.currentApprover &&
            leaveRequest.currentApprover.toString() !== approverId
        ) {
            return res.status(403).json({
                message: "You are not the current approver for this leave request"
            });
        }


        // Check role
        const allowedRoles = [
            "Team Lead",
            "Project Lead",
            "HR",
            "CEO"
        ];

        if (!allowedRoles.includes(approver.role)) {
            return res.status(403).json({
                message: "You are not authorized to reject this leave request"
            });
        }


        // Reject request
        leaveRequest.status = "Rejected";
        leaveRequest.currentApprover = null;

        await leaveRequest.save();


        res.status(200).json({
            message: "Leave request rejected successfully",
            leaveRequest
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = {
    approveLeaveRequest,
    rejectLeaveRequest
};