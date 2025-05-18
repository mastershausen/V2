# ProfileImage Komponente

Die `ProfileImage` Komponente ist eine zentrale UI-Komponente zur einheitlichen Darstellung von Benutzerprofilbildern in der SolvBox-App.

## Features

- Anzeige von Profilbildern mit URL oder Fallback zu Initialen
- Konsistentes Caching von Profilbildern
- Verschiedene Größen-Präsets (xsmall, small, medium, large, xlarge)
- Varianten: circle (Standard), rounded, square
- Badge-Anzeige (z.B. für Online-Status)
- Hochwertige Fallbacks mit generierten Initialen

## Verwendung

```tsx
import { ProfileImage } from '@/shared-components/media';

// Einfache Verwendung
<ProfileImage fallbackText="Max Mustermann" size="medium" />

// Mit Bild
<ProfileImage 
  fallbackText="Max Mustermann" 
  imageUrl="https://example.com/profile.jpg"
  size="medium" 
/>

// Mit Badge
<ProfileImage 
  fallbackText="Max Mustermann" 
  imageUrl="https://example.com/profile.jpg"
  showBadge={true}
  badgeColor="green"
/>

// Mit vollständigen Profildaten
<ProfileImage 
  profileData={{
    initials: "MM",
    imageUrl: "https://example.com/profile.jpg"
  }}
/>
```

## Provider

Um das Caching von Profilbildern zu aktivieren, muss der `ProfileImageCacheProvider` in der App eingebunden werden. Dies ist typischerweise in der obersten Ebene der App-Komponente:

```tsx
import { ProfileImageCacheProvider } from '@/shared-components/media';

export default function App() {
  return (
    <ProfileImageCacheProvider>
      {/* Rest der App... */}
    </ProfileImageCacheProvider>
  );
}
```

## Hilfsfunktionen

Zusätzlich zur Komponente bieten wir einige nützliche Hilfsfunktionen:

```tsx
import { 
  createProfileInitials, 
  createProfileInitialsFromName,
  getProfileDataFromUser 
} from '@/shared-components/media';

// Initialen aus Namen erstellen
const profileData = createProfileInitialsFromName("Max Mustermann");
// -> { initials: "MM" }

// Profilbild-Daten aus Benutzer extrahieren
const profileData = getProfileDataFromUser(userProfile);
``` 