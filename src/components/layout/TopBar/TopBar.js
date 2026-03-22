import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faUser, faSignOutAlt,
  faChevronDown, faUserShield, faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import styles from './TopBar.module.scss';
import { useAuth } from '../../../hooks/useAuth';
import { getNavItemsByRole } from '@/utils/navByRole';

export function TopBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserDropdownOpen(false); // Cerrar dropdown si está abierto
  };

  const toggleUserDropdown = () => {
    if (window.innerWidth <= 768) {
      // En móvil, el click en el card abre el menú móvil
      toggleMobileMenu();
    } else {
      // En desktop, el click en el card abre el dropdown normal
      setIsUserDropdownOpen(!isUserDropdownOpen);
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navItems = getNavItemsByRole(user?.role);

  // Badge de rol con colores
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { label: 'Administrador', color: '#e53e3e', bgColor: '#fed7d7' },
      cobrador: { label: 'Cobrador', color: '#3182ce', bgColor: '#bee3f8' },
      consultor: { label: 'Consultor', color: '#38a169', bgColor: '#c6f6d5' }
    };
    
    return roleConfig[role] || { label: role, color: '#718096', bgColor: '#e2e8f0' };
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <div className={styles.topBar}>
      <div className={styles.topBarMain}>
        <div className={styles.leftSection}>
          {/* Logo */}
          <div className={styles.logo}>
            <h2>Sistema de Cobranza</h2>
            <span className={styles.subtitle}>Gestión Municipal</span>
          </div>
        </div>

        {/* Navegación Desktop - SOLO se muestra en desktop */}
        <nav className={styles.desktopNav}>
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className={styles.rightSection}>
          {/* Usuario Desktop con Dropdown */}
          <div className={styles.userContainer} ref={dropdownRef}>
            <div className={styles.userContent} onClick={toggleUserDropdown}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {user?.name || 'Usuario'}
                </span>
                <span 
                  className={styles.userRole}
                  style={{
                    color: roleBadge.color,
                    backgroundColor: roleBadge.bgColor,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {roleBadge.label}
                </span>
              </div>
              <div className={styles.userControls}>
                <div className={styles.userAvatar}>
                  <FontAwesomeIcon icon={user?.role === 'admin' ? faUserShield : faUser} />
                </div>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`${styles.chevron} ${isUserDropdownOpen ? styles.chevronRotated : ''}`} 
                />
              </div>
            </div>

            {/* Botón Menú Hamburguesa MÓVIL - Solo ícono, sin funcionalidad separada */}
            <div className={styles.mobileMenuIcon}>
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faEllipsisV} />
            </div>

            {/* Dropdown Menu (Desktop) */}
            {isUserDropdownOpen && (
              <div className={styles.userDropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    <FontAwesomeIcon icon={user?.role === 'admin' ? faUserShield : faUser} />
                  </div>
                  <div className={styles.dropdownUserInfo}>
                    <span className={styles.dropdownUserName}>
                      {user?.name || 'Usuario'}
                    </span>
                    <span 
                      className={styles.dropdownUserRole}
                      style={{
                        color: roleBadge.color,
                        backgroundColor: roleBadge.bgColor
                      }}
                    >
                      {roleBadge.label}
                    </span>
                    <span className={styles.dropdownUserEmail}>
                      {user?.email}
                    </span>
                    <span className={styles.dropdownUserMunicipio}>
                      {user?.municipio}
                    </span>
                  </div>
                </div>
                
                <div className={styles.dropdownDivider}></div>
                
                <button 
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className={styles.dropdownIcon} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MENÚ MÓVIL UNIFICADO ================= */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {/* Información del usuario */}
            <div className={styles.mobileUserInfo}>
              <div className={styles.userAvatar}>
                <FontAwesomeIcon icon={user?.role === 'admin' ? faUserShield : faUser} />
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>
                  {user?.name || 'Usuario'}
                </span>
                <span 
                  className={styles.userRole}
                  style={{
                    color: roleBadge.color,
                    backgroundColor: roleBadge.bgColor,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'inline-block',
                    marginTop: '4px'
                  }}
                >
                  {roleBadge.label}
                </span>
                <span className={styles.userEmail}>
                  {user?.email}
                </span>
                <span className={styles.userMunicipio}>
                  {user?.municipio}
                </span>
              </div>
            </div>

            <div className={styles.mobileDivider}></div>

            {/* OPCIONES DE NAVEGACIÓN - Las mismas que el topbar */}
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={item.icon} className={styles.mobileNavIcon} />
                <span>{item.label}</span>
              </a>
            ))}

            <div className={styles.mobileDivider}></div>

            {/* Cerrar Sesión */}
            <button 
              className={styles.mobileLogout}
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className={styles.mobileNavIcon} />
              <span>Cerrar Sesión</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}