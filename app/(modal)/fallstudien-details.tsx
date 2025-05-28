import React from 'react';
import { 
  View, 
  Text,
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';

export default function FallstudienDetailsModal() {
  const colors = useThemeColor();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
      {/* Header mit Close Button */}
      <View style={[styles.header, { borderBottomColor: colors.inputBorder }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Fallstudie Details
        </Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            🎉 Fallstudie erfolgreich erstellt!
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Deine Fallstudie wurde erfolgreich angelegt und ist nun verfügbar. Hier sind die nächsten Schritte:
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            📝 Nächste Schritte
          </Text>
          <View style={styles.stepsList}>
            <Text style={[styles.step, { color: colors.textSecondary }]}>
              • Überprüfe deine Angaben im Fallstudien-Bereich
            </Text>
            <Text style={[styles.step, { color: colors.textSecondary }]}>
              • Ergänze bei Bedarf weitere Details
            </Text>
            <Text style={[styles.step, { color: colors.textSecondary }]}>
              • Teile deine Fallstudie mit potenziellen Kunden
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={[styles.footer, { borderTopColor: colors.inputBorder }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={handleClose}
        >
          <Text style={styles.actionButtonText}>
            Zu meinen Fallstudien
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  section: {
    paddingVertical: spacing.l,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.m,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  stepsList: {
    gap: spacing.s,
  },
  step: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderTopWidth: 1,
  },
  actionButton: {
    paddingVertical: spacing.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 