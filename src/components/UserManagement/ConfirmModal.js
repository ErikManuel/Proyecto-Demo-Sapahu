import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faCheckCircle, 
  faUser,
  faEnvelope,
  faUserTag,
  faMapMarkerAlt,
  faPowerOff,
  faPlay,
  faBan
} from '@fortawesome/free-solid-svg-icons';
import styles from './UserManagement.module.scss';

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  usuario, 
  actionType = 'deactivate', // 'deactivate', 'activate', 'delete'
  loading = false 
}) {
  if (!isOpen) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case 'activate':
        return {
          title: 'Activar Usuario',
          message: '¿Estás seguro de que quieres activar este usuario?',
          icon: faPlay,
          iconClass: 'success',
          buttonText: 'Activar Usuario',
          buttonClass: 'success',
          warning: 'El usuario podrá acceder al sistema nuevamente.'
        };
      case 'delete':
        return {
          title: 'Eliminar Usuario',
          message: '¿Estás seguro de que quieres eliminar permanentemente este usuario?',
          icon: faBan,
          iconClass: 'danger',
          buttonText: 'Eliminar Permanentemente',
          buttonClass: 'danger',
          warning: 'Esta acción no se puede deshacer. Todos los datos del usuario se perderán.'
        };
      default: // deactivate
        return {
          title: 'Desactivar Usuario',
          message: '¿Estás seguro de que quieres desactivar este usuario?',
          icon: faPowerOff,
          iconClass: 'warning',
          buttonText: 'Desactivar Usuario',
          buttonClass: 'danger',
          warning: 'El usuario no podrá acceder al sistema hasta que sea activado nuevamente.'
        };
    }
  };

  const config = getActionConfig();

  const handleConfirm = () => {
    onConfirm(usuario);
  };

  return (
    <div className={styles.confirmModalOverlay}>
      <div className={styles.confirmModal}>
        <div className={styles.confirmModalHeader}>
          <div className={`${styles.confirmIcon} ${styles[config.iconClass]}`}>
            <FontAwesomeIcon icon={config.icon} />
          </div>
          <h3>{config.title}</h3>
          <p>{config.message}</p>
        </div>

        <div className={styles.confirmModalBody}>
          <div className={styles.userInfo}>
            <div className={styles.userDetail}>
              <FontAwesomeIcon icon={faUser} />
              <span className={styles.userName}>{usuario.name}</span>
            </div>
            <div className={styles.userDetail}>
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{usuario.email}</span>
            </div>
            <div className={styles.userDetail}>
              <FontAwesomeIcon icon={faUserTag} />
              <span>
                {usuario.role === 'admin' ? 'Administrador' : 
                 usuario.role === 'cobrador' ? 'Cobrador' : 'Consultor'}
              </span>
            </div>
            {usuario.municipio && (
              <div className={styles.userDetail}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{usuario.municipio}</span>
              </div>
            )}
          </div>

          <div className={styles.warningText}>
            <strong>⚠️ Importante</strong>
            <span>{config.warning}</span>
          </div>
        </div>

        <div className={styles.confirmModalActions}>
          <button 
            className={styles.confirmCancel}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            className={`${styles.confirmAction} ${styles[config.buttonClass]}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faCheckCircle} spin />
                Procesando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={config.icon} />
                {config.buttonText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}