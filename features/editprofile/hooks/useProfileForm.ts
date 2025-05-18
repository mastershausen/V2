import { useState, useEffect, useCallback } from 'react';

import { HeaderMediaType } from '@/features/profile/types/ProfileTypes';
import { validateProfileData } from '@/features/profile/utils/profileValidation';
import { useUserStore } from '@/stores/userStore';
import { UserProfile } from '@/types/userTypes';

import { EditProfileFormData } from '../types/EditProfileTypes';

// Definition für erweiterte Benutzerprofilfelder, die im neuen UserProfile nicht vorhanden sind
interface ExtendedUserProfile {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  headline?: string;
  website?: string;
  description?: string;
  headerImage?: string | null;
  location?: string;
  industry?: string;
  rating?: number;
  phone?: string;
}

/**
 * Hook für die Verwaltung des Profil-Formulars
 */
export function useProfileForm(user: UserProfile | null) {
  const { getMockUserById } = useUserStore();
  
  // State für Änderungen und ursprüngliche Daten
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<EditProfileFormData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Formulardaten initialisieren
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: user?.name || "",
    firstName: (user as unknown as ExtendedUserProfile)?.firstName || "",
    lastName: (user as unknown as ExtendedUserProfile)?.lastName || "",
    username: user?.username || "",
    company: (user as unknown as ExtendedUserProfile)?.companyName || "",
    rating: (user as unknown as ExtendedUserProfile)?.rating || 4.5,
    profileImage: user?.profileImage || null,
    headerMedia: (user as unknown as ExtendedUserProfile)?.headerImage ? 
      { type: 'image' as HeaderMediaType, url: (user as unknown as ExtendedUserProfile)?.headerImage || '', thumbnail: (user as unknown as ExtendedUserProfile)?.headerImage || '' } : 
      { type: 'none' as HeaderMediaType, url: '', thumbnail: '' },
    website: (user as unknown as ExtendedUserProfile)?.website || "",
    headline: (user as unknown as ExtendedUserProfile)?.headline || "",
    description: (user as unknown as ExtendedUserProfile)?.description || "",
    location: (user as unknown as ExtendedUserProfile)?.location || "",
    industry: (user as unknown as ExtendedUserProfile)?.industry || "",
    email: user?.email || "",
    phone: (user as unknown as ExtendedUserProfile)?.phone || "",
    userType: (user?.role as 'free' | 'pro' | 'premium') || 'free'
  });

  // Formulardaten aktualisieren, wenn sich der Benutzer ändert
  useEffect(() => {
    if (user) {
      const extendedUser = user as unknown as ExtendedUserProfile;
      
      const initialData: EditProfileFormData = {
        name: user.name || "",
        firstName: extendedUser.firstName || "",
        lastName: extendedUser.lastName || "",
        username: user.username || "",
        company: extendedUser.companyName || "",
        rating: extendedUser.rating || 4.5,
        profileImage: user.profileImage || null,
        headerMedia: extendedUser.headerImage ? 
          { type: 'image' as HeaderMediaType, url: extendedUser.headerImage, thumbnail: extendedUser.headerImage } : 
          { type: 'none' as HeaderMediaType, url: '', thumbnail: '' },
        website: extendedUser.website || "",
        headline: extendedUser.headline || "",
        description: extendedUser.description || "",
        location: extendedUser.location || "",
        industry: extendedUser.industry || "",
        email: user.email || "",
        phone: extendedUser.phone || "",
        userType: (user.role as 'free' | 'pro' | 'premium') || 'free'
      };
      
      setFormData(initialData);
      setOriginalData(initialData);
      setHasChanges(false);
    }
  }, [user]);

  // Handler zum Aktualisieren der Formulardaten
  const updateFormData = useCallback((data: Partial<EditProfileFormData>) => {
    // Fehler für geänderte Felder zurücksetzen
    if (Object.keys(data).length > 0) {
      setFormErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        // Entferne Fehler für Felder, die gerade geändert werden
        Object.keys(data).forEach(key => {
          delete newErrors[key];
        });
        return newErrors;
      });
    }

    setFormData(prev => {
      const updated = { ...prev, ...data };
      
      // Prüfen, ob sich etwas geändert hat mit JSON.stringify
      if (originalData) {
        setHasChanges(JSON.stringify(updated) !== JSON.stringify(originalData));
      }
      
      return updated;
    });
  }, [originalData]);

  // Formular validieren
  const validateForm = useCallback(() => {
    const { isValid, errors, fieldErrors } = validateProfileData(formData);
    if (!isValid) {
      setFormErrors(fieldErrors || {});
      return { isValid, errors };
    }
    
    setFormErrors({});
    return { isValid, errors: [] };
  }, [formData]);

  // Payload für das Profil-Update erstellen
  const createUpdatePayload = useCallback(() => {
    const headerImageToUpdate = formData.headerMedia && formData.headerMedia.type !== 'none' ? 
      formData.headerMedia.url : undefined;
      
    // Profilbild direkt als String verwenden
    const profileImageToUpdate = formData.profileImage;
      
    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      companyName: formData.company,
      headline: formData.headline,
      description: formData.description,
      website: formData.website,
      profileImage: profileImageToUpdate,
      headerImage: headerImageToUpdate,
      location: formData.location,
      industry: formData.industry,
      email: formData.email,
      phone: formData.phone,
      role: formData.userType, // Stelle sicher, dass die Rolle korrekt übernommen wird
      name: formData.name, // Füge das Name-Feld hinzu, das im neuen UserProfile erforderlich ist
    };
  }, [formData]);

  // Formular zurücksetzen
  const resetForm = useCallback(() => {
    if (originalData) {
      setFormData(originalData);
      setFormErrors({});
      setHasChanges(false);
    }
  }, [originalData]);

  // Bei erfolgreicher Speicherung
  const handleSaveSuccess = useCallback(() => {
    setHasChanges(false);
    setOriginalData(formData);
  }, [formData]);

  return {
    formData,
    formErrors,
    hasChanges,
    updateFormData,
    validateForm,
    createUpdatePayload,
    resetForm,
    handleSaveSuccess,
  };
} 