import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ClassesScreen() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const classes = [
    { id: 1, name: "Mathematics", time: "09:00", day: 0, duration: 2, room: "Room 101", attendance: 85 },
    { id: 2, name: "Physics", time: "14:00", day: 0, duration: 1, room: "Lab 204", attendance: 92 },
    { id: 3, name: "Chemistry", time: "10:00", day: 1, duration: 2, room: "Lab 301", attendance: 78 },
    { id: 4, name: "Biology", time: "13:00", day: 2, duration: 1, room: "Room 205", attendance: 88 },
    { id: 5, name: "English", time: "11:00", day: 3, duration: 1, room: "Room 102", attendance: 95 },
  ];

  const upcomingClasses = [
    { id: 1, name: "Mathematics", time: "09:00 AM", room: "Room 101", status: "upcoming", reminder: "Leave now - traffic detected!" },
    { id: 2, name: "Physics", time: "02:00 PM", room: "Lab 204", status: "later", reminder: null },
  ];

  const getClassForSlot = (dayIndex: number, timeSlot: string) => {
    return classes.find(cls => cls.day === dayIndex && cls.time === timeSlot);
  };

  const renderCalendarView = () => (
    <View style={styles.calendar}>
      <View style={styles.calendarHeader}>
        <View style={styles.timeColumn} />
        {weekDays.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
      </View>
      
      {timeSlots.map((timeSlot, timeIndex) => (
        <View key={timeIndex} style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeText}>{timeSlot}</Text>
          </View>
          {weekDays.map((_, dayIndex) => {
            const classItem = getClassForSlot(dayIndex, timeSlot);
            return (
              <View key={dayIndex} style={styles.dayColumn}>
                {classItem && (
                  <TouchableOpacity style={[styles.classBlock, { backgroundColor: '#667eea' }]}>
                    <Text style={styles.classBlockText}>{classItem.name}</Text>
                    <Text style={styles.classBlockRoom}>{classItem.room}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );

  const renderListView = () => (
    <View style={styles.listContainer}>
      <Text style={styles.sectionTitle}>Today's Schedule</Text>
      {upcomingClasses.map((classItem) => (
        <View key={classItem.id} style={styles.classCard}>
          <View style={styles.classInfo}>
            <Text style={styles.className}>{classItem.name}</Text>
            <Text style={styles.classDetails}>{classItem.time} • {classItem.room}</Text>
            {classItem.reminder && (
              <View style={styles.reminderContainer}>
                <Ionicons name="warning" size={16} color="#ff9800" />
                <Text style={styles.reminderText}>{classItem.reminder}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <Ionicons name="videocam" size={20} color="white" />
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classes</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'calendar' && styles.activeToggle]}
            onPress={() => setViewMode('calendar')}
          >
            <Ionicons name="calendar" size={20} color={viewMode === 'calendar' ? 'white' : '#667eea'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? 'white' : '#667eea'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
        
        {/* Attendance Summary */}
        <View style={styles.attendanceSection}>
          <Text style={styles.sectionTitle}>Attendance Summary</Text>
          {classes.map((classItem) => (
            <View key={classItem.id} style={styles.attendanceCard}>
              <View style={styles.attendanceInfo}>
                <Text style={styles.attendanceClassName}>{classItem.name}</Text>
                <Text style={styles.attendancePercentage}>{classItem.attendance}%</Text>
              </View>
              <View style={styles.attendanceBar}>
                <View 
                  style={[
                    styles.attendanceProgress, 
                    { 
                      width: `${classItem.attendance}%`,
                      backgroundColor: classItem.attendance >= 85 ? '#4CAF50' : classItem.attendance >= 75 ? '#ff9800' : '#f44336'
                    }
                  ]} 
                />
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
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: "#667eea",
  },
  content: {
    flex: 1,
  },
  calendar: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeColumn: {
    width: 60,
    alignItems: "center",
  },
  dayColumn: {
    flex: 1,
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  timeRow: {
    flexDirection: "row",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  classBlock: {
    padding: 8,
    borderRadius: 6,
    width: "90%",
    height: 50,
    justifyContent: "center",
  },
  classBlockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  classBlockRoom: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 10,
  },
  listContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  classCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    padding: 8,
    borderRadius: 6,
  },
  reminderText: {
    fontSize: 12,
    color: "#ff9800",
    marginLeft: 4,
    fontWeight: "500",
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  attendanceSection: {
    padding: 16,
  },
  attendanceCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  attendanceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  attendanceClassName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  attendancePercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#667eea",
  },
  attendanceBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
  },
  attendanceProgress: {
    height: "100%",
    borderRadius: 3,
  },
});
