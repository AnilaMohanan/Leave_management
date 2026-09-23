import { useEffect, useState } from "react";
import { getLeaveRequests } from "../services/leaveApi";
import LeaveStatusPanel from "../components/LeaveStatusPanel";

function Approvals() {

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchLeaveRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getLeaveRequests();

            setLeaveRequests(response.data);

            // Keep selected request after refresh
            if (selectedLeave) {

                const updatedLeave =
                    response.data.find(
                        leave =>
                            leave._id === selectedLeave._id
                    );

                setSelectedLeave(
                    updatedLeave || null
                );

            }
            else if (response.data.length > 0) {

                setSelectedLeave(
                    response.data[0]
                );

            }

        } catch (error) {

            console.error(
                "Failed to fetch leave requests:",
                error
            );

            setError(
                "Unable to load leave requests."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchLeaveRequests();

    }, []);


    return (

        <div className="min-h-screen bg-gray-100 p-4 md:p-8">

            <div className="mx-auto max-w-7xl">

                {/* Page Header */}

                <div className="mb-6">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Leave Approval Panel
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Review and process employee leave requests.
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">
                        {error}
                    </div>

                )}


                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">


                    {/* LEFT - Leave Requests */}

                    <div className="rounded-2xl bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <h2 className="font-semibold text-gray-800">
                                Leave Requests
                            </h2>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                {leaveRequests.length}
                            </span>

                        </div>


                        {loading ? (

                            <div className="py-10 text-center text-sm text-gray-500">
                                Loading...
                            </div>

                        ) : leaveRequests.length === 0 ? (

                            <div className="py-10 text-center text-sm text-gray-500">
                                No leave requests found.
                            </div>

                        ) : (

                            <div className="mt-4 space-y-3">

                                {leaveRequests.map(
                                    leave => (

                                        <button
                                            key={leave._id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedLeave(
                                                    leave
                                                )
                                            }
                                            className={`
                                                w-full rounded-xl border p-4 text-left transition
                                                ${
                                                    selectedLeave?._id ===
                                                    leave._id
                                                        ? "border-blue-400 bg-blue-50"
                                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                                }
                                            `}
                                        >

                                            <div className="flex items-center justify-between gap-2">

                                                <p className="font-semibold text-gray-800">
                                                    {leave.employeeId?.name ||
                                                        "Unknown Employee"}
                                                </p>

                                                <span
                                                    className={`
                                                        rounded-full px-2 py-1 text-[10px] font-semibold
                                                        ${
                                                            leave.status ===
                                                            "Approved"
                                                                ? "bg-green-100 text-green-700"
                                                                : leave.status ===
                                                                    "Rejected"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                        }
                                                    `}
                                                >
                                                    {leave.status}
                                                </span>

                                            </div>


                                            <p className="mt-2 line-clamp-1 text-xs text-gray-500">
                                                {leave.reason}
                                            </p>

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* RIGHT - Status Panel */}

                    <LeaveStatusPanel
                        leaveRequest={selectedLeave}
                        onActionComplete={
                            fetchLeaveRequests
                        }
                    />

                </div>

            </div>

        </div>

    );
}

export default Approvals;