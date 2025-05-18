/**
 * useAppNavigation Hook
 * 
 * Eine Wrapper für die React-Navigation Hooks, die eine einheitliche Schnittstelle
 * für die Navigation innerhalb der App bietet.
 */

import { useNavigation , NavigationProp, ParamListBase } from '@react-navigation/native';

/**
 * App-Navigation Hook
 * 
 * Stellt Funktionen für die Navigation in der App bereit
 */
export function useAppNavigation() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  /**
   * Navigiert zur vorherigen Seite zurück
   */
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.warn('Navigation: Kann nicht zurückgehen, keine vorherige Route verfügbar');
    }
  };

  /**
   * Navigiert zu einer spezifischen Route
   * @param routeName Name der Route
   * @param params Parameter für die Route
   */
  const navigateTo = (routeName: string, params?: Record<string, unknown>) => {
    navigation.navigate(routeName, params);
  };

  /**
   * Ersetzt die aktuelle Route durch eine neue
   * @param routeName Name der Route
   * @param params Parameter für die Route
   */
  const replaceTo = (routeName: string, params?: Record<string, unknown>) => {
    navigation.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    });
  };

  return {
    navigation,
    goBack,
    navigateTo,
    replaceTo
  };
}

export default useAppNavigation; 