const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors());         

// --- CONFIGURACIÓN DE LA BASE DE DATOS (ADAPTADA PARA PRODUCCIÓN / RAILWAY) ---
const db = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',          
    password: process.env.MYSQLPASSWORD || '',          
    database: process.env.MYSQLDATABASE || 'inventario',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("✅ Sistema de conexión Pool preparado para MySQL.");

// ============================================================
// EVIDENCIA GA7-220501096-AA5-EV01: SERVICIOS WEB
// ============================================================

// --- SERVICIO 1: REGISTRO DE USUARIOS ---
app.post('/registro', (req, res) => {
    const { nuevoUsuario, nuevaClave, rol } = req.body;
    const sql = "INSERT INTO usuarios (nombre_usuario, password, rol) VALUES (?, ?, ?)";
    
    db.query(sql, [nuevoUsuario, nuevaClave, rol], (err, result) => {
        if (err) {
            console.error("Error al registrar:", err);
            return res.status(500).json({ success: false, message: "Error al registrar usuario" });
        }
        res.json({ success: true, message: "Usuario registrado con éxito" });
    });
});

// --- SERVICIO 2: INICIO DE SESIÓN (LOGIN) ---
app.post('/login', (req, res) => {
    const { usuarioIngresado, claveIngresada } = req.body;
    const sql = "SELECT * FROM usuarios WHERE nombre_usuario = ? AND password = ?";
    
    db.query(sql, [usuarioIngresado, claveIngresada], (err, result) => {
        if (err) {
            console.error("Error en el login:", err);
            return res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
        
        if (result.length > 0) {
            return res.json({ success: true, message: "Autenticación satisfactoria" });
        } else {
            return res.json({ success: false, message: "Error en la autenticación" });
        }
    });
});

// ============================================================
// SERVICIOS DE GESTIÓN DE INVENTARIO (PRODUCTOS)
// ============================================================

// --- OBTENER TODOS LOS PRODUCTOS ---
app.get('/productos', (req, res) => {
    const sql = "SELECT * FROM productos"; 
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error al leer productos" });
        }
        return res.json(data);
    });
});

// --- CREAR PRODUCTO ---
app.post('/crear', (req, res) => {
    const sql = "INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)";
    const values = [req.body.nombre, req.body.cantidad, req.body.precio];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ success: true, message: "Producto guardado" });
    });
});

// --- ACTUALIZAR STOCK Y REGISTRAR ENTREGA ---
app.put('/entregar/:id', (req, res) => {
    const id = req.params.id;
    const { cantidadARestar, persona_recibe, area, nombre_producto } = req.body;

    const sqlUpdate = "UPDATE productos SET cantidad = cantidad - ? WHERE id = ? AND cantidad >= ?";
    
    db.query(sqlUpdate, [cantidadARestar, id, cantidadARestar], (err, result) => {
        if (err) {
            console.error("Error al actualizar stock:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "Saldo insuficiente o ID no encontrado" });
        }

        const sqlInsert = "INSERT INTO entregas (id_producto, nombre_producto, cantidad, persona_recibe, area) VALUES (?, ?, ?, ?, ?)";
        const valuesInsert = [id, nombre_producto, cantidadARestar, persona_recibe, area];

        db.query(sqlInsert, valuesInsert, (errInsert, resultInsert) => {
            if (errInsert) {
                console.error("Error al registrar historial:", errInsert);
                return res.status(500).json({ success: false, message: "Stock restado pero falló el registro de historial" });
            }
            return res.json({ success: true, message: "Entrega registrada y stock actualizado con éxito" });
        });
    });
});

// --- OBTENER EL HISTORIAL DE ENTREGAS ---
app.get('/historial', (req, res) => {
    const sql = "SELECT * FROM entregas ORDER BY fecha_entrega DESC"; 
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error al leer historial:", err);
            return res.status(500).json({ error: "Error al leer historial" });
        }
        return res.json(data);
    });
});

// --- ELIMINAR PRODUCTO ---
app.delete('/eliminar/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM productos WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ success: true, message: "Producto eliminado" });
    });
});

// --- ARRANQUE DEL SERVIDOR (PUERTO DINÁMICO REQUERIDO POR RAILWAY) ---
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`🚀 Servidor del Backend corriendo en el puerto ${PORT}`);
});