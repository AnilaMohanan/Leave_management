const express = require("express");

const {
    createLeaveRequest,
    getLeaveRequests,
    getLeaveRequestById,
    updateLeaveRequest,
    deleteLeaveRequest
    
} = require("../controllers/leaveRequestController");

const {
    approveLeaveRequest,
    rejectLeaveRequest
} = require("../controllers/leaveApprovalController");

const router = express.Router();


// POST - Create leave request
router.post("/", createLeaveRequest);


// GET - Get all leave requests
router.get("/", getLeaveRequests);


// GET - Get single leave request
router.get("/:id", getLeaveRequestById);


// PUT - Update leave request
router.put("/:id", updateLeaveRequest);


// DELETE - Delete leave request
router.delete("/:id", deleteLeaveRequest);


// Leave Approval APIs

router.put("/:id/approve", approveLeaveRequest);

router.put("/:id/reject", rejectLeaveRequest);

module.exports = router;