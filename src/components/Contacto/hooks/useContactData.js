import { useState, useEffect } from 'react';
import { 
  faBuilding, 
  faTools, 
  faEnvelope, 
  faWrench, 
  faFileInvoice,
  faMapMarkerAlt,
  faIndustry
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp,
  faFacebook,
  faTwitter,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';

export function useContactData() {
  const [contactInfo, setContactInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContactInfo = () => {
      setLoading(true);
      setTimeout(() => {
        const mockContactInfo = {
          telefonos: [
            {
              tipo: 'Oficina Principal',
              numero: '555-123-4567',
              icono: faBuilding,
              descripcion: 'Atención general y consultas'
            },
            {
              tipo: 'WhatsApp Business',
              numero: '555-987-6543',
              icono: faWhatsapp,
              descripcion: 'Mensajes rápidos y soporte'
            },
            {
              tipo: 'Línea de Soporte',
              numero: '555-555-5555',
              icono: faTools,
              descripcion: 'Asistencia técnica y reportes'
            }
          ],
          emails: [
            {
              tipo: 'Contacto General',
              email: 'contacto@sapahu.com.mx',
              icono: faEnvelope,
              descripcion: 'Consultas generales'
            },
            {
              tipo: 'Soporte Técnico',
              email: 'soporte@sapahu.com.mx',
              icono: faWrench,
              descripcion: 'Asistencia técnica'
            },
            {
              tipo: 'Facturación',
              email: 'facturacion@sapahu.com.mx',
              icono: faFileInvoice,
              descripcion: 'Consultas de facturación'
            }
          ],
          direcciones: [
            {
              tipo: 'Oficina Central',
              direccion: 'Av. Principal #123, Colonia Centro, Ciudad de México, CP 06000',
              icono: faMapMarkerAlt,
              descripcion: 'Oficinas administrativas principales'
            },
            {
              tipo: 'Sucursal Norte',
              direccion: 'Calzada del Norte #456, Col. Industrial, Ciudad de México, CP 06300',
              icono: faIndustry,
              descripcion: 'Atención a clientes zona norte'
            }
          ],
          redesSociales: [
            {
              plataforma: 'Facebook',
              usuario: '@SAPAHUOficial',
              icono: faFacebook,
              url: '#',
              descripcion: 'Síguenos para noticias y actualizaciones'
            },
            {
              plataforma: 'Twitter',
              usuario: '@SAPAHU_CDMX',
              icono: faTwitter,
              url: '#',
              descripcion: 'Comunícate con nosotros rápidamente'
            },
            {
              plataforma: 'Instagram',
              usuario: '@sapahu_agua',
              icono: faInstagram,
              url: '#',
              descripcion: 'Mira nuestro trabajo en imágenes'
            }
          ]
        };
        setContactInfo(mockContactInfo);
        setLoading(false);
      }, 800);
    };

    loadContactInfo();
  }, []);

  return { contactInfo, loading };
}