import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { KanbanColumn as KanbanColumnType } from '../types/position';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onDragEnd: (event: DragEndEvent) => void;
  isUpdating?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  columns, 
  onDragEnd,
  isUpdating = false 
}) => {
  const hasAnyCandidates = columns.some(col => col.candidates.length > 0);

  return (
    <DndContext onDragEnd={onDragEnd}>
      {hasAnyCandidates ? (
        <Row className="g-3">
          {columns.map(column => (
            <Col key={column.id} xs={12} md={6} lg={4}>
              <KanbanColumn 
                column={column}
                isDisabled={isUpdating}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 text-muted">
          <h1 style={{ fontSize: '4rem' }}>📭</h1>
          <p>No hay candidatos en esta posición</p>
        </div>
      )}
    </DndContext>
  );
};

export default KanbanBoard;

