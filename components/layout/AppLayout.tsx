import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Sidebar from './Sidebar';

const BREAKPOINT = 768;

const PAGE_TITLES: Record<string, string> = {
  '/': '대시보드',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];
  const S = Colors.sidebar[scheme];
  const pageTitle = PAGE_TITLES[pathname] ?? '';

  if (isDesktop) {
    return (
      <View style={[styles.desktop, { backgroundColor: C.background }]}>
        <Sidebar />
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.mobile, { backgroundColor: C.background }]}>
      <View style={[styles.mobileHeader, { backgroundColor: S.background, borderBottomColor: S.border }]}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={22} color={S.textActive} />
        </TouchableOpacity>
        <Text style={[styles.mobileTitle, { color: S.textActive }]}>{pageTitle}</Text>
        <TouchableOpacity onPress={logout} style={styles.iconBtn}>
          <Ionicons name="log-out-outline" size={20} color={S.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>{children}</View>

      <Modal visible={drawerOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setDrawerOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.drawer}>
              <Sidebar />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  desktop: {
    flex: 1,
    flexDirection: 'row',
  },
  mobile: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
  },
  mobileHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  iconBtn: {
    padding: 6,
  },
  mobileTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
  },
  drawer: {
    height: '100%',
  },
});
