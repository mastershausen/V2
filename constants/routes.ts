/**
 * Zentrale Definition aller Routen in der App
 * 
 * Vorteile:
 * - Vermeidet Tippfehler oder Inkonsistenzen
 * - Ermöglicht Umbenennen eines Pfads an zentraler Stelle
 * - Bessere Autocomplete-Unterstützung in IDEs
 * - Einheitliche Dokumentation aller verfügbaren Routen
 * - Typsicherheit durch Literal-Union-Typen
 */

import { useRouter } from 'expo-router';

// Typdefinitionen für Routen mit festem Pfad
export type TabRoute = '/(tabs)' | '/(tabs)/home' | '/(tabs)/mysolvbox' | '/(tabs)/chats' | '/(tabs)/solvboxai' | '/(tabs)/profile';
export type AuthRoute = '/(auth)' | '/(auth)/login' | '/(auth)/register' | '/(auth)/forgot-password' | '/(auth)/upgrade';
export type SettingsRoute = '/settings' | '/settings/account' | '/settings/debug';
export type StaticNuggetRoute = '/nuggets' | '/nuggets/create' | '/nuggets/create/createNugget';
export type StaticGigRoute = '/gigs' | '/gigs/create' | '/gigs/create/createGigList';
export type StaticCaseStudyRoute = '/casestudies' | '/casestudies/create' | '/casestudies/create/createCasestudyList';
export type MiscRoute = '/editprofile' | '+not-found';

// Funktionstypen für dynamische Routen (mit ID)
export type DynamicRouteBuilder = (id: string) => string;

// Union-Typ aller möglichen Routen
export type AppRoute = 
  | TabRoute 
  | AuthRoute 
  | SettingsRoute 
  | StaticNuggetRoute 
  | StaticGigRoute 
  | StaticCaseStudyRoute 
  | MiscRoute
  | ReturnType<DynamicRouteBuilder>; // Hinzufügen der dynamisch generierten Routen

// Typ-Hilfsfunktion für Expo Router kompatible Pfade
// Diese Funktion ist eine "Identitäts"-Funktion, die nur für die Typsystem-Integration verwendet wird
export type ExpoRouterPath = Parameters<ReturnType<typeof useRouter>['push']>[0];

// Interface für das Routes-Objekt
interface RoutesInterface {
  TABS: {
    ROOT: '/(tabs)';
    HOME: '/(tabs)/home';
    MY_SOLVBOX: '/(tabs)/mysolvbox';
    CHATS: '/(tabs)/chats';
    SOLVBOX_AI: '/(tabs)/solvboxai';
    PROFILE: '/(tabs)/profile';
  };
  AUTH: {
    ROOT: '/(auth)';
    LOGIN: '/(auth)/login';
    REGISTER: '/(auth)/register';
    FORGOT_PASSWORD: '/(auth)/forgot-password';
    UPGRADE: '/(auth)/upgrade';
  };
  SETTINGS: {
    ROOT: '/settings';
    ACCOUNT: '/settings/account';
    DEBUG: '/settings/debug';
  };
  EDIT_PROFILE: '/editprofile';
  NUGGETS: {
    ROOT: '/nuggets';
    CREATE: {
      ROOT: '/nuggets/create';
      NEW: '/nuggets/create/createNugget';
    };
    DETAIL: DynamicRouteBuilder;
    EDIT: DynamicRouteBuilder;
  };
  GIGS: {
    ROOT: '/gigs';
    CREATE: {
      ROOT: '/gigs/create';
      NEW: '/gigs/create/createGigList';
    };
    DETAIL: DynamicRouteBuilder;
    EDIT: DynamicRouteBuilder;
  };
  CASE_STUDIES: {
    ROOT: '/casestudies';
    CREATE: {
      ROOT: '/casestudies/create';
      NEW: '/casestudies/create/createCasestudyList';
    };
    DETAIL: DynamicRouteBuilder;
    EDIT: DynamicRouteBuilder;
  };
  NOT_FOUND: '+not-found';
}

// Definition des typsicheren Routes-Objekts
const Routes: RoutesInterface = {
  TABS: {
    ROOT: '/(tabs)',
    HOME: '/(tabs)/home',
    MY_SOLVBOX: '/(tabs)/mysolvbox',
    CHATS: '/(tabs)/chats',
    SOLVBOX_AI: '/(tabs)/solvboxai',
    PROFILE: '/(tabs)/profile',
  },
  AUTH: {
    ROOT: '/(auth)',
    LOGIN: '/(auth)/login',
    REGISTER: '/(auth)/register',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
    UPGRADE: '/(auth)/upgrade',
  },
  SETTINGS: {
    ROOT: '/settings',
    ACCOUNT: '/settings/account',
    DEBUG: '/settings/debug',
  },
  EDIT_PROFILE: '/editprofile',
  NUGGETS: {
    ROOT: '/nuggets',
    CREATE: {
      ROOT: '/nuggets/create',
      NEW: '/nuggets/create/createNugget',
    },
    DETAIL: (id: string) => `/nuggets/${id}`,
    EDIT: (id: string) => `/nuggets/edit/${id}`,
  },
  GIGS: {
    ROOT: '/gigs',
    CREATE: {
      ROOT: '/gigs/create',
      NEW: '/gigs/create/createGigList',
    },
    DETAIL: (id: string) => `/gigs/${id}`,
    EDIT: (id: string) => `/gigs/edit/${id}`,
  },
  CASE_STUDIES: {
    ROOT: '/casestudies',
    CREATE: {
      ROOT: '/casestudies/create',
      NEW: '/casestudies/create/createCasestudyList',
    },
    DETAIL: (id: string) => `/casestudies/${id}`,
    EDIT: (id: string) => `/casestudies/edit/${id}`,
  },
  NOT_FOUND: '+not-found',
};

export default Routes;

/**
 * Navigation Helpers
 * 
 * Diese Funktionen erlauben typsichere Navigation in der App.
 * Sie können direkt in Komponenten verwendet werden oder über einen Hook.
 */

/**
 * Konvertiert unsere typisierten App-Routen in Expo Router-kompatible Pfade
 * Diese Funktion dient nur der Typsystem-Integration und hat keine Laufzeitauswirkungen
 * @param path
 */
export function asExpoPath<T extends AppRoute | string>(path: T): ExpoRouterPath {
  return path as unknown as ExpoRouterPath;
}

/**
 * Typsichere Navigation zu einer Route
 * @param router - Der Expo Router
 * @param route - Die Zielroute (typsicher)
 * @param options - Optionale Parameter für die Navigation
 * @param options.replace
 */
export function navigateTo(router: ReturnType<typeof useRouter>, route: AppRoute | string, options?: { replace?: boolean }) {
  const expoPath = asExpoPath(route);
  
  if (options?.replace) {
    router.replace(expoPath);
  } else {
    router.push(expoPath);
  }
}

/**
 * Hook für typsichere Navigation
 * 
 * Beispiel-Verwendung:
 * ```
 * const navigation = useAppNavigation();
 * 
 * // In einem Event-Handler:
 * navigation.navigateTo(Routes.TABS.HOME);
 * ```
 */
export function useAppNavigation() {
  const router = useRouter();

  return {
    navigateTo: (route: AppRoute | string, options?: { replace?: boolean }) => 
      navigateTo(router, route, options),
    
    replace: (route: AppRoute | string) => 
      navigateTo(router, route, { replace: true }),
  };
}

/**
 * ANLEITUNG ZUR VERWENDUNG:
 * 
 * 1. Route-Konstanten verwenden:
 *    ```
 *    import Routes from '@/constants/routes';
 *    
 *    <Link href={Routes.TABS.HOME}>Home</Link>
 *    ```
 * 
 * 2. Typsichere Navigation mit dem Hook:
 *    ```
 *    import { useAppNavigation } from '@/constants/routes';
 *    
 *    const navigation = useAppNavigation();
 *    
 *    navigation.navigateTo(Routes.EDIT_PROFILE);
 *    // oder
 *    navigation.replace(Routes.AUTH.LOGIN);
 *    ```
 * 
 * 3. Direkte Verwendung der Hilfsfunktion:
 *    ```
 *    import { navigateTo } from '@/constants/routes';
 *    
 *    const router = useRouter();
 *    navigateTo(router, Routes.NUGGETS.CREATE.NEW);
 *    ```
 * 
 * 4. Dynamische Routen mit IDs verwenden:
 *    ```
 *    // Für Detailansicht eines Nuggets mit ID
 *    navigation.navigateTo(Routes.NUGGETS.DETAIL('123'));
 *    
 *    // Für Bearbeiten eines Gigs mit ID
 *    navigation.navigateTo(Routes.GIGS.EDIT('456'));
 *    ```
 */ 