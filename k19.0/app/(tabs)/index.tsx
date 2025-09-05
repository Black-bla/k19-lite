import React from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, Platform, Modal, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useSubjectsStore } from '@/stores/subjects';
import { useDocsStore } from '@/stores/docs';
import { useNotesStore } from '@/stores/notes';
import { useEventsStore } from '@/stores/events';

export default function HomeScreen() {
  const subjects = useSubjectsStore((s) => s.subjects);
  const addSubject = useSubjectsStore((s) => s.addSubject);
  const docsRecent = useDocsStore((s) => s.getRecent(5));
  const notesRecent = useNotesStore((s) => s.getRecent(5));
  const getNextEvent = useEventsStore((s) => s.getNext);
  const addDoc = useDocsStore((s) => s.addDoc);
  const addNote = useNotesStore((s) => s.addNote);
  const addEvent = useEventsStore((s) => s.addEvent);

  const [search, setSearch] = React.useState('');
  const [showActions, setShowActions] = React.useState(false);
  const [pickerFor, setPickerFor] = React.useState<null | 'doc' | 'note' | 'event'>(null);
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string | null>(null);
  const [noteText, setNoteText] = React.useState('');
  const [eventTitle, setEventTitle] = React.useState('');
  const [eventWhen, setEventWhen] = React.useState<string>(''); // ISO-like string or natural

  const next = getNextEvent();

  const filteredSubjects = subjects.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const searchResults = search
    ? [
        ...subjects
          .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
          .map((s) => ({ type: 'subject' as const, id: s.id, title: s.title })),
        ...docsRecent
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((d) => ({ type: 'doc' as const, id: d.id, subjectId: d.subjectId, title: d.name })),
        ...notesRecent
          .filter((n) =>
            `${n.title} ${n.content}`.toLowerCase().includes(search.toLowerCase())
          )
          .map((n) => ({ type: 'note' as const, id: n.id, subjectId: n.subjectId, title: n.title })),
      ]
    : [];

  const openPickSubject = (forType: 'doc' | 'note' | 'event') => {
    setSelectedSubjectId(null);
    setPickerFor(forType);
    setShowActions(false);
  };

  const handlePickDocument = async () => {
    if (!selectedSubjectId) return;
    const res = await DocumentPicker.getDocumentAsync({ multiple: false });
    if (res.assets && res.assets.length > 0) {
      const f = res.assets[0];
      addDoc({ subjectId: selectedSubjectId, name: f.name ?? 'Document', uri: f.uri, mimeType: f.mimeType ?? undefined });
    }
    setPickerFor(null);
  };

  const handleAddNote = () => {
    if (!selectedSubjectId) return;
    addNote({ subjectId: selectedSubjectId, title: noteText || 'Quick Note', content: noteText, aiGenerated: false });
    setNoteText('');
    setPickerFor(null);
  };

  const handleAddEvent = () => {
    if (!selectedSubjectId) return;
    const when = Date.parse(eventWhen) || Date.now() + 60 * 60 * 1000; // fallback +1h
    addEvent({ subjectId: selectedSubjectId, title: eventTitle || 'New Event', startsAt: when });
    setEventTitle('');
    setEventWhen('');
    setPickerFor(null);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Next Class Widget */}
      <ThemedView style={styles.card}>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle">Next class</ThemedText>
          {next ? (
            <Link href={{ pathname: '/subject/[id]', params: { id: next.subjectId } }} asChild>
              <TouchableOpacity style={styles.linkBtn}><ThemedText style={styles.linkText}>Open</ThemedText></TouchableOpacity>
            </Link>
          ) : null}
        </View>
        {next ? (
          <>
            <ThemedText type="defaultSemiBold">{next.title}</ThemedText>
            <ThemedText style={{ opacity: 0.7 }}>{new Date(next.startsAt).toLocaleString()}</ThemedText>
            {next.location ? (
              <ThemedText style={{ opacity: 0.7 }}>Location: {next.location}</ThemedText>
            ) : null}
          </>
        ) : (
          <ThemedText style={{ opacity: 0.7 }}>No upcoming events</ThemedText>
        )}
      </ThemedView>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search subjects, docs, notes, events"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
      {searchResults.length > 0 && (
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={{ marginBottom: 8 }}>Search results</ThemedText>
          {searchResults.map((r) => (
            <Link key={`${r.type}-${r.id}`} href={{ pathname: '/subject/[id]', params: { id: (r as any).subjectId || r.id } }} asChild>
              <TouchableOpacity style={styles.resultRow}>
                <ThemedText>[{r.type}] {(r as any).title}</ThemedText>
              </TouchableOpacity>
            </Link>
          ))}
        </ThemedView>
      )}

      {/* Subjects Grid */}
      <ThemedText type="subtitle" style={{ marginTop: 8, marginBottom: 6 }}>Subjects</ThemedText>
      <FlatList
        data={filteredSubjects}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ paddingBottom: 96 }}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/subject/[id]', params: { id: item.id } }} asChild>
            <TouchableOpacity style={styles.subjectCard}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={{ opacity: 0.6 }}>Open</ThemedText>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<ThemedText style={{ opacity: 0.7 }}>No subjects. Use + to add.</ThemedText>}
      />

      {/* Recent Activity */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={{ marginBottom: 6 }}>Recent</ThemedText>
        {[...docsRecent, ...notesRecent]
          .sort((a, b) => (('createdAt' in b ? (b as any).createdAt : 0) - ('createdAt' in a ? (a as any).createdAt : 0)))
          .slice(0, 6)
          .map((item: any) => (
            <Link key={`recent-${item.id}`} href={{ pathname: '/subject/[id]', params: { id: item.subjectId || item.id } }} asChild>
              <TouchableOpacity style={styles.resultRow}>
                {'name' in item ? (
                  <ThemedText>[doc] {item.name}</ThemedText>
                ) : (
                  <ThemedText>[note] {item.title}</ThemedText>
                )}
              </TouchableOpacity>
            </Link>
          ))}
      </ThemedView>

      {/* Floating Quick Actions */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowActions((s) => !s)}>
        <ThemedText style={styles.fabText}>+</ThemedText>
      </TouchableOpacity>

      {showActions && (
        <ThemedView style={styles.actionSheet}>
          <Pressable onPress={() => { addSubject({ title: `New Subject ${subjects.length + 1}` }); setShowActions(false); }} style={styles.actionBtn}>
            <ThemedText>New Subject</ThemedText>
          </Pressable>
          <Pressable onPress={() => openPickSubject('doc')} style={styles.actionBtn}>
            <ThemedText>Add Document</ThemedText>
          </Pressable>
          <Pressable onPress={() => openPickSubject('note')} style={styles.actionBtn}>
            <ThemedText>Add Note</ThemedText>
          </Pressable>
          <Pressable onPress={() => openPickSubject('event')} style={styles.actionBtn}>
            <ThemedText>Add Event</ThemedText>
          </Pressable>
        </ThemedView>
      )}

      {/* Subject Picker + contextual modals */}
      <Modal visible={pickerFor !== null} transparent animationType="slide" onRequestClose={() => setPickerFor(null)}>
        <View style={styles.modalBackdrop}>
          <ThemedView style={styles.modalCard}>
            <ThemedText type="subtitle" style={{ marginBottom: 8 }}>Select Subject</ThemedText>
            <FlatList
              data={subjects}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedSubjectId(item.id)} style={[styles.resultRow, selectedSubjectId === item.id && { backgroundColor: '#2f95dc22' }]}>
                  <ThemedText>{item.title}</ThemedText>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 200 }}
            />

            {pickerFor === 'note' && (
              <TextInput
                placeholder="Quick note"
                value={noteText}
                onChangeText={setNoteText}
                style={styles.input}
              />
            )}
            {pickerFor === 'event' && (
              <>
                <TextInput placeholder="Event title" value={eventTitle} onChangeText={setEventTitle} style={styles.input} />
                <TextInput placeholder="When (e.g., 2025-09-01 14:00)" value={eventWhen} onChangeText={setEventWhen} style={styles.input} />
              </>
            )}

            <View style={[styles.rowBetween, { marginTop: 12 }] }>
              <TouchableOpacity onPress={() => setPickerFor(null)} style={[styles.linkBtn, { backgroundColor: '#aaa' }]}>
                <ThemedText style={{ color: '#fff' }}>Cancel</ThemedText>
              </TouchableOpacity>
              {pickerFor === 'doc' && (
                <TouchableOpacity onPress={handlePickDocument} style={styles.linkBtn} disabled={!selectedSubjectId}>
                  <ThemedText style={styles.linkText}>Pick File</ThemedText>
                </TouchableOpacity>
              )}
              {pickerFor === 'note' && (
                <TouchableOpacity onPress={handleAddNote} style={styles.linkBtn} disabled={!selectedSubjectId}>
                  <ThemedText style={styles.linkText}>Save Note</ThemedText>
                </TouchableOpacity>
              )}
              {pickerFor === 'event' && (
                <TouchableOpacity onPress={handleAddEvent} style={styles.linkBtn} disabled={!selectedSubjectId}>
                  <ThemedText style={styles.linkText}>Add Event</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingBottom: 40 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  searchRow: { marginBottom: 8 },
  searchInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, default: 10 }),
  },
  resultRow: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  subjectCard: {
    flex: 1,
    minHeight: 90,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#2f95dc',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 28 },
  actionSheet: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    padding: 8,
    gap: 6,
  },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
  linkBtn: { backgroundColor: '#2f95dc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  linkText: { color: '#fff', fontWeight: '600' },
  modalBackdrop: { flex: 1, backgroundColor: '#0006', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, width: '100%' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
});
