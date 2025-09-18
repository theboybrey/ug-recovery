"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/hooks/userContext";
import { Eye } from "lucide-react";

// Define the Claim type based on the properties used in the component
type Claim = {
  id: number | string;
  itemName: string;
  claimantName: string;
  submittedAt: string;
  status: string;
  collectionPoint: string;
};

const PendingClaimsPage = () => {
  const { claimRequests, user, items: collectionPoints } = useAuthContext();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  // Officer's assigned collection point names
  const officerPointNames = collectionPoints
    .filter((point) => point.officers.some((o) => o.id === Number(user?._id)))
    .map((point) => point.name);

  // Filter pending claims for officer's points
  const pendingClaims = claimRequests.filter(
    (claim) =>
      claim.status === "Pending" &&
      officerPointNames.includes(claim.collectionPoint)
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Pending Claims</h1>
          <p className="opacity-90">
            Review and process claims for your assigned collection points
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
                    Date
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
                {pendingClaims.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-text-muted">
                      No pending claims found.
                    </td>
                  </tr>
                ) : (
                  pendingClaims.map((claim) => (
                    <tr
                      key={claim.id}
                      className="border-b border-card-border hover:bg-surface transition-colors"
                    >
                      <td className="p-4">{claim.itemName}</td>
                      <td className="p-4">{claim.claimantName}</td>
                      <td className="p-4">{claim.submittedAt}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-alert-bg text-alert">
                          {claim.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          className="p-1 text-secondary-600 hover:bg-secondary-50 rounded transition-colors"
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
                  Claim Details
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
                  <span className="text-text-muted">Date:</span>
                  <p className="font-medium text-text">
                    {selectedClaim.submittedAt}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-alert-bg text-alert">
                    {selectedClaim?.status}
                  </span>
                </div>
                {/* Add approve/reject buttons here if needed */}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
                >
                  Close
                </button>
                {/* Approve/Reject buttons can be added here */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingClaimsPage;
