import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ClassSchedule, useSubjects } from "../../contexts/SubjectsContext";

const { width } = Dimensions.get('window');

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat'];
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '00:00'];

type ClassType = ClassSchedule;

type EditModalProps = {
  visible: boolean;
  onClose: () => void;
  classData: ClassSchedule | null;
  onSave: (updatedClass: ClassSchedule) => void;
  onDelete: (id: number) => void;
};

const EditClassModal = ({ visible, onClose, classData, onSave, onDelete }: EditModalProps) => {
  const { subjects } = useSubjects();
  const [formData, setFormData] = useState<ClassSchedule>({
    id: 0,
    subjectId: '',
    time: '09:00',
    day: 0,
    duration: 1,
    attendance: 100
  });
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  React.useEffect(() => {
    if (classData) {
      setFormData(classData);
    }
  }, [classData]);

  const handleInputChange = (field: keyof ClassSchedule, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (classData) {
      onDelete(classData.id);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Class</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowSubjectPicker(!showSubjectPicker)}
            >
              <Text style={styles.pickerButtonText}>
                {formData.subjectId ? subjects.find(s => s.id === formData.subjectId)?.name || 'Select a subject' : 'Select a subject'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showSubjectPicker && (
              <View style={styles.pickerDropdown}>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    style={styles.pickerOption}
                    onPress={() => {
                      handleInputChange('subjectId', subject.id);
                      setShowSubjectPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{subject.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Day</Text>
              <TextInput
                style={styles.input}
                value={weekDays[formData.day]}
                editable={false}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                value={formData.time}
                onChangeText={(text) => handleInputChange('time', text)}
                placeholder="HH:MM"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Duration (hours)</Text>
              <TextInput
                style={styles.input}
                value={formData.duration.toString()}
                onChangeText={(text) => handleInputChange('duration', parseInt(text) || 1)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Attendance %</Text>
              <TextInput
                style={styles.input}
                value={formData.attendance.toString()}
                onChangeText={(text) => handleInputChange('attendance', parseInt(text) || 100)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]} 
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <View style={styles.buttonSpacer} />
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.buttonSpacer} />
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
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

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();
  const { subjects, classes, addClass, updateClass, deleteClass, getSubjectById } = useSubjects();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getClassForSlot = (dayIndex: number, timeSlot: string) => {
    return classes.find(cls => cls.day === dayIndex && cls.time === timeSlot);
  };

  const handleEditClass = (classItem: ClassSchedule) => {
    setSelectedClass(classItem);
    setIsModalVisible(true);
  };

  const handleSaveClass = (updatedClass: ClassSchedule) => {
    updateClass(updatedClass);
  };

  const handleDeleteClass = (id: number) => {
    deleteClass(id);
  };

  const handleAddNewClass = (dayIndex: number, timeSlot: string) => {
    if (subjects.length === 0) {
      Alert.alert('No Subjects', 'Please add subjects in the Home tab first before creating classes.');
      return;
    }
    const newClass: ClassSchedule = {
      id: Math.max(0, ...classes.map(c => c.id)) + 1,
      subjectId: subjects[0].id,
      time: timeSlot,
      day: dayIndex,
      duration: 1,
      attendance: 100
    };
    addClass(newClass);
  };

  const renderCalendarView = () => (
    <Animated.View style={[styles.calendar, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.calendarHeader}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeHeaderText}>Time</Text>
        </View>
        {weekDays.map((day, index) => {
          const today = new Date().getDay();
          const dayIndex = today === 0 ? 6 : today - 1;
          const isToday = dayIndex === index;
          return (
            <View key={index} style={[styles.dayColumn, isToday && styles.todayColumn]}>
              <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
              {isToday && <View style={styles.todayIndicator} />}
            </View>
          );
        })}
      </View>
      
      {timeSlots.map((timeSlot, timeIndex) => {
        const currentHour = currentTime.getHours();
        const slotHour = parseInt(timeSlot.split(':')[0]);
        const isPastTime = slotHour < currentHour;
        
        return (
          <View key={timeIndex} style={[styles.timeRow, isPastTime && styles.pastTimeRow]}>
            <View style={styles.timeColumn}>
              <Text style={[styles.timeText, isPastTime && styles.pastTimeText]}>{timeSlot}</Text>
            </View>
            {weekDays.map((_, dayIndex) => {
              const classItem = getClassForSlot(dayIndex, timeSlot);
              const subject = classItem ? getSubjectById(classItem.subjectId) : null;
              const classColor = classItem ? `hsl(${(classItem.id * 60) % 360}, 70%, 60%)` : '#667eea';
              
              return (
                <View key={dayIndex} style={styles.dayColumn}>
                  {classItem ? (
                    <TouchableOpacity 
                      style={[
                        styles.classBlock, 
                        { backgroundColor: classColor },
                        isPastTime && styles.pastClassBlock
                      ]}
                      onPress={() => handleEditClass(classItem)}
                      onLongPress={() => handleEditClass(classItem)}
                    >
                      <Text style={styles.classBlockText} numberOfLines={1}>
                        {subject?.name || 'Unknown Subject'}
                      </Text>
                      <Text style={styles.classBlockRoom} numberOfLines={1}>
                        {subject?.room || 'No Room'}
                      </Text>
                      <View style={styles.classBlockFooter}>
                        <Text style={styles.classDuration}>{classItem.duration}h</Text>
                        <View style={[styles.attendanceDot, { 
                          backgroundColor: classItem.attendance >= 85 ? '#4CAF50' : classItem.attendance >= 75 ? '#FF9800' : '#F44336' 
                        }]} />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.addClassButton, isPastTime && styles.pastAddButton]}
                      onPress={() => handleAddNewClass(dayIndex, timeSlot)}
                      disabled={isPastTime}
                    >
                      <Ionicons name="add" size={18} color={isPastTime ? "#ccc" : "#667eea"} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </Animated.View>
  );

  const renderListView = () => {
    const todayClasses = classes.filter(cls => {
      const today = new Date().getDay();
      const dayIndex = today === 0 ? 6 : today - 1; // Convert Sunday=0 to our Monday=0 format
      return cls.day === dayIndex;
    });

    return (
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        {todayClasses.length === 0 ? (
          <View style={styles.emptySchedule}>
            <Text style={styles.emptyScheduleText}>No classes scheduled for today</Text>
          </View>
        ) : (
          todayClasses.map((classItem) => {
            const subject = getSubjectById(classItem.subjectId);
            return (
              <View key={classItem.id} style={styles.classCard}>
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{subject?.name || 'Unknown Subject'}</Text>
                  <Text style={styles.classDetails}>{classItem.time} • {subject?.room || 'No Room'}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => subject?.classLink && Linking.openURL(
                    subject.classLink.startsWith('http') 
                      ? subject.classLink 
                      : `https://${subject.classLink}`
                  )}
                >
                  <Ionicons name="videocam" size={20} color="white" />
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <EditClassModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        classData={selectedClass}
        onSave={handleSaveClass}
        onDelete={handleDeleteClass}
      />
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Classes</Text>
          <Text style={styles.subtitle}>{classes.length} scheduled classes</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'calendar' && styles.activeToggle]}
              onPress={() => setViewMode('calendar')}
            >
              <Ionicons name="calendar" size={18} color={viewMode === 'calendar' ? 'white' : '#667eea'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons name="list" size={18} color={viewMode === 'list' ? 'white' : '#667eea'} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
        
        {/* Quick Stats */}
        {classes.length > 0 && (
          <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.statGradient}>
                  <Ionicons name="calendar" size={24} color="white" />
                  <Text style={styles.statNumber}>{classes.length}</Text>
                  <Text style={styles.statLabel}>Total Classes</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.statGradient}>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.statNumber}>
                    {Math.round(classes.reduce((acc, cls) => acc + cls.attendance, 0) / classes.length)}%
                  </Text>
                  <Text style={styles.statLabel}>Avg Attendance</Text>
                </LinearGradient>
              </View>
            </View>
          </Animated.View>
        )}
        
        {/* Attendance Summary */}
        {classes.length > 0 && (
          <Animated.View style={[styles.attendanceSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Attendance Summary</Text>
            {classes.map((classItem, index) => {
              const subject = getSubjectById(classItem.subjectId);
              return (
                <Animated.View 
                  key={classItem.id} 
                  style={[
                    styles.attendanceCard,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: Animated.add(slideAnim, new Animated.Value(index * 5)) }]
                    }
                  ]}
                >
                  <View style={styles.attendanceInfo}>
                    <View style={styles.attendanceLeft}>
                      <View style={[styles.subjectColorDot, { backgroundColor: `hsl(${(classItem.id * 60) % 360}, 70%, 60%)` }]} />
                      <Text style={styles.attendanceClassName}>{subject?.name || 'Unknown Subject'}</Text>
                    </View>
                    <Text style={[styles.attendancePercentage, {
                      color: classItem.attendance >= 85 ? '#4CAF50' : classItem.attendance >= 75 ? '#FF9800' : '#F44336'
                    }]}>{classItem.attendance}%</Text>
                  </View>
                  <View style={styles.attendanceBar}>
                    <Animated.View 
                      style={[
                        styles.attendanceProgress, 
                        { 
                          width: `${classItem.attendance}%`,
                          backgroundColor: classItem.attendance >= 85 ? '#4CAF50' : classItem.attendance >= 75 ? '#FF9800' : '#F44336'
                        }
                      ]} 
                    />
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    color: '#555',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerDropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: 'white',
    marginTop: 4,
    maxHeight: 150,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
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
  deleteButton: {
    backgroundColor: '#f56565',
    marginRight: 'auto',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonSpacer: {
    width: 10,
  },
  // Existing styles
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: -0.5,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#667eea',
    elevation: 2,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
    elevation: 1,
  },
  timeColumn: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  timeHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    position: 'relative',
  },
  todayColumn: {
    backgroundColor: '#f0f4ff',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  todayText: {
    color: '#667eea',
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  pastTimeRow: {
    opacity: 0.6,
    backgroundColor: '#fafafa',
  },
  timeText: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '600',
  },
  pastTimeText: {
    color: '#adb5bd',
  },
  classBlock: {
    flex: 1,
    margin: 3,
    padding: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  pastClassBlock: {
    opacity: 0.7,
    elevation: 1,
  },
  classBlockFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  classDuration: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  attendanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addClassButton: {
    flex: 1,
    margin: 3,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  pastAddButton: {
    borderColor: '#e9ecef',
    backgroundColor: '#f5f5f5',
  },
  classBlockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  classBlockRoom: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    letterSpacing: -0.3,
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
  attendanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  attendanceClassName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  attendancePercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  attendanceCard: {
    marginBottom: 15,
    padding: 18,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  attendanceProgress: {
    height: '100%',
    borderRadius: 4,
  },
  emptySchedule: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  emptyScheduleText: {
    color: '#666',
    fontSize: 16,
  },
  statsSection: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 15,
    borderRadius: 16,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  attendanceSection: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 15,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  attendanceBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
});
