import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="photo-detail" />
      <Stack.Screen name="location-photos" />
    </Stack>
  );
}
