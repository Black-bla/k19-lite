import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const notes = [
    {
      id: 1,
      title: "Mathematics - Calculus",
      preview: "Derivatives and integrals are fundamental concepts...",
      date: "2024-03-14",
      tags: ["math", "calculus"],
      hasAudio: true,
      hasDrawing: false,
    },
    {
      id: 2,
      title: "Physics - Quantum Mechanics",
      preview: "Wave-particle duality explains the behavior of...",
      date: "2024-03-13",
      tags: ["physics", "quantum"],
      hasAudio: false,
      hasDrawing: true,
    },
    {
      id: 3,
      title: "Chemistry - Organic Compounds",
      preview: "Carbon-based molecules form the basis of...",
      date: "2024-03-12",
      tags: ["chemistry", "organic"],
      hasAudio: true,
      hasDrawing: true,
    },
  ];

  const aiSuggestions = [
    "Generate flashcards from this note",
    "Summarize key points",
    "Create practice questions",
    "Find related topics",
  ];

  const renderNotesList = () => (
    <ScrollView style={styles.notesList}>
      <View style={styles.notesHeader}>
        <Text style={styles.sectionTitle}>Recent Notes</Text>
        <TouchableOpacity style={styles.newNoteButton}>
          <Ionicons name="add" size={20} color="#667eea" />
          <Text style={styles.newNoteText}>New Note</Text>
        </TouchableOpacity>
      </View>

      {notes.map((note) => (
        <TouchableOpacity
          key={note.id}
          style={styles.noteCard}
          onPress={() => setSelectedNote(note.id)}
        >
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.notePreview}>{note.preview}</Text>
            <View style={styles.noteMeta}>
              <Text style={styles.noteDate}>{note.date}</Text>
              <View style={styles.noteIcons}>
                {note.hasAudio && <Ionicons name="mic" size={14} color="#666" />}
                {note.hasDrawing && <Ionicons name="brush" size={14} color="#666" />}
              </View>
            </View>
            <View style={styles.tagsContainer}>
              {note.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderNoteEditor = () => (
    <View style={styles.editorContainer}>
      <View style={styles.editorHeader}>
        <TouchableOpacity onPress={() => setSelectedNote(null)}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.editorTitle}>Edit Note</Text>
        <TouchableOpacity>
          <Ionicons name="checkmark" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolButton}>
          <Ionicons name="text" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Ionicons name="brush" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toolButton, isRecording && styles.activeToolButton]}
          onPress={() => setIsRecording(!isRecording)}
        >
          <Ionicons name="mic" size={20} color={isRecording ? "white" : "#666"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Ionicons name="camera" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Editor */}
      <ScrollView style={styles.editor}>
        <TextInput
          style={styles.editorInput}
          multiline
          placeholder="Start typing your notes..."
          value={noteContent}
          onChangeText={setNoteContent}
          textAlignVertical="top"
        />
      </ScrollView>

      {/* AI Suggestions */}
      <View style={styles.aiSuggestions}>
        <Text style={styles.aiTitle}>✨ AI Assistant</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {aiSuggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recording Indicator */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Recording... Tap to stop</Text>
          <Text style={styles.recordingTime}>0:23</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {selectedNote ? renderNoteEditor() : renderNotesList()}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  searchButton: {
    padding: 4,
  },
  notesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  newNoteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  newNoteText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  noteCard: {
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
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  noteMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: "#999",
  },
  noteIcons: {
    flexDirection: "row",
    gap: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#1976d2",
    fontWeight: "500",
  },
  editorContainer: {
    flex: 1,
  },
  editorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  toolbar: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    gap: 16,
  },
  toolButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  activeToolButton: {
    backgroundColor: "#667eea",
  },
  editor: {
    flex: 1,
    backgroundColor: "white",
  },
  editorInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    padding: 20,
    minHeight: 300,
  },
  aiSuggestions: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  suggestionChip: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "500",
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ffcdd2",
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f44336",
    marginRight: 8,
  },
  recordingText: {
    flex: 1,
    fontSize: 14,
    color: "#f44336",
    fontWeight: "500",
  },
  recordingTime: {
    fontSize: 14,
    color: "#f44336",
    fontWeight: "600",
  },
});
