import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SettingItem {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);


  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Account",
      items: [
        {
          icon: "person",
          title: "Profile Information",
          subtitle: "Update your profile details",
          onPress: () => {},
          showArrow: true
        },
        {
          icon: "shield-checkmark",
          title: "Privacy & Security",
          subtitle: "Manage your privacy settings",
          onPress: () => {},
          showArrow: true
        }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "notifications",
          title: "Notifications",
          subtitle: "Push notifications and alerts",
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
          showSwitch: true,
          switchValue: notificationsEnabled
        },
        {
          icon: "moon",
          title: "Dark Mode",
          subtitle: "Switch to dark theme",
          onPress: () => setDarkModeEnabled(!darkModeEnabled),
          showSwitch: true,
          switchValue: darkModeEnabled
        },
        {
          icon: "sync",
          title: "Auto Sync",
          subtitle: "Automatically sync your data",
          onPress: () => setSyncEnabled(!syncEnabled),
          showSwitch: true,
          switchValue: syncEnabled
        }
      ]
    },
    {
      title: "Storage",
      items: [
        {
          icon: "cloud",
          title: "Cloud Storage",
          subtitle: "Google Drive, OneDrive integration",
          onPress: () => {},
          showArrow: true
        },
        {
          icon: "download",
          title: "Offline Content",
          subtitle: "Manage downloaded files",
          onPress: () => {},
          showArrow: true
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: "help-circle",
          title: "Help & FAQ",
          subtitle: "Get help and support",
          onPress: () => {},
          showArrow: true
        },
        {
          icon: "mail",
          title: "Contact Us",
          subtitle: "Send feedback or report issues",
          onPress: () => {},
          showArrow: true
        },
        {
          icon: "information-circle",
          title: "About",
          subtitle: "App version and information",
          onPress: () => {},
          showArrow: true
        }
      ]
    }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={32} color="#667eea" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Student User</Text>
            <Text style={styles.profileEmail}>student@university.edu</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="create" size={20} color="#667eea" />
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon as any} size={20} color="#667eea" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  {item.showSwitch && (
                    <Switch
                      value={item.switchValue}
                      onValueChange={item.onPress}
                      trackColor={{ false: "#e0e0e0", true: "#667eea" }}
                      thumbColor={item.switchValue ? "#fff" : "#f4f3f4"}
                    />
                  )}
                  {item.showArrow && (
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}


        {/* App Version */}
        <Text style={styles.versionText}>gTok v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f4ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  editProfileButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#f44336",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginBottom: 40,
  },
});
