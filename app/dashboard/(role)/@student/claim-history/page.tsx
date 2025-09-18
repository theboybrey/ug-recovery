"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/hooks/userContext";
import { Eye } from "lucide-react";
import type { ClaimRequest } from "@/providers/auth-context";

const ClaimHistory = () => {
  const { claimRequests, user } = useAuthContext();
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(null);

  // Filter claims made by the current user
  const myClaims = claimRequests.filter(
    (claim) => claim.claimantEmail === user?.email
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Claim History</h1>
          <p className="opacity-90">See all claims you have made in the past</p>
        </div>
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-card-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-text">Item</th>
                  <th className="text-left p-4 font-semibold text-text">Date</th>
                  <th className="text-left p-4 font-semibold text-text">Status</th>
                  <th className="text-left p-4 font-semibold text-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myClaims.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-text-muted">
                      No claim history found.
                    </td>
                  </tr>
                ) : (
                  myClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-card-border hover:bg-surface transition-colors">
                      <td className="p-4">{claim.itemName}</td>
                      <td className="p-4">{claim.submittedAt}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === "Pending"
                            ? "bg-alert-bg text-alert"
                            : claim.status === "Approved"
                            ? "bg-success-bg text-success"
                            : claim.status === "Rejected"
                            ? "bg-error-bg text-error"
                            : "bg-primary-100 text-primary-800"
                        }`}>
                          {claim.status}
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
                <h3 className="text-lg font-semibold text-text">Claim Details</h3>
                <button onClick={() => setSelectedClaim(null)}>
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-text-muted">Item:</span>
                  <p className="font-medium text-text">{selectedClaim.itemName}</p>
                </div>
                <div>
                  <span className="text-text-muted">Date:</span>
                  <p className="font-medium text-text">{selectedClaim.submittedAt}</p>
                </div>
                <div>
                  <span className="text-text-muted">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedClaim.status === "Pending"
                      ? "bg-alert-bg text-alert"
                      : selectedClaim.status === "Approved"
                      ? "bg-success-bg text-success"
                      : selectedClaim.status === "Rejected"
                      ? "bg-error-bg text-error"
                      : "bg-primary-100 text-primary-800"
                  }`}>
                    {selectedClaim.status}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted">Collection Point:</span>
                  <p className="font-medium text-text">{selectedClaim.collectionPoint}</p>
                </div>
                <div>
                  <span className="text-text-muted">Description:</span>
                  <p className="font-medium text-text">{selectedClaim.description}</p>
                </div>
                {selectedClaim.reviewerNotes && (
                  <div>
                    <span className="text-text-muted">Reviewer Notes:</span>
                    <p className="font-medium text-text">{selectedClaim.reviewerNotes}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimHistory;
