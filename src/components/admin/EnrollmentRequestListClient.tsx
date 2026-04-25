'use client';

import { useState } from 'react';
import { approveEnrollmentRequest, rejectEnrollmentRequest } from '@/app/actions/adminActions';
import { useRouter } from 'next/navigation';

interface EnrollmentRequest {
  _id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseId: string;
  courseName: string;
  courseSlug: string;
  courseFees: number;
  status: string;
  requestDate: string;
  approvalDate: string | null;
  rejectionReason: string;
  approvedBy: string;
}

interface Props {
  requests: EnrollmentRequest[];
}

export default function EnrollmentRequestListClient({ requests }: Props) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [rejectionModal, setRejectionModal] = useState<{ requestId: string; open: boolean }>({
    requestId: '',
    open: false,
  });
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async (requestId: string) => {
    setIsApproving(requestId);
    try {
      const result = await approveEnrollmentRequest(requestId, 'Student@123');
      if (result.success) {
        alert(result.message);
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setIsApproving(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setIsRejecting(rejectionModal.requestId);
    try {
      const result = await rejectEnrollmentRequest(
        rejectionModal.requestId,
        rejectionReason
      );
      if (result.success) {
        alert(result.message);
        setRejectionModal({ requestId: '', open: false });
        setRejectionReason('');
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setIsRejecting(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Student Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{req.studentName}</div>
                    <div className="text-sm text-gray-600">{req.studentEmail}</div>
                    <div className="text-sm text-gray-600">{req.studentPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{req.courseName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-green-600">₹{req.courseFees}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(req.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req._id)}
                        disabled={isApproving === req._id}
                        className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
                      >
                        {isApproving === req._id ? 'Approving...' : '✅ Approve'}
                      </button>
                      <button
                        onClick={() =>
                          setRejectionModal({ requestId: req._id, open: true })
                        }
                        disabled={isRejecting === req._id}
                        className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        {isRejecting === req._id ? 'Rejecting...' : '❌ Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Enrollment Request</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setRejectionModal({ requestId: '', open: false });
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={isRejecting === rejectionModal.requestId}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isRejecting === rejectionModal.requestId ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
