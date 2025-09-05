import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Dimensions, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSubjects } from "../../contexts/SubjectsContext";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { useSubjectItems } from "../../contexts/SubjectItemsContext";

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { subjects, updateSubject } = useSubjects();
  const { items } = useSubjectItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");

  const screenWidth = Dimensions.get('window').width;

  const baseCategories = [
    { id: "all", name: "All" },
    { id: "notes", name: "Notes" },
    { id: "assignments", name: "Assignments" },
    { id: "lectures", name: "Lectures" },
  ] as const;

  // Mock documents enhanced with subject linkage
  const documents = [
    { 
      id: 1, 
      name: "Mathematics Notes - Chapter 5", 
      type: "pdf", 
      size: "2.4 MB", 
      date: "2024-03-14",
      category: "notes",
      subjectId: subjects[0]?.id,
      synced: true 
    },
    { 
      id: 2, 
      name: "Physics Assignment 3", 
      type: "docx", 
      size: "1.2 MB", 
      date: "2024-03-13",
      category: "assignments",
      subjectId: subjects[1]?.id ?? subjects[0]?.id,
      synced: false 
    },
    { 
      id: 3, 
      name: "Chemistry Lab Report", 
      type: "pdf", 
      size: "3.1 MB", 
      date: "2024-03-12",
      category: "assignments",
      subjectId: subjects[2]?.id ?? subjects[0]?.id,
      synced: true 
    },
    { 
      id: 4, 
      name: "Biology Lecture Recording", 
      type: "mp4", 
      size: "45.2 MB", 
      date: "2024-03-11",
      category: "lectures",
      subjectId: subjects[3]?.id ?? subjects[0]?.id,
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

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
      const matchesSubject = selectedSubjectId === "all" || doc.subjectId === selectedSubjectId;
      return matchesSearch && matchesCategory && matchesSubject;
    });
  }, [documents, searchQuery, selectedCategory, selectedSubjectId]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, notes: 0, assignments: 0, lectures: 0 };
    documents.forEach(d => {
      counts.all += 1;
      if (d.category in counts) counts[d.category] += 1;
    });
    return counts;
  }, [documents]);

  // Compute per-subject counts from global items
  const subjectStats = useMemo(() => {
    const stats: Record<string, { docs: number; images: number; videos: number; notes: number }> = {};
    subjects.forEach(s => { stats[s.id] = { docs: 0, images: 0, videos: 0, notes: 0 }; });
    items.forEach(it => {
      const sid = String(it.subjectId);
      if (!stats[sid]) stats[sid] = { docs: 0, images: 0, videos: 0, notes: 0 };
      if (it.type === 'pdf' || it.type === 'docx') stats[sid].docs += 1;
      else if (it.type === 'jpg' || it.type === 'png') stats[sid].images += 1;
      else if (it.type === 'mp4') stats[sid].videos += 1;
      else if (it.type === 'note') stats[sid].notes += 1;
    });
    return stats;
  }, [subjects, items]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <Text style={styles.title}>My Subjects</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Subject Grid/List */}
      {subjects.length === 0 ? (
        <View style={styles.emptyStateWrapper}>
          <Ionicons name="folder-open" size={32} color="#667eea" />
          <Text style={styles.emptyStateTitle}>No subjects yet</Text>
          <Text style={styles.emptyStateSub}>Add subjects on the Home tab to organize your documents</Text>
          <TouchableOpacity style={styles.emptyCta} onPress={() => router.push("/(tabs)")}> 
            <Ionicons name="home" size={16} color="white" />
            <Text style={styles.emptyCtaText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={styles.documentsContainer}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
          data={subjects}
          keyExtractor={(item) => String(item.id)}
          key={'list-full'}
          numColumns={1}
          renderItem={({ item: subj }) => {
            const stats = subjectStats[String(subj.id)] || { docs: 0, images: 0, videos: 0, notes: 0 };
            const cardWidth = screenWidth - 16 - 16; // paddingHorizontal 16 on container
            const imageUrl = (subj as any)?.imageUrl as string | undefined;
            return (
              <TouchableOpacity
                onPress={() => router.push({ pathname: "/subject/[id]", params: { id: String(subj.id) } })}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={imageUrl ? { uri: imageUrl } : undefined}
                  style={[styles.subjectCardFull, { width: cardWidth }]}
                  imageStyle={styles.subjectCardImage}
                >
                  {/* Overlay for legibility */}
                  <View style={styles.subjectOverlay} />
                  <View style={styles.subjectContent}>
                    <View style={styles.subjectTopRow}>
                      <View style={styles.subjectBadge}>
                        <Ionicons name="book" size={16} color="#667eea" />
                      </View>
                      <TouchableOpacity
                        style={styles.subjectMenuBtn}
                        onPress={async () => {
                          const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
                          if (res.canceled || !res.assets?.length) return;
                          const uri = res.assets[0].uri;
                          updateSubject({ ...subj, imageUrl: uri });
                        }}
                      >
                        <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.subjectTitle} numberOfLines={1}>{subj.name}</Text>
                    <View style={styles.subjectStatsRow}>
                      <View style={styles.statPill}>
                        <Ionicons name="document-text" size={14} color="#fff" />
                        <Text style={styles.statText}>{stats.docs}</Text>
                      </View>
                      <View style={styles.statPill}>
                        <Ionicons name="image" size={14} color="#fff" />
                        <Text style={styles.statText}>{stats.images}</Text>
                      </View>
                      <View style={styles.statPill}>
                        <Ionicons name="videocam" size={14} color="#fff" />
                        <Text style={styles.statText}>{stats.videos}</Text>
                      </View>
                      <View style={styles.statPill}>
                        <Ionicons name="create" size={14} color="#fff" />
                        <Text style={styles.statText}>{stats.notes}</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, { bottom: 24 + insets.bottom }]} activeOpacity={0.9}>
        <Ionicons name="add" size={26} color="white" />
      </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  toggleButton: {
    display: 'none',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  uploadButton: {
    backgroundColor: "#667eea",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "white",
  },
  subjectsContainer: {
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 0,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dbe4ff',
    height: 22,
  },
  activeSubjectChip: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  subjectDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#667eea',
    marginRight: 6,
  },
  subjectText: {
    fontSize: 10,
    color: '#667eea',
    fontWeight: '600',
    lineHeight: 12,
  },
  activeSubjectText: {
    color: 'white',
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    paddingHorizontal: 12,
    paddingVertical: 4,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  scanText: {
    marginLeft: 4,
    fontSize: 11,
    color: "#667eea",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  filtersContainer: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: 'white',
  },
  categoryChip: {
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    height: 20,
  },
  activeCategoryChip: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  categoryText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "600",
    lineHeight: 12,
  },
  activeCategoryText: {
    color: "white",
  },
  documentsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subjectCardFull: {
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#667eea',
    marginBottom: 12,
  },
  subjectCardImage: {
    resizeMode: 'cover',
    borderRadius: 14,
  },
  subjectOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  subjectContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  subjectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dbe4ff',
  },
  subjectMenuBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
  },
  subjectStatsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statText: {
    marginLeft: 4,
    color: 'white',
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#667eea',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  documentSubjectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  documentSubjectText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
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
  emptyStateWrapper: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyStateTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  emptyStateSub: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  emptyCta: {
    marginTop: 12,
    backgroundColor: '#667eea',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyCtaText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyStateInline: {
    padding: 20,
    alignItems: 'center',
    opacity: 0.8,
  },
  emptyStateInlineText: {
    marginTop: 6,
    color: '#999',
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
