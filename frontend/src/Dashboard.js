import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook para navegar

function Dashboard() {
    const [productos, setProductos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');
    const navigate = useNavigate(); // 2. Inicializamos la función de navegación

    // 1. Cargar productos desde MySQL (URL de Railway)
    const cargarProductos = () => {
        axios.get('https://localtocloud-production.up.railway.app/productos')
            .then(res => setProductos(res.data))
            .catch(err => console.log("Error al cargar:", err));
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    // 2. Guardar nuevo producto (URL de Railway)
    const guardarProducto = (e) => {
        e.preventDefault();
        if (!nombre || !cantidad || !precio) {
            alert("Por favor completa todos los campos");
            return;
        }

        axios.post('https://localtocloud-production.up.railway.app/crear', { 
            nombre: nombre, 
            cantidad: cantidad, 
            precio: precio 
        })
        .then(res => {
            if (res.data.success) {
                alert(`✅ ${nombre} guardado correctamente`);
                cargarProductos(); 
                setNombre(''); setCantidad(''); setPrecio('');
            }
        })
        .catch(err => alert("❌ No se pudo guardar el producto."));
    };

    // 3. ENTREGAR PRODUCTO (Actualizado para Producción en Railway) 📉📝
    const entregarProducto = (id, cantidadActual, nombreProducto) => {
        const inputCantidad = window.prompt(`¿Cuántas unidades de "${nombreProducto}" vas a entregar? (Disponibles: ${cantidadActual})`);
        if (inputCantidad === null || inputCantidad === "") return;
        
        const cantidadARestar = parseInt(inputCantidad);
        if (isNaN(cantidadARestar) || cantidadARestar <= 0 || cantidadARestar > cantidadActual) {
            alert("❌ Cantidad no válida o insuficiente.");
            return;
        }

        const persona = window.prompt("¿Nombre de la persona que recibe?");
        if (!persona) {
            alert("❌ El nombre es obligatorio para el registro.");
            return;
        }

        const area = window.prompt("¿Área de destino?");
        if (!area) {
            alert("❌ El área es obligatoria para el registro.");
            return;
        }

        axios.put(`https://localtocloud-production.up.railway.app/entregar/${id}`, { 
            cantidadARestar: cantidadARestar,
            persona_recibe: persona,
            area: area,
            nombre_producto: nombreProducto 
        })
        .then(res => {
            if (res.data.success) {
                alert(`✅ Entrega registrada: ${cantidadARestar} unidades a ${persona}.`);
                cargarProductos();
            } else {
                alert("❌ Error: " + res.data.message);
            }
        })
        .catch(err => console.log("Error en entrega:", err));
    };

    // 4. Eliminar producto (URL de Railway)
    const eliminarProducto = (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            axios.delete(`https://localtocloud-production.up.railway.app/eliminar/${id}`)
                .then(res => {
                    if (res.data.success) {
                        alert("🗑️ Producto eliminado");
                        cargarProductos();
                    }
                })
                .catch(err => console.log("Error al eliminar:", err));
        }
    };

    return (
        <div style={styles.contenedor}>
            <header style={styles.header}>
                <h1 style={styles.titulo}>Sistema Control Job - Inventario</h1>
                
                {/* --- 3. CONTENEDOR DE BOTONES A LA DERECHA --- */}
                <div style={styles.contenedorBotones}>
                    <button 
                        style={styles.botonHistorial} 
                        onClick={() => navigate('/historial')}
                    >
                        📋 Ver Historial
                    </button>
                    <button 
                        style={styles.botonSalir} 
                        onClick={() => navigate('/')}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <section style={styles.seccionFormulario}>
                <h2 style={styles.subtitulo}>Registro de productos</h2>
                <form style={styles.formulario} onSubmit={guardarProducto}>
                    <div style={styles.grupoInput}>
                        <label style={styles.etiqueta}>Nombre del producto</label>
                        <input type="text" style={styles.input} value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div style={styles.grupoInput}>
                        <label style={styles.etiqueta}>Cantidad</label>
                        <input type="number" style={styles.input} value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                    </div>
                    <div style={styles.grupoInput}>
                        <label style={styles.etiqueta}>Precio Unitario</label>
                        <input type="number" style={styles.input} value={precio} onChange={(e) => setPrecio(e.target.value)} />
                    </div>
                    <button type="submit" style={styles.botonGuardar}>Guardar Producto</button>
                </form>
            </section>

            <section style={styles.seccionTabla}>
                <h2 style={styles.subtitulo}>Inventario Actual</h2>
                <table style={styles.tabla}>
                    <thead>
                        <tr style={styles.filaEncabezado}>
                            <th style={styles.celda}>ID</th>
                            <th style={styles.celda}>Producto</th>
                            <th style={styles.celda}>Cantidad</th>
                            <th style={styles.celda}>Precio</th>
                            <th style={styles.celda}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((p) => (
                            <tr key={p.id} style={styles.fila}>
                                <td style={styles.celda}>{p.id}</td>
                                <td style={styles.celda}>{p.nombre}</td>
                                <td style={styles.celda}>{p.cantidad}</td>
                                <td style={styles.celda}>${p.precio}</td>
                                <td style={styles.celda}>
                                    <button style={styles.botonEntregar} onClick={() => entregarProducto(p.id, p.cantidad, p.nombre)}>Entregar</button>
                                    <button style={styles.botonEliminar} onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

const styles = {
    contenedor: { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#343a40', color: 'white', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px' },
    titulo: { margin: 0, fontSize: '20px' },
    contenedorBotones: { display: 'flex', gap: '10px' }, 
    botonHistorial: { backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    subtitulo: { borderBottom: '3px solid #007bff', paddingBottom: '5px', color: '#333', marginBottom: '15px' },
    seccionFormulario: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px', maxWidth: '500px' },
    formulario: { display: 'flex', flexDirection: 'column', gap: '15px' },
    grupoInput: { display: 'flex', flexDirection: 'column', gap: '5px' },
    etiqueta: { fontWeight: 'bold', fontSize: '14px', color: '#555' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', outline: 'none' },
    botonGuardar: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    seccionTabla: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    tabla: { width: '100%', borderCollapse: 'collapse' },
    filaEncabezado: { backgroundColor: '#007bff', color: 'white' },
    celda: { padding: '12px', border: '1px solid #ddd', textAlign: 'left' },
    botonEntregar: { backgroundColor: '#ffc107', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontWeight: 'bold' },
    botonEliminar: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    botonSalir: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }
};

export default Dashboard;