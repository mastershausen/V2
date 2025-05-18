/**
 * @file features/auth/utils/formValidation.ts
 * @description Utility-Funktionen für die Validierung von Auth-Formularen
 */
import { AUTH_VALIDATION, AUTH_ERROR_MESSAGES } from '@/features/auth/config';
import { TFunction } from 'i18next';

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validiert eine E-Mail-Adresse
 * @param email Die zu validierende E-Mail-Adresse
 * @param t Übersetzungsfunktion (optional)
 * @returns Validierungsergebnis mit Fehlermeldung, wenn ungültig
 */
export function validateEmail(email: string, t?: TFunction): ValidationError | null {
  if (!email || email.trim() === '') {
    return {
      field: 'email',
      message: t ? t('auth.validation.required') : 'Bitte geben Sie eine E-Mail-Adresse ein'
    };
  }
  
  if (!AUTH_VALIDATION.EMAIL.REGEX.test(email)) {
    return {
      field: 'email',
      message: t ? t('auth.validation.email') : 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    };
  }
  
  return null;
}

/**
 * Validiert ein Passwort gemäß den Regeln in AUTH_VALIDATION
 * @param password Das zu validierende Passwort
 * @param t Übersetzungsfunktion (optional)
 * @returns Validierungsergebnis mit Fehlermeldung, wenn ungültig
 */
export function validatePassword(password: string, t?: TFunction): ValidationError | null {
  if (!password || password.trim() === '') {
    return {
      field: 'password',
      message: t ? t('auth.validation.required') : 'Bitte geben Sie ein Passwort ein'
    };
  }
  
  const { MIN_LENGTH, REQUIRE_NUMBER, REQUIRE_SPECIAL_CHAR, REQUIRE_UPPERCASE } = AUTH_VALIDATION.PASSWORD;
  
  if (password.length < MIN_LENGTH) {
    return {
      field: 'password',
      message: t 
        ? t('auth.validation.password.minLength', { length: MIN_LENGTH }) 
        : `Das Passwort muss mindestens ${MIN_LENGTH} Zeichen lang sein`
    };
  }
  
  if (REQUIRE_NUMBER && !/\d/.test(password)) {
    return {
      field: 'password',
      message: t 
        ? t('auth.validation.password.requireNumber') 
        : 'Das Passwort muss mindestens eine Zahl enthalten'
    };
  }
  
  if (REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      field: 'password',
      message: t 
        ? t('auth.validation.password.requireSpecialChar') 
        : 'Das Passwort muss mindestens ein Sonderzeichen enthalten'
    };
  }
  
  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    return {
      field: 'password',
      message: t 
        ? t('auth.validation.password.requireUppercase') 
        : 'Das Passwort muss mindestens einen Großbuchstaben enthalten'
    };
  }
  
  return null;
}

/**
 * Validiert ein Eingabefeld auf Leerheit
 * @param value Der zu prüfende Wert
 * @param fieldName Der Name des Feldes für die Fehlermeldung
 * @param displayName Der anzuzeigende Name für die Fehlermeldung (optional)
 * @param t Übersetzungsfunktion (optional)
 * @returns Validierungsergebnis mit Fehlermeldung, wenn das Feld leer ist
 */
export function validateRequired(
  value: string, 
  fieldName: string, 
  displayName?: string,
  t?: TFunction
): ValidationError | null {
  if (!value || value.trim() === '') {
    return {
      field: fieldName,
      message: t 
        ? t('auth.validation.required') 
        : `Bitte geben Sie ${displayName || fieldName} ein`
    };
  }
  
  return null;
}

/**
 * Validiert, ob zwei Passwörter übereinstimmen
 * @param password Das Passwort
 * @param confirmPassword Die Passwortbestätigung
 * @param t Übersetzungsfunktion (optional)
 * @returns Validierungsergebnis mit Fehlermeldung, wenn die Passwörter nicht übereinstimmen
 */
export function validatePasswordMatch(
  password: string, 
  confirmPassword: string,
  t?: TFunction
): ValidationError | null {
  if (password !== confirmPassword) {
    return {
      field: 'confirmPassword',
      message: t 
        ? t('auth.validation.passwordMatch') 
        : 'Die Passwörter stimmen nicht überein'
    };
  }
  
  return null;
}

/**
 * Validiert Login-Formulardaten
 * @param email Die eingegebene E-Mail-Adresse
 * @param password Das eingegebene Passwort
 * @param t Übersetzungsfunktion (optional)
 * @returns Validierungsergebnis mit allen Fehlern
 */
export function validateLoginForm(
  email: string, 
  password: string,
  t?: TFunction
): FormValidationResult {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email, t);
  const passwordError = validatePassword(password, t);
  
  if (emailError) errors.push(emailError);
  if (passwordError) errors.push(passwordError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validiert Registrierungsformulardaten
 * @param email Die eingegebene E-Mail-Adresse
 * @param password Das eingegebene Passwort
 * @param confirmPassword Die Passwortbestätigung
 * @param t Übersetzungsfunktion (optional)
 * @param firstName Der Vorname (optional)
 * @param lastName Der Nachname (optional)
 * @returns Validierungsergebnis mit allen Fehlern
 */
export function validateRegisterForm(
  email: string, 
  password: string, 
  confirmPassword: string,
  t?: TFunction,
  firstName?: string,
  lastName?: string
): FormValidationResult {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email, t);
  const passwordError = validatePassword(password, t);
  const passwordMatchError = validatePasswordMatch(password, confirmPassword, t);
  
  if (emailError) errors.push(emailError);
  if (passwordError) errors.push(passwordError);
  if (passwordMatchError) errors.push(passwordMatchError);
  
  // FirstName und LastName sind optional und müssen daher nicht validiert werden,
  // wenn sie nicht angegeben sind
  if (firstName !== undefined && firstName === '') {
    const firstNameError = validateRequired(firstName, 'firstName', t ? t('auth.common.firstName') : 'Ihren Vornamen', t);
    if (firstNameError) errors.push(firstNameError);
  }
  
  if (lastName !== undefined && lastName === '') {
    const lastNameError = validateRequired(lastName, 'lastName', t ? t('auth.common.lastName') : 'Ihren Nachnamen', t);
    if (lastNameError) errors.push(lastNameError);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Findet den Fehler für ein bestimmtes Feld in einem Validierungsergebnis
 * @param errors Liste von Validierungsfehlern
 * @param fieldName Der Name des zu prüfenden Feldes
 * @returns Die Fehlermeldung oder null, wenn kein Fehler gefunden wurde
 */
export function getFieldError(errors: ValidationError[], fieldName: string): string | null {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : null;
} 