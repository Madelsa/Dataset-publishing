/**
 * Dataset API Service
 * 
 * Centralized service for all dataset-related API calls
 * This provides a single point of access for dataset operations
 * and abstracts the HTTP request details from components
 */

import { Dataset, DatasetListItem, DatasetCreateInput, DatasetUpdateInput, PublicationStatusUpdate } from '@/types/dataset.types';

/**
 * Datasets API service
 * 
 * Provides methods for all dataset-related operations:
 * - Fetching datasets (list and individual)
 * - Creating, updating, and deleting datasets
 * - Managing dataset metadata
 * - Publication workflow and versioning
 */
export const datasetsApi = {
  /**
   * Get all datasets
   * 
   * @returns Promise resolving to an array of datasets
   */
  getAllDatasets: async (): Promise<DatasetListItem[]> => {
    const response = await fetch('/api/datasets');
    
    if (!response.ok) {
      throw new Error('Failed to fetch datasets');
    }
    
    const data = await response.json();
    return data.datasets;
  },
  
  /**
   * Get a single dataset by ID
   * 
   * @param id - Dataset ID
   * @returns Promise resolving to the dataset
   */
  getDataset: async (id: string): Promise<Dataset> => {
    const response = await fetch(`/api/datasets/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dataset');
    }
    
    const data = await response.json();
    return data.dataset;
  },
  
  /**
   * Create a new dataset
   * 
   * @param dataset - Dataset creation input data
   * @returns Promise resolving to the created dataset
   */
  createDataset: async (dataset: DatasetCreateInput): Promise<Dataset> => {
    const formData = new FormData();
    formData.append('name', dataset.name);
    
    if (dataset.description) {
      formData.append('description', dataset.description);
    }
    
    formData.append('file', dataset.file);
    
    const response = await fetch('/api/datasets', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to create dataset');
    }
    
    const data = await response.json();
    return data.dataset;
  },
  
  /**
   * Update a dataset
   * 
   * @param id - Dataset ID
   * @param updates - Dataset update data
   * @returns Promise resolving to the updated dataset
   */
  updateDataset: async (id: string, updates: DatasetUpdateInput): Promise<Dataset> => {
    const response = await fetch(`/api/datasets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update dataset');
    }
    
    const data = await response.json();
    return data.dataset;
  },
  
  /**
   * Delete a dataset
   * 
   * @param id - Dataset ID
   * @returns Promise resolving when deletion is complete
   */
  deleteDataset: async (id: string): Promise<void> => {
    const response = await fetch(`/api/datasets/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete dataset');
    }
  },
  
  /**
   * Get dataset metadata
   * 
   * @param id - Dataset ID
   * @returns Promise resolving to the dataset metadata
   */
  getDatasetMetadata: async (id: string) => {
    const response = await fetch(`/api/datasets/${id}/metadata`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dataset metadata');
    }
    
    const data = await response.json();
    return data.metadata;
  },
  
  /**
   * Update dataset metadata
   * 
   * @param id - Dataset ID
   * @param metadata - Metadata to update
   * @returns Promise resolving to the updated metadata
   */
  updateDatasetMetadata: async (id: string, metadata: any) => {
    const response = await fetch(`/api/datasets/${id}/metadata`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update dataset metadata');
    }
    
    const data = await response.json();
    return data.metadata;
  },

  /**
   * Submit dataset for review
   * 
   * @param id - Dataset ID
   * @returns Promise resolving to the updated dataset
   */
  submitForReview: async (id: string): Promise<Dataset> => {
    const update: PublicationStatusUpdate = {
      publicationStatus: 'PENDING_REVIEW'
    };
    
    const response = await fetch(`/api/datasets/${id}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit dataset for review');
    }
    
    const data = await response.json();
    return data.dataset;
  },
  
  /**
   * Approve and publish a dataset
   * 
   * @param id - Dataset ID
   * @param comment - Optional feedback or comment for the approval
   * @returns Promise resolving to the published dataset
   */
  publishDataset: async (id: string, comment?: string): Promise<Dataset> => {
    const update: PublicationStatusUpdate = {
      publicationStatus: 'PUBLISHED',
      reviewComment: comment
    };
    
    const response = await fetch(`/api/datasets/${id}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });
    
    if (!response.ok) {
      throw new Error('Failed to publish dataset');
    }
    
    const data = await response.json();
    return data.dataset;
  },
  
  /**
   * Reject a dataset with a comment
   * 
   * @param id - Dataset ID
   * @param comment - Rejection reason
   * @returns Promise resolving to the rejected dataset
   */
  rejectDataset: async (id: string, comment: string): Promise<Dataset> => {
    const update: PublicationStatusUpdate = {
      publicationStatus: 'REJECTED',
      reviewComment: comment
    };
    
    const response = await fetch(`/api/datasets/${id}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });
    
    if (!response.ok) {
      throw new Error('Failed to reject dataset');
    }
    
    const data = await response.json();
    return data.dataset;
  },
  
  /**
   * Get dataset version history
   * 
   * @param id - Dataset ID
   * @returns Promise resolving to the dataset version history
   */
  getDatasetVersions: async (id: string) => {
    const response = await fetch(`/api/datasets/${id}/versions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dataset versions');
    }
    
    const data = await response.json();
    return data.versions;
  },
  
  /**
   * Get a specific version of a dataset
   * 
   * @param id - Dataset ID
   * @param version - Version number
   * @returns Promise resolving to the specific dataset version
   */
  getDatasetVersion: async (id: string, version: number): Promise<Dataset> => {
    const response = await fetch(`/api/datasets/${id}/versions/${version}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dataset version');
    }
    
    const data = await response.json();
    return data.dataset;
  }
}; 