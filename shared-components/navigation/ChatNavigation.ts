import { Router, usePathname } from 'expo-router';

// ID des Solvbox-Assistenten Chats basierend auf den Mock-Daten
export const ASSISTANT_CHAT_ID = '1';
export const ASSISTANT_CHAT_NAME = 'Solvbox-Assistent';

/**
 * Prüft, ob wir uns aktuell auf einer Chat-bezogenen Seite befinden
 * 
 * @param pathname - Der aktuelle Pfadname (aus usePathname() von expo-router)
 * @returns true, wenn wir uns auf einer Chat-bezogenen Seite befinden
 */
export function isOnChatScreen(pathname: string): boolean {
  return pathname.startsWith('/chats');
}

/**
 * Navigiert zum Solvbox-Assistenten Chat
 * 
 * Diese Funktion navigiert zum Chat mit dem Solvbox-Assistenten,
 * unabhängig davon, von welchem Screen aus sie aufgerufen wird.
 * 
 * @param router - Der Expo Router
 */
export function navigateToAssistantChat(router: Router): void {
  router.push({
    pathname: `/chats/${ASSISTANT_CHAT_ID}`,
    params: { name: ASSISTANT_CHAT_NAME }
  });
} 