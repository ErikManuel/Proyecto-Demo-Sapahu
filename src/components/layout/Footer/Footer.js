import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope,
  faClock,
  faWater, // Icono de agua para el logo
  faShieldHalved, // Icono de seguridad/institucional
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faTwitter, 
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.scss';
import { resetDemoData } from '@/mocks/demoApi';
import { useAuth } from '@/hooks/useAuth';
import { HOME_NAV_ITEM, getNavItemsByRole } from '@/utils/navByRole';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
  const { user } = useAuth();

  const handleResetDemo = () => {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm('Esto reiniciara todos los datos de demostracion. ¿Deseas continuar?');
    if (!confirmed) return;

    resetDemoData();
    window.location.reload();
  };

  const socialLinks = [
    { 
      icon: faFacebook, 
      href: '#', 
      label: 'Facebook',
      color: '#1877F2'
    },
    { 
      icon: faTwitter, 
      href: '#', 
      label: 'Twitter',
      color: '#1DA1F2'
    },
    { 
      icon: faInstagram, 
      href: '#', 
      label: 'Instagram',
      color: '#E4405F'
    },
    { 
      icon: faYoutube, 
      href: '#', 
      label: 'YouTube',
      color: '#FF0000'
    }
  ];

  const roleQuickLinks = getNavItemsByRole(user?.role);
  const quickLinks = [HOME_NAV_ITEM, ...roleQuickLinks];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <div className={styles.footerContent}>
          
          {/* Logo y Descripción */}
          <div className={styles.footerSection}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <FontAwesomeIcon icon={faWater} className={styles.logoIcon} />
                <div className={styles.logoText}>
                  <h3>Sistema de Cobranza</h3>
                  <span className={styles.logoSubtitle}>Gestión Municipal de Agua</span>
                </div>
              </div>
              <p className={styles.description}>
                Plataforma integral para la gestión eficiente de servicios de agua potable municipal. 
                Consulte pagos, administre usuarios y monitoree ingresos en tiempo real.
              </p>
              <div className={styles.securityBadge}>
                <FontAwesomeIcon icon={faShieldHalved} />
                <span>Sistema Seguro Certificado</span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Enlaces Rápidos</h4>
            <nav className={styles.quickLinks}>
              {quickLinks.map((link, index) => (
                <a key={index} href={link.href} className={styles.quickLink}>
                  <FontAwesomeIcon icon={link.icon} className={styles.quickLinkIcon} />
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Información de Contacto */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Contacto</h4>
            
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>Dirección</strong>
                  <p>Av. Independencia #100<br />Centro, C.P. 12345<br />Municipio, Estado</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faPhone} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>Teléfono</strong>
                  <p>(55) 1234-5678</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>Correo Electrónico</strong>
                  <p>agua@municipio.gob.mx</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <FontAwesomeIcon icon={faClock} className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>Horario de Atención</strong>
                  <p>Lunes a Viernes<br />8:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Síguenos</h4>
            <p className={styles.socialDescription}>
              Mantente informado sobre nuestros servicios y avisos importantes
            </p>
            
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className={styles.socialLink}
                  style={{ '--social-color': social.color }}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>

            {/* Información Adicional */}
            <div className={styles.additionalInfo}>
              <div className={styles.infoItem}>
                <strong>Soporte Técnico:</strong>
                <span>soporte@municipio.gob.mx</span>
              </div>
              <div className={styles.infoItem}>
                <strong>Emergencias:</strong>
                <span>24/7 - (55) 9876-5432</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} Sistema de Cobranza de Agua Municipal. Todos los derechos reservados.</p>
          </div>
          <div className={styles.legalLinks}>
            <a href="/privacidad">Política de Privacidad</a>
            <a href="/terminos">Términos de Servicio</a>
            <a href="/accesibilidad">Accesibilidad</a>
            {isDemoMode && (
              <button type="button" className={styles.resetDemoButton} onClick={handleResetDemo}>
                <FontAwesomeIcon icon={faRotateLeft} />
                Restablecer estado de demostracion
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}