import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Study Assistant. I can help you summarize documents, generate quizzes, answer questions from your notes, and more. What would you like to work on today?",
      isUser: false,
      timestamp: "10:30 AM"
    }
  ]);
  const [inputText, setInputText] = useState("");

  const quickActions = [
    { id: 1, title: "Summarize PDF", icon: "document-text", color: "#f44336" },
    { id: 2, title: "Generate Quiz", icon: "help-circle", color: "#4CAF50" },
    { id: 3, title: "Create Flashcards", icon: "layers", color: "#FF9800" },
    { id: 4, title: "Explain Topic", icon: "bulb", color: "#2196F3" },
  ];

  const recentFiles = [
    { id: 1, name: "Mathematics Notes Ch.5", type: "pdf" },
    { id: 2, name: "Physics Assignment", type: "docx" },
    { id: 3, name: "Chemistry Lab Report", type: "pdf" },
  ];

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMessage]);
      setInputText("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          text: "I understand you want help with that. Let me analyze your request and provide you with the best assistance possible.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessage: Message = {
      id: messages.length + 1,
      text: `I'd like to ${action.toLowerCase()}`,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, actionMessage]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          {messages.length === 1 && (
            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[styles.quickActionCard, { backgroundColor: action.color }]}
                    onPress={() => handleQuickAction(action.title)}
                  >
                    <Ionicons name={action.icon as any} size={24} color="white" />
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Recent Files */}
          {messages.length === 1 && (
            <View style={styles.recentFilesContainer}>
              <Text style={styles.recentFilesTitle}>Analyze Recent Files</Text>
              {recentFiles.map((file) => (
                <TouchableOpacity key={file.id} style={styles.fileCard}>
                  <View style={styles.fileIcon}>
                    <Ionicons 
                      name={file.type === 'pdf' ? 'document-text' : 'document'} 
                      size={20} 
                      color={file.type === 'pdf' ? '#f44336' : '#2196F3'} 
                    />
                  </View>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              {!message.isUser && (
                <View style={styles.aiAvatar}>
                  <Text style={styles.aiAvatarText}>AI</Text>
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.aiBubble
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.isUser ? styles.userText : styles.aiText
                ]}>
                  {message.text}
                </Text>
                <Text style={[
                  styles.messageTime,
                  message.isUser ? styles.userTime : styles.aiTime
                ]}>
                  {message.timestamp}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="attach" size={20} color="#667eea" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me anything about your studies..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color={inputText.trim() ? "white" : "#999"} />
            </TouchableOpacity>
          </View>
          
          {/* Suggestions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>Explain quantum mechanics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>Create math quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>Summarize my notes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickActionsContainer: {
    marginVertical: 20,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    width: "47%",
    aspectRatio: 1.5,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  recentFilesContainer: {
    marginBottom: 20,
  },
  recentFilesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  fileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fileIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  aiAvatarText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: "#667eea",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  userText: {
    color: "white",
  },
  aiText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
  },
  userTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  aiTime: {
    color: "#999",
  },
  inputContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: "#667eea",
  },
  suggestionsContainer: {
    flexDirection: "row",
  },
  suggestionChip: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "500",
  },
});
