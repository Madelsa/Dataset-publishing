/**
 * Workflow Controls Component
 * 
 * Displays workflow controls for a dataset:
 * - Submit for review button
 * - Approve/reject buttons for reviewers
 * - Publication status badge
 * - Rejection feedback display
 * 
 * Handles the publication workflow UI and interactions.
 */

'use client';

import React, { useState } from 'react';
import { FiSend, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { Dataset, PublicationStatus } from '@/types/dataset.types';
import { datasetsApi } from '@/services/api/datasets';
import StatusBadge from './StatusBadge';
import { getDisplayStatus } from '@/utils/dataset.utils';

interface WorkflowControlsProps {
  dataset: Dataset;
  isReviewer?: boolean;
  onWorkflowUpdate?: (dataset: Dataset) => void;
}

export default function WorkflowControls({ 
  dataset, 
  isReviewer = false,
  onWorkflowUpdate 
}: WorkflowControlsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const { id, reviewComment } = dataset;
  const displayStatus = getDisplayStatus(dataset);
  
  const isSubmittable = displayStatus === 'NEEDS_METADATA';
  const isReviewable = displayStatus === 'PENDING_REVIEW' && isReviewer;
  const isRejected = displayStatus === 'REJECTED';
  const isApproved = displayStatus === 'APPROVED';
  
  // Submit for review
  const handleSubmitForReview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedDataset = await datasetsApi.submitForReview(id);
      
      if (onWorkflowUpdate) {
        onWorkflowUpdate(updatedDataset);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit for review');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Approve dataset
  const handleApprove = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedDataset = await datasetsApi.publishDataset(id);
      
      if (onWorkflowUpdate) {
        onWorkflowUpdate(updatedDataset);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve dataset');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reject dataset
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedDataset = await datasetsApi.rejectDataset(id, rejectReason);
      
      if (onWorkflowUpdate) {
        onWorkflowUpdate(updatedDataset);
      }
      
      setShowRejectForm(false);
      setRejectReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject dataset');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel rejection
  const handleCancelReject = () => {
    setShowRejectForm(false);
    setRejectReason('');
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Publication Status</h3>
        <StatusBadge status={displayStatus as any} />
      </div>
      
      {/* Workflow step description */}
      <div className="mb-6">
        {displayStatus === 'NEEDS_METADATA' && (
          <p className="text-sm text-gray-600">
            This dataset is in draft mode. Complete the metadata and submit for review when ready.
          </p>
        )}
        
        {displayStatus === 'PENDING_REVIEW' && (
          <p className="text-sm text-gray-600">
            This dataset is awaiting review from a supervisor.
          </p>
        )}
        
        {displayStatus === 'REJECTED' && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Dataset Rejected</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{reviewComment || 'No reason provided.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {displayStatus === 'APPROVED' && (
          <p className="text-sm text-gray-600">
            This dataset is published and publicly accessible.
          </p>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Submit for review button */}
        {isSubmittable && (
          <button
            onClick={handleSubmitForReview}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
          >
            <FiSend className="mr-2 h-4 w-4" />
            Submit for Review
          </button>
        )}
        
        {/* Reviewer actions */}
        {isReviewable && !showRejectForm && (
          <>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              <FiCheck className="mr-2 h-4 w-4" />
              Approve
            </button>
            
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              <FiX className="mr-2 h-4 w-4" />
              Reject
            </button>
          </>
        )}
        
        {/* Rejection form */}
        {showRejectForm && (
          <div className="w-full mt-2">
            <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason
            </label>
            <textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Please provide a reason for rejection..."
            />
            <div className="mt-3 flex justify-end space-x-3">
              <button
                onClick={handleCancelReject}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        )}
        
        {/* If rejected, allow resubmission */}
        {isRejected && (
          <button
            onClick={handleSubmitForReview}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
          >
            <FiSend className="mr-2 h-4 w-4" />
            Resubmit for Review
          </button>
        )}
      </div>
    </div>
  );
} 