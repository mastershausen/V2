import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { logger } from '@/utils/simpleLogger';

interface Props {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<{
    error: Error;
    resetError: () => void;
  }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary-Komponente, die App-Fehler abfängt und einen Fallback-Bildschirm zeigt
 */
export default class ErrorBoundary extends Component<Props, State> {
  /**
   *
   * @param props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  /**
   *
   * @param error
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  /**
   *
   * @param error
   * @param errorInfo
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Fehler loggen
    logger.error('App Error:', error.message);
    logger.error('Error Info:', errorInfo.componentStack);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  /**
   *
   */
  render() {
    const { hasError, error } = this.state;
    const { children, FallbackComponent } = this.props;

    if (hasError && error) {
      if (FallbackComponent) {
        return <FallbackComponent error={error} resetError={this.resetError} />;
      }

      // Standard-Fallback, wenn keine benutzerdefinierte Komponente bereitgestellt wird
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Etwas ist schief gelaufen</Text>
          <Text style={styles.message}>{error.message}</Text>
          <Text 
            style={styles.button}
            onPress={this.resetError}
          >
            Erneut versuchen
          </Text>
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#dc3545',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  button: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
}); 