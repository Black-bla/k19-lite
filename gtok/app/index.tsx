import { Text, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen() {
  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      router.replace("/(tabs)/" as any);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>📚 gTok</Text>
        <Text style={styles.tagline}>Your Smart Study Companion</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
});
