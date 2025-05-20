import React, { useEffect } from 'react';
import MetaDataScreen from '@/features/shared/screens/MetaDataScreen';
import { CreateFormProvider, useCreateForm } from '@/features/shared/contexts/CreateFormContext';

// Wrapper, der den Type im CreateFormContext setzt
function GigMetaDataContent() {
  const { updateFormData } = useCreateForm();

  // Setze den Typ beim ersten Rendern
  useEffect(() => {
    updateFormData({ type: 'gig' });
  }, []);

  return <MetaDataScreen />;
}

/**
 * Wrapper für den gemeinsamen MetaDataScreen 
 * im Gigs-Stack, damit die Navigation richtig funktioniert
 */
export default function GigMetaDataRoute() {
  return (
    <CreateFormProvider>
      <GigMetaDataContent />
    </CreateFormProvider>
  );
} 