import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useDroppable } from '@dnd-kit/core';
import { KanbanColumn as KanbanColumnType } from '../types/position';
import CandidateCard from './CandidateCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  isDisabled?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  isDisabled = false 
}) => {
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
    disabled: isDisabled,
    data: {
      columnId: column.id
    }
  });

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{column.name}</h5>
          <Badge bg="secondary">{column.candidates.length}</Badge>
        </div>
      </Card.Header>

      <Card.Body 
        ref={setNodeRef}
        className="kanban-column-body"
        style={{ minHeight: '400px', maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}
      >
        {column.candidates.map(candidate => (
          <CandidateCard 
            key={candidate.id}
            candidate={candidate}
            isDisabled={isDisabled}
          />
        ))}

        {column.candidates.length === 0 && (
          <div className="text-center text-muted py-5">
            <small>No hay candidatos</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default KanbanColumn;

