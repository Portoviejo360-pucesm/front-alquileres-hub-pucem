// app/(protected)/alquileres/[reservaId]/contrato/page.tsx

'use client';
import '@/styles/components/alquileres.css';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { reservasApi } from '@/lib/api/reservas.api';
import { contratosApi } from '@/lib/api/contratos.api';
import { Button } from '@/components/ui/Button';
import EstadoBadge from '@/components/propiedades/EstadoBadge';
import type { Reserva, Contrato } from '@/types/reserva';

export default function ContratoPage() {
    const params = useParams();
    const reservaId = params.reservaId as string;

    const [reserva, setReserva] = useState<Reserva | null>(null);
    const [contrato, setContrato] = useState<Contrato | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                // Cargar todas las reservas y encontrar la actual
                const reservas = await reservasApi.misReservas();
                const reservaActual = reservas.find(r => r.id === reservaId);

                if (reservaActual) {
                    setReserva(reservaActual);
                }
            } catch (err) {
                console.error('Error al cargar reserva:', err);
            } finally {
                setLoading(false);
            }
        };

        if (reservaId) {
            cargarDatos();
        }
    }, [reservaId]);

    const handleDescargar = async () => {
        try {
            setDownloading(true);

            // 1. Force regeneration first to ensure latest template/fixes
            // We pass the reservation ID and the user ID (which is currently hardcoded in the api wrapper, 
            // but the backend needs a user ID in the body or header. The wrapper handles headers).
            // The GenerarContratoRequest type expects { reservaId, usuarioId? }.
            // We can pass just reservaId if the backend resolves user from header, 
            // but let's be safe and pass what we can or just let the API wrapper handle it.
            // Check contracts.api.ts: generarContrato takes 'GenerarContratoRequest'.

            // Let's assume user ID management is handled by the API auth layer mostly, 
            // but we need to trigger the POST.
            await contratosApi.generarContrato({
                reservaId,
                // We don't have the user ID easily accessible here except via complex context, 
                // but the backend uses the header 'x-user-id'.
            });

            // 2. Then download
            await contratosApi.downloadPDF(
                reservaId,
                `contrato-${reserva?.propiedad?.tituloAnuncio || reservaId}.pdf`
            );
        } catch (err) {
            console.error('Error al descargar contrato:', err);
            alert('Error al descargar el contrato. Verifica que el contrato haya sido generado.');
        } finally {
            setDownloading(false);
        }
    };

    const handleImprimir = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="contrato-container">
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <p>Cargando contrato...</p>
                </div>
            </div>
        );
    }

    if (!reserva) {
        return (
            <div className="contrato-container">
                <div className="empty-state">
                    <h3 className="empty-state-title">Reserva no encontrada</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="contrato-container">
            {/* Header */}
            <div className="contrato-header">
                <h1 className="contrato-title">Contrato de Arrendamiento #{reserva.id.slice(0, 8)}</h1>
            </div>

            <div className="contrato-grid">
                {/* Panel de Información */}
                <div className="contrato-info-panel">
                    {/* Inmueble */}
                    <div className="info-card">
                        <h3 className="info-card-title">Inmueble</h3>
                        <div className="info-row">
                            <div className="info-label">Dirección</div>
                            <div className="info-value">
                                {reserva.propiedad?.direccion || 'N/A'}
                            </div>
                        </div>
                        <div className="info-row">
                            <div className="info-label">Ciudad</div>
                            <div className="info-value">
                                {reserva.propiedad?.ciudad || 'N/A'}
                            </div>
                        </div>
                        <div className="info-row">
                            <div className="info-label">Precio Mensual</div>
                            <div className="info-value">
                                ${reserva.propiedad?.precioMensual || '0'}/mes
                            </div>
                        </div>
                    </div>

                    {/* Arrendatario */}
                    <div className="info-card">
                        <h3 className="info-card-title">Arrendatario</h3>
                        <div className="info-row">
                            <div className="info-label">Nombre</div>
                            <div className="info-value">Usuario Actual</div>
                        </div>
                        <div className="info-row">
                            <div className="info-label">ID Usuario</div>
                            <div className="info-value" style={{ fontSize: '11px' }}>
                                {reserva.usuarioId.slice(0, 16)}...
                            </div>
                        </div>
                    </div>

                    {/* Detalles de Reserva */}
                    <div className="info-card">
                        <h3 className="info-card-title">Detalles de Reserva</h3>
                        <div className="info-row">
                            <div className="info-label">Fecha Entrada</div>
                            <div className="info-value">
                                {new Date(reserva.fechaEntrada).toLocaleDateString('es-ES')}
                            </div>
                        </div>
                        <div className="info-row">
                            <div className="info-label">Fecha Salida</div>
                            <div className="info-value">
                                {new Date(reserva.fechaSalida).toLocaleDateString('es-ES')}
                            </div>
                        </div>
                        <div className="info-row">
                            <div className="info-label">Total a Pagar</div>
                            <div className="info-value">
                                ${reserva.totalPagar}
                            </div>
                        </div>
                        <div className="info-row">
                            <div className="info-label">Estado</div>
                            <div className="info-value">
                                <EstadoBadge estado={reserva.estado} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visor de Documento */}
                <div className="document-viewer">
                    <div className="document-toolbar">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleDescargar}
                            isLoading={downloading}
                        >
                            Descargar Contrato (PDF)
                        </Button>
                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleImprimir}
                        >
                            Imprimir
                        </Button>
                    </div>

                    <div className="document-content">
                        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
                            CONTRATO DE ARRENDAMIENTO
                        </h2>

                        <p style={{ marginBottom: '16px' }}>
                            <strong>Contrato ID:</strong> #{reserva.id}
                        </p>

                        <p style={{ marginBottom: '16px' }}>
                            Entre el <strong>ARRENDADOR</strong> y el <strong>ARRENDATARIO</strong>{' '}
                            se celebra el presente contrato de arrendamiento sobre el inmueble{' '}
                            ubicado en <strong>{reserva.propiedad?.direccion}, {reserva.propiedad?.ciudad}</strong>.
                        </p>

                        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>
                            PRIMERA: OBJETO DEL CONTRATO
                        </h3>
                        <p style={{ marginBottom: '16px' }}>
                            El ARRENDADOR cede el uso y goce del inmueble denominado{' '}
                            "{reserva.propiedad?.tituloAnuncio}" al ARRENDATARIO por el período{' '}
                            comprendido entre el {new Date(reserva.fechaEntrada).toLocaleDateString('es-ES', { timeZone: 'UTC' })}{' '}
                            y el {new Date(reserva.fechaSalida).toLocaleDateString('es-ES', { timeZone: 'UTC' })}.
                        </p>

                        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>
                            SEGUNDA: RENTA
                        </h3>
                        <p style={{ marginBottom: '16px' }}>
                            El ARRENDATARIO se obliga a pagar la cantidad de
                            ${reserva.propiedad?.precioMensual} mensuales.
                        </p>
                        <p style={{ marginBottom: '16px' }}>
                            Por el período contratado (del {new Date(reserva.fechaEntrada).toLocaleDateString('es-ES', { timeZone: 'UTC' })} al {new Date(reserva.fechaSalida).toLocaleDateString('es-ES', { timeZone: 'UTC' })}),
                            el valor total a pagar es de <strong>${reserva.totalPagar}</strong>.
                        </p>

                        <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>
                            TERCERA: OBLIGACIONES
                        </h3>
                        <p style={{ marginBottom: '16px' }}>
                            El ARRENDATARIO se compromete a mantener el inmueble en buen estado,
                            realizar el pago puntual de la renta y respetar las normas de
                            convivencia establecidas.
                        </p>

                        <p style={{ marginTop: '32px', fontStyle: 'italic', color: '#6b7280' }}>
                            Este es un documento preliminar. El contrato completo se generará
                            y firmará digitalmente una vez confirmado el pago.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
