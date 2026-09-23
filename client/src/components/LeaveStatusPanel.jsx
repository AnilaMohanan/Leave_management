import { useState } from "react";
import {
    approveLeaveRequest,
    rejectLeaveRequest
} from "../services/leaveApi";

const workflowStages = [
    {
        role: "Employee",
        title: "Employee"
    },
    {
        role: "Team Lead",
        title: "Team Lead"
    },
    {
        role: "Project Lead",
        title: "Project Lead"
    },
    {
        role: "HR",
        title: "HR"
    },
    {
        role: "CEO",
        title: "CEO"
    }
];

function LeaveStatusPanel({ leaveRequest, onActionComplete }) {

    const [loading, setLoading] = useState(false);

    if (!leaveRequest) {
        return (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-white shadow-sm">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-700">
                        No Leave Request Selected
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Select a leave request to view its status.
                    </p>
                </div>
            </div>
        );
    }

    const employee = leaveRequest.employeeId;
    const currentApprover = leaveRequest.currentApprover;

    /*
        Find the current workflow index.

        Employee = 0
        Team Lead = 1
        Project Lead = 2
        HR = 3
        CEO = 4
    */

    const currentIndex = currentApprover
        ? workflowStages.findIndex(
            stage => stage.role === currentApprover.role
        )
        : -1;


    // Determine stage status
    const getStageStatus = (stage, index) => {

        // If completely approved
        if (leaveRequest.status === "Approved") {
            return "completed";
        }

        // If rejected
        if (leaveRequest.status === "Rejected") {

            if (
                currentApprover &&
                currentApprover.role === stage.role
            ) {
                return "rejected";
            }

            if (index < currentIndex) {
                return "completed";
            }

            return "pending";
        }

        // Employee stage
        if (stage.role === "Employee") {
            return "completed";
        }

        // Current approver
        if (
            currentApprover &&
            currentApprover.role === stage.role
        ) {
            return "current";
        }

        // Previous stages
        if (currentIndex !== -1 && index < currentIndex) {
            return "completed";
        }

        // Future stages
        return "pending";
    };


    // Get person for a stage
    const getStageUser = (stage) => {

        if (stage.role === "Employee") {
            return employee;
        }

        if (
            currentApprover &&
            currentApprover.role === stage.role
        ) {
            return currentApprover;
        }

        return null;
    };


    // Format date
    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // Approve
    const handleApprove = async () => {

        if (!currentApprover?._id) {
            alert("Current approver not found.");
            return;
        }

        try {

            setLoading(true);

            await approveLeaveRequest(
                leaveRequest._id,
                currentApprover._id
            );

            if (onActionComplete) {
                await onActionComplete();
            }

        } catch (error) {

            console.error(
                "Approval error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to approve leave request."
            );

        } finally {

            setLoading(false);

        }
    };


    // Reject
    const handleReject = async () => {

        if (!currentApprover?._id) {
            alert("Current approver not found.");
            return;
        }

        const confirmReject = window.confirm(
            "Are you sure you want to reject this leave request?"
        );

        if (!confirmReject) {
            return;
        }

        try {

            setLoading(true);

            await rejectLeaveRequest(
                leaveRequest._id,
                currentApprover._id
            );

            if (onActionComplete) {
                await onActionComplete();
            }

        } catch (error) {

            console.error(
                "Rejection error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to reject leave request."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="rounded-2xl bg-white p-6 shadow-sm">

            {/* Header */}

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Leave Status
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Leave approval workflow
                    </p>

                </div>


                {/* Overall Status */}

                <span
                    className={`
                        rounded-full px-4 py-2 text-sm font-semibold
                        ${
                            leaveRequest.status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : leaveRequest.status === "Rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                        }
                    `}
                >
                    {leaveRequest.status}
                </span>

            </div>


            {/* Leave Details */}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* Employee */}

                <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs font-medium uppercase text-gray-400">
                        Employee
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                        {employee?.name || "-"}
                    </p>

                </div>


                {/* Leave Dates */}

                <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs font-medium uppercase text-gray-400">
                        Leave Dates
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">

                        {formatDate(
                            leaveRequest.startDate
                        )}

                        {" - "}

                        {formatDate(
                            leaveRequest.endDate
                        )}

                    </p>

                </div>


                {/* Reason */}

                <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-xs font-medium uppercase text-gray-400">
                        Reason
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                        {leaveRequest.reason || "-"}
                    </p>

                </div>

            </div>


            {/* Workflow */}

            <div className="mt-10">

                <h2 className="mb-8 text-center text-lg font-semibold text-gray-700">
                    Approval Workflow
                </h2>


                <div className="overflow-x-auto pb-5">

                    <div className="flex min-w-[800px] items-start justify-center">

                        {workflowStages.map(
                            (stage, index) => {

                                const status =
                                    getStageStatus(
                                        stage,
                                        index
                                    );

                                const user =
                                    getStageUser(stage);


                                return (
                                    <div
                                        key={stage.role}
                                        className="flex flex-1 items-start"
                                    >

                                        {/* Stage */}

                                        <div className="flex w-full min-w-[130px] flex-col items-center">

                                            {/* Avatar */}

                                            <div
                                                className={`
                                                    relative flex h-20 w-20 items-center justify-center
                                                    overflow-hidden rounded-full border-4 bg-white
                                                    transition-all duration-300
                                                    ${
                                                        status === "completed"
                                                            ? "border-green-500"
                                                            : status === "current"
                                                                ? "border-blue-500 shadow-lg shadow-blue-100"
                                                                : status === "rejected"
                                                                    ? "border-red-500"
                                                                    : "border-gray-300"
                                                    }
                                                `}
                                            >

                                                {user?.profileImage ? (

                                                    <img
                                                        src={`http://localhost:5000${user.profileImage}`}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />

                                                ) : (

                                                    <span
                                                        className={`
                                                            text-2xl font-bold
                                                            ${
                                                                status === "completed"
                                                                    ? "text-green-600"
                                                                    : status === "current"
                                                                        ? "text-blue-600"
                                                                        : status === "rejected"
                                                                            ? "text-red-600"
                                                                            : "text-gray-400"
                                                            }
                                                        `}
                                                    >
                                                        {user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            stage.title
                                                                .charAt(0)}
                                                    </span>

                                                )}

                                                {/* Completed Check */}

                                                {status === "completed" && (

                                                    <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500 text-xs font-bold text-white">
                                                        ✓
                                                    </span>

                                                )}

                                                {/* Rejected X */}

                                                {status === "rejected" && (

                                                    <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white">
                                                        ×
                                                    </span>

                                                )}

                                            </div>


                                            {/* Name */}

                                            <h3 className="mt-3 text-center text-sm font-semibold text-gray-800">

                                                {user?.name ||
                                                    stage.title}

                                            </h3>


                                            {/* Role */}

                                            <p className="mt-1 text-center text-xs text-gray-500">
                                                {stage.title}
                                            </p>


                                            {/* Status */}

                                            <span
                                                className={`
                                                    mt-2 rounded-full px-3 py-1 text-xs font-medium
                                                    ${
                                                        status === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : status === "current"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : status === "rejected"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-gray-100 text-gray-500"
                                                    }
                                                `}
                                            >

                                                {status === "completed" &&
                                                    "Completed"}

                                                {status === "current" &&
                                                    "Current"}

                                                {status === "rejected" &&
                                                    "Rejected"}

                                                {status === "pending" &&
                                                    "Pending"}

                                            </span>

                                        </div>


                                        {/* Connector */}

                                        {index <
                                            workflowStages.length - 1 && (

                                            <div className="mt-10 flex min-w-[50px] flex-1 items-center">

                                                <div
                                                    className={`
                                                        h-1 w-full border-t-2 border-dashed
                                                        ${
                                                            status === "completed"
                                                                ? "border-green-400"
                                                                : "border-gray-300"
                                                        }
                                                    `}
                                                />

                                            </div>

                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

            </div>


            {/* Current Approver */}

            {leaveRequest.status === "Pending" &&
                currentApprover && (

                    <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

                        <p className="text-xs font-medium text-blue-500">
                            CURRENT APPROVER
                        </p>

                        <div className="mt-1 flex items-center gap-2">

                            <p className="font-semibold text-gray-800">
                                {currentApprover.name}
                            </p>

                            <span className="text-sm text-blue-600">
                                ({currentApprover.role})
                            </span>

                        </div>

                    </div>

                )}


            {/* Action Buttons */}

            {leaveRequest.status === "Pending" &&
                currentApprover && (

                    <div className="mt-6 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={loading}
                            className="rounded-lg border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading
                                ? "Processing..."
                                : "Reject"}

                        </button>


                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={loading}
                            className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading
                                ? "Processing..."
                                : "Approve"}

                        </button>

                    </div>

                )}

        </div>

    );
}

export default LeaveStatusPanel;