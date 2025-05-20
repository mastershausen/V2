import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'expo-router';

// Typen für den Kontext
export type CreateFormType = 'gig' | 'casestudy';

// Gemeinsame Basisattribute für beide Formulartypen
interface BaseFormData {
  type: CreateFormType;
  title: string;
  description: string;
  imageUrl: string | null;
}

// Spezifische Attribute für Gigs
interface GigFormData extends BaseFormData {
  type: 'gig';
  price: string;
  currency: string;
}

// Spezifische Attribute für Fallstudien
interface CasestudyFormData extends BaseFormData {
  type: 'casestudy';
}

// Union-Typ für alle Formulartypen
type FormData = GigFormData | CasestudyFormData;

interface CreateFormContextType {
  // Formulardaten
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  
  // Navigation
  goToMetaDataScreen: () => void;
  goBackToDetailsScreen: () => void;
  
  // Erstellung
  createItem: () => void;
}

// Default-Werte für die Formulartypen
const defaultGigFormData: GigFormData = {
  type: 'gig',
  title: '',
  description: '',
  price: '0',
  currency: '€',
  imageUrl: null,
};

const defaultCasestudyFormData: CasestudyFormData = {
  type: 'casestudy',
  title: '',
  description: '',
  imageUrl: null,
};

// Context erstellen
const CreateFormContext = createContext<CreateFormContextType | undefined>(undefined);

// Provider-Komponente
interface CreateFormProviderProps {
  children: ReactNode;
}

export const CreateFormProvider: React.FC<CreateFormProviderProps> = ({ children }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(defaultGigFormData);
  
  // Formulardaten aktualisieren mit Typprüfung
  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prevData => {
      // Wenn sich der Typ ändert, setze die entsprechenden Defaults
      if (data.type && data.type !== prevData.type) {
        if (data.type === 'gig') {
          return { ...defaultGigFormData, ...data } as GigFormData;
        } else {
          return { ...defaultCasestudyFormData, ...data } as CasestudyFormData;
        }
      }
      
      // Ansonsten nur die angegebenen Felder aktualisieren
      return { ...prevData, ...data } as FormData;
    });
  };
  
  // Formular zurücksetzen basierend auf dem aktuellen Typ
  const resetForm = () => {
    if (formData.type === 'gig') {
      setFormData(defaultGigFormData);
    } else {
      setFormData(defaultCasestudyFormData);
    }
  };
  
  // Navigation zum MetaDataScreen
  const goToMetaDataScreen = () => {
    router.push('/create/metadata');
  };
  
  // Zurück zum Details-Screen mit type-sicherer Navigation
  const goBackToDetailsScreen = () => {
    if (formData.type === 'gig') {
      router.push('/gigs/create/createGigDetails');
    } else {
      router.push('/casestudies/create/createCasestudyDetails');
    }
  };
  
  // Element erstellen basierend auf dem Typ
  const createItem = () => {
    // Hier später die tatsächliche Erstellung implementieren
    // Für jetzt nur ein Alert und Redirect zur Home-Seite
    alert(`${formData.type === 'gig' ? 'Gig' : 'Fallstudie'} erfolgreich erstellt!`);
    router.push('/(tabs)/home');
  };
  
  // Context-Wert
  const value: CreateFormContextType = {
    formData,
    updateFormData,
    resetForm,
    goToMetaDataScreen,
    goBackToDetailsScreen,
    createItem,
  };
  
  return (
    <CreateFormContext.Provider value={value}>
      {children}
    </CreateFormContext.Provider>
  );
};

// Custom Hook für einfacheren Zugriff auf den Context
export const useCreateForm = (): CreateFormContextType => {
  const context = useContext(CreateFormContext);
  
  if (context === undefined) {
    throw new Error('useCreateForm muss innerhalb eines CreateFormProviders verwendet werden');
  }
  
  return context;
}; 