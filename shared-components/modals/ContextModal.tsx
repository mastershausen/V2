import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ContextModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (context: string) => void;
  initialValue?: string;
}

export function ContextModal({ visible, onClose, onSave, initialValue = '' }: ContextModalProps) {
  const colors = useThemeColor();
  const [contextText, setContextText] = useState(initialValue);
  const { t } = useTranslation();

  const handleSave = () => {
    onSave(contextText);
    onClose();
  };

  const handleCancel = () => {
    setContextText(initialValue); // Reset auf ursprünglichen Wert
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButtonLeft}>
            <Text style={[styles.headerButtonText, { color: colors.textSecondary }]}>
              {t('casestudy.contextModal.cancel')}
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('casestudy.contextModal.title')}
          </Text>
          
          <TouchableOpacity onPress={handleSave} style={styles.headerButtonRight}>
            <Text style={[styles.headerButtonText, { color: colors.primary }]}>
              {t('casestudy.contextModal.save')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Erklärung */}
            <View style={styles.explanationContainer}>
              <View style={styles.explanationHeader}>
                <Ionicons 
                  name="information-circle-outline" 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={[styles.explanationTitle, { color: colors.textPrimary }]}>
                  {t('casestudy.contextModal.additionalInfo')}
                </Text>
              </View>
              
              <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                {t('casestudy.contextModal.infoDescription')}
              </Text>
              
              <Text style={[styles.explanationSubtext, { color: colors.textTertiary }]}>
                {t('casestudy.contextModal.infoExamples')}
              </Text>
            </View>

            {/* Texteingabefeld */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                    borderColor: colors.divider,
                  }
                ]}
                value={contextText}
                onChangeText={setContextText}
                placeholder={t('casestudy.contextModal.placeholder')}
                placeholderTextColor={colors.textTertiary}
                multiline
                textAlignVertical="top"
                autoFocus
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButtonLeft: {
    minWidth: 80,
    alignItems: 'flex-start',
  },
  headerButtonRight: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  headerButtonText: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.medium as any,
  },
  headerTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.semiBold as any,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.m,
  },
  explanationContainer: {
    marginBottom: spacing.l,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  explanationTitle: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.semiBold as any,
    marginLeft: spacing.xs,
  },
  explanationText: {
    fontSize: typography.fontSize.s,
    lineHeight: 20,
    marginBottom: spacing.s,
  },
  explanationSubtext: {
    fontSize: typography.fontSize.xs,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  inputContainer: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    fontSize: typography.fontSize.m,
    minHeight: 200,
    maxHeight: 400,
  },
}); 