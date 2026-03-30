import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const NAV_ITEMS = [
  { label: '대시보드', icon: 'home-outline' as const, iconActive: 'home' as const, route: '/' },
];

export default function Sidebar() {
  const scheme = useColorScheme() ?? 'light';
  const S = Colors.sidebar[scheme];
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View style={[styles.sidebar, { backgroundColor: S.background, borderRightColor: S.border }]}>
      {/* 로고 */}
      <View style={[styles.logoArea, { borderBottomColor: S.border }]}>
        <Text style={[styles.logoText, { color: S.textActive }]}>ICTM</Text>
        <Text style={[styles.logoSub, { color: S.text }]}>정보통신설비 유지보수</Text>
      </View>

      {/* 네비게이션 */}
      <View style={styles.nav}>
        <Text style={[styles.navSection, { color: S.text }]}>메뉴</Text>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.navItem,
                isActive && { backgroundColor: S.backgroundActive },
              ]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? item.iconActive : item.icon}
                size={18}
                color={isActive ? S.textActive : S.text}
              />
              <Text style={[styles.navLabel, { color: isActive ? S.textActive : S.text }, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 하단 */}
      <View style={[styles.bottom, { borderTopColor: S.border }]}>
        <View style={[styles.userRow, { backgroundColor: S.backgroundActive, borderRadius: Radius.md }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase()}</Text>
          </View>
          <View style={styles.userTexts}>
            <Text style={[styles.userName, { color: S.textActive }]} numberOfLines={1}>{user?.username}</Text>
            <Text style={[styles.userRole, { color: S.text }]}>{user?.role}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={16} color={S.text} />
          <Text style={[styles.logoutText, { color: S.text }]}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  logoArea: {
    padding: 20,
    borderBottomWidth: 1,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 10,
    marginTop: 3,
  },
  nav: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  navSection: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    gap: 10,
  },
  navLabel: {
    fontSize: 13,
  },
  navLabelActive: {
    fontWeight: '600',
  },
  bottom: {
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FAFAFA',
    fontWeight: '600',
    fontSize: 13,
  },
  userTexts: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
  },
  userRole: {
    fontSize: 11,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
  },
  logoutText: {
    fontSize: 13,
  },
});
