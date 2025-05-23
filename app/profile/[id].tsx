import { Stack, useLocalSearchParams } from 'expo-router';
import { ChatProfile } from '@/features/profile/screens/ChatProfile';

/**
 * Profilseite für Chats, zeigt Details zu einem Chat-Kontakt an
 */
export default function ChatProfileScreen() {
  const params = useLocalSearchParams<{ id: string, name: string }>();
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <ChatProfile 
        id={params.id} 
        name={params.name}
      />
    </>
  );
}
