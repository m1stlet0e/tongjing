import { Tabs } from 'expo-router';
import { Platform, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

// 配色
const KLEIN_BLUE = '#002FA7';
const CHAMPAGNE_GOLD = '#C9A96E';

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEEEEE',
          borderTopWidth: 1,
          height: Platform.OS === 'web' ? 60 : 50 + insets.bottom,
          paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: KLEIN_BLUE,
        tabBarInactiveTintColor: '#999999',
        tabBarItemStyle: {
          height: Platform.OS === 'web' ? 60 : undefined,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      {/* Tab 1: 首页 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house" size={20} color={color} solid={color === KLEIN_BLUE} />
          ),
        }}
      />

      {/* Tab 2: 机位地图 */}
      <Tabs.Screen
        name="map"
        options={{
          title: '机位',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="map-location-dot" size={20} color={color} solid={color === KLEIN_BLUE} />
          ),
        }}
      />

      {/* Tab 3: 发布 - 中间悬浮大按钮 */}
      <Tabs.Screen
        name="publish"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.publishButton}>
              <FontAwesome6 name="plus" size={24} color="#FFFFFF" />
            </View>
          ),
        }}
      />

      {/* Tab 4: 计划与挑战 */}
      <Tabs.Screen
        name="plan"
        options={{
          title: '计划',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="clipboard-list" size={20} color={color} solid={color === KLEIN_BLUE} />
          ),
        }}
      />

      {/* Tab 5: 我的 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user" size={20} color={color} solid={color === KLEIN_BLUE} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  publishButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: KLEIN_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: KLEIN_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
});
