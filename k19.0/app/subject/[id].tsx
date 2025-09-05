import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSubjectsStore } from '@/stores/subjects';

const tabs = ['Documents', 'Notes', 'Timetable', 'Share'] as const;

type TabKey = typeof tabs[number];

export default function SubjectPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [active, setActive] = React.useState<TabKey>('Documents');
  const subject = useSubjectsStore((s) => s.getSubject(String(id)));

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{subject?.title || `Subject: ${id}`}</ThemedText>

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickBtn}><ThemedText style={styles.quickText}>+ Doc</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}><ThemedText style={styles.quickText}>+ Note</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}><ThemedText style={styles.quickText}>+ Event</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}><ThemedText style={styles.quickText}>Share</ThemedText></TouchableOpacity>
      </View>

      <View style={styles.tabbar}>
        {tabs.map((t) => (
          <TouchableOpacity key={t} onPress={() => setActive(t)} style={[styles.tab, active === t && styles.tabActive]}>
            <ThemedText style={active === t ? styles.tabTextActive : styles.tabText}>{t}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 12 }}>
        {active === 'Documents' && (
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Documents</ThemedText>
            <ThemedText style={styles.muted}>Upload files and see AI summaries (stub)</ThemedText>
          </ThemedView>
        )}
        {active === 'Notes' && (
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Notes</ThemedText>
            <ThemedText style={styles.muted}>Rich text + AI notes (stub)</ThemedText>
          </ThemedView>
        )}
        {active === 'Timetable' && (
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Timetable</ThemedText>
            <ThemedText style={styles.muted}>Events and reminders (stub)</ThemedText>
          </ThemedView>
        )}
        {active === 'Share' && (
          <ThemedView style={styles.card}>
            <ThemedText type="defaultSemiBold">Share</ThemedText>
            <ThemedText style={styles.muted}>Invite collaborators (stub)</ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      <Link href="/(tabs)/chat" asChild>
        <TouchableOpacity style={styles.fab}>
          <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Chat</ThemedText>
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  quickBtn: { backgroundColor: '#2f95dc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  quickText: { color: '#fff', fontWeight: '600' },
  tabbar: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 8 },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#9999',
  },
  tabActive: { backgroundColor: '#2f95dc22', borderColor: '#2f95dc' },
  tabText: { opacity: 0.8 },
  tabTextActive: { color: '#2f95dc', fontWeight: '600' },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  muted: { opacity: 0.7, marginTop: 6 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#2f95dc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    elevation: 2,
  },
});
