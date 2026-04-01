/**
 * Sidebar.tsx — sidebar-08 스타일 접이식 사이드바
 *
 * - 펼침(240px) ↔ 접힘(56px) 애니메이션
 * - 접히면 아이콘만, 펼치면 아이콘 + 라벨
 * - 하단에 다크모드 토글 버튼
 */

import { Badge } from "@/components/ui/Badge";
import { Colors, Radius } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/features/auth/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EXPANDED = 240;
const COLLAPSED = 56;
const ANIM_DURATION = 200;

const NAV_SECTIONS = [
  {
    title: "메뉴",
    items: [
      {
        label: "대시보드",
        icon: "home-outline" as const,
        iconActive: "home" as const,
        route: "/",
      },
    ],
  },
  {
    title: "환경설정",
    items: [
      {
        label: "공지사항",
        icon: "megaphone-outline" as const,
        iconActive: "megaphone" as const,
        route: "/notice",
      },
      {
        label: "공통코드",
        icon: "list-outline" as const,
        iconActive: "list" as const,
        route: "/common-code",
      },
    ],
  },
];

export default function Sidebar() {
  const scheme = useColorScheme() ?? "light";
  const { toggleTheme } = useTheme();
  const S = Colors.sidebar[scheme];
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const widthAnim = useRef(new Animated.Value(EXPANDED)).current;
  const labelOpacity = useRef(new Animated.Value(1)).current;

  const toggleSidebar = () => {
    const toWidth = collapsed ? EXPANDED : COLLAPSED;
    const toLabelOpacity = collapsed ? 1 : 0;

    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: toWidth,
        duration: ANIM_DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(labelOpacity, {
        toValue: toLabelOpacity,
        duration: collapsed ? ANIM_DURATION : ANIM_DURATION / 2,
        useNativeDriver: false,
      }),
    ]).start();

    setCollapsed(!collapsed);
  };

  return (
    <Animated.View
      style={[
        styles.sidebar,
        { width: widthAnim, backgroundColor: S.background, borderRightColor: S.border },
      ]}
    >
      {/* ── 상단: 로고 + 토글 버튼 ───────────── */}
      <View style={[styles.logoArea, { borderBottomColor: S.border }]}>
        {/* 로고 (펼쳤을 때만 표시) */}
        <Animated.View style={[styles.logoTexts, { opacity: labelOpacity }]}>
          <Text style={[styles.logoText, { color: S.textActive }]}>ICTM</Text>
          <Text style={[styles.logoSub, { color: S.text }]}>
            정보통신설비 유지보수
          </Text>
        </Animated.View>

        {/* 사이드바 토글 버튼 */}
        <TouchableOpacity
          onPress={toggleSidebar}
          activeOpacity={0.7}
          style={[
            styles.toggleBtn,
            collapsed && styles.toggleBtnCollapsed,
          ]}
        >
          <Ionicons
            name={collapsed ? "chevron-forward-outline" : "chevron-back-outline"}
            size={16}
            color={S.text}
          />
        </TouchableOpacity>
      </View>

      {/* ── 메뉴 영역 ───────────────────────── */}
      <View style={styles.nav}>
        {NAV_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            {/* 섹션 제목 (펼쳤을 때만) */}
            <Animated.Text
              style={[styles.navSection, { color: S.text, opacity: labelOpacity }]}
              numberOfLines={1}
            >
              {section.title}
            </Animated.Text>

            {section.items.map((item) => {
              const isActive = pathname === item.route;

              return (
                <TouchableOpacity
                  key={item.route}
                  style={[
                    styles.navItem,
                    collapsed && styles.navItemCollapsed,
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
                  <Animated.Text
                    style={[
                      styles.navLabel,
                      { color: isActive ? S.textActive : S.text, opacity: labelOpacity },
                      isActive && styles.navLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Animated.Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── 하단: 유저 정보 + 다크모드 + 로그아웃 ── */}
      <View style={[styles.bottom, { borderTopColor: S.border }]}>
        {/* 유저 카드 (펼쳤을 때만 상세 표시) */}
        <View
          style={[
            styles.userRow,
            { backgroundColor: S.backgroundActive, borderRadius: Radius.md },
            collapsed && styles.userRowCollapsed,
          ]}
        >
          {/* 아바타 */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase()}
            </Text>
          </View>

          {/* 이름 + 역할 (펼쳤을 때만) */}
          <Animated.View style={[styles.userTexts, { opacity: labelOpacity }]}>
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
          </Animated.View>
        </View>

        {/* 다크모드 토글 */}
        <TouchableOpacity
          style={[
            styles.iconRow,
            collapsed && styles.iconRowCollapsed,
          ]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons
            name={scheme === "dark" ? "sunny-outline" : "moon-outline"}
            size={16}
            color={S.text}
          />
          <Animated.Text
            style={[styles.iconRowText, { color: S.text, opacity: labelOpacity }]}
            numberOfLines={1}
          >
            {scheme === "dark" ? "라이트 모드" : "다크 모드"}
          </Animated.Text>
        </TouchableOpacity>

        {/* 로그아웃 */}
        <TouchableOpacity
          style={[
            styles.iconRow,
            collapsed && styles.iconRowCollapsed,
          ]}
          onPress={logout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={16} color={S.text} />
          <Animated.Text
            style={[styles.iconRowText, { color: S.text, opacity: labelOpacity }]}
            numberOfLines={1}
          >
            로그아웃
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    borderRightWidth: 1,
    flexDirection: "column",
    overflow: "hidden",
  },

  // 로고 영역
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    minHeight: 60,
  },

  logoTexts: {
    flex: 1,
    overflow: "hidden",
  },

  logoText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },

  logoSub: {
    fontSize: 9,
    marginTop: 2,
  },

  toggleBtn: {
    padding: 4,
    borderRadius: Radius.sm,
  },

  toggleBtnCollapsed: {
    // 접혔을 때 버튼을 중앙에 위치
    marginLeft: "auto",
    marginRight: "auto",
  },

  // 메뉴 영역
  nav: {
    flex: 1,
    padding: 8,
  },

  section: {
    marginBottom: 12,
  },

  navSection: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 8,
    paddingVertical: 6,
    opacity: 0.7,
    overflow: "hidden",
  },

  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    gap: 10,
    overflow: "hidden",
  },

  navItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
    gap: 0,
  },

  navLabel: {
    fontSize: 13,
    overflow: "hidden",
  },

  navLabelActive: {
    fontWeight: "600",
  },

  // 하단 영역
  bottom: {
    padding: 8,
    borderTopWidth: 1,
    gap: 4,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
    overflow: "hidden",
  },

  userRowCollapsed: {
    justifyContent: "center",
    padding: 6,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  avatarText: {
    color: "#FAFAFA",
    fontWeight: "600",
    fontSize: 12,
  },

  userTexts: {
    flex: 1,
    overflow: "hidden",
  },

  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  userName: {
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    overflow: "hidden",
  },

  iconRowCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
    gap: 0,
  },

  iconRowText: {
    fontSize: 13,
    overflow: "hidden",
  },
});
