import { Badge } from "@/components/ui/Badge";
import { Colors, Radius } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NAV_SECTIONS = [
  {
    title: "메뉴",
    items: [
      {
        label: "대시보드",
        icon: "home-outline",
        iconActive: "home",
        route: "/",
      },
    ],
  },
  {
    title: "환경설정",
    items: [
      {
        label: "공지사항",
        icon: "megaphone-outline",
        iconActive: "megaphone",
        route: "/notice",
      },
      {
        label: "공통코드",
        icon: "list-outline",
        iconActive: "list",
        route: "/common-code",
      },
    ],
  },
];

export default function Sidebar() {
  const scheme = useColorScheme() ?? "light";
  const S = Colors.sidebar[scheme];
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View
      style={[
        styles.sidebar,
        { backgroundColor: S.background, borderRightColor: S.border },
      ]}
    >
      {/* ── 로고 영역 ───────────────── */}
      <View style={[styles.logoArea, { borderBottomColor: S.border }]}>
        <Text style={[styles.logoText, { color: S.textActive }]}>ICTM</Text>
        <Text style={[styles.logoSub, { color: S.text }]}>
          정보통신설비 유지보수
        </Text>
      </View>

      {/* ── 메뉴 영역 ───────────────── */}
      <View style={styles.nav}>
        {NAV_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            {/* 섹션 제목 */}
            <Text style={[styles.navSection, { color: S.text }]}>
              {section.title}
            </Text>

            {/* 메뉴 */}
            {section.items.map((item) => {
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
                    name={(isActive ? item.iconActive : item.icon) as any}
                    size={18}
                    color={isActive ? S.textActive : S.text}
                  />
                  <Text
                    style={[
                      styles.navLabel,
                      { color: isActive ? S.textActive : S.text },
                      isActive && styles.navLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── 하단 유저 영역 ───────────────── */}
      <View style={[styles.bottom, { borderTopColor: S.border }]}>
        <View
          style={[
            styles.userRow,
            { backgroundColor: S.backgroundActive, borderRadius: Radius.md },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.userTexts}>
            <View style={styles.userNameRow}>
              <Text
                style={[styles.userName, { color: S.textActive }]}
                numberOfLines={1}
              >
                {user?.name}
              </Text>

              <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"}>
                {user?.role}
              </Badge>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={logout}
          activeOpacity={0.7}
        >
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
    flexDirection: "column",
  },

  logoArea: {
    padding: 20,
    borderBottomWidth: 1,
  },

  logoText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },

  logoSub: {
    fontSize: 10,
    marginTop: 3,
  },

  nav: {
    flex: 1,
    padding: 12,
  },

  section: {
    marginBottom: 14, // 🔥 섹션 간 간격
  },

  navSection: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 8,
    paddingVertical: 6,
    opacity: 0.7,
  },

  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    gap: 10,
  },

  navLabel: {
    fontSize: 13,
  },

  navLabelActive: {
    fontWeight: "600",
  },

  bottom: {
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },

  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FAFAFA",
    fontWeight: "600",
    fontSize: 13,
  },

  userTexts: {
    flex: 1,
  },

  userName: {
    fontSize: 13,
    fontWeight: "600",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
  },

  logoutText: {
    fontSize: 13,
  },
});
