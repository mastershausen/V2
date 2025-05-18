/**
 * @file features/auth/hooks/useAuthForm.ts
 * @description Hook für gemeinsame Auth-Formular-Logik
 * 
 * Stellt React Hooks für Login- und Registrierungsformulare bereit.
 * Verwaltet Formularfelder, Validierung, Fehlerbehandlung und Formulareinreichung.
 * Folgt dem Gold Standard mit stabilen Referenzen und getrennter UI/Logik.
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { 
  validateLoginForm, 
  validateRegisterForm, 
  FormValidationResult,
  ValidationError,
  getFieldError 
} from '../utils/formValidation';

/**
 * Gemeinsame Formularfelder für alle Auth-Formulare
 * @interface CommonFormFields
 */
export interface CommonFormFields {
  /** E-Mail-Adresse des Benutzers */
  email: string;
  /** Passwort des Benutzers */
  password: string;
}

/**
 * Formularfelder für das Login-Formular
 * @interface LoginFormFields
 * @extends CommonFormFields
 */
export interface LoginFormFields extends CommonFormFields {}

/**
 * Formularfelder für das Registrierungsformular
 * @interface RegisterFormFields
 * @extends CommonFormFields
 */
export interface RegisterFormFields extends CommonFormFields {
  /** Bestätigung des Passworts (für Validierung) */
  confirmPassword: string;
  /** Vorname des Benutzers (optional) */
  firstName: string;
  /** Nachname des Benutzers (optional) */
  lastName: string;
}

/**
 * Optionen für das Login-Formular
 * @interface LoginFormOptions
 */
export interface LoginFormOptions {
  /** Callback, der nach erfolgreicher Anmeldung aufgerufen wird */
  onSuccess?: () => void;
  /** Callback, der bei Fehler während der Anmeldung aufgerufen wird */
  onError?: (error: string) => void;
}

/**
 * Optionen für das Registrierungsformular
 * @interface RegisterFormOptions
 */
export interface RegisterFormOptions {
  /** Callback, der nach erfolgreicher Registrierung aufgerufen wird */
  onSuccess?: () => void;
  /** Callback, der bei Fehler während der Registrierung aufgerufen wird */
  onError?: (error: string) => void;
}

/**
 * Hook für Login-Formular-Logik
 * 
 * Verwaltet den Zustand und die Logik eines Login-Formulars,
 * einschließlich Feldaktualisierungen, Validierung und Formularabsendung.
 * Bietet stabile Referenzen für alle zurückgegebenen Funktionen.
 *
 * @param {LoginFormOptions} [options] - Optionen für das Login-Formular
 * @returns {Object} Formularstatus, -felder und -funktionen
 */
export function useLoginForm(options?: LoginFormOptions) {
  // Auth-Hook für Login-Funktion
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();
  
  // Formularfelder
  const [fields, setFields] = useState<LoginFormFields>({
    email: '',
    password: '',
  });
  
  // Formularstatus
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<FormValidationResult>({
    isValid: true,
    errors: []
  });
  
  /**
   * Integriert Auth-Fehler in das Validierungsergebnis
   */
  useEffect(() => {
    if (authError) {
      setValidationResult(prev => ({
        ...prev,
        isValid: false,
        errors: [
          ...prev.errors.filter(e => e.field !== 'auth'),
          { field: 'auth', message: authError.message }
        ]
      }));
    }
  }, [authError]);
  
  /**
   * Aktualisiert ein Formularfeld und bereinigt Validierungsfehler
   * 
   * @param {keyof LoginFormFields} field - Der Name des zu aktualisierenden Feldes
   * @returns {Function} Eine Funktion, die den Wert des Feldes aktualisiert
   */
  const updateField = useCallback((field: keyof LoginFormFields) => (value: string) => {
    setFields(prev => ({ ...prev, [field]: value }));
    
    // Entferne Validierungsfehler für dieses Feld
    setValidationResult(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.field !== field)
    }));
    
    // Entferne Auth-Fehler bei Eingabe
    if (authError) {
      clearError();
    }
  }, [authError, clearError]);
  
  /**
   * Verarbeitet die Formularabsendung
   * 
   * Validiert die Formularfelder und sendet die Anmeldeanfrage,
   * wenn die Validierung erfolgreich ist. Behandelt Erfolgs- und Fehlerfälle.
   * 
   * @returns {Promise<void>}
   */
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    // Tastatur ausblenden
    Keyboard.dismiss();
    
    // Formularvalidierung
    const result = validateLoginForm(fields.email, fields.password);
    setValidationResult(result);
    
    if (!result.isValid) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Login-Funktion aus Auth-Hook aufrufen
      const success = await login(fields.email, fields.password);
      
      if (success && options?.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      setValidationResult({
        isValid: false,
        errors: [{ field: 'auth', message: errorMessage }]
      });
      
      if (options?.onError) {
        options.onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [fields, isSubmitting, login, options]);
  
  /**
   * Gibt den Fehlermeldungstext für ein bestimmtes Feld zurück
   * 
   * @param {string} field - Der Name des Feldes
   * @returns {string|null} Die Fehlermeldung oder null, wenn keine vorhanden
   */
  const getErrorMessage = useCallback((field: string): string | null => {
    return getFieldError(validationResult.errors, field);
  }, [validationResult.errors]);
  
  /**
   * Auth-Fehlermeldung für allgemeine Formularfehler
   */
  const authErrorMessage = useMemo(() => {
    return getFieldError(validationResult.errors, 'auth');
  }, [validationResult.errors]);
  
  /**
   * Setzt alle Formularfelder auf ihre Standardwerte zurück
   */
  const resetForm = useCallback(() => {
    setFields({
      email: '',
      password: '',
    });
    setValidationResult({ isValid: true, errors: [] });
    if (authError) {
      clearError();
    }
  }, [authError, clearError]);
  
  /**
   * Füllt das Formular mit Demodaten für Testzwecke
   */
  const fillDemoData = useCallback(() => {
    setFields({
      email: 'demo@example.com',
      password: 'Demo123!',
    });
    setValidationResult({ isValid: true, errors: [] });
    if (authError) {
      clearError();
    }
  }, [authError, clearError]);
  
  return {
    // Daten
    formData: fields,
    validationResult,
    isSubmitting,
    isLoading: isSubmitting || authLoading,
    authError: authErrorMessage,
    
    // Funktionen
    updateField,
    handleSubmit,
    getFieldError: getErrorMessage,
    resetForm,
    fillDemoData,
  };
}

/**
 * Hook für Registrierungsformular-Logik
 * 
 * Verwaltet den Zustand und die Logik eines Registrierungsformulars,
 * einschließlich erweiterter Felder für die Benutzerregistrierung.
 * 
 * @param {RegisterFormOptions} [options] - Optionen für das Registrierungsformular
 * @returns {Object} Formularstatus, -felder und -funktionen
 */
export function useRegisterForm(options?: RegisterFormOptions) {
  // Auth-Hook für Register-Funktion
  const { register, isLoading: authLoading, error: authError, clearError } = useAuth();
  
  // Formularfelder
  const [fields, setFields] = useState<RegisterFormFields>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  
  // Formularstatus
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<FormValidationResult>({
    isValid: true,
    errors: []
  });
  
  /**
   * Integriert Auth-Fehler in das Validierungsergebnis
   */
  useEffect(() => {
    if (authError) {
      setValidationResult(prev => ({
        ...prev,
        isValid: false,
        errors: [
          ...prev.errors.filter(e => e.field !== 'auth'),
          { field: 'auth', message: authError.message }
        ]
      }));
    }
  }, [authError]);
  
  /**
   * Aktualisiert ein Formularfeld und bereinigt Validierungsfehler
   * 
   * @param {keyof RegisterFormFields} field - Der Name des zu aktualisierenden Feldes
   * @returns {Function} Eine Funktion, die den Wert des Feldes aktualisiert
   */
  const updateField = useCallback((field: keyof RegisterFormFields) => (value: string) => {
    setFields(prev => ({ ...prev, [field]: value }));
    
    // Entferne Validierungsfehler für dieses Feld
    setValidationResult(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.field !== field)
    }));
    
    // Entferne Auth-Fehler bei Eingabe
    if (authError) {
      clearError();
    }
  }, [authError, clearError]);
  
  /**
   * Verarbeitet die Formularabsendung für die Registrierung
   * 
   * Validiert die Formularfelder inkl. Passwortbestätigung und
   * sendet die Registrierungsanfrage, wenn alles gültig ist.
   * 
   * @returns {Promise<void>}
   */
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    // Tastatur ausblenden
    Keyboard.dismiss();
    
    // Formularvalidierung
    const result = validateRegisterForm(
      fields.email, 
      fields.password, 
      fields.confirmPassword,
      fields.firstName,
      fields.lastName
    );
    setValidationResult(result);
    
    if (!result.isValid) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Register-Funktion aus Auth-Hook aufrufen
      const success = await register(
        fields.email,
        fields.password,
        fields.firstName || undefined // Nur senden wenn vorhanden
      );
      
      if (success && options?.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      setValidationResult({
        isValid: false,
        errors: [{ field: 'auth', message: errorMessage }]
      });
      
      if (options?.onError) {
        options.onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [fields, isSubmitting, register, options]);
  
  /**
   * Gibt den Fehlermeldungstext für ein bestimmtes Feld zurück
   * 
   * @param {string} field - Der Name des Feldes
   * @returns {string|null} Die Fehlermeldung oder null, wenn keine vorhanden
   */
  const getErrorMessage = useCallback((field: string): string | null => {
    return getFieldError(validationResult.errors, field);
  }, [validationResult.errors]);
  
  /**
   * Auth-Fehlermeldung für allgemeine Formularfehler
   */
  const authErrorMessage = useMemo(() => {
    return getFieldError(validationResult.errors, 'auth');
  }, [validationResult.errors]);
  
  /**
   * Setzt alle Formularfelder auf ihre Standardwerte zurück
   */
  const resetForm = useCallback(() => {
    setFields({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    });
    setValidationResult({ isValid: true, errors: [] });
    if (authError) {
      clearError();
    }
  }, [authError, clearError]);
  
  /**
   * Füllt das Formular mit Demodaten für Testzwecke
   */
  const fillDemoData = useCallback(() => {
    const demoPassword = 'Demo123!';
    setFields({
      email: 'demo@example.com',
      password: demoPassword,
      confirmPassword: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
    });
    setValidationResult({ isValid: true, errors: [] });
    if (authError) {
      clearError();
    }
  }, [authError, clearError]);
  
  return {
    // Daten
    formData: fields,
    validationResult,
    isSubmitting,
    isLoading: isSubmitting || authLoading,
    authError: authErrorMessage,
    
    // Funktionen
    updateField,
    handleSubmit,
    getFieldError: getErrorMessage,
    resetForm,
    fillDemoData,
  };
} 