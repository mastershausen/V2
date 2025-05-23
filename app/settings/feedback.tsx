import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HeaderNavigation } from '@/shared-components/navigation/HeaderNavigation';

/**
 * Feedback Screen
 * Sammelt Benutzerfeedback und Bewertungen
 */
export default function FeedbackScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  
  // State für Feedback
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  
  // Handler für Sterne-Bewertung
  const handleRating = (stars: number) => {
    setRating(stars);
  };
  
  // Handler für Feedback senden
  const handleSubmitFeedback = () => {
    if (feedbackText.trim().length < 10) {
      Alert.alert(
        'Feedback zu kurz',
        'Bitte geben Sie mindestens 10 Zeichen ein, damit wir Ihr Feedback verstehen können.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Hier würde das Feedback gesendet werden
    Alert.alert(
      'Feedback gesendet',
      'Vielen Dank für Ihr Feedback! Wir werden es zur Verbesserung der App nutzen.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      <HeaderNavigation 
        title="Feedback"
        showBackButton={true}
        onBackPress={() => router.back()}
        titleStyle={styles.headerTitle}
        containerStyle={styles.headerContainer}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bewertung */}
        <View style={styles.ratingContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Wie gefällt Ihnen Solvbox?
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => handleRating(star)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color={star <= rating ? '#FFD700' : colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Feedback Text */}
        <View style={styles.feedbackContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Ihr Feedback
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Teilen Sie uns mit, was gut läuft und was wir verbessern können.
          </Text>
          
          <TextInput
            style={[
              styles.feedbackInput,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.inputText,
              }
            ]}
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Ihr Feedback..."
            placeholderTextColor={colors.textTertiary}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
          
          <Text style={[styles.characterCount, { color: colors.textTertiary }]}>
            {feedbackText.length} Zeichen (mindestens 10)
          </Text>
        </View>
        
        {/* Senden Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton, 
              { 
                backgroundColor: feedbackText.trim().length >= 10 ? colors.primary : colors.textTertiary,
                opacity: feedbackText.trim().length >= 10 ? 1 : 0.5 
              }
            ]}
            onPress={handleSubmitFeedback}
            disabled={feedbackText.trim().length < 10}
            activeOpacity={0.8}
          >
            <Ionicons name="send-outline" size={20} color="white" style={styles.submitIcon} />
            <Text style={styles.submitButtonText}>
              Feedback senden
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.textTertiary }]}>
            Ihr Feedback wird anonym verarbeitet und hilft uns dabei, Solvbox kontinuierlich zu verbessern.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 56,
    paddingTop: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.m,
  },
  ratingContainer: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: '600',
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.s,
    marginTop: spacing.s,
  },
  starButton: {
    padding: spacing.xs,
  },
  feedbackContainer: {
    paddingVertical: spacing.m,
  },
  sectionDescription: {
    fontSize: typography.fontSize.s,
    lineHeight: 20,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    fontSize: typography.fontSize.m,
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.s,
    textAlign: 'right',
  },
  submitContainer: {
    paddingTop: spacing.l,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: ui.borderRadius.m,
  },
  submitIcon: {
    marginRight: spacing.s,
  },
  submitButtonText: {
    color: 'white',
    fontSize: typography.fontSize.m,
    fontWeight: '600',
  },
  infoContainer: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.m,
  },
  infoText: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    textAlign: 'center',
  },
}); 