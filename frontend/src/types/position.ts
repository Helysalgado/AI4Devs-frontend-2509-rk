// Types for Position Page (Kanban)

export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlow {
  id: number;
  description: string | null;
  interviewSteps: InterviewStep[];
}

export interface InterviewFlowResponse {
  interviewFlow: {
    positionName: string;
    interviewFlow: InterviewFlow;
  };
}

export interface CandidateResponse {
  fullName: string;
  currentInterviewStep: string; // Nombre del step (no ID)
  averageScore: number;
  id: number; // Candidate ID
  applicationId: number; // CRÍTICO para updates
}

export interface Candidate {
  id: number;
  fullName: string;
  averageScore: number;
  currentInterviewStepId: number;
  currentInterviewStepName: string;
  applicationId: number;
}

export interface KanbanColumn {
  id: number;
  name: string;
  orderIndex: number;
  candidates: Candidate[];
}

export interface UpdateCandidateStageRequest {
  applicationId: number;
  currentInterviewStep: number; // ID del InterviewStep
}

export interface PositionPageState {
  positionId: number;
  positionName: string;
  columns: KanbanColumn[];
  loading: boolean;
  error: string | null;
  updating: boolean;
}

