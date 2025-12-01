import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllPositions } from '../services/positionService';
import { PositionListItem } from '../types/position';

interface PositionsState {
    positions: PositionListItem[];
    loading: boolean;
    error: string | null;
}

const Positions: React.FC = () => {
    const navigate = useNavigate();
    
    const [state, setState] = useState<PositionsState>({
        positions: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        loadPositions();
    }, []);

    const loadPositions = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const positions = await getAllPositions();
            setState({ positions, loading: false, error: null });
        } catch (error) {
            setState({
                positions: [],
                loading: false,
                error: error instanceof Error ? error.message : 'Error al cargar posiciones'
            });
        }
    };

    const handleViewProcess = (positionId: number) => {
        navigate(`/position/${positionId}`);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { variant: string; label: string }> = {
            'Open': { variant: 'bg-success', label: 'Abierto' },
            'Closed': { variant: 'bg-danger', label: 'Cerrado' },
            'Draft': { variant: 'bg-secondary', label: 'Borrador' },
            'Filled': { variant: 'bg-info', label: 'Contratado' }
        };
        return statusMap[status] || { variant: 'bg-warning', label: status };
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Sin fecha límite';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Loading state
    if (state.loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" />
                <p className="mt-3">Cargando posiciones...</p>
            </Container>
        );
    }

    // Error state
    if (state.error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>⚠️ Error al cargar posiciones</Alert.Heading>
                    <p>{state.error}</p>
                    <Button variant="outline-danger" onClick={loadPositions}>
                        Reintentar
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Posiciones</h2>
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Control type="text" placeholder="Buscar por título" />
                </Col>
                <Col md={3}>
                    <Form.Control type="date" placeholder="Buscar por fecha" />
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Estado</option>
                        <option value="open">Abierto</option>
                        <option value="filled">Contratado</option>
                        <option value="closed">Cerrado</option>
                        <option value="draft">Borrador</option>
                    </Form.Control>
                </Col>
                <Col md={3}>
                    <Form.Control as="select">
                        <option value="">Manager</option>
                        <option value="john_doe">John Doe</option>
                        <option value="jane_smith">Jane Smith</option>
                        <option value="alex_jones">Alex Jones</option>
                    </Form.Control>
                </Col>
            </Row>
            {state.positions.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <h1 style={{ fontSize: '4rem' }}>📭</h1>
                    <p>No hay posiciones disponibles</p>
                    <p className="small">Contacta al administrador para crear nuevas posiciones</p>
                </div>
            ) : (
                <Row>
                    {state.positions.map((position) => {
                        const statusInfo = getStatusBadge(position.status);
                        return (
                            <Col md={4} key={position.id} className="mb-4">
                                <Card className="shadow-sm h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>{position.title}</Card.Title>
                                        <Card.Text className="flex-grow-1">
                                            <strong>Empresa:</strong> {position.companyName}<br />
                                            <strong>Ubicación:</strong> {position.location || 'No especificada'}<br />
                                            <strong>Tipo:</strong> {position.employmentType || 'No especificado'}<br />
                                            <strong>Fecha límite:</strong> {formatDate(position.applicationDeadline)}
                                        </Card.Text>
                                        <div className="mb-3">
                                            <span className={`badge ${statusInfo.variant} text-white`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-auto">
                                            <Button variant="primary" onClick={() => handleViewProcess(position.id)}>
                                                Ver proceso
                                            </Button>
                                            <Button variant="secondary">Editar</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default Positions;