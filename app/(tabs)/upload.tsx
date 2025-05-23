import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

const windowWidth = Dimensions.get('window').width;

// Frame-Typen
enum FrameType {
  BEFORE_AFTER = 'BEFORE_AFTER',
  OUTSIDE_BOX = 'OUTSIDE_BOX',
  CREATE_NEW = 'CREATE_NEW'
}

interface FrameOption {
  id: FrameType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

/**
 * Upload Screen für Fallstudien
 * Ermöglicht die Auswahl verschiedener Frame-Typen für den Upload-Prozess
 */
export default function UploadScreen() {
  const colors = useThemeColor();
  const [selectedFrame, setSelectedFrame] = useState<FrameType | null>(null);

  // Frame-Optionen
  const frameOptions: FrameOption[] = [
    {
      id: FrameType.BEFORE_AFTER,
      title: 'Vorher → Nachher',
      description: 'Zeige eine klare Transformation mit messbaren Ergebnissen.',
      icon: 'sync-outline',
      color: colors.primary
    },
    {
      id: FrameType.OUTSIDE_BOX,
      title: 'Um die Ecke gedacht',
      description: 'Präsentiere einen kreativen, unerwarteten Lösungsansatz.',
      icon: 'bulb-outline',
      color: '#6B5C1E' // Alternative Farbe für Unterscheidung
    },
    {
      id: FrameType.CREATE_NEW,
      title: 'Neues erschaffen',
      description: 'Stelle ein innovatives Konzept oder eine neue Lösung vor.',
      icon: 'add-circle-outline',
      color: '#3E1E6B' // Alternative Farbe für Unterscheidung
    }
  ];

  // Frame auswählen und zum nächsten Schritt gehen
  const handleSelectFrame = (frameType: FrameType) => {
    setSelectedFrame(frameType);
    // Hier würden wir normalerweise zum nächsten Schritt navigieren
    console.log(`Frame ausgewählt: ${frameType}`);
    // TODO: Navigation zum nächsten Schritt implementieren
  };

  // Rendert eine einzelne Frame-Option
  const renderFrameOption = (option: FrameOption) => {
    const isSelected = selectedFrame === option.id;
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.frameOption,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: isSelected ? option.color : 'transparent',
            borderWidth: isSelected ? 2 : 0,
          }
        ]}
        onPress={() => handleSelectFrame(option.id)}
      >
        <View style={[styles.frameIconContainer, { backgroundColor: `${option.color}20` }]}>
          <Ionicons name={option.icon} size={36} color={option.color} />
        </View>
        <View style={styles.frameTextContainer}>
          <Text style={[styles.frameTitle, { color: colors.textPrimary }]}>
            {option.title}
          </Text>
          <Text style={[styles.frameDescription, { color: colors.textSecondary }]}>
            {option.description}
          </Text>
        </View>
        <View style={styles.frameArrow}>
          <Ionicons 
            name={isSelected ? "checkmark-circle" : "arrow-forward-circle-outline"} 
            size={24} 
            color={isSelected ? option.color : colors.textTertiary} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.backgroundPrimary }]}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
        <Stack.Screen 
          options={{ 
            headerShown: false,
          }} 
        />
        
        {/* Header - vollständig sichtbar */}
        <View style={styles.headerContainer}>
          <HeaderNavigation
            title="Fallstudie erstellen"
            showBackButton={false}
            containerStyle={styles.headerNavStyle}
          />
        </View>

        {/* Inhalt */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Einleitung */}
          <View style={styles.introContainer}>
            <Text style={[styles.introTitle, { color: colors.textPrimary }]}>
              Welche Art von Fallstudie möchtest du erstellen?
            </Text>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Wähle den passenden Frame für deine Fallstudie, um deinen Erfolg am besten zu präsentieren.
            </Text>
          </View>

          {/* Frame-Optionen */}
          <View style={styles.framesContainer}>
            {frameOptions.map(renderFrameOption)}
          </View>

          {/* Zusätzliche Informationen */}
          <View style={styles.infoContainer}>
            <View style={[styles.infoBox, { backgroundColor: `${colors.primary}10` }]}>
              <Ionicons name="information-circle-outline" size={24} color={colors.primary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Die Wahl des richtigen Frames hilft dabei, deine Fallstudie strukturiert und überzeugend zu präsentieren.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer-Button wurde entfernt */}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? spacing.m : spacing.xl,
    paddingBottom: spacing.xs,
    marginBottom: spacing.s,
    zIndex: 10,
  },
  headerNavStyle: {
    height: 56,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.m,
  },
  introContainer: {
    marginBottom: spacing.l,
  },
  introTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.s,
  },
  introText: {
    fontSize: typography.fontSize.m,
    lineHeight: 22,
  },
  framesContainer: {
    marginBottom: spacing.xl,
  },
  frameOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  frameIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  frameTextContainer: {
    flex: 1,
  },
  frameTitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
    marginBottom: spacing.xs,
  },
  frameDescription: {
    fontSize: typography.fontSize.s,
    lineHeight: 18,
  },
  frameArrow: {
    marginLeft: spacing.s,
  },
  infoContainer: {
    marginBottom: spacing.xl,
  },
  infoBox: {
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: spacing.s,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.s,
    lineHeight: 18,
  },
}); 