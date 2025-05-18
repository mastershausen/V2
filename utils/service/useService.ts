/**
 * useService Hook
 * 
 * Hook für den einfachen Zugriff auf Services in React-Komponenten.
 */

import { useEffect, useState } from 'react';

import { logger } from '@/utils/logger';

import { IService, ServiceRegistry, ServiceType } from './serviceRegistry';

/**
 * Hook zum Zugriff auf einen Service aus der ServiceRegistry
 * @param {ServiceType} serviceType - Der Typ des Services, der geholt werden soll
 * @returns {T} Die Service-Instanz
 */
export default function useService<T extends IService>(serviceType: ServiceType): T {
  const registry = ServiceRegistry.getInstance();
  const [service] = useState<T>(() => registry.getService<T>(serviceType));

  useEffect(() => {
    // Initialisiere Service, wenn er noch nicht initialisiert ist
    registry.initService(serviceType).catch(error => {
      // Fehler beim Initialisieren in der Konsole loggen
      logger.error(`Fehler beim Initialisieren des Service ${serviceType}:`, String(error));
    });
  }, [serviceType, registry]);

  return service;
} 