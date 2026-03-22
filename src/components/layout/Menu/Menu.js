import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved,
  faClock,
  faUserShield,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import styles from './Menu.module.scss';

export function Menu() {
  const features = [
    {
      icon: faChartLine,
      title: 'Gestión Integral',
      description: 'Control completo de contratos y pagos.'
    },
    {
      icon: faShieldHalved,
      title: 'Seguro y Confiable',
      description: 'Sistema protegido para uso municipal.'
    },
    {
      icon: faClock,
      title: 'Tiempo Real',
      description: 'Información actualizada al instante.'
    },
    {
      icon: faUserShield,
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva y profesional.'
    }
  ];

  return (
    <section className={styles.menu}>
      <div className={styles.menuContainer}>
        {/* Contenido Principal */}
        <div className={styles.menuContent}>
          <h1 className={styles.menuTitle}>
            Bienvenido al Sistema de Cobranza
          </h1>
          <p className={styles.menuDescription}>
            Plataforma integral para la gestión eficiente de servicios de agua potable municipal. 
            Consulte pagos, administre usuarios y monitoree ingresos en tiempo real.
          </p>
        </div>

        {/* Características */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}