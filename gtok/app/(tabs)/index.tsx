import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const todayClasses = [
    { id: 1, name: "Mathematics", time: "09:00 AM", room: "Room 101", countdown: "2h 15m" },
    { id: 2, name: "Physics", time: "02:00 PM", room: "Lab 204", countdown: "7h 15m" },
  ];

  const upcomingAssignments = [
    { id: 1, title: "Math Assignment", dueDate: "Tomorrow", priority: "high" },
    { id: 2, title: "Physics Lab Report", dueDate: "3 days", priority: "medium" },
  ];

  const quickLinks = [
    { id: 1, title: "Documents", icon: "folder", color: "#4CAF50" },
    { id: 2, title: "Notes", icon: "create", color: "#FF9800" },
    { id: 3, title: "Media", icon: "images", color: "#9C27B0" },
    { id: 4, title: "AI Assistant", icon: "chatbubble", color: "#2196F3" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.date}>Today, March 15, 2024</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={32} color="#667eea" />
          </TouchableOpacity>
        </View>

        {/* Study Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakContent}>
            <Text style={styles.streakTitle}>Study Streak</Text>
            <Text style={styles.streakNumber}>7 days 🔥</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '70%' }]} />
          </View>
        </View>

        {/* Today's Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          {todayClasses.map((classItem) => (
            <View key={classItem.id} style={styles.classCard}>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{classItem.name}</Text>
                <Text style={styles.classDetails}>{classItem.time} • {classItem.room}</Text>
              </View>
              <View style={styles.countdown}>
                <Text style={styles.countdownText}>{classItem.countdown}</Text>
                <Text style={styles.countdownLabel}>until class</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickLinksGrid}>
            {quickLinks.map((link) => (
              <TouchableOpacity key={link.id} style={[styles.quickLinkCard, { backgroundColor: link.color }]}>
                <Ionicons name={link.icon as any} size={24} color="white" />
                <Text style={styles.quickLinkText}>{link.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Assignments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
          {upcomingAssignments.map((assignment) => (
            <View key={assignment.id} style={styles.assignmentCard}>
              <View style={styles.assignmentInfo}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentDue}>Due {assignment.dueDate}</Text>
              </View>
              <View style={[styles.priorityBadge, { 
                backgroundColor: assignment.priority === 'high' ? '#ff4444' : '#ff9800' 
              }]}>
                <Text style={styles.priorityText}>{assignment.priority}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  streakCard: {
    backgroundColor: "#667eea",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
  },
  streakContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  streakTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  streakNumber: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  classCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  classDetails: {
    fontSize: 14,
    color: "#666",
  },
  countdown: {
    alignItems: "center",
  },
  countdownText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#667eea",
  },
  countdownLabel: {
    fontSize: 12,
    color: "#666",
  },
  quickLinksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  quickLinkCard: {
    width: "47%",
    aspectRatio: 1.5,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLinkText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  assignmentCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  assignmentDue: {
    fontSize: 14,
    color: "#666",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
