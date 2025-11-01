import { Link, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CHECKMATE_CHALLENGES } from '@/constants/checkmate-challenges';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CheckmateChallengeListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const controlTextColor = colorScheme === 'dark' ? '#e2e8f0' : '#334155';

  const challenges = useMemo(
    () => CHECKMATE_CHALLENGES.map((challenge) => challenge.id).sort((a, b) => a - b),
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.linkButton} onPress={() => router.back()}>
            <ThemedText style={[styles.linkLabel, { color: controlTextColor }]}>Back</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">Checkmate Challenge</ThemedText>
          <View style={styles.linkButtonPlaceholder} />
        </View>
        <ThemedText style={styles.description}>
          Choose a mate-in-one puzzle to test your tactics.
        </ThemedText>
        <View style={styles.grid}>
          {challenges.map((id) => (
            <Link
              key={id}
              href={{ pathname: '/checkmate/[id]', params: { id: String(id) } }}
              asChild>
              <TouchableOpacity activeOpacity={0.85} style={styles.challengeButton}>
                <ThemedText style={styles.challengeLabel}>Challenge {id}</ThemedText>
                <ThemedText style={styles.challengeSubLabel}>Mate in 1</ThemedText>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkButtonPlaceholder: {
    width: 52,
    height: 32,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  challengeButton: {
    width: '45%',
    minWidth: 140,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    gap: 4,
  },
  challengeLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#facc15',
    letterSpacing: 0.3,
  },
  challengeSubLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#e2e8f0',
  },
});
