import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  // --- FUNCIÓN 1: INICIO DE SESIÓN (LOGIN) ---
  const handleLogin = (e) => {
    e.preventDefault();

    if (usuario === "" || clave === "") {
      alert("Por favor, llena todos los campos");
      return;
    }

    // URL modificada para producción en Railway
    axios.post('https://localtocloud-production.up.railway.app/login', { 
      usuarioIngresado: usuario, 
      claveIngresada: clave 
    })
    .then(res => {
      if (res.data.success) {
        // MENSAJE REQUERIDO POR EL SENA
        alert("✅ " + res.data.message); 
        navigate('/dashboard'); 
      } else {
        // MENSAJE DE ERROR REQUERIDO POR EL SENA
        alert("❌ " + res.data.message);
      }
    })
    .catch(err => {
      console.log(err);
      alert("❌ No se pudo conectar con el servidor.");
    });
  };

  // --- FUNCIÓN 2: REGISTRO DE USUARIO NUEVO ---
  const handleRegistro = () => {
    if (usuario === "" || clave === "") {
      alert("Para registrarte, escribe un usuario y contraseña en los cuadros.");
      return;
    }

    // URL modificada para producción en Railway
    axios.post('https://localtocloud-production.up.railway.app/registro', { 
      nuevoUsuario: usuario, 
      nuevaClave: clave,
      rol: 'usuario' // Por defecto lo creamos como rol usuario
    })
    .then(res => {
      if (res.data.success) {
        alert("✅ " + res.data.message); // "Usuario registrado con éxito"
      } else {
        alert("❌ Error al registrar.");
      }
    })
    .catch(err => {
      console.log(err);
      alert("❌ Error de conexión al intentar registrar.");
    });
  };

  return (
    <div style={styles.contenedorPrincipal}>
      <div style={styles.cuadroLogin}>
        
        <div style={styles.encabezado}>
          <h1 style={styles.titulo}>Control Job</h1>
        </div>

        <form style={styles.formulario} onSubmit={handleLogin}>
          <div style={styles.grupoCampo}>
            <label style={styles.etiqueta}>Usuario</label>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Ej: admin"
              onChange={e => setUsuario(e.target.value)} 
            />
          </div>

          <div style={styles.grupoCampo}>
            <label style={styles.etiqueta}>Contraseña</label>
            <input 
              type="password" 
              style={styles.input} 
              placeholder="Ej: 123"
              onChange={e => setClave(e.target.value)} 
            />
          </div>

          <button type="submit" style={styles.botonIngresar}>
            Ingresar
          </button>

          {/* BOTÓN NUEVO PARA REGISTRO */}
          <button 
            type="button" 
            onClick={handleRegistro} 
            style={styles.botonRegistrar}
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  contenedorPrincipal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  cuadroLogin: {
    backgroundColor: '#ffffff',
    width: '320px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  encabezado: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderBottom: '1px solid #ddd',
    textAlign: 'center'
  },
  titulo: {
    margin: 0,
    fontSize: '22px',
    color: '#333',
    fontWeight: 'bold'
  },
  formulario: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  grupoCampo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  etiqueta: {
    fontSize: '15px',
    color: '#333'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none'
  },
  botonIngresar: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  botonRegistrar: {
    backgroundColor: '#28a745', 
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default Login;