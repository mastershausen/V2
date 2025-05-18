/**
 * ProfileImage Cache-Funktionalität Test
 * 
 * Dieses Skript testet die Cache-Funktionalität der ProfileImage-Komponente,
 * insbesondere den updateProfileImageCache-Mechanismus.
 * 
 * Verwendung:
 * 1. Kopiere diesen Code in eine temporäre Komponente
 * 2. Importiere diese Komponente in einem App-Screen
 * 3. Teste die Cache-Funktionalität
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView } from 'react-native';

import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ProfileImage, updateProfileImageCache } from '@/shared-components/media';

export function CacheUpdateTest() {
  const colors = useThemeColor();
  const [userId, setUserId] = useState('test-user-1');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/200');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [testResults, setTestResults] = useState([]);
  
  // Füge ein Testergebnis hinzu
  const addResult = (message, status = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [
      { id: Date.now(), message, status, timestamp },
      ...prev
    ]);
  };
  
  // Cache manuell aktualisieren
  const updateCache = () => {
    try {
      addResult(`Versuche Cache zu aktualisieren für User ${userId}...`, 'pending');
      updateProfileImageCache(userId, imageUrl);
      addResult(`Cache-Update ausgelöst für User: ${userId}`, 'success');
      // Force Re-Render
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      addResult(`Fehler beim Cache-Update: ${error.message}`, 'error');
    }
  };
  
  // Cache mit leerem Bild aktualisieren
  const clearCache = () => {
    try {
      addResult(`Versuche Cache zu löschen für User ${userId}...`, 'pending');
      updateProfileImageCache(userId, '');
      addResult(`Cache gelöscht für User: ${userId}`, 'success');
      // Force Re-Render
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      addResult(`Fehler beim Cache-Löschen: ${error.message}`, 'error');
    }
  };
  
  // Verschiedene Bilder im Zyklus testen
  const cycleThroughImages = () => {
    const images = [
      'https://picsum.photos/200',
      'https://picsum.photos/200/200',
      'https://picsum.photos/300/300',
      'https://picsum.photos/400/400'
    ];
    
    const currentIndex = images.indexOf(imageUrl);
    const nextIndex = (currentIndex + 1) % images.length;
    
    setImageUrl(images[nextIndex]);
    addResult(`Bild-URL geändert zu: ${images[nextIndex]}`, 'info');
  };
  
  // Komponente initialisieren
  useEffect(() => {
    addResult('Cache-Test initialisiert', 'info');
    addResult(`User ID: ${userId}`, 'info');
    addResult(`Initiale Bild-URL: ${imageUrl}`, 'info');
  }, []);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        ProfileImage Cache-Test
      </Text>
      
      <View style={styles.controlsContainer}>
        <Text style={styles.sectionTitle}>Testparameter</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>User ID:</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border }]}
            value={userId}
            onChangeText={setUserId}
            placeholder="Benutzer-ID eingeben"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bild-URL:</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border }]}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Bild-URL eingeben"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Cache aktualisieren" 
            onPress={updateCache} 
            color={colors.primary}
          />
          <Button 
            title="Cache löschen" 
            onPress={clearCache} 
            color={colors.error}
          />
          <Button 
            title="Bilder durchschalten" 
            onPress={cycleThroughImages} 
            color={colors.secondary}
          />
        </View>
      </View>
      
      <View style={styles.testContainer}>
        <Text style={styles.sectionTitle}>Test-Vorschau</Text>
        
        <View style={styles.previewRow}>
          <View style={styles.previewItem}>
            <Text style={styles.label}>Standard:</Text>
            <ProfileImage 
              fallbackText="Testuser"
              userId={userId}
              size="large"
            />
          </View>
          
          <View style={styles.previewItem}>
            <Text style={styles.label}>Mit imageUrl:</Text>
            <ProfileImage 
              fallbackText="Testuser"
              userId={userId}
              imageUrl={imageUrl}
              size="large"
            />
          </View>
          
          <View style={styles.previewItem}>
            <Text style={styles.label}>Ohne userId:</Text>
            <ProfileImage 
              fallbackText="Testuser"
              imageUrl={imageUrl}
              size="large"
            />
          </View>
        </View>
        
        <Text style={styles.hint}>
          Die erste Komponente sollte das im Cache gespeicherte Bild anzeigen (wenn vorhanden).
        </Text>
      </View>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Testergebnisse</Text>
        
        {testResults.map(result => (
          <View 
            key={result.id} 
            style={[
              styles.resultItem, 
              { 
                backgroundColor: 
                  result.status === 'success' ? 'rgba(0, 255, 0, 0.1)' : 
                  result.status === 'error' ? 'rgba(255, 0, 0, 0.1)' : 
                  result.status === 'pending' ? 'rgba(255, 255, 0, 0.1)' : 
                  'rgba(0, 0, 0, 0.05)'
              }
            ]}
          >
            <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
          </View>
        ))}
        
        {testResults.length === 0 && (
          <Text style={styles.noResults}>Noch keine Testergebnisse</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  controlsContainer: {
    marginBottom: spacing.l,
    padding: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.m,
  },
  inputContainer: {
    marginBottom: spacing.m,
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.medium,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: spacing.s,
    fontSize: typography.fontSize.m,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.m,
  },
  testContainer: {
    marginBottom: spacing.l,
  },
  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  previewItem: {
    alignItems: 'center',
    marginRight: spacing.l,
    marginBottom: spacing.l,
    minWidth: 100,
  },
  hint: {
    fontStyle: 'italic',
    marginTop: spacing.m,
    marginBottom: spacing.m,
  },
  resultsContainer: {
    marginBottom: spacing.l,
  },
  resultItem: {
    padding: spacing.s,
    marginBottom: spacing.s,
    borderRadius: 4,
  },
  resultTimestamp: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  resultMessage: {
    fontSize: typography.fontSize.s,
  },
  noResults: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.m,
  },
}); 