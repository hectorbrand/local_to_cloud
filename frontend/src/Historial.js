import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Historial() {
    const [entregas, setEntregas] = useState([]);
    const navigate = useNavigate();

    // 1. Cargar el historial desde el servidor (URL de Railway)
    const cargarHistorial = () => {
        axios.get('https://localtocloud-production.up.railway.app/historial')
            .then(res => {
                setEntregas(res.data);
            })
            .catch(err => {
                console.error("Error al cargar el historial:", err);
                alert("No se pudo obtener el historial de entregas.");
            });
    };

    useEffect(() => {
        cargarHistorial();
    }, []);

    return (
        <div style={styles.contenedor}>
            <header style={styles.header}>
                <h1 style={styles.titulo}>Reporte de Entregas - Control Job</h1>
                <button style={styles.botonVolver} onClick={() => navigate('/dashboard')}>
                    Volver al Inventario
                </button>
            </header>

            <section style={styles.seccionTabla}>
                <h2 style={styles.subtitulo}>Movimientos Registrados</h2>
                <table style={styles.tabla}>
                    <thead>
                        <tr style={styles.filaEncabezado}>
                            <th style={styles.celda}>ID</th>
                            <th style={styles.celda}>Producto</th>
                            <th style={styles.celda}>Cantidad</th>
                            <th style={styles.celda}>Persona que Recibe</th>
                            <th style={styles.celda}>Área</th>
                            <th style={styles.celda}>Fecha y Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entregas.length > 0 ? (
                            entregas.map((e) => (
                                <tr key={e.id_entrega} style={styles.fila}>
                                    <td style={styles.celda}>{e.id_entrega}</td>
                                    <td style={styles.celda}>{e.nombre_producto}</td>
                                    <td style={styles.celda}>{e.cantidad}</td>
                                    <td style={styles.celda}>{e.persona_recibe}</td>
                                    <td style={styles.celda}>{e.area}</td>
                                    <td style={styles.celda}>{new Date(e.fecha_entrega).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    No hay registros de entregas aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

const styles = {
    contenedor: { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px' },
    titulo: { margin: 0, fontSize: '20px' },
    subtitulo: { borderBottom: '3px solid #28a745', paddingBottom: '5px', color: '#333', marginBottom: '15px' },
    botonVolver: { backgroundColor: '#343a40', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    seccionTabla: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    tabla: { width: '100%', borderCollapse: 'collapse' },
    filaEncabezado: { backgroundColor: '#28a745', color: 'white' },
    celda: { padding: '12px', border: '1px solid #ddd', textAlign: 'left' },
    fila: { borderBottom: '1px solid #eee' }
};

export default Historial;