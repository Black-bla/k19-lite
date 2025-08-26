import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function DocumentsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", count: 24 },
    { id: "notes", name: "Notes", count: 12 },
    { id: "assignments", name: "Assignments", count: 8 },
    { id: "lectures", name: "Lectures", count: 4 },
  ];

  const documents = [
    { 
      id: 1, 
      name: "Mathematics Notes - Chapter 5", 
      type: "pdf", 
      size: "2.4 MB", 
      date: "2024-03-14",
      category: "notes",
      synced: true 
    },
    { 
      id: 2, 
      name: "Physics Assignment 3", 
      type: "docx", 
      size: "1.2 MB", 
      date: "2024-03-13",
      category: "assignments",
      synced: false 
    },
    { 
      id: 3, 
      name: "Chemistry Lab Report", 
      type: "pdf", 
      size: "3.1 MB", 
      date: "2024-03-12",
      category: "assignments",
      synced: true 
    },
    { 
      id: 4, 
      name: "Biology Lecture Recording", 
      type: "mp4", 
      size: "45.2 MB", 
      date: "2024-03-11",
      category: "lectures",
      synced: true 
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return "document-text";
      case "docx": return "document";
      case "mp4": return "videocam";
      case "jpg": case "png": return "image";
      default: return "document";
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case "pdf": return "#f44336";
      case "docx": return "#2196F3";
      case "mp4": return "#9C27B0";
      case "jpg": case "png": return "#4CAF50";
      default: return "#666";
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="AI Search: 'Find notes on mitochondria'"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Cloud Sync Status */}
      <View style={styles.syncContainer}>
        <View style={styles.syncStatus}>
          <Ionicons name="cloud-done" size={16} color="#4CAF50" />
          <Text style={styles.syncText}>Synced with Google Drive</Text>
        </View>
        <TouchableOpacity style={styles.scanButton}>
          <Ionicons name="scan" size={16} color="#667eea" />
          <Text style={styles.scanText}>Smart Scanner</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.activeCategoryChip
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.activeCategoryText
            ]}>
              {category.name} ({category.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Documents List */}
      <ScrollView style={styles.documentsContainer}>
        {filteredDocuments.map((document) => (
          <TouchableOpacity key={document.id} style={styles.documentCard}>
            <View style={styles.documentIcon}>
              <Ionicons 
                name={getFileIcon(document.type) as any} 
                size={24} 
                color={getFileColor(document.type)} 
              />
            </View>
            
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{document.name}</Text>
              <View style={styles.documentMeta}>
                <Text style={styles.documentSize}>{document.size}</Text>
                <Text style={styles.documentDate}>{document.date}</Text>
              </View>
            </View>

            <View style={styles.documentActions}>
              {document.synced ? (
                <Ionicons name="cloud-done" size={16} color="#4CAF50" />
              ) : (
                <Ionicons name="cloud-upload" size={16} color="#ff9800" />
              )}
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="camera" size={20} color="#667eea" />
          <Text style={styles.actionText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="folder-open" size={20} color="#667eea" />
          <Text style={styles.actionText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cloud-upload" size={20} color="#667eea" />
          <Text style={styles.actionText}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share" size={20} color="#667eea" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
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
  uploadButton: {
    backgroundColor: "#667eea",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  syncContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  syncStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  syncText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scanText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#667eea",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  categoryChip: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeCategoryChip: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "white",
  },
  documentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  documentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentSize: {
    fontSize: 12,
    color: "#666",
    marginRight: 12,
  },
  documentDate: {
    fontSize: 12,
    color: "#666",
  },
  documentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreButton: {
    marginLeft: 12,
    padding: 4,
  },
  quickActions: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
  },
  actionText: {
    fontSize: 12,
    color: "#667eea",
    marginTop: 4,
    fontWeight: "500",
  },
});
