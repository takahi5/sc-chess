import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <ImageBackground
        source={require("@/assets/images/chess-photo.png")}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.content}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.buttonStack}>
            <Link href="/play" asChild>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.actionButton}
              >
                <View style={styles.buttonContent}>
                  <FontAwesome name="play" size={20} color="#0f172a" />
                  <Text style={styles.buttonLabel}>Start Match</Text>
                </View>
              </TouchableOpacity>
            </Link>
            <Link href="/cpu" asChild>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.actionButton}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons
                    name="robot"
                    size={20}
                    color="#0f172a"
                  />
                  <Text style={styles.buttonLabel}>VS CPU</Text>
                </View>
              </TouchableOpacity>
            </Link>
            <Link href="/checkmate" asChild>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.actionButton}
              >
                <View style={styles.buttonContent}>
                  <FontAwesome5 name="chess-king" size={20} color="#0f172a" />
                  <Text style={styles.buttonLabel}>Checkmate Challenge</Text>
                </View>
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
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: "80%",
    maxWidth: "100%",
    aspectRatio: 2,
    marginBottom: 16,
  },
  buttonStack: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  actionButton: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 34,
    backgroundColor: "#facc15",
    shadowColor: "#78350f",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
    width: 300,
    maxWidth: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: 0.3,
  },
});
