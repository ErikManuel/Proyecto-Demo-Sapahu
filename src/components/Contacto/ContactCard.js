import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhoneAlt, 
  faEnvelope, 
  faBuilding, 
  faGlobe 
} from '@fortawesome/free-solid-svg-icons';
import styles from './Contacto.module.scss';

export function ContactCard({ contactInfo }) {
  const handleCall = (numero) => {
    console.log('Llamando a:', numero);
    window.open(`tel:${numero}`, '_self');
  };

  const handleEmail = (email) => {
    console.log('Enviando email a:', email);
    window.open(`mailto:${email}`, '_self');
  };

  const handleSocial = (url) => {
    console.log('Abriendo red social:', url);
    window.open(url, '_blank');
  };

  if (!contactInfo.telefonos) {
    return <div className={styles.loading}>Cargando información de contacto...</div>;
  }

  return (
    <div className={styles.contactCard}>
      {/* Teléfonos */}
      <div className={styles.contactSection}>
        <h3 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faPhoneAlt} /> Teléfonos de Contacto
        </h3>
        <div className={styles.contactGrid}>
          {contactInfo.telefonos.map((telefono, index) => (
            <div key={index} className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FontAwesomeIcon icon={telefono.icono} />
              </div>
              <div className={styles.contactContent}>
                <div className={styles.contactType}>{telefono.tipo}</div>
                <div 
                  className={styles.contactValue}
                  onClick={() => handleCall(telefono.numero)}
                >
                  {telefono.numero}
                </div>
                <div className={styles.contactDesc}>{telefono.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emails */}
      <div className={styles.contactSection}>
        <h3 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faEnvelope} /> Correos Electrónicos
        </h3>
        <div className={styles.contactGrid}>
          {contactInfo.emails.map((email, index) => (
            <div key={index} className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FontAwesomeIcon icon={email.icono} />
              </div>
              <div className={styles.contactContent}>
                <div className={styles.contactType}>{email.tipo}</div>
                <div 
                  className={styles.contactValue}
                  onClick={() => handleEmail(email.email)}
                >
                  {email.email}
                </div>
                <div className={styles.contactDesc}>{email.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direcciones */}
      <div className={styles.contactSection}>
        <h3 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faBuilding} /> Direcciones y Oficinas
        </h3>
        <div className={styles.contactGrid}>
          {contactInfo.direcciones.map((direccion, index) => (
            <div key={index} className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FontAwesomeIcon icon={direccion.icono} />
              </div>
              <div className={styles.contactContent}>
                <div className={styles.contactType}>{direccion.tipo}</div>
                <div className={styles.contactValue}>
                  {direccion.direccion}
                </div>
                <div className={styles.contactDesc}>{direccion.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redes Sociales */}
      <div className={styles.contactSection}>
        <h3 className={styles.sectionTitle}>
          <FontAwesomeIcon icon={faGlobe} /> Síguenos en Redes Sociales
        </h3>
        <div className={styles.contactGrid}>
          {contactInfo.redesSociales.map((red, index) => (
            <div key={index} className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FontAwesomeIcon icon={red.icono} />
              </div>
              <div className={styles.contactContent}>
                <div className={styles.contactType}>{red.plataforma}</div>
                <div 
                  className={styles.contactValue}
                  onClick={() => handleSocial(red.url)}
                >
                  {red.usuario}
                </div>
                <div className={styles.contactDesc}>{red.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}