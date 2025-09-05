import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SubjectsProvider } from "../contexts/SubjectsContext";
import { SubjectItemsProvider } from "../contexts/SubjectItemsContext";

export default function RootLayout() {
  return (
    <SubjectsProvider>
      <SubjectItemsProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SubjectItemsProvider>
    </SubjectsProvider>
  );
}
