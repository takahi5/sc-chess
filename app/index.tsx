import { Link } from 'expo-router';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('@/assets/images/home.png')}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}>
        <View style={styles.content}>
          <View style={styles.buttonStack}>
            <Link href="/play" asChild>
              <TouchableOpacity activeOpacity={0.8} style={styles.primaryButton}>
                <Text style={styles.primaryLabel}>Start Match</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/cpu" asChild>
              <TouchableOpacity activeOpacity={0.85} style={styles.cpuButton}>
                <Text style={styles.cpuLabel}>VS CPU</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/checkmate" asChild>
              <TouchableOpacity activeOpacity={0.85} style={styles.secondaryButton}>
                <Text style={styles.secondaryLabel}>Checkmate Challenge</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  buttonStack: {
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 34,
    backgroundColor: '#facc15',
    shadowColor: '#78350f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },
  primaryLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  cpuButton: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 34,
    backgroundColor: '#38bdf8',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },
  cpuLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#082f49',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: '#facc15',
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  secondaryLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#facc15',
    letterSpacing: 0.25,
  },
});
