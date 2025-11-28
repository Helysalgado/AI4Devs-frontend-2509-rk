import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Alert, Spinner } from 'react-bootstrap';
import { DragEndEvent } from '@dnd-kit/core';
import { 
  PositionPageState, 
  KanbanColumn, 
  Candidate,
  CandidateResponse,
  InterviewFlowResponse
} from '../types/position';
import {
  getInterviewFlowByPosition,
  getCandidatesByPosition,
  updateCandidateStage
} from '../services/positionService';
import KanbanBoard from './KanbanBoard';

const PositionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Parse and validate id
  const positionId = id ? parseInt(id) : NaN;
  const isValidId = !isNaN(positionId);
  
  const [state, setState] = useState<PositionPageState>({
    positionId: positionId || 0,
    positionName: '',
    columns: [],
    loading: true,
    error: null,
    updating: false
  });

  useEffect(() => {
    if (isValidId) {
      loadData();
    }
  }, [id, isValidId]);

  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Fetch interview flow and candidates in parallel
      const [flowResponse, candidatesResponse] = await Promise.all([
        getInterviewFlowByPosition(positionId),
        getCandidatesByPosition(positionId)
      ]);

      // Process interview flow into columns
      const columns = processInterviewFlow(flowResponse);
      
      // Distribute candidates into columns
      const columnsWithCandidates = distributeCandidates(candidatesResponse, columns);

      setState(prev => ({
        ...prev,
        positionName: flowResponse.interviewFlow.positionName,
        columns: columnsWithCandidates,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      
      if (error instanceof Error && error.message === 'Position not found') {
        setState(prev => ({ ...prev, error: 'Posición no encontrada', loading: false }));
        setTimeout(() => navigate('/positions'), 3000);
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Error al cargar los datos. Intenta de nuevo.', 
          loading: false 
        }));
      }
    }
  };

  const processInterviewFlow = (response: InterviewFlowResponse): KanbanColumn[] => {
    const { interviewFlow } = response.interviewFlow;
    
    return interviewFlow.interviewSteps
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((step) => ({
        id: step.id,
        name: step.name,
        orderIndex: step.orderIndex,
        candidates: []
      }));
  };

  const distributeCandidates = (
    candidates: CandidateResponse[],
    columns: KanbanColumn[]
  ): KanbanColumn[] => {
    // Create a map of step name -> step ID
    const stepNameToId = new Map(
      columns.map(col => [col.name, col.id])
    );

    // Clone columns to avoid mutation
    const newColumns: KanbanColumn[] = columns.map(col => ({ ...col, candidates: [] as Candidate[] }));

    // Distribute candidates
    candidates.forEach(candidateData => {
      const stepId = stepNameToId.get(candidateData.currentInterviewStep);
      
      if (stepId) {
        const column = newColumns.find(col => col.id === stepId);
        
        if (column) {
          const candidate: Candidate = {
            id: candidateData.id,
            fullName: candidateData.fullName,
            averageScore: candidateData.averageScore,
            currentInterviewStepId: stepId,
            currentInterviewStepName: candidateData.currentInterviewStep,
            applicationId: candidateData.applicationId
          };
          
          column.candidates.push(candidate);
        }
      } else {
        console.warn(`Candidate ${candidateData.id} has unknown step: ${candidateData.currentInterviewStep}`);
      }
    });

    return newColumns;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const candidateData = active.data.current?.candidate as Candidate;
    const targetColumnId = over.data.current?.columnId as number;

    if (!candidateData || !targetColumnId) return;

    // Don't update if dropped in same column
    if (candidateData.currentInterviewStepId === targetColumnId) return;

    // Find source and target columns
    const sourceColumnIndex = state.columns.findIndex(
      col => col.id === candidateData.currentInterviewStepId
    );
    const targetColumnIndex = state.columns.findIndex(
      col => col.id === targetColumnId
    );

    if (sourceColumnIndex === -1 || targetColumnIndex === -1) return;

    // Save current state for rollback
    const previousColumns = state.columns;

    // Optimistic update
    const newColumns = [...state.columns];
    const sourceColumn = { ...newColumns[sourceColumnIndex] };
    const targetColumn = { ...newColumns[targetColumnIndex] };

    // Remove from source
    sourceColumn.candidates = sourceColumn.candidates.filter(
      c => c.id !== candidateData.id
    );

    // Add to target
    const updatedCandidate = {
      ...candidateData,
      currentInterviewStepId: targetColumnId,
      currentInterviewStepName: targetColumn.name
    };
    targetColumn.candidates.push(updatedCandidate);

    newColumns[sourceColumnIndex] = sourceColumn;
    newColumns[targetColumnIndex] = targetColumn;

    // Update UI immediately
    setState(prev => ({ ...prev, columns: newColumns, updating: true }));

    try {
      // Call API
      await updateCandidateStage(candidateData.id, {
        applicationId: candidateData.applicationId,
        currentInterviewStep: targetColumnId
      });

      setState(prev => ({ ...prev, updating: false }));
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      
      // Rollback on error
      setState(prev => ({ ...prev, columns: previousColumns, updating: false }));
      
      // Show error (could use toast here)
      alert('No se pudo mover el candidato. Intenta de nuevo.');
    }
  };

  // Validate ID (after hooks)
  if (!isValidId) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <h5>⚠️ Error</h5>
          <p>ID de posición inválido</p>
          <Button variant="outline-danger" onClick={() => navigate('/positions')}>
            Volver a posiciones
          </Button>
        </Alert>
      </Container>
    );
  }

  if (state.loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status" className="mt-5">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <h5>⚠️ Error</h5>
          <p>{state.error}</p>
          <Button variant="outline-danger" onClick={loadData}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Button 
          variant="link" 
          onClick={() => navigate('/positions')}
          className="text-decoration-none"
        >
          ← Volver
        </Button>
        <h2 className="ms-3 mb-0">{state.positionName}</h2>
      </div>

      {/* Kanban */}
      <KanbanBoard 
        columns={state.columns}
        onDragEnd={handleDragEnd}
        isUpdating={state.updating}
      />
    </Container>
  );
};

export default PositionPage;

