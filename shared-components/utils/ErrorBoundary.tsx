import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props für die ErrorBoundary-Komponente
 */
interface ErrorBoundaryProps {
  /**
   * Die Komponente, die angezeigt wird, wenn ein Fehler auftritt
   */
  fallback: ReactNode;
  
  /**
   * Die Kind-Komponenten, die von der ErrorBoundary umschlossen werden
   */
  children: ReactNode;
  
  /**
   * Optionale Callback-Funktion, die aufgerufen wird, wenn ein Fehler auftritt
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State für die ErrorBoundary-Komponente
 */
interface ErrorBoundaryState {
  /**
   * Gibt an, ob ein Fehler aufgetreten ist
   */
  hasError: boolean;
  
  /**
   * Der aufgetretene Fehler, falls vorhanden
   */
  error: Error | null;
}

/**
 * Eine Komponente, die Fehler in ihren Kind-Komponenten abfängt und eine Fallback-UI anzeigt
 * @example
 * <ErrorBoundary fallback={<Text>Etwas ist schiefgelaufen</Text>}>
 *   <ComponentThatMightThrow />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   *
   * @param props
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Aktualisiert den State, wenn ein Fehler im Kind-Komponenten-Baum aufgetreten ist
   * @param error
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Wird aufgerufen, wenn ein Fehler während des Renderns auftritt
   * @param error
   * @param errorInfo
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Hier könnte man den Fehler an einen Logging-Service senden
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  /**
   * Setzt den Error-State zurück
   */
  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  /**
   *
   */
  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
} 