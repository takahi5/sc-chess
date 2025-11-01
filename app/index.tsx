import { Link } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>SC Chess</Text>
          <Text style={styles.subtitle}>
            Play head-to-head on a single device. Tap start to begin a fresh match.
          </Text>
        </View>
        <Link href="/play" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryLabel}>Start Match</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
  },
  hero: {
    gap: 12,
    marginTop: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: '#cbd5f5',
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf8',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },
  primaryLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
});
