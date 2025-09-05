import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, SafeAreaView, Linking, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { useSubjects, Subject } from "../../contexts/SubjectsContext";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');


interface SubjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (subject: Subject) => void;
  subject: Subject | null;
}

const SubjectModal = ({ visible, onClose, onSave, subject = null }: SubjectModalProps) => {
  const [formData, setFormData] = useState<Omit<Subject, 'id'>>({
    name: subject?.name || '',
    lecturer: subject?.lecturer || '',
    phone: subject?.phone || '',
    email: subject?.email || '',
    classLink: subject?.classLink || '',
    room: subject?.room || '',
  });

  const handleSave = () => {
    onSave({
      ...formData,
      id: subject?.id || Math.random().toString(36).substr(2, 9),
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {subject ? 'Edit Subject' : 'Add New Subject'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Subject Name"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Lecturer Name"
            value={formData.lecturer}
            onChangeText={(text) => setFormData({...formData, lecturer: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Class Link"
            value={formData.classLink}
            onChangeText={(text) => setFormData({...formData, classLink: text})}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Room Number"
            value={formData.room}
            onChangeText={(text) => setFormData({...formData, room: text})}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { subjects, classes, addSubject, updateSubject, deleteSubject } = useSubjects();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleAddSubject = () => {
    setEditingSubject(null);
    setIsModalVisible(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalVisible(true);
  };

  const handleSaveSubject = (subject: Subject) => {
    if (editingSubject) {
      // Update existing subject
      updateSubject(subject);
    } else {
      // Add new subject
      addSubject(subject);
    }
    setIsModalVisible(false);
  };

  const handleDeleteSubject = (id: string) => {
    deleteSubject(id);
  };
  
  const getTodayClasses = () => {
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    return classes.filter(cls => cls.day === dayIndex).map(cls => {
      const subject = subjects.find(s => s.id === cls.subjectId);
      return {
        id: cls.id,
        name: subject?.name || 'Unknown Subject',
        time: cls.time,
        room: subject?.room || 'No Room',
        countdown: getTimeUntilClass(cls.time)
      };
    });
  };

  const getTimeUntilClass = (classTime: string) => {
    const now = new Date();
    const [hours, minutes] = classTime.split(':').map(Number);
    const classDate = new Date();
    classDate.setHours(hours, minutes, 0, 0);
    
    if (classDate < now) {
      classDate.setDate(classDate.getDate() + 1);
    }
    
    const diff = classDate.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}m`;
    } else if (minutesLeft > 0) {
      return `${minutesLeft}m`;
    } else {
      return 'Now';
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning! ☀️';
    if (hour < 17) return 'Good afternoon! 🌤️';
    return 'Good evening! 🌙';
  };

  const getFormattedDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const todayClasses = getTodayClasses();

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.date}>{getFormattedDate()}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/settings")}>
            <View style={styles.profileButtonInner}>
              <Ionicons name="person-circle" size={32} color="#667eea" />
              {subjects.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{subjects.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Study Streak */}
        <Animated.View style={[{ opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.streakCard}
          >
            <View style={styles.streakContent}>
              <View>
                <Text style={styles.streakTitle}>Study Streak</Text>
                <Text style={styles.streakNumber}>7 days 🔥</Text>
              </View>
              <View style={styles.streakStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{subjects.length}</Text>
                  <Text style={styles.statLabel}>Subjects</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{classes.length}</Text>
                  <Text style={styles.statLabel}>Classes</Text>
                </View>
              </View>
            </View>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: '70%' }]} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Today's Classes */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Classes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/classes')} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#667eea" />
            </TouchableOpacity>
          </View>
          {todayClasses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No classes scheduled for today</Text>
              <Text style={styles.emptyStateSubtext}>Enjoy your free time! 🎉</Text>
            </View>
          ) : (
            todayClasses.map((classItem, index) => (
              <Animated.View 
                key={classItem.id} 
                style={[
                  styles.classCard,
                  { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <View style={styles.classCardLeft}>
                  <View style={[styles.classIndicator, { backgroundColor: `hsl(${index * 60}, 70%, 60%)` }]} />
                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{classItem.name}</Text>
                    <Text style={styles.classDetails}>
                      <Ionicons name="time-outline" size={14} color="#666" /> {classItem.time} • 
                      <Ionicons name="location-outline" size={14} color="#666" /> {classItem.room}
                    </Text>
                  </View>
                </View>
                <View style={styles.countdown}>
                  <Text style={[styles.countdownText, { color: classItem.countdown === 'Now' ? '#ff4444' : '#667eea' }]}>
                    {classItem.countdown}
                  </Text>
                  <Text style={styles.countdownLabel}>until class</Text>
                </View>
              </Animated.View>
            ))
          )}
        </Animated.View>

        {/* Quick Links */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickLinksGrid}>
            {quickLinks.map((link, index) => (
              <Animated.View
                key={link.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{ 
                    translateY: Animated.add(slideAnim, new Animated.Value(index * 10))
                  }]
                }}
              >
                <TouchableOpacity style={styles.quickLinkCard}>
                  <LinearGradient
                    colors={[link.color, `${link.color}CC`]}
                    style={styles.quickLinkGradient}
                  >
                    <View style={styles.quickLinkIconContainer}>
                      <Ionicons name={link.icon as any} size={28} color="white" />
                    </View>
                    <Text style={styles.quickLinkText}>{link.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

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

        {/* Subjects */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Subjects</Text>
            <TouchableOpacity onPress={handleAddSubject} style={styles.addButton}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {subjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={64} color="#ddd" />
              <Text style={styles.emptyStateText}>No subjects added yet</Text>
              <Text style={styles.emptyStateSubtext}>Start building your academic schedule</Text>
              <TouchableOpacity onPress={handleAddSubject} style={styles.addFirstButton}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.addFirstButtonGradient}
                >
                  <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.addFirstButtonText}>Add Your First Subject</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.subjectsList}>
              {subjects.map((subject, index) => (
                <Animated.View 
                  key={subject.id} 
                  style={[
                    styles.subjectCard,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: Animated.add(slideAnim, new Animated.Value(index * 5)) }]
                    }
                  ]}
                >
                  <View style={styles.subjectHeader}>
                    <View style={styles.subjectTitleContainer}>
                      <View style={[styles.subjectColorIndicator, { backgroundColor: `hsl(${index * 45}, 70%, 60%)` }]} />
                      <Text style={styles.subjectName}>{subject.name}</Text>
                    </View>
                    <View style={styles.subjectActions}>
                      <TouchableOpacity 
                        onPress={() => handleEditSubject(subject)}
                        style={styles.actionButton}
                      >
                        <Ionicons name="pencil" size={18} color="#667eea" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleDeleteSubject(subject.id)}
                        style={[styles.actionButton, styles.deleteButton]}
                      >
                        <Ionicons name="trash" size={18} color="#ff4757" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.subjectDetailsContainer}>
                    <View style={styles.subjectDetailRow}>
                      <View style={styles.detailIcon}>
                        <Ionicons name="person" size={16} color="#667eea" />
                      </View>
                      <Text style={styles.subjectDetailText}>{subject.lecturer}</Text>
                    </View>
                  
                    {subject.phone && (
                      <View style={styles.subjectDetailRow}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="call" size={16} color="#667eea" />
                        </View>
                        <Text style={styles.subjectDetailText}>{subject.phone}</Text>
                      </View>
                    )}
                  
                    {subject.email && (
                      <View style={styles.subjectDetailRow}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="mail" size={16} color="#667eea" />
                        </View>
                        <Text style={styles.subjectDetailText}>{subject.email}</Text>
                      </View>
                    )}
                  
                    {subject.room && (
                      <View style={styles.subjectDetailRow}>
                        <View style={styles.detailIcon}>
                          <Ionicons name="location" size={16} color="#667eea" />
                        </View>
                        <Text style={styles.subjectDetailText}>{subject.room}</Text>
                      </View>
                    )}
                  
                    {subject.classLink && (
                      <TouchableOpacity 
                        style={[styles.subjectDetailRow, styles.classLink]}
                        onPress={() => Linking.openURL(
                          subject.classLink.startsWith('http') 
                            ? subject.classLink 
                            : `https://${subject.classLink}`
                        )}
                      >
                        <View style={styles.detailIcon}>
                          <Ionicons name="link" size={16} color="#667eea" />
                        </View>
                        <Text style={[styles.subjectDetailText, styles.linkText]}>
                          {subject.classLink.length > 25 
                            ? `${subject.classLink.substring(0, 22)}...` 
                            : subject.classLink}
                        </Text>
                        <Ionicons name="open-outline" size={14} color="#667eea" />
                      </TouchableOpacity>
                    )}
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
        
        <SubjectModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditingSubject(null);
          }}
          onSave={handleSaveSubject}
          subject={editingSubject}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#667eea',
  },
  cancelButton: {
    backgroundColor: '#a0aec0',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  // Subject list styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  viewAllText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateText: {
    marginTop: 16,
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  addFirstButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  subjectsList: {
    paddingHorizontal: 20,
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectColorIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  subjectActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
  },
  subjectDetailsContainer: {
    gap: 12,
  },
  subjectDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectDetailText: {
    color: '#555',
    fontSize: 15,
    flex: 1,
  },
  linkText: {
    color: '#667eea',
    fontWeight: '500',
  },
  classLink: {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
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
  profileButtonInner: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  streakContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  streakStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
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
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
    shadowColor: 'white',
    shadowOpacity: 0.5,
    shadowRadius: 4,
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
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  classCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  classIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
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
    gap: 16,
  },
  quickLinkCard: {
    width: (width - 72) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  quickLinkGradient: {
    aspectRatio: 1.3,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLinkIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
