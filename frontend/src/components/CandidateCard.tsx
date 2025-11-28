import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Candidate } from '../types/position';

interface CandidateCardProps {
  candidate: Candidate;
  isDisabled?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  isDisabled = false 
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `candidate-${candidate.id}`,
    disabled: isDisabled,
    data: {
      candidate: candidate
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDisabled ? 'default' : 'grab',
  };

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 4.5) return 'success';
    if (score >= 3.5) return 'primary';
    if (score >= 2.5) return 'warning';
    if (score > 0) return 'danger';
    return 'secondary';
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2 shadow-sm candidate-card"
    >
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="mb-0">{candidate.fullName}</h6>
          {candidate.averageScore > 0 ? (
            <Badge 
              bg={getScoreBadgeColor(candidate.averageScore)}
              className="ms-2"
            >
              {candidate.averageScore.toFixed(1)}
            </Badge>
          ) : (
            <Badge bg="secondary" className="ms-2">
              N/A
            </Badge>
          )}
        </div>
        
        {candidate.averageScore === 0 && (
          <small className="text-muted">Sin evaluaciones</small>
        )}
      </Card.Body>
    </Card>
  );
};

export default CandidateCard;

