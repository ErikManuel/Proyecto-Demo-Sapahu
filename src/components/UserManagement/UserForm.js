import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes,
  faSave,
  faUser,
  faEnvelope,
  faLock,
  faUserShield,
  faUserTag,
  faMapMarkerAlt,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faEdit,
  faCheck,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { useUsers } from './hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import styles from './UserManagement.module.scss';

export function UserForm({ usuario, onClose, onUsuarioGuardado }) {
  const { crearUsuario, actualizarUsuario, error, usuarios } = useUsers();
  const { user: adminActual } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [mostrarConfirmacionAdmin, setMostrarConfirmacionAdmin] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cobrador',
    municipio: ''
  });

  const [confirmacionData, setConfirmacionData] = useState({
    passwordAdmin: ''
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        name: usuario.name || '',
        email: usuario.email || '',
        password: '',
        confirmPassword: '',
        role: usuario.role || 'cobrador',
        municipio: usuario.municipio || ''
      });
    }
  }, [usuario]);

  useEffect(() => {
    if (!mostrarConfirmacionAdmin) {
      setConfirmacionData({ passwordAdmin: '' });
    }
  }, [mostrarConfirmacionAdmin]);

  // ✅ NUEVA FUNCIÓN: Validación en tiempo real
  const validarCampo = (name, value) => {
    const nuevosErrores = { ...erroresValidacion };
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          nuevosErrores.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          nuevosErrores.email = 'El formato del email no es válido';
        } else if (usuarios.some(u => u.email === value.trim() && u._id !== usuario?._id)) {
          nuevosErrores.email = 'Ya existe un usuario con este email';
        } else {
          delete nuevosErrores.email;
        }
        break;
        
      case 'name':
        if (!value.trim()) {
          nuevosErrores.name = 'El nombre es requerido';
        } else if (value.trim().length < 2) {
          nuevosErrores.name = 'El nombre debe tener al menos 2 caracteres';
        } else {
          delete nuevosErrores.name;
        }
        break;
        
      case 'municipio':
        if (!value.trim()) {
          nuevosErrores.municipio = 'El municipio es requerido';
        } else {
          delete nuevosErrores.municipio;
        }
        break;
        
      case 'password':
        if (!usuario && !value) {
          nuevosErrores.password = 'La contraseña es requerida';
        } else if (value && value.length < 6) {
          nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
        } else {
          delete nuevosErrores.password;
        }
        
        // Validar confirmación cuando cambia la contraseña
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
        } else if (formData.confirmPassword) {
          delete nuevosErrores.confirmPassword;
        }
        break;
        
      case 'confirmPassword':
        if ((!usuario || formData.password) && !value) {
          nuevosErrores.confirmPassword = 'Confirma la contraseña';
        } else if (value !== formData.password) {
          nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete nuevosErrores.confirmPassword;
        }
        break;
    }
    
    setErroresValidacion(nuevosErrores);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ✅ Validar en tiempo real
    validarCampo(name, value);
  };

  const handleConfirmacionChange = (e) => {
    const { name, value } = e.target;
    setConfirmacionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ FUNCIÓN MEJORADA: Validación completa antes de enviar
  const validarFormularioCompleto = () => {
    const errores = {};
    
    // Validar campos requeridos
    if (!formData.name.trim()) {
      errores.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      errores.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errores.email = 'El formato del email no es válido';
    } else if (usuarios.some(u => u.email === formData.email.trim() && u._id !== usuario?._id)) {
      errores.email = 'Ya existe un usuario con este email';
    }
    
    if (!formData.role) {
      errores.role = 'El rol es requerido';
    }
    
    if (!formData.municipio.trim()) {
      errores.municipio = 'El municipio es requerido';
    }

    // Validaciones específicas por modo
    if (!usuario) {
      if (!formData.password) {
        errores.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        errores.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      if (!formData.confirmPassword) {
        errores.confirmPassword = 'Confirma la contraseña';
      }
    } else {
      if (formData.password && formData.password.length < 6) {
        errores.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      errores.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErroresValidacion(errores);
    
    // Si hay errores, mostrar el primero
    if (Object.keys(errores).length > 0) {
      const primerError = Object.values(errores)[0];
      throw new Error(primerError);
    }

    // Si se está asignando rol de admin, requerir confirmación
    if (formData.role === 'admin' && !usuario) {
      setMostrarConfirmacionAdmin(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    try {
      // Validar formulario completo
      if (!validarFormularioCompleto()) {
        return;
      }

      setLoading(true);

      const datosEnvio = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        municipio: formData.municipio.trim()
      };

      if (!usuario || formData.password) {
        datosEnvio.password = formData.password;
      }

      let result;
      if (usuario) {
        result = await actualizarUsuario(usuario._id, datosEnvio);
      } else {
        result = await crearUsuario(datosEnvio);
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onUsuarioGuardado(result);
      }, 1500);
      
    } catch (err) {
      console.error('Error guardando usuario:', err);
      setSubmitStatus('error');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (resto del código handleConfirmacionAdmin permanece igual)

  // ✅ NUEVA FUNCIÓN: Obtener clase CSS para el campo
  const getFieldClass = (fieldName) => {
    if (erroresValidacion[fieldName]) {
      return styles.fieldError;
    }
    return '';
  };

  // ✅ NUEVA FUNCIÓN: Mostrar estado de validación
  const renderValidationIcon = (fieldName) => {
    if (!formData[fieldName]) return null;
    
    if (erroresValidacion[fieldName]) {
      return <FontAwesomeIcon icon={faTimesCircle} className={styles.iconError} />;
    } else {
      return <FontAwesomeIcon icon={faCheck} className={styles.iconSuccess} />;
    }
  };

  const esModoEdicion = !!usuario;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>
            <FontAwesomeIcon icon={esModoEdicion ? faEdit : faUser} />
            {esModoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {submitStatus === 'success' && (
          <div className={styles.successMessage}>
            <FontAwesomeIcon icon={faCheckCircle} />
            <div>
              <strong>¡Usuario guardado exitosamente!</strong>
              <p>El usuario ha sido {esModoEdicion ? 'actualizado' : 'creado'} correctamente.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className={styles.errorMessage}>
            <FontAwesomeIcon icon={faExclamationCircle} />
            <div>
              <strong>Error al guardar usuario</strong>
              <p>{error || 'Por favor, intenta nuevamente.'}</p>
            </div>
          </div>
        )}

        {mostrarConfirmacionAdmin ? (
          <form onSubmit={handleConfirmacionAdmin} className={styles.form}>
            <div className={styles.confirmacionAdmin}>
              <FontAwesomeIcon icon={faUserShield} size="2x" />
              <h4>Confirmación Requerida</h4>
              <p>Estás a punto de crear un usuario con permisos de administrador. 
                 Por seguridad, ingresa tu contraseña actual para confirmar.</p>
              
              <div className={styles.formGroup}>
                <label htmlFor="passwordAdmin">
                  <FontAwesomeIcon icon={faLock} /> Tu Contraseña de Administrador *
                </label>
                <input
                  type="password"
                  id="passwordAdmin"
                  name="passwordAdmin"
                  value={confirmacionData.passwordAdmin}
                  onChange={handleConfirmacionChange}
                  required
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.secondaryButton}
                  onClick={() => setMostrarConfirmacionAdmin(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Confirmando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} /> Confirmar
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">
                  <FontAwesomeIcon icon={faUser} /> Nombre Completo
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Juan Pérez"
                    className={getFieldClass('name')}
                  />
                  {renderValidationIcon('name')}
                </div>
                {erroresValidacion.name && (
                  <div className={styles.errorText}>{erroresValidacion.name}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ejemplo@correo.com"
                    className={getFieldClass('email')}
                  />
                  {renderValidationIcon('email')}
                </div>
                {erroresValidacion.email && (
                  <div className={styles.errorText}>{erroresValidacion.email}</div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="role">
                  <FontAwesomeIcon icon={faUserTag} /> Rol
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="cobrador">Cobrador</option>
                  <option value="consultor">Consultor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="municipio">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Municipio
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    id="municipio"
                    name="municipio"
                    value={formData.municipio}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Municipio Principal"
                    className={getFieldClass('municipio')}
                  />
                  {renderValidationIcon('municipio')}
                </div>
                {erroresValidacion.municipio && (
                  <div className={styles.errorText}>{erroresValidacion.municipio}</div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="password">
                  <FontAwesomeIcon icon={faLock} /> 
                  {esModoEdicion ? 'Nueva Contraseña' : 'Contraseña'}
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!esModoEdicion}
                    placeholder={esModoEdicion ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
                    minLength={6}
                    className={getFieldClass('password')}
                  />
                  {renderValidationIcon('password')}
                </div>
                {erroresValidacion.password && (
                  <div className={styles.errorText}>{erroresValidacion.password}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">
                  <FontAwesomeIcon icon={faLock} /> 
                  {esModoEdicion ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña'}
                </label>
                <div className={styles.inputContainer}>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!esModoEdicion || formData.password}
                    placeholder="Repite la contraseña"
                    className={getFieldClass('confirmPassword')}
                  />
                  {renderValidationIcon('confirmPassword')}
                </div>
                {erroresValidacion.confirmPassword && (
                  <div className={styles.errorText}>{erroresValidacion.confirmPassword}</div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.secondaryButton}
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className={styles.primaryButton}
                disabled={loading || Object.keys(erroresValidacion).length > 0}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Guardando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} /> 
                    {esModoEdicion ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}