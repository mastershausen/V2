/**
 * Feature-Flag-Service
 * 
 * Zentralisierte Verwaltung für Feature-Flags in der Anwendung.
 * Ermöglicht flexible Steuerung von Features basierend auf:
 * - App-Modus (development, demo, live)
 * - Benutzerrolle (free, pro, premium, admin)
 */

import { isDemoMode, isLiveMode, isDevelopmentMode } from '@/features/auth/config/modes';
import { useModeStore } from '@/features/mode/stores';
import { useUserStore } from '@/stores/userStore';
import { UserRole } from '@/types/userTypes';



// Alle verfügbaren Feature-Flags
export type FeatureFlag = 
  | 'DEBUG_MENU'           // Debug-Menü in den Einstellungen
  | 'ROLE_SWITCHER'        // Rollenumschalter im Debug-Menü
  | 'DEMO_MODE_BUTTON'     // Demo-Modus-Button in der UI
  | 'PREMIUM_FEATURES';    // Premium-Features für berechtigte Benutzer

// Lebenszyklus-Status eines Feature-Flags
export type FeatureFlagLifecycle = 
  | 'beta'            // Neu und experimentell, kann instabil sein
  | 'stable'          // Stabil und getestet, bereit für Produktion
  | 'deprecated'      // Veraltet, wird in Zukunft entfernt
  | 'planned-removal' // Geplant zur Entfernung in naher Zukunft
  | 'legacy';         // Alte Funktionalität, die aus Kompatibilitätsgründen beibehalten wird

// Konfiguration für ein Feature-Flag
interface FeatureFlagConfig {
  // APP_ENV-Konfiguration
  enabledInDevelopment: boolean;  // Ob das Feature im Development-Modus aktiviert ist
  enabledInDemo: boolean;         // Ob das Feature im Demo-Modus aktiviert ist 
  enabledInLive: boolean;         // Ob das Feature im Live-Modus aktiviert ist

  // Beschränkungen
  requiredRoles?: UserRole[];     // Welche Benutzerrollen für dieses Feature erforderlich sind
  
  // Metainformationen
  description: string;            // Beschreibung des Features
  createdAt: string;              // Erstellungsdatum (YYYY-MM-DD)
  expiresAt?: string;             // Ablaufdatum, falls vorhanden (YYYY-MM-DD)
  replacedBy?: FeatureFlag;       // Ersatz-Feature, falls veraltet
  owner?: string;                 // Wer ist für dieses Feature verantwortlich
  lifecycleStage?: FeatureFlagLifecycle; // Status im Lebenszyklus
  
  // Debug-Überschreibungen
  forceEnabled?: boolean;         // Erzwingt Aktivierung, unabhängig von anderen Bedingungen
  forceDisabled?: boolean;        // Erzwingt Deaktivierung, unabhängig von anderen Bedingungen
  
  // Nutzungsverfolgung
  usageCount: number;             // Wie oft wurde dieses Flag abgefragt
}

// Prüft, ob ein Datum abgelaufen ist
function isDateExpired(dateString?: string): boolean {
  if (!dateString) return false;
  
  const expiryDate = new Date(dateString);
  const currentDate = new Date();
  
  return currentDate > expiryDate;
}

// Standard-Konfigurationen für alle Feature-Flags
const featureConfigs: Record<FeatureFlag, FeatureFlagConfig> = {
  DEBUG_MENU: {
    enabledInLive: false,
    enabledInDemo: true,
    enabledInDevelopment: true,
    description: 'Zeigt das Debug-Menü in den Einstellungen an',
    createdAt: '2023-10-01',
    expiresAt: '2025-01-01',
    owner: 'DevTeam',
    lifecycleStage: 'stable',
    usageCount: 0
  },
  ROLE_SWITCHER: {
    enabledInLive: false,
    enabledInDemo: true,
    enabledInDevelopment: true,
    description: 'Ermöglicht das Umschalten der Benutzerrolle im Debug-Menü',
    createdAt: '2023-10-01',
    expiresAt: '2025-01-01',
    owner: 'DevTeam',
    lifecycleStage: 'stable',
    usageCount: 0
  },
  DEMO_MODE_BUTTON: {
    enabledInLive: false,
    enabledInDemo: true,
    enabledInDevelopment: true,
    description: 'Zeigt den Demo-Modus-Button in der UI an (nur im Development-Build)',
    createdAt: '2023-10-01',
    expiresAt: '2025-01-01',
    owner: 'DevTeam',
    lifecycleStage: 'stable',
    usageCount: 0
  },
  PREMIUM_FEATURES: {
    enabledInLive: true,
    enabledInDemo: true,
    enabledInDevelopment: true,
    requiredRoles: ['premium', 'admin'],
    description: 'Aktiviert Premium-Features für berechtigte Benutzer',
    createdAt: '2023-10-01',
    owner: 'ProductTeam',
    lifecycleStage: 'stable',
    usageCount: 0
  }
};

// Nutzungs-Tracking-Daten für Analytics
interface FeatureUsageData {
  flagName: FeatureFlag;
  wasEnabled: boolean;
  userRole?: UserRole;
  userMode?: string;
  screenName?: string;
  timestamp: string;
}

// In-Memory-Speicher für Flag-Nutzung (im echten System könnte dies zu einem Analytics-Service gehen)
const usageData: FeatureUsageData[] = [];

/**
 * Interne Hilfsfunktion zur Berechnung, ob ein Feature aktiviert ist.
 * Ruft NICHT _trackUsageInternal auf, um Rekursion zu vermeiden.
 * @param feature
 */
function calculateIsFeatureEnabled(feature: FeatureFlag): boolean {
  const featureConfig = featureConfigs[feature];
  
  // Warnung, wenn das Flag abgelaufen ist
  if (isDateExpired(featureConfig.expiresAt)) {
    console.warn(
      `🚨 Feature-Flag "${feature}" ist am ${featureConfig.expiresAt} abgelaufen und sollte entfernt werden. ` + 
      `Verantwortlich: ${featureConfig.owner}`
    );
    
    // Wenn es einen Ersatz gibt, diesen vorschlagen
    if (featureConfig.replacedBy) {
      console.warn(`   Bitte stattdessen '${featureConfig.replacedBy}' verwenden.`);
    }
  }
  
  // Store-State abrufen
  const storeState = useUserStore.getState();
  const user = storeState.user;
  const userRole = user?.role as UserRole | undefined;
  
  // Force-Überschreibungen für Tests
  if (featureConfig.forceEnabled) return true;
  if (featureConfig.forceDisabled) return false;
  
  // Basis-Prüfung nach App-Modus
  let isEnabledForMode = false;
  if (isLiveMode()) {
    isEnabledForMode = featureConfig.enabledInLive;
  } else if (isDemoMode()) {
    isEnabledForMode = featureConfig.enabledInDemo;
  } else if (isDevelopmentMode()) {
    isEnabledForMode = featureConfig.enabledInDevelopment;
  }
  
  // Wenn für den App-Modus nicht aktiviert, früh aussteigen
  if (!isEnabledForMode && isLiveMode()) {
    return false;
  }
  
  // Benutzerrolle prüfen (wenn konfiguriert)
  if (featureConfig.requiredRoles && featureConfig.requiredRoles.length > 0) {
    if (!userRole) {
      return false; // Wenn keine Rolle vorhanden, kein Zugriff
    }
    
    // Überprüfen, ob die aktuelle Rolle in den erforderlichen Rollen enthalten ist
    const hasRequiredRole = featureConfig.requiredRoles.includes(userRole);
    
    if (isLiveMode()) {
      // Im Live-Modus ist das eine UND-Bedingung
      isEnabledForMode = isEnabledForMode && hasRequiredRole;
    } else {
      // In anderen Modi eine ODER-Bedingung
      isEnabledForMode = isEnabledForMode || hasRequiredRole;
    }
  }
  
  return isEnabledForMode;
}

/**
 * Feature-Flag-Service zur zentralen Verwaltung von Feature-Flags
 */
export const FeatureFlags = {
  /**
   * Prüft, ob ein Feature aktiviert ist
   * @param feature Das zu prüfende Feature-Flag
   * @param trackingInfo Optionale Informationen für das Nutzungs-Tracking
   * @param trackingInfo.screenName
   * @returns true wenn das Feature aktiviert ist, sonst false
   */
  isEnabled: (
    feature: FeatureFlag, 
    trackingInfo?: { screenName?: string }
  ): boolean => {
    // Berechne Ergebnis vor dem Tracking, um Rekursion zu vermeiden
    const isEnabled = calculateIsFeatureEnabled(feature);
    
    // Feature-Flag-Nutzung verfolgen (aber nur, wenn wir nicht im Tracking sind)
    try {
      // Inkrementiere Nutzungszähler direkt
      featureConfigs[feature].usageCount++;
      
      const storeState = useUserStore.getState();
      const userRole = storeState.user?.role;
      const modeState = useModeStore.getState();
      const userMode = modeState.userStatus;
      
      // Erfasse Nutzungsdaten für Analytics
      usageData.push({
        flagName: feature,
        wasEnabled: isEnabled, // Verwende bereits berechneten Wert
        userRole,
        userMode,
        screenName: trackingInfo?.screenName,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      // Tracking-Fehler sollten die Anwendung nicht beeinträchtigen
      console.error('Fehler beim Tracking der Feature-Flag-Nutzung:', e);
    }
    
    return isEnabled;
  },
  
  /**
   * Inkrementiert den Nutzungszähler für ein Feature
   * @param feature
   * @param trackingInfo
   * @param trackingInfo.screenName
   * @private
   * @deprecated Diese Methode wurde entfernt, um Rekursion zu vermeiden. Tracking erfolgt direkt in isEnabled.
   */
  _trackUsageInternal: (
    feature: FeatureFlag,
    trackingInfo?: { screenName?: string }
  ): void => {
    // Leere Implementierung, um bestehende Aufrufe nicht zu brechen
    // Keine Implementierung, um Rekursion zu vermeiden
    return;
  },
  
  /**
   * Gibt die Nutzungsstatistiken für Feature-Flags zurück
   * @returns Ein Objekt mit allen Feature-Flags und deren Nutzungsstatistiken
   */
  getUsageStats: () => {
    return Object.entries(featureConfigs).map(([flag, config]) => ({
      flag,
      usageCount: config.usageCount,
      lifecycle: config.lifecycleStage || 'stable',
      isExpired: isDateExpired(config.expiresAt)
    }));
  },
  
  /**
   * Gibt die vollständige Konfiguration eines Feature-Flags zurück
   * @param feature Das Feature-Flag
   * @returns Die Konfiguration des Feature-Flags
   */
  getFeatureConfig: (feature: FeatureFlag) => {
    return { ...featureConfigs[feature] };
  },
  
  /**
   * Gibt alle Feature-Flag-Namen zurück
   * @returns Ein Array mit allen Feature-Flag-Namen
   */
  getAllFeatureNames: (): FeatureFlag[] => {
    return Object.keys(featureConfigs) as FeatureFlag[];
  },
  
  /**
   * Nutzungsdaten für Analytics abrufen und zurücksetzen
   * @returns Die gesammelten Nutzungsdaten
   */
  collectUsageData: (): FeatureUsageData[] => {
    const data = [...usageData];
    usageData.length = 0; // Array leeren
    return data;
  }
}; 