import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';
import { Ionicons } from '@expo/vector-icons';

/**
 * CreateReviewScreen
 * 
 * Ermöglicht das Erstellen einer neuen Bewertung für einen Experten
 */
export default function CreateReviewScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const params = useLocalSearchParams<{
    expertId?: string;
    expertName?: string;
  }>();
  
  // Standardwerte aus Parametern oder Fallbacks
  const expertId = params.expertId || 'demo-expert-id';
  const expertName = params.expertName || 'Alexander Becker';
  
  // State für Bewertungsdaten
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  
  // Funktion zum Erstellen der Bewertung
  const submitReview = () => {
    // Hier würde normalerweise die Bewertung an das Backend gesendet werden
    
    // Demo-Modus: Erfolgsmeldung anzeigen und zum Profilscreen zurücknavigieren
    Alert.alert(
      'Bewertung abgesendet',
      `Deine ${rating}-Sterne Bewertung für ${expertName} wurde erfolgreich erstellt.`,
      [
        { 
          text: 'OK', 
          onPress: () => router.push('/(tabs)/profile') 
        }
      ]
    );
  };
  
  // Sterne-Bewertung rendern
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity 
          key={i} 
          onPress={() => setRating(i)}
          style={styles.starContainer}
        >
          <Ionicons 
            name={i <= rating ? "star" : "star-outline"}
            size={36}
            color="#FFD700"
          />
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.starsContainer}>
        {stars}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <HeaderNavigation 
          title="Bewertung erstellen" 
          onBackPress={() => router.push('/(tabs)/profile')}
          rightContent={
            <TouchableOpacity onPress={submitReview}>
              <Text style={[styles.submitButton, { color: colors.primary }]}>
                Senden
              </Text>
            </TouchableOpacity>
          }
        />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Bewerte {expertName}
            </Text>
            
            {renderStars()}
            
            <Text style={[styles.label, { color: colors.textPrimary, marginTop: spacing.l }]}>
              Deine Bewertung
            </Text>
            
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                  borderColor: colors.divider
                }
              ]}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Beschreibe deine Erfahrung mit diesem Experten..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            
            <View style={styles.infoBox}>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Deine Bewertung hilft anderen Nutzern, den richtigen Experten zu finden. 
                Sei ehrlich und konstruktiv!
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.submitButtonLarge, { backgroundColor: colors.primary }]}
              onPress={submitReview}
            >
              <Text style={styles.submitButtonLargeText}>
                Bewertung senden
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.m,
  },
  label: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.m,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.m,
  },
  starContainer: {
    marginHorizontal: spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    minHeight: 120,
    fontSize: typography.fontSize.m,
  },
  submitButton: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
  },
  submitButtonLarge: {
    paddingVertical: spacing.m,
    borderRadius: ui.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  submitButtonLargeText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  infoBox: {
    marginTop: spacing.l,
    padding: spacing.m,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: ui.borderRadius.m,
  },
  infoText: {
    fontSize: typography.fontSize.s,
    lineHeight: typography.lineHeight.m,
    textAlign: 'center',
  },
}); 