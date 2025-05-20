import CreateDetailsScreen from '@/features/shared/screens/createDetailsScreen';
import React from 'react';

/**
 * Route für das Erstellen einer Fallstudie im WYSIWYG-Format
 */
export default function CreateCasestudyDetailsScreen() {
  return (
    <CreateDetailsScreen 
      type="casestudy"
      navigationTitle="Fallstudie erstellen"
      redirectRoute="/(tabs)/home"
      submitButtonText="Erstellen"
      actionButtonLabels={{
        leftButton: "Bewerten",
        middleButton: "Anfragen",
        rightButton: "Speichern",
      }}
    />
  );
} 