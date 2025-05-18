import { logger } from '@/utils/logger';
import { IService } from '@/utils/service/serviceRegistry';

import { config } from '../config/app/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export interface ApiServiceOptions {
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Generische Schnittstelle für Request-Bodies
 */
export interface RequestBody {
  [key: string]: unknown;
}

const DEFAULT_OPTIONS: ApiServiceOptions = {
  retries: 2,
  retryDelayMs: 500,
};

/**
 * Zentraler Service für REST-/HTTP-Aufrufe.
 * Verwaltet Basis-URL, Error-Handling, Retry-Logik und JSON-Parsing.
 * Implementiert das IService-Interface für die ServiceRegistry.
 */
class ApiService implements IService {
  private baseUrl = config.apiBaseUrl || '';

  /**
   * Initialisierung des API-Service
   */
  async init(): Promise<void> {
    logger.debug('[ApiService] Initialisiert');
  }

  /**
   * Ressourcen freigeben
   */
  async dispose(): Promise<void> {
    logger.debug('[ApiService] Ressourcen freigegeben');
  }

  /**
   * Interne Methode zur Durchführung von HTTP-Requests mit Fehlerbehandlung und Retry-Logik
   * @template T - Typ des erwarteten Rückgabewerts
   * @param {string} path - Relativer Pfad zur API-Ressource
   * @param {HttpMethod} method - HTTP-Methode (GET, POST, PUT, DELETE, PATCH)
   * @param {RequestBody} [body] - Anfragekörper für POST/PUT-Requests
   * @param {Record<string, unknown>} [params] - Query-Parameter für die URL
   * @param {ApiServiceOptions} [options] - Konfigurationsoptionen wie Anzahl der Wiederholungsversuche
   * @returns {Promise<T>} Promise mit der API-Antwort
   * @throws {Error} Wirft einen Fehler bei fehlgeschlagenen Anfragen nach allen Wiederholungsversuchen
   * @private
   */
  private async request<T>(
    path: string,
    method: HttpMethod,
    body?: RequestBody,
    params?: Record<string, unknown>,
    options: ApiServiceOptions = {}
  ): Promise<T> {
    const { retries, retryDelayMs } = { ...DEFAULT_OPTIONS, ...options };

    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const fetchOptions: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body != null ? JSON.stringify(body) : undefined,
    };

    for (let attempt = 0; attempt <= retries!; attempt++) {
      try {
        const response = await fetch(url.toString(), fetchOptions);
        const text = await response.text();
        let data: unknown;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!response.ok) {
          const error = typeof data === 'object' && data !== null && 'error' in data 
            ? (data as { error: string }).error 
            : response.statusText;
          throw new Error(`API error (${response.status}): ${error}`);
        }
        return data as T;
      } catch (err) {
        if (attempt < retries!) {
          await new Promise(res => setTimeout(res, retryDelayMs));
          continue;
        }
        throw err;
      }
    }
    // Sollte nie erreicht werden
    throw new Error('Unreachable code in ApiService.request');
  }

  /**
   * Führt einen HTTP GET-Request durch
   * @template T - Typ des erwarteten Rückgabewerts
   * @param {string} path - Relativer Pfad zur API-Ressource
   * @param {Record<string, unknown>} [params] - Query-Parameter für die Anfrage
   * @param {ApiServiceOptions} [options] - Optionen für die Anfrage (Retries, etc.)
   * @returns {Promise<T>} Promise mit der API-Antwort als generischer Typ T
   */
  get<T>(path: string, params?: Record<string, unknown>, options?: ApiServiceOptions): Promise<T> {
    return this.request<T>(path, 'GET', undefined, params, options);
  }

  /**
   * Führt einen HTTP POST-Request durch
   * @template T - Typ des erwarteten Rückgabewerts
   * @param {string} path - Relativer Pfad zur API-Ressource
   * @param {RequestBody} body - Anfragekörper, der als JSON gesendet wird
   * @param {ApiServiceOptions} [options] - Optionen für die Anfrage (Retries, etc.)
   * @returns {Promise<T>} Promise mit der API-Antwort als generischer Typ T
   */
  post<T>(path: string, body: RequestBody, options?: ApiServiceOptions): Promise<T> {
    return this.request<T>(path, 'POST', body, undefined, options);
  }

  /**
   * Führt einen HTTP PUT-Request durch
   * @template T - Typ des erwarteten Rückgabewerts
   * @param {string} path - Relativer Pfad zur API-Ressource
   * @param {RequestBody} body - Anfragekörper, der als JSON gesendet wird
   * @param {ApiServiceOptions} [options] - Optionen für die Anfrage (Retries, etc.)
   * @returns {Promise<T>} Promise mit der API-Antwort als generischer Typ T
   */
  put<T>(path: string, body: RequestBody, options?: ApiServiceOptions): Promise<T> {
    return this.request<T>(path, 'PUT', body, undefined, options);
  }

  /**
   * Führt einen HTTP DELETE-Request durch
   * @template T - Typ des erwarteten Rückgabewerts
   * @param {string} path - Relativer Pfad zur API-Ressource
   * @param {ApiServiceOptions} [options] - Optionen für die Anfrage (Retries, etc.)
   * @returns {Promise<T>} Promise mit der API-Antwort als generischer Typ T
   */
  delete<T>(path: string, options?: ApiServiceOptions): Promise<T> {
    return this.request<T>(path, 'DELETE', undefined, undefined, options);
  }
}

export default ApiService; 