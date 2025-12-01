import {
  PositionListItem,
  InterviewFlowResponse,
  CandidateResponse,
  UpdateCandidateStageRequest
} from '../types/position';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3010';

/**
 * Get all positions
 */
export const getAllPositions = async (): Promise<PositionListItem[]> => {
  const response = await fetch(`${API_BASE_URL}/position`);
  
  if (!response.ok) {
    throw new Error('Error fetching positions');
  }
  
  return response.json();
};

/**
 * Get interview flow (columns) for a position
 */
export const getInterviewFlowByPosition = async (
  positionId: number
): Promise<InterviewFlowResponse> => {
  const response = await fetch(`${API_BASE_URL}/position/${positionId}/interviewflow`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Position not found');
    }
    throw new Error('Error fetching interview flow');
  }
  
  return response.json();
};

/**
 * Get candidates for a position
 */
export const getCandidatesByPosition = async (
  positionId: number
): Promise<CandidateResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/position/${positionId}/candidates`);
  
  if (!response.ok) {
    throw new Error('Error fetching candidates');
  }
  
  return response.json();
};

/**
 * Update candidate stage (interview step)
 */
export const updateCandidateStage = async (
  candidateId: number,
  data: UpdateCandidateStageRequest
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error updating candidate stage');
  }
};

