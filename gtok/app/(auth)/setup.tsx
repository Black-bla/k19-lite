import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function SetupScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [timetableSync, setTimetableSync] = useState(false);

  const handleContinue = () => {
    // TODO: Save preferences
    router.replace("../");
  };

  const handleSkip = () => {
    router.replace("../");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Quick Setup</Text>
          <Text style={styles.subtitle}>Let's personalize your experience</Text>
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.option}>
            <View style={styles.optionContent}>
              <Text style={styles.optionIcon}>📅</Text>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Sync Timetable</Text>
                <Text style={styles.optionDescription}>
                  Connect with your university portal or add manually
                </Text>
              </View>
            </View>
            <Switch
              value={timetableSync}
              onValueChange={setTimetableSync}
              trackColor={{ false: "#e0e0e0", true: "#667eea" }}
            />
          </View>

          <View style={styles.option}>
            <View style={styles.optionContent}>
              <Text style={styles.optionIcon}>🔔</Text>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Push Notifications</Text>
                <Text style={styles.optionDescription}>
                  Get reminders for classes, assignments, and study sessions
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#e0e0e0", true: "#667eea" }}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  buttonContainer: {
    marginTop: 32,
  },
  continueButton: {
    backgroundColor: "#667eea",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
  },
});
