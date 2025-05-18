/**
 * API Service
 * 
 * Zentrale Schnittstelle für alle API-Anfragen
 */
import { config } from '../../config/app/env';

// Standard Request-Timeout in Millisekunden
const DEFAULT_TIMEOUT = 30000;

// Standard Headers für API-Anfragen
const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Definition des Request-Body-Typs für API-Anfragen
 */
export interface ApiRequestBody {
  [key: string]: unknown;
}

// Definition der API-Anfrageparameter
export interface ApiRequestParams {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: ApiRequestBody;
  token?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Definition der API-Antwortstruktur
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    status?: number;
  };
}

/**
 * ApiService bietet standardisierte Methoden für API-Anfragen
 */
export class ApiService {
  /**
   * Basis-Methode für API-Anfragen
   * @param root0
   * @param root0.endpoint
   * @param root0.method
   * @param root0.data
   * @param root0.token
   * @param root0.timeout
   * @param root0.headers
   */
  static async request<T>({
    endpoint,
    method = 'GET',
    data,
    token,
    timeout = DEFAULT_TIMEOUT,
    headers = {},
  }: ApiRequestParams): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const url = this.getFullUrl(endpoint);
      const options: RequestInit = {
        method,
        headers: {
          ...getDefaultHeaders(token),
          ...headers,
        },
        signal: controller.signal,
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      const responseData = await this.parseResponse<T>(response);
      return responseData;
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * GET-Anfrage
   * @param endpoint
   * @param token
   * @param params
   */
  static async get<T>(
    endpoint: string,
    token?: string,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    const finalEndpoint = params 
      ? `${endpoint}?${new URLSearchParams(this.convertParamsToString(params))}` 
      : endpoint;
      
    return this.request<T>({
      endpoint: finalEndpoint,
      method: 'GET',
      token,
    });
  }

  /**
   * POST-Anfrage
   * @param endpoint
   * @param data
   * @param token
   */
  static async post<T>(
    endpoint: string,
    data: ApiRequestBody,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'POST',
      data,
      token,
    });
  }

  /**
   * PUT-Anfrage
   * @param endpoint
   * @param data
   * @param token
   */
  static async put<T>(
    endpoint: string,
    data: ApiRequestBody,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'PUT',
      data,
      token,
    });
  }

  /**
   * DELETE-Anfrage
   * @param endpoint
   * @param token
   */
  static async delete<T>(
    endpoint: string,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'DELETE',
      token,
    });
  }

  /**
   * PATCH-Anfrage
   * @param endpoint
   * @param data
   * @param token
   */
  static async patch<T>(
    endpoint: string,
    data: ApiRequestBody,
    token?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'PATCH',
      data,
      token,
    });
  }

  /**
   * Hilfsmetoden
   * @param endpoint
   */
  private static getFullUrl(endpoint: string): string {
    // Entferne führenden Slash, falls vorhanden
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${config.apiBaseUrl}/${cleanEndpoint}`;
  }

  private static async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      return {
        success: false,
        error: {
          message: `HTTP error: ${response.status} ${response.statusText}`,
          status: response.status,
        },
      };
    }

    try {
      // Für den Fall, dass keine Antwort erwartet wird (z.B. bei 204 No Content)
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to parse response data',
          code: 'PARSE_ERROR',
        },
      };
    }
  }

  /**
   * Fehlerbehandlung für API-Anfragen
   * @param error Der aufgetretene Fehler
   * @returns Eine API-Antwort mit Fehlerinformationen
   * @private
   */
  private static handleError<T>(error: unknown): ApiResponse<T> {
    // Wenn es sich um einen AbortError handelt (Timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          message: 'Request timed out',
          code: 'TIMEOUT',
        },
      };
    }

    // Für andere Fehler
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      error: {
        message: errorMessage,
        code: 'NETWORK_ERROR',
      },
    };
  }
  
  /**
   * Konvertiert Parameter in String-Werte für URL-Parameter
   * @param params Die Parameter
   * @returns Die konvertierten Parameter
   * @private
   */
  private static convertParamsToString(
    params: Record<string, string | number | boolean>
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
  }
} 