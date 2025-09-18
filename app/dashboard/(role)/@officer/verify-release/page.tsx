"use client";
import { useAuthContext } from "@/hooks/userContext";
import type { ClaimRequest } from "@/providers/auth-context";
import { Eye } from "lucide-react";
import { useState } from "react";

const VerifyReleasePage = () => {
  const { claimRequests, user, items: collectionPoints } = useAuthContext();
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(null);

  // Officer's assigned collection point names
  const officerPointNames = collectionPoints
    .filter((point) => point.officers.some((o) => o.id === Number(user?._id)))
    .map((point) => point.name);

  // Filter claims that are approved but not yet verified/released
  const toVerifyClaims = claimRequests.filter(
    (claim) =>
      claim.status === "Approved" &&
      officerPointNames.includes(claim.collectionPoint) &&
      !claim.reviewedAt // Not yet verified/released
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Verify Release</h1>
          <p className="opacity-90">
            Verify and confirm the release of items to claimants at your
            assigned collection points
          </p>
        </div>
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-card-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-text">
                    Item
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Claimant
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Appointment Date
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {toVerifyClaims.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-text-muted">
                      No items pending verification.
                    </td>
                  </tr>
                ) : (
                  toVerifyClaims.map((claim) => (
                    <tr
                      key={claim.id}
                      className="border-b border-card-border hover:bg-surface transition-colors"
                    >
                      <td className="p-4">{claim.itemName}</td>
                      <td className="p-4">{claim.claimantName}</td>
                      <td className="p-4">{claim.appointmentDate || "-"}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Awaiting Verification
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          onClick={() => setSelectedClaim(claim)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Claim Details Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text">
                  Verify Release
                </h3>
                <button onClick={() => setSelectedClaim(null)}>
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-text-muted">Item:</span>
                  <p className="font-medium text-text">
                    {selectedClaim.itemName}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Claimant:</span>
                  <p className="font-medium text-text">
                    {selectedClaim.claimantName}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Appointment Date:</span>
                  <p className="font-medium text-text">
                    {selectedClaim.appointmentDate || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Awaiting Verification
                  </span>
                </div>
                {/* Add verification buttons here if needed */}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
                >
                  Close
                </button>
                {/*
                <button
                  onClick={() => handleVerify(selectedClaim)}
                  className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-success-bg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify Release
                </button>
                <button
                  onClick={() => handleReject(selectedClaim)}
                  className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error-bg transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyReleasePage;
