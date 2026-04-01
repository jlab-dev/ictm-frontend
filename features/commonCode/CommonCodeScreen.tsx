/**
 * CommonCodeScreen.tsx — 공통코드 화면
 *
 * 시스템에서 공통으로 사용하는 코드(분류, 상태값 등)를 관리하는 화면입니다.
 *
 * URL 경로: /common-code
 * 진입점:  app/(app)/common-code.tsx → 이 컴포넌트를 re-export
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CommonCodeScreen() {
  const scheme = useColorScheme() ?? "light";
  const C = Colors[scheme];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.inner}
    >
      {/* 페이지 헤더 */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: C.foreground }]}>
          공통코드
        </Text>
      </View>

      {/* 공통코드 목록 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>코드 목록</CardTitle>
          <CardDescription>
            등록된 공통코드를 조회하고 관리하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 데이터 없을 때 빈 상태 UI */}
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: C.muted }]}>
              <Ionicons
                name="list-outline"
                size={28}
                color={C.mutedForeground}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: C.foreground }]}>
              등록된 코드가 없습니다
            </Text>
            <Text style={[styles.emptyDesc, { color: C.mutedForeground }]}>
              공통코드를 등록해보세요.
            </Text>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 24, gap: 20 },
  pageHeader: { gap: 4 },
  pageTitle: { fontSize: 22, fontWeight: "700", letterSpacing: -0.3 },
  pageDesc: { fontSize: 13 },
  emptyState: { alignItems: "center", paddingVertical: 32, gap: 10 },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: { fontSize: 14, fontWeight: "600" },
  emptyDesc: { fontSize: 12, textAlign: "center" },
});
