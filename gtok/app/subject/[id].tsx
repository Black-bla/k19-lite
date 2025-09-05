import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubjects } from '../../contexts/SubjectsContext';
import { useSubjectItems } from '../../contexts/SubjectItemsContext';
import { Video, ResizeMode } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const SEGMENTS = [
  { id: 'documents', label: 'Documents' },
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
  { id: 'notes', label: 'Notes' },
] as const;

type SegmentId = typeof SEGMENTS[number]['id'];

type Item = {
  id: string | number;
  name: string;
  type: 'pdf' | 'docx' | 'jpg' | 'png' | 'mp4' | 'note';
  date: string;
  subjectId: string;
  uri?: string;
};

export default function SubjectDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { subjects } = useSubjects();
  const { items, addItem, getItemsBySubject } = useSubjectItems();
  const [segment, setSegment] = useState<SegmentId>('documents');
  const [actionOpen, setActionOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const subject = subjects.find(s => String(s.id) === String(id));

  // Subject-specific items from global store
  const subjectItems = useMemo(() => getItemsBySubject(String(id)) as Item[], [items, id, getItemsBySubject]);
  const [preview, setPreview] = useState<{ visible: boolean; type?: 'video' | 'image'; uri?: string }>({ visible: false });

  const filtered = useMemo(() => {
    switch (segment) {
      case 'documents':
        return subjectItems.filter(i => i.type === 'pdf' || i.type === 'docx');
      case 'images':
        return subjectItems.filter(i => i.type === 'jpg' || i.type === 'png');
      case 'videos':
        return subjectItems.filter(i => i.type === 'mp4');
      case 'notes':
        return subjectItems.filter(i => i.type === 'note');
      default:
        return [];
    }
  }, [subjectItems, segment]);

  const iconFor = (type: Item['type']) => {
    switch (type) {
      case 'pdf': return { name: 'document-text', color: '#f44336' } as const;
      case 'docx': return { name: 'document', color: '#2196F3' } as const;
      case 'jpg':
      case 'png': return { name: 'image', color: '#4CAF50' } as const;
      case 'mp4': return { name: 'videocam', color: '#9C27B0' } as const;
      case 'note': return { name: 'create', color: '#FF9800' } as const;
      default: return { name: 'document', color: '#666' } as const;
    }
  };

  const ensureMediaPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required.');
      return false;
    }
    return true;
  }, []);

  const pickDocument = useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ multiple: false });
      if (res.canceled) return;
      const file = res.assets?.[0];
      if (!file) return;
      const name = file.name ?? 'Document';
      const ext = (name.split('.').pop() || '').toLowerCase();
      const type: Item['type'] = ext === 'doc' || ext === 'docx' ? 'docx' : 'pdf';
      addItem({ name, type, subjectId: String(id), uri: file.uri });
    } catch (e) {
      console.warn('pickDocument error', e);
    } finally {
      setActionOpen(false);
    }
  }, [id, addItem]);

  const pickImage = useCallback(async () => {
    try {
      if (!(await ensureMediaPermission())) return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.9 });
      if (res.canceled || !res.assets?.length) return;
      const asset = res.assets[0];
      const uri = asset.uri || '';
      const ext = (uri.split('.').pop() || '').toLowerCase();
      const type: Item['type'] = ext === 'png' ? 'png' : 'jpg';
      const name = asset.fileName || 'Image';
      addItem({ name, type, subjectId: String(id), uri });
    } catch (e) {
      console.warn('pickImage error', e);
    } finally {
      setActionOpen(false);
    }
  }, [id, ensureMediaPermission, addItem]);

  const pickVideo = useCallback(async () => {
    try {
      if (!(await ensureMediaPermission())) return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos, quality: 1 });
      if (res.canceled || !res.assets?.length) return;
      const asset = res.assets[0];
      const name = asset.fileName || 'Video';
      addItem({ name, type: 'mp4', subjectId: String(id), uri: asset.uri });
    } catch (e) {
      console.warn('pickVideo error', e);
    } finally {
      setActionOpen(false);
    }
  }, [id, ensureMediaPermission, addItem]);

  const saveNote = useCallback(() => {
    if (!noteText.trim()) { setNoteOpen(false); return; }
    addItem({ name: noteText.trim(), type: 'note', subjectId: String(id) });
    setNoteText('');
    setNoteOpen(false);
    setActionOpen(false);
  }, [id, noteText, addItem]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#667eea" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{subject?.name || 'Subject'}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.segmentBar}>
        {SEGMENTS.map(s => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setSegment(s.id)}
            style={[styles.segment, segment === s.id && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, segment === s.id && styles.segmentTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {segment === 'images' ? (
        <FlatList
          data={filtered}
          key={'images-grid'}
          numColumns={3}
          keyExtractor={(item) => String(item.id)}
          columnWrapperStyle={{ gap: 10, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingBottom: 120, gap: 10 }}
          ListEmptyComponent={() => (
            <View style={styles.emptyStateInline}>
              <Ionicons name="folder-open" size={28} color="#999" />
              <Text style={styles.emptyStateInlineText}>No images yet</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.imageGridItem}
              activeOpacity={0.85}
              onPress={() => item.uri && setPreview({ visible: true, type: 'image', uri: item.uri })}
            >
              {item.uri ? (
                <Image source={{ uri: item.uri }} style={styles.imageThumb} resizeMode="cover" />
              ) : (
                <View style={[styles.imageThumb, { backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="image" size={20} color="#9ca3af" />
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={filtered}
          key={'list'}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          ListEmptyComponent={() => (
            <View style={styles.emptyStateInline}>
              <Ionicons name="folder-open" size={28} color="#999" />
              <Text style={styles.emptyStateInlineText}>No items yet</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const icon = iconFor(item.type);
            return (
              <TouchableOpacity
                style={styles.itemCard}
                activeOpacity={0.8}
                onPress={() => {
                  if (item.type === 'mp4' && item.uri) {
                    setPreview({ visible: true, type: 'video', uri: item.uri });
                  }
                }}
              >
                <View style={[styles.itemIcon, { backgroundColor: '#f5f5f5' }]}>
                  <Ionicons name={icon.name as any} size={22} color={icon.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{item.date}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <Ionicons name="ellipsis-vertical" size={18} color="#666" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <TouchableOpacity style={[styles.fab, { bottom: 24 + insets.bottom }]} activeOpacity={0.9} onPress={() => setActionOpen(true)}>
        <Ionicons name="add" size={26} color="white" />
      </TouchableOpacity>

      {/* Action Sheet */}
      <Modal visible={actionOpen} animationType="fade" transparent onRequestClose={() => setActionOpen(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={[styles.sheet, { paddingBottom: 12 + insets.bottom }]}> 
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add to {subject?.name || 'Subject'}</Text>
            <TouchableOpacity style={styles.sheetItem} onPress={pickDocument}>
              <Ionicons name="document-text" size={18} color="#333" />
              <Text style={styles.sheetItemText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} onPress={pickImage}>
              <Ionicons name="image" size={18} color="#333" />
              <Text style={styles.sheetItemText}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} onPress={pickVideo}>
              <Ionicons name="videocam" size={18} color="#333" />
              <Text style={styles.sheetItemText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} onPress={() => setNoteOpen(true)}>
              <Ionicons name="create" size={18} color="#333" />
              <Text style={styles.sheetItemText}>Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sheetItem, { justifyContent: 'center' }]} onPress={() => setActionOpen(false)}>
              <Text style={[styles.sheetItemText, { fontWeight: '800' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Media Preview (image/video) */}
      <Modal visible={preview.visible} animationType="slide" transparent onRequestClose={() => setPreview({ visible: false })}>
        <View style={styles.noteBackdrop}>
          <View style={[styles.videoModal, { paddingBottom: 12 + insets.bottom }]}> 
            <TouchableOpacity style={styles.videoClose} onPress={() => setPreview({ visible: false })}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            {preview.type === 'video' && preview.uri ? (
              <Video
                source={{ uri: preview.uri }}
                style={{ width: '100%', height: 220, backgroundColor: '#000' }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            ) : preview.type === 'image' && preview.uri ? (
              <Image
                source={{ uri: preview.uri }}
                style={{ width: '100%', height: 320, backgroundColor: '#000', borderRadius: 8 }}
                resizeMode="contain"
              />
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Note Modal */}
      <Modal visible={noteOpen} animationType="slide" transparent onRequestClose={() => setNoteOpen(false)}>
        <View style={styles.noteBackdrop}>
          <View style={styles.noteModal}>
            <Text style={styles.noteTitle}>New Note</Text>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Note title"
              placeholderTextColor="#999"
              style={styles.noteInput}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => setNoteOpen(false)} style={styles.noteBtnSecondary}>
                <Text style={styles.noteBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveNote} style={styles.noteBtnPrimary}>
                <Text style={[styles.noteBtnText, { color: 'white' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#dbe4ff',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#f1f5ff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dbe4ff',
  },
  segmentActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  segmentText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '700',
  },
  segmentTextActive: {
    color: 'white',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  itemMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#666',
  },
  moreButton: {
    marginLeft: 8,
    padding: 4,
  },
  emptyStateInline: {
    padding: 24,
    alignItems: 'center',
    opacity: 0.8,
  },
  emptyStateInlineText: {
    marginTop: 6,
    color: '#999',
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
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  sheetItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
  },
  noteBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  noteModal: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
    color: '#333',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8, default: 10 }),
    marginBottom: 12,
    color: '#111827',
  },
  noteBtnSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  noteBtnPrimary: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#667eea',
  },
  noteBtnText: {
    color: '#111827',
    fontWeight: '800',
  },
  videoModal: {
    width: '92%',
    maxWidth: 560,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
  },
  videoClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  imageGridItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  imageThumb: {
    width: '100%',
    height: '100%',
  },
});
