/**
 * CommonCodeScreen.tsx — 공통코드 관리 화면
 *
 * 탭 구조:
 *   - 코드 그룹 목록 (SCR-036): 통계 카드 + 검색/필터 + 테이블 + 페이지네이션
 *   - 코드 상세 목록 (SCR-037): 좌측 그룹 패널 + 우측 상세 코드 테이블
 *
 * 모달: 그룹 등록 / 그룹 수정 / 그룹 삭제 확인 / 코드 등록 / 코드 수정
 */

import { Colors, Radius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import api from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── API 응답 타입 ─────────────────────────────────────────────────

/** GET /api/v1/codes 응답의 detail 항목 */
interface ApiDetail {
  code: string;
  codeName: string;
  description: string | null;
  sortOrder: number;
  useYn: boolean;
}

/** GET /api/v1/codes 응답의 group 항목 */
interface ApiGroup {
  groupCode: string;
  groupName: string;
  description: string | null;
  useYn: boolean;
  systemYn: boolean;
  details: ApiDetail[];
}

// ─── 타입 ──────────────────────────────────────────────────────────

type Tab = "group" | "detail";

type ModalType =
  | "add-group"
  | "edit-group"
  | "del-group"
  | "add-detail"
  | "edit-detail"
  | "del-detail"
  | null;

interface CodeGroup {
  id: number;
  code: string;     // 예) EQUIP_TYPE
  name: string;     // 예) 설비 유형
  desc: string;
  count: number;    // 하위 코드 수
  sort: number;
  active: boolean;
  systemYn: boolean; // true = 시스템 코드 (삭제/수정 제한)
  updatedAt: string;
}

interface CodeDetail {
  id: number;
  groupId: number;
  code: string; // 예) EQUIP_TYPE_001
  name: string;
  desc: string;
  sort: number;
  active: boolean;
  updatedAt: string;
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────

export default function CommonCodeScreen() {
  const scheme = useColorScheme() ?? "light";
  const C = Colors[scheme];

  // ── API 데이터 상태
  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [details, setDetails] = useState<CodeDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // GET /api/v1/codes — 전체 공통코드 조회
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ data: ApiGroup[] }>("/codes");
        const apiGroups: ApiGroup[] = res.data.data;

        // API 응답 → 내부 CodeGroup 타입으로 변환
        const mappedGroups: CodeGroup[] = apiGroups.map((g, idx) => ({
          id: idx + 1,
          code: g.groupCode,
          name: g.groupName,
          desc: g.description ?? "",
          count: g.details.length,
          sort: idx + 1,
          active: g.useYn,
          systemYn: g.systemYn,
          updatedAt: "-",
        }));

        // API 응답 → 내부 CodeDetail 타입으로 변환 (그룹별 detail을 하나의 배열로 flatten)
        let detailId = 1;
        const mappedDetails: CodeDetail[] = apiGroups.flatMap((g, gIdx) =>
          g.details.map((d) => ({
            id: detailId++,
            groupId: gIdx + 1,
            code: d.code,
            name: d.codeName,
            desc: d.description ?? "",
            sort: d.sortOrder,
            active: d.useYn,
            updatedAt: "-",
          })),
        );

        setGroups(mappedGroups);
        setDetails(mappedDetails);
      } catch (e) {
        console.error("공통코드 조회 실패:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── 공통 상태
  const [activeTab, setActiveTab] = useState<Tab>("group");
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);

  // ── 그룹 탭 상태
  const [groupSearch, setGroupSearch] = useState("");
  const [groupStatusFilter, setGroupStatusFilter] = useState<
    "all" | "use" | "nouse"
  >("all");
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [groupPage, setGroupPage] = useState(1);

  // ── 상세 탭 상태
  const [gpSearch, setGpSearch] = useState("");
  const [detailSearch, setDetailSearch] = useState("");
  const [detailStatusFilter, setDetailStatusFilter] = useState<
    "all" | "use" | "nouse"
  >("all");
  const [selectedDetailIds, setSelectedDetailIds] = useState<number[]>([]);
  const [detailStatusDropdown, setDetailStatusDropdown] = useState(false);

  // ── 그룹 등록 폼 상태
  const [newGroupCode, setNewGroupCode]     = useState("");
  const [newGroupName, setNewGroupName]     = useState("");
  const [newGroupDesc, setNewGroupDesc]     = useState("");
  const [newGroupSort, setNewGroupSort]     = useState("99");
  const [newGroupActive, setNewGroupActive] = useState(true);

  // ── 그룹 수정 폼 상태 (선택된 그룹의 값으로 초기화)
  const [editGroupName,   setEditGroupName]   = useState("");
  const [editGroupDesc,   setEditGroupDesc]   = useState("");
  const [editGroupSort,   setEditGroupSort]   = useState("0");
  const [editGroupActive, setEditGroupActive] = useState(true);

  // ── 상세코드 등록/수정 폼 상태
  const [detailCode,         setDetailCode]         = useState("");
  const [detailName,         setDetailName]         = useState("");
  const [detailDesc,         setDetailDesc]         = useState("");
  const [detailSort,         setDetailSort]         = useState("99");
  const [detailActive,       setDetailActive]       = useState(true);
  const [editDetailOrigCode, setEditDetailOrigCode] = useState(""); // 수정 시 원래 code (PATH용)
  const [editGroupCode,      setEditGroupCode]      = useState(""); // 수정 중인 그룹 코드 (표시용)

  // ── 필터된 그룹 목록
  const GROUP_PAGE_SIZE = 10;

  const filteredGroups = groups.filter((g) => {
    const matchSearch =
      groupSearch === "" ||
      g.code.toLowerCase().includes(groupSearch.toLowerCase()) ||
      g.name.includes(groupSearch);
    const matchStatus =
      groupStatusFilter === "all" ||
      (groupStatusFilter === "use" && g.active) ||
      (groupStatusFilter === "nouse" && !g.active);
    return matchSearch && matchStatus;
  });

  const totalGroupPages = Math.max(
    1,
    Math.ceil(filteredGroups.length / GROUP_PAGE_SIZE),
  );
  const pagedGroups = filteredGroups.slice(
    (groupPage - 1) * GROUP_PAGE_SIZE,
    groupPage * GROUP_PAGE_SIZE,
  );

  const groupPageNumbers = (() => {
    const total = totalGroupPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (groupPage <= 3) return [1, 2, 3, 4, 5];
    if (groupPage >= total - 2)
      return [total - 4, total - 3, total - 2, total - 1, total];
    return [
      groupPage - 2,
      groupPage - 1,
      groupPage,
      groupPage + 1,
      groupPage + 2,
    ];
  })();

  // ── 선택된 그룹 (API 로딩 전 groups가 빈 배열일 수 있으므로 null 허용)
  const selectedGroup =
    groups.find((g) => g.id === selectedGroupId) ?? groups[0] ?? null;

  // ── 필터된 상세 코드
  const filteredDetails = details.filter((d) => {
    const matchGroup = d.groupId === selectedGroupId;
    const matchSearch =
      detailSearch === "" ||
      d.code.toLowerCase().includes(detailSearch.toLowerCase()) ||
      d.name.includes(detailSearch);
    const matchStatus =
      detailStatusFilter === "all" ||
      (detailStatusFilter === "use" && d.active) ||
      (detailStatusFilter === "nouse" && !d.active);
    return matchGroup && matchSearch && matchStatus;
  });

  // ── 그룹 체크박스
  const toggleGroup = (id: number) =>
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const toggleAllGroups = () =>
    setSelectedGroupIds((prev) =>
      prev.length === filteredGroups.length
        ? []
        : filteredGroups.map((g) => g.id),
    );

  // ── 상세 체크박스
  const toggleDetail = (id: number) =>
    setSelectedDetailIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const toggleAllDetails = () =>
    setSelectedDetailIds((prev) =>
      prev.length === filteredDetails.length
        ? []
        : filteredDetails.map((d) => d.id),
    );

  const hasGroupSelected = selectedGroupIds.length > 0;
  const hasDetailSelected = selectedDetailIds.length > 0;

  // 수정: 정확히 1개만 선택 시 활성
  const canEditGroup = selectedGroupIds.length === 1;
  // 삭제: 1개 이상이면서 선택된 그룹 중 systemYn=true인 것이 없어야 활성
  const selectedSystemGroup = groups.some(
    (g) => selectedGroupIds.includes(g.id) && g.systemYn
  );
  const canDeleteGroup = hasGroupSelected && !selectedSystemGroup;

  // ── 데이터 새로고침 (API 재조회)
  const reload = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: ApiGroup[] }>("/codes");
      const apiGroups: ApiGroup[] = res.data.data;
      let detailId = 1;
      setGroups(apiGroups.map((g, idx) => ({
        id: idx + 1, code: g.groupCode, name: g.groupName,
        desc: g.description ?? "", count: g.details.length,
        sort: idx + 1, active: g.useYn, systemYn: g.systemYn, updatedAt: "-",
      })));
      setDetails(apiGroups.flatMap((g, gIdx) =>
        g.details.map((d) => ({
          id: detailId++, groupId: gIdx + 1, code: d.code,
          name: d.codeName, desc: d.description ?? "",
          sort: d.sortOrder, active: d.useYn, updatedAt: "-",
        }))
      ));
    } catch (e) {
      console.error("공통코드 재조회 실패:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // ── 그룹 등록 POST /codes/groups
  const handleAddGroup = async () => {
    if (!newGroupCode.trim() || !newGroupName.trim()) return;
    try {
      await api.post("/codes/groups", {
        groupCode: newGroupCode.trim(),
        groupName: newGroupName.trim(),
        description: newGroupDesc.trim() || null,
        sortOrder: parseInt(newGroupSort) || 0,
      });
      setNewGroupCode(""); setNewGroupName(""); setNewGroupDesc(""); setNewGroupSort("99");
      setOpenModal(null);
      reload();
    } catch (e) {
      console.error("그룹 등록 실패:", e);
    }
  };

  // ── 그룹 수정 모달 열기 — 체크박스로 선택된 그룹 기준으로 폼 초기화
  const openEditGroup = () => {
    const target = groups.find((g) => g.id === selectedGroupIds[0]);
    if (!target) return;
    setEditGroupCode(target.code);
    setEditGroupName(target.name);
    setEditGroupDesc(target.desc);
    setEditGroupSort(String(target.sort));
    setEditGroupActive(target.active);
    setOpenModal("edit-group");
  };

  // ── 그룹 수정 PUT /codes/groups/{groupCode}
  const handleEditGroup = async () => {
    const target = groups.find((g) => g.id === selectedGroupIds[0]);
    if (!target || !editGroupName.trim()) return;
    try {
      await api.put(`/codes/groups/${target.code}`, {
        groupName: editGroupName.trim(),
        description: editGroupDesc.trim() || null,
        sortOrder: parseInt(editGroupSort) || 0,
        useYn: editGroupActive,
      });
      setOpenModal(null);
      reload();
    } catch (e) {
      console.error("그룹 수정 실패:", e);
    }
  };

  // ── 그룹 삭제 DELETE /codes/groups/{groupCode}
  const handleDeleteGroups = async () => {
    try {
      const targetCodes = groups
        .filter((g) => selectedGroupIds.includes(g.id))
        .map((g) => g.code);
      await Promise.all(targetCodes.map((code) => api.delete(`/codes/groups/${code}`)));
      setSelectedGroupIds([]);
      setOpenModal(null);
      reload();
    } catch (e) {
      console.error("그룹 삭제 실패:", e);
    }
  };

  // ── 상세코드 등록 POST /codes/groups/{groupCode}/details
  const handleAddDetail = async () => {
    if (!selectedGroup || !detailCode.trim() || !detailName.trim()) return;
    try {
      await api.post(`/codes/groups/${selectedGroup.code}/details`, {
        code: detailCode.trim(),
        codeName: detailName.trim(),
        description: detailDesc.trim() || null,
        sortOrder: parseInt(detailSort) || 0,
      });
      setDetailCode(""); setDetailName(""); setDetailDesc(""); setDetailSort("99");
      setOpenModal(null);
      reload();
    } catch (e) {
      console.error("상세코드 등록 실패:", e);
    }
  };

  // ── 상세코드 수정 모달 열기
  const openEditDetail = (d: CodeDetail) => {
    setEditDetailOrigCode(d.code);
    setDetailCode(d.code);
    setDetailName(d.name);
    setDetailDesc(d.desc);
    setDetailSort(String(d.sort));
    setDetailActive(d.active);
    setOpenModal("edit-detail");
  };

  // ── 상세코드 수정 PUT /codes/groups/{groupCode}/details/{code}
  const handleEditDetail = async () => {
    if (!selectedGroup || !detailName.trim()) return;
    try {
      await api.put(`/codes/groups/${selectedGroup.code}/details/${editDetailOrigCode}`, {
        codeName: detailName.trim(),
        description: detailDesc.trim() || null,
        sortOrder: parseInt(detailSort) || 0,
        useYn: detailActive,
      });
      setOpenModal(null);
      reload();
    } catch (e) {
      console.error("상세코드 수정 실패:", e);
    }
  };

  // ── 상세코드 삭제 DELETE /codes/groups/{groupCode}/details/{code}
  const handleDeleteDetails = async () => {
    if (!selectedGroup) return;
    try {
      const targetCodes = details
        .filter((d) => selectedDetailIds.includes(d.id))
        .map((d) => d.code);
      await Promise.all(
        targetCodes.map((code) =>
          api.delete(`/codes/groups/${selectedGroup.code}/details/${code}`)
        )
      );
      setSelectedDetailIds([]);
      setOpenModal(null);
      reload();
    } catch (e) {
      console.error("상세코드 삭제 실패:", e);
    }
  };

  // ── 로딩 중 스피너 표시
  if (isLoading) {
    return (
      <View style={[styles.wrapper, { backgroundColor: C.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: C.mutedForeground, fontSize: 13 }}>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: C.background }]}>
      {/* ── 탭 바 ──────────────────────────────────────── */}
      <View style={[styles.tabBar, { borderBottomColor: C.border }]}>
        {(
          [
            ["group", "코드 그룹 목록"],
            ["detail", "코드 상세 목록"],
          ] as [Tab, string][]
        ).map(([tab, label]) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                isActive && {
                  borderBottomColor: C.foreground,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? C.foreground : C.mutedForeground },
                  isActive && { fontWeight: "600" },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ════════════════════════════════════════
          탭1: 코드 그룹 목록
      ════════════════════════════════════════ */}
      {activeTab === "group" && (
        <ScrollView contentContainerStyle={styles.inner}>
          {/* 헤더 */}
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, { color: C.foreground }]}>
              공통코드 그룹 목록
            </Text>
            <View style={styles.headerActions}>
              {/* 수정 버튼 */}
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    borderColor: C.border,
                    backgroundColor: C.background,
                    opacity: canEditGroup ? 1 : 0.4,
                  },
                ]}
                onPress={() => canEditGroup && openEditGroup()}
                disabled={!canEditGroup}
              >
                <Ionicons
                  name="pencil-outline"
                  size={13}
                  color={C.foreground}
                />
                <Text style={[styles.btnText, { color: C.foreground }]}>
                  수정
                </Text>
              </TouchableOpacity>
              {/* 삭제 버튼 — systemYn=true인 항목 포함 시 비활성 */}
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    borderColor: "#FCA5A5",
                    backgroundColor: C.background,
                    opacity: canDeleteGroup ? 1 : 0.4,
                  },
                ]}
                onPress={() => canDeleteGroup && setOpenModal("del-group")}
                disabled={!canDeleteGroup}
              >
                <Ionicons name="trash-outline" size={13} color="#EF4444" />
                <Text style={[styles.btnText, { color: "#EF4444" }]}>삭제</Text>
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: C.border }]} />
              {/* 그룹 등록 버튼 — 클릭 시 폼 초기화 후 모달 오픈 */}
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: C.primary, borderColor: C.primary },
                ]}
                onPress={() => setOpenModal("add-group")}
              >
                <Ionicons name="add" size={14} color={C.primaryForeground} />
                <Text
                  style={[
                    styles.btnText,
                    { color: C.primaryForeground, fontWeight: "600" },
                  ]}
                >
                  그룹 등록
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 통계 카드 */}
          <View style={styles.statsGrid}>
            {[
              {
                label: "전체 그룹",
                value: groups.length,
                color: C.foreground,
              },
              {
                label: "전체 코드 수",
                value: details.length,
                color: "#1D4ED8",
              },
              {
                label: "사용 중",
                value: groups.filter((g) => g.active).length,
                color: "#16A34A",
              },
              {
                label: "미사용",
                value: groups.filter((g) => !g.active).length,
                color: "#B45309",
              },
            ].map((s) => (
              <View
                key={s.label}
                style={[
                  styles.statCard,
                  { backgroundColor: C.card, borderColor: C.border },
                ]}
              >
                <Text style={[styles.statLabel, { color: C.mutedForeground }]}>
                  {s.label}
                </Text>
                <Text style={[styles.statValue, { color: s.color }]}>
                  {s.value}
                </Text>
              </View>
            ))}
          </View>

          {/* 검색 바 */}
          <View style={styles.filterRow}>
            <View
              style={[
                styles.searchBox,
                { borderColor: C.border, backgroundColor: C.background },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={14}
                color={C.mutedForeground}
              />
              <TextInput
                style={[styles.searchInput, { color: C.foreground }]}
                placeholder="그룹 코드, 그룹명 검색"
                placeholderTextColor={C.mutedForeground}
                value={groupSearch}
                onChangeText={setGroupSearch}
              />
            </View>
            {/* 상태 드롭다운 */}
            <View style={{ position: "relative", zIndex: 10 }}>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  { borderColor: C.border, backgroundColor: C.background },
                ]}
                onPress={() => setStatusDropdown((v) => !v)}
              >
                <Text style={[styles.dropdownText, { color: C.foreground }]}>
                  {groupStatusFilter === "all"
                    ? "전체 상태"
                    : groupStatusFilter === "use"
                      ? "사용"
                      : "미사용"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={13}
                  color={C.mutedForeground}
                />
              </TouchableOpacity>
              {statusDropdown && (
                <View
                  style={[
                    styles.dropdownList,
                    { backgroundColor: C.card, borderColor: C.border },
                  ]}
                >
                  {[
                    ["all", "전체 상태"],
                    ["use", "사용"],
                    ["nouse", "미사용"],
                  ].map(([v, l]) => (
                    <TouchableOpacity
                      key={v}
                      style={[
                        styles.dropdownItem,
                        groupStatusFilter === v && { backgroundColor: C.muted },
                      ]}
                      onPress={() => {
                        setGroupStatusFilter(v as any);
                        setStatusDropdown(false);
                      }}
                    >
                      <Text style={{ color: C.foreground, fontSize: 13 }}>
                        {l}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.btn,
                { borderColor: C.border, backgroundColor: C.background },
              ]}
            >
              <Ionicons name="search" size={13} color={C.foreground} />
              <Text style={[styles.btnText, { color: C.foreground }]}>
                검색
              </Text>
            </TouchableOpacity>
          </View>

          {/* 테이블 */}
          <View style={{ width: "100%" }}>
            <View>
              {/* 테이블 헤더 */}
              <View
                style={[
                  styles.tableHeader,
                  { backgroundColor: C.muted, borderColor: C.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.colChk}
                  onPress={toggleAllGroups}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: C.border,
                        backgroundColor:
                          selectedGroupIds.length === filteredGroups.length &&
                          filteredGroups.length > 0
                            ? C.primary
                            : C.background,
                      },
                    ]}
                  >
                    {selectedGroupIds.length === filteredGroups.length &&
                      filteredGroups.length > 0 && (
                        <Ionicons
                          name="checkmark"
                          size={10}
                          color={C.primaryForeground}
                        />
                      )}
                  </View>
                </TouchableOpacity>
                {[
                  "그룹 코드",
                  "그룹명",
                  "설명",
                  "코드 수",
                  "정렬",
                  "사용 여부",
                  "수정일",
                  "상세",
                ].map((h, i) => (
                  <Text
                    key={h}
                    style={[
                      styles.headerText,
                      { color: C.mutedForeground },
                      i === 0 && { flex: 2 },
                      i === 1 && { flex: 1.5 },
                      i === 2 && { flex: 2 },
                      i === 3 && { width: 60, textAlign: "center" },
                      i === 4 && { width: 44, textAlign: "center" },
                      i === 5 && { width: 72 },
                      i === 6 && { width: 90 },
                      i === 7 && { width: 52, textAlign: "center" },
                    ]}
                  >
                    {h}
                  </Text>
                ))}
              </View>

              {/* 테이블 행 */}
              {pagedGroups.map((group, idx) => {
                const isSelected = selectedGroupIds.includes(group.id);
                const isLast = idx === pagedGroups.length - 1;
                return (
                  <TouchableOpacity
                    key={group.id}
                    style={[
                      styles.tableRow,
                      { borderColor: C.border },
                      isSelected && { backgroundColor: C.muted },
                      !isLast && { borderBottomWidth: 1 },
                    ]}
                    onPress={() => toggleGroup(group.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.colChk}>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: C.border,
                            backgroundColor: isSelected
                              ? C.primary
                              : C.background,
                          },
                        ]}
                      >
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={10}
                            color={C.primaryForeground}
                          />
                        )}
                      </View>
                    </View>
                    {/* 그룹 코드 */}
                    <View style={{ flex: 2 }}>
                      <View
                        style={[
                          styles.codeChip,
                          { backgroundColor: C.muted, borderColor: C.border },
                        ]}
                      >
                        <Text
                          style={[styles.codeChipText, { color: C.foreground }]}
                          numberOfLines={1}
                        >
                          {group.code}
                        </Text>
                      </View>
                    </View>
                    {/* 그룹명 */}
                    <Text
                      style={[
                        styles.cellText,
                        { flex: 1.5, color: C.foreground, fontWeight: "500" },
                      ]}
                      numberOfLines={1}
                    >
                      {group.name}
                    </Text>
                    {/* 설명 */}
                    <Text
                      style={[
                        styles.cellText,
                        { flex: 2, color: C.mutedForeground },
                      ]}
                      numberOfLines={1}
                    >
                      {group.desc}
                    </Text>
                    {/* 코드 수 */}
                    <Text
                      style={[
                        styles.cellText,
                        {
                          width: 60,
                          color: "#1D4ED8",
                          textAlign: "center",
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {group.count}
                    </Text>
                    {/* 정렬 */}
                    <Text
                      style={[
                        styles.cellText,
                        { width: 44, color: C.foreground, textAlign: "center" },
                      ]}
                    >
                      {group.sort}
                    </Text>
                    {/* 사용 여부 */}
                    <View style={{ width: 72 }}>
                      <View
                        style={[
                          styles.badge,
                          group.active ? styles.badgeGreen : styles.badgeGray,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            {
                              color: group.active
                                ? "#16A34A"
                                : C.mutedForeground,
                            },
                          ]}
                        >
                          {group.active ? "사용" : "미사용"}
                        </Text>
                      </View>
                    </View>
                    {/* 수정일 */}
                    <Text
                      style={[
                        styles.cellText,
                        { width: 90, color: C.mutedForeground },
                      ]}
                      numberOfLines={1}
                    >
                      {group.updatedAt}
                    </Text>
                    {/* 상세 버튼 */}
                    <View style={{ width: 52, alignItems: "center" }}>
                      <TouchableOpacity
                        style={[styles.actionBtn, { borderColor: C.border }]}
                        onPress={() => {
                          setSelectedGroupId(group.id);
                          setActiveTab("detail");
                        }}
                      >
                        <Text
                          style={[
                            styles.actionBtnText,
                            { color: C.foreground },
                          ]}
                        >
                          상세
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <View style={[styles.tableBottom, { borderColor: C.border }]} />
            </View>
          </View>

          {/* 페이지네이션 */}
          <View style={styles.pagination}>
            <Text style={[styles.totalText, { color: C.mutedForeground }]}>
              전체{" "}
              <Text style={{ fontWeight: "600", color: C.foreground }}>
                {filteredGroups.length}개
              </Text>{" "}
              그룹
            </Text>
            <View style={styles.pageButtons}>
              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  {
                    borderColor: C.border,
                    backgroundColor: C.background,
                    opacity: groupPage === 1 ? 0.4 : 1,
                  },
                ]}
                onPress={() => setGroupPage((p) => Math.max(1, p - 1))}
                disabled={groupPage === 1}
              >
                <Ionicons name="chevron-back" size={13} color={C.foreground} />
              </TouchableOpacity>
              {groupPageNumbers.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.pageBtn,
                    {
                      borderColor: C.border,
                      backgroundColor:
                        groupPage === p ? C.primary : C.background,
                    },
                  ]}
                  onPress={() => setGroupPage(p)}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color:
                        groupPage === p ? C.primaryForeground : C.foreground,
                    }}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  {
                    borderColor: C.border,
                    backgroundColor: C.background,
                    opacity: groupPage === totalGroupPages ? 0.4 : 1,
                  },
                ]}
                onPress={() =>
                  setGroupPage((p) => Math.min(totalGroupPages, p + 1))
                }
                disabled={groupPage === totalGroupPages}
              >
                <Ionicons
                  name="chevron-forward"
                  size={13}
                  color={C.foreground}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* ════════════════════════════════════════
          탭2: 코드 상세 목록
      ════════════════════════════════════════ */}
      {activeTab === "detail" && (
        <View style={[styles.splitWrapper, { backgroundColor: C.background }]}>
          {/* 헤더 */}
          <View style={[styles.pageHeader, { padding: 20, paddingBottom: 0 }]}>
            <Text style={[styles.pageTitle, { color: C.foreground }]}>
              공통코드 상세 목록
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  { borderColor: C.border, backgroundColor: C.background },
                ]}
                onPress={() => setActiveTab("group")}
              >
                <Ionicons name="arrow-back" size={13} color={C.foreground} />
                <Text style={[styles.btnText, { color: C.foreground }]}>
                  그룹 목록
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    borderColor: C.border,
                    backgroundColor: C.background,
                    opacity: hasDetailSelected ? 1 : 0.4,
                  },
                ]}
                disabled={!hasDetailSelected}
                onPress={() => {
                  const target = details.find((d) => d.id === selectedDetailIds[0]);
                  if (target) openEditDetail(target);
                }}
              >
                <Ionicons
                  name="pencil-outline"
                  size={13}
                  color={C.foreground}
                />
                <Text style={[styles.btnText, { color: C.foreground }]}>
                  수정
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    borderColor: "#FCA5A5",
                    backgroundColor: C.background,
                    opacity: hasDetailSelected ? 1 : 0.4,
                  },
                ]}
                disabled={!hasDetailSelected}
                onPress={() => setOpenModal("del-detail")}
              >
                <Ionicons name="trash-outline" size={13} color="#EF4444" />
                <Text style={[styles.btnText, { color: "#EF4444" }]}>삭제</Text>
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: C.border }]} />
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: C.primary, borderColor: C.primary },
                ]}
                onPress={() => {
                  setDetailCode(""); setDetailName(""); setDetailDesc("");
                  setDetailSort("99"); setDetailActive(true);
                  setOpenModal("add-detail");
                }}
              >
                <Ionicons name="add" size={14} color={C.primaryForeground} />
                <Text
                  style={[
                    styles.btnText,
                    { color: C.primaryForeground, fontWeight: "600" },
                  ]}
                >
                  코드 등록
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 분할 레이아웃 */}
          <View style={styles.split}>
            {/* 좌: 그룹 패널 */}
            <View
              style={[
                styles.groupPanel,
                { borderColor: C.border, backgroundColor: C.card },
              ]}
            >
              {/* 그룹 패널 헤더 */}
              <View
                style={[
                  styles.gpHead,
                  { borderBottomColor: C.border, backgroundColor: C.muted },
                ]}
              >
                <Text
                  style={[styles.gpHeadTitle, { color: C.mutedForeground }]}
                >
                  코드 그룹
                </Text>
                <Text style={[{ fontSize: 11, color: C.mutedForeground }]}>
                  18개
                </Text>
              </View>
              {/* 그룹 패널 검색 */}
              <View
                style={[styles.gpSearchWrap, { borderBottomColor: C.border }]}
              >
                <TextInput
                  style={[
                    styles.gpSearch,
                    {
                      borderColor: C.border,
                      backgroundColor: C.background,
                      color: C.foreground,
                    },
                  ]}
                  placeholder="그룹 검색..."
                  placeholderTextColor={C.mutedForeground}
                  value={gpSearch}
                  onChangeText={setGpSearch}
                />
                <TouchableOpacity
                  style={[styles.gpSearchBtn, { borderColor: C.border }]}
                >
                  <Text style={{ fontSize: 12, color: C.foreground }}>
                    검색
                  </Text>
                </TouchableOpacity>
              </View>
              {/* 그룹 목록 */}
              <ScrollView style={{ maxHeight: 500 }}>
                {groups
                  .filter(
                    (g) =>
                      gpSearch === "" ||
                      g.name.includes(gpSearch) ||
                      g.code.toLowerCase().includes(gpSearch.toLowerCase()),
                  )
                  .map((g, idx, arr) => {
                    const isActive = g.id === selectedGroupId;
                    return (
                      <TouchableOpacity
                        key={g.id}
                        style={[
                          styles.gpItem,
                          { borderBottomColor: C.border },
                          idx !== arr.length - 1 && { borderBottomWidth: 1 },
                          isActive && [
                            styles.gpItemActive,
                            {
                              backgroundColor: "#EFF6FF",
                              borderLeftColor: "#1D4ED8",
                            },
                          ],
                        ]}
                        onPress={() => {
                          setSelectedGroupId(g.id);
                          setSelectedDetailIds([]);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[styles.gpItemName, { color: C.foreground }]}
                          >
                            {g.name}
                          </Text>
                          <Text
                            style={[
                              styles.gpItemCode,
                              { color: C.mutedForeground },
                            ]}
                          >
                            {g.code}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.gpCount,
                            { backgroundColor: C.muted, borderColor: C.border },
                          ]}
                        >
                          <Text
                            style={{ fontSize: 11, color: C.mutedForeground }}
                          >
                            {g.count}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </View>

            {/* 우: 상세 패널 */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20, gap: 16 }}
            >
              {/* 선택된 그룹 정보 카드 */}
              <View
                style={[
                  styles.detailHeader,
                  { backgroundColor: C.card, borderColor: C.border },
                ]}
              >
                <View style={styles.dhLeft}>
                  <View style={[styles.dhIcon, { backgroundColor: "#EFF6FF" }]}>
                    <Ionicons name="list" size={18} color="#1D4ED8" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.dhTitleRow}>
                      <Text style={[styles.dhName, { color: C.foreground }]}>
                        {selectedGroup?.name}
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          selectedGroup?.active
                            ? styles.badgeGreen
                            : styles.badgeGray,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            {
                              color: selectedGroup?.active
                                ? "#16A34A"
                                : C.mutedForeground,
                            },
                          ]}
                        >
                          {selectedGroup?.active ? "사용" : "미사용"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.codeChip,
                        {
                          backgroundColor: C.muted,
                          borderColor: C.border,
                          alignSelf: "flex-start",
                          marginTop: 4,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.codeChipText,
                          { color: C.mutedForeground },
                        ]}
                      >
                        {selectedGroup?.code}
                      </Text>
                    </View>
                    <Text
                      style={[
                        {
                          fontSize: 12,
                          color: C.mutedForeground,
                          marginTop: 2,
                        },
                      ]}
                    >
                      {selectedGroup?.desc}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.dhStats,
                    { backgroundColor: C.muted, borderRadius: Radius.md },
                  ]}
                >
                  <View style={styles.dhStat}>
                    <Text style={[styles.dhStatVal, { color: C.foreground }]}>
                      {filteredDetails.length}
                    </Text>
                    <Text
                      style={[styles.dhStatLabel, { color: C.mutedForeground }]}
                    >
                      전체
                    </Text>
                  </View>
                  <View style={styles.dhStat}>
                    <Text style={[styles.dhStatVal, { color: "#16A34A" }]}>
                      {filteredDetails.filter((d) => d.active).length}
                    </Text>
                    <Text
                      style={[styles.dhStatLabel, { color: C.mutedForeground }]}
                    >
                      사용 중
                    </Text>
                  </View>
                </View>
              </View>

              {/* 상세 검색 */}
              <View style={[styles.filterRow, { zIndex: 10 }]}>
                <View
                  style={[
                    styles.searchBox,
                    { borderColor: C.border, backgroundColor: C.background },
                  ]}
                >
                  <Ionicons
                    name="search-outline"
                    size={14}
                    color={C.mutedForeground}
                  />
                  <TextInput
                    style={[styles.searchInput, { color: C.foreground }]}
                    placeholder="코드, 코드명 검색"
                    placeholderTextColor={C.mutedForeground}
                    value={detailSearch}
                    onChangeText={setDetailSearch}
                  />
                </View>
                <View style={{ position: "relative", zIndex: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.dropdown,
                      { borderColor: C.border, backgroundColor: C.background },
                    ]}
                    onPress={() => setDetailStatusDropdown((v) => !v)}
                  >
                    <Text
                      style={[styles.dropdownText, { color: C.foreground }]}
                    >
                      {detailStatusFilter === "all"
                        ? "전체 상태"
                        : detailStatusFilter === "use"
                          ? "사용"
                          : "미사용"}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={13}
                      color={C.mutedForeground}
                    />
                  </TouchableOpacity>
                  {detailStatusDropdown && (
                    <View
                      style={[
                        styles.dropdownList,
                        { backgroundColor: C.card, borderColor: C.border },
                      ]}
                    >
                      {[
                        ["all", "전체 상태"],
                        ["use", "사용"],
                        ["nouse", "미사용"],
                      ].map(([v, l]) => (
                        <TouchableOpacity
                          key={v}
                          style={[
                            styles.dropdownItem,
                            detailStatusFilter === v && {
                              backgroundColor: C.muted,
                            },
                          ]}
                          onPress={() => {
                            setDetailStatusFilter(v as any);
                            setDetailStatusDropdown(false);
                          }}
                        >
                          <Text style={{ color: C.foreground, fontSize: 13 }}>
                            {l}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { borderColor: C.border, backgroundColor: C.background },
                  ]}
                >
                  <Ionicons name="search" size={13} color={C.foreground} />
                  <Text style={[styles.btnText, { color: C.foreground }]}>
                    검색
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 상세 테이블 */}
              <View style={{ width: "100%" }}>
                <View>
                  <View
                    style={[
                      styles.tableHeader,
                      { backgroundColor: C.muted, borderColor: C.border },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.colChk}
                      onPress={toggleAllDetails}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: C.border,
                            backgroundColor:
                              selectedDetailIds.length ===
                                filteredDetails.length &&
                              filteredDetails.length > 0
                                ? C.primary
                                : C.background,
                          },
                        ]}
                      >
                        {selectedDetailIds.length === filteredDetails.length &&
                          filteredDetails.length > 0 && (
                            <Ionicons
                              name="checkmark"
                              size={10}
                              color={C.primaryForeground}
                            />
                          )}
                      </View>
                    </TouchableOpacity>
                    {[
                      "상세 코드",
                      "코드명",
                      "설명",
                      "정렬",
                      "사용 여부",
                      "수정일",
                    ].map((h, i) => (
                      <Text
                        key={h}
                        style={[
                          styles.headerText,
                          { color: C.mutedForeground },
                          i === 0 && { flex: 2.5 },
                          i === 1 && { flex: 1.5 },
                          i === 2 && { flex: 2 },
                          i === 3 && { width: 44, textAlign: "center" },
                          i === 4 && { width: 72 },
                          i === 5 && { width: 90 },
                        ]}
                      >
                        {h}
                      </Text>
                    ))}
                  </View>
                  {filteredDetails.map((d, idx) => {
                    const isSel = selectedDetailIds.includes(d.id);
                    const isLast = idx === filteredDetails.length - 1;
                    return (
                      <TouchableOpacity
                        key={d.id}
                        style={[
                          styles.tableRow,
                          { borderColor: C.border },
                          isSel && { backgroundColor: C.muted },
                          !isLast && { borderBottomWidth: 1 },
                        ]}
                        onPress={() => toggleDetail(d.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.colChk}>
                          <View
                            style={[
                              styles.checkbox,
                              {
                                borderColor: C.border,
                                backgroundColor: isSel
                                  ? C.primary
                                  : C.background,
                              },
                            ]}
                          >
                            {isSel && (
                              <Ionicons
                                name="checkmark"
                                size={10}
                                color={C.primaryForeground}
                              />
                            )}
                          </View>
                        </View>
                        <View style={{ flex: 2.5 }}>
                          <View
                            style={[
                              styles.codeChip,
                              {
                                backgroundColor: C.muted,
                                borderColor: C.border,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.codeChipText,
                                { color: C.foreground },
                              ]}
                              numberOfLines={1}
                            >
                              {d.code}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[
                            styles.cellText,
                            {
                              flex: 1.5,
                              color: C.foreground,
                              fontWeight: "500",
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {d.name}
                        </Text>
                        <Text
                          style={[
                            styles.cellText,
                            { flex: 2, color: C.mutedForeground },
                          ]}
                          numberOfLines={1}
                        >
                          {d.desc}
                        </Text>
                        <Text
                          style={[
                            styles.cellText,
                            {
                              width: 44,
                              color: C.foreground,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {d.sort}
                        </Text>
                        <View style={{ width: 72 }}>
                          <View
                            style={[
                              styles.badge,
                              d.active ? styles.badgeGreen : styles.badgeGray,
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeText,
                                {
                                  color: d.active
                                    ? "#16A34A"
                                    : C.mutedForeground,
                                },
                              ]}
                            >
                              {d.active ? "사용" : "미사용"}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[
                            styles.cellText,
                            { width: 90, color: C.mutedForeground },
                          ]}
                          numberOfLines={1}
                        >
                          {d.updatedAt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <View
                    style={[styles.tableBottom, { borderColor: C.border }]}
                  />
                </View>
              </View>

              {/* 상세 페이지네이션 */}
              <View style={styles.pagination}>
                <Text style={[styles.totalText, { color: C.mutedForeground }]}>
                  전체{" "}
                  <Text style={{ fontWeight: "600", color: C.foreground }}>
                    {filteredDetails.length}개
                  </Text>{" "}
                  코드
                </Text>
                <View style={styles.pageButtons}>
                  <TouchableOpacity
                    style={[
                      styles.pageBtn,
                      { borderColor: C.border, backgroundColor: C.primary },
                    ]}
                  >
                    <Text style={{ fontSize: 13, color: C.primaryForeground }}>
                      1
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* ════════════════════════════════════════
          모달: 그룹 등록
      ════════════════════════════════════════ */}
      <Modal
        visible={openModal === "add-group"}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenModal(null)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalBox,
                { backgroundColor: C.card, borderColor: C.border },
              ]}
            >
              <View style={[styles.modalHead, { borderBottomColor: C.border }]}>
                <Text style={[styles.modalTitle, { color: C.foreground }]}>
                  코드 그룹 등록
                </Text>
                <TouchableOpacity onPress={() => setOpenModal(null)}>
                  <Ionicons name="close" size={18} color={C.mutedForeground} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <ModalField
                  label="그룹 코드"
                  required
                  hint="영문 대문자, 숫자, 언더스코어 · 중복 불가"
                  C={C}
                >
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                      },
                    ]}
                    placeholder="예) MY_CODE"
                    placeholderTextColor={C.mutedForeground}
                    value={newGroupCode}
                    onChangeText={setNewGroupCode}
                  />
                </ModalField>
                <ModalField label="그룹명" required C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                      },
                    ]}
                    placeholder="예) 사용자 정의 코드"
                    placeholderTextColor={C.mutedForeground}
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                  />
                </ModalField>
                <ModalField label="설명" C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      styles.fiTextarea,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                      },
                    ]}
                    placeholder="코드 그룹 설명"
                    placeholderTextColor={C.mutedForeground}
                    multiline
                    textAlignVertical="top"
                    value={newGroupDesc}
                    onChangeText={setNewGroupDesc}
                  />
                </ModalField>
                <ModalField label="정렬 순서" C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                        width: 90,
                      },
                    ]}
                    keyboardType="numeric"
                    value={newGroupSort}
                    onChangeText={setNewGroupSort}
                  />
                </ModalField>
                <ModalField label="사용 여부" C={C}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingTop: 4,
                    }}
                  >
                    <Switch
                      value={newGroupActive}
                      onValueChange={setNewGroupActive}
                      trackColor={{ false: C.border, true: "#16A34A" }}
                      thumbColor="#fff"
                    />
                    <Text style={{ fontSize: 13, color: C.mutedForeground }}>
                      {newGroupActive ? "사용" : "미사용"}
                    </Text>
                  </View>
                </ModalField>
              </View>
              <View style={[styles.modalFoot, { borderTopColor: C.border }]}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { borderColor: C.border, backgroundColor: C.background },
                  ]}
                  onPress={() => setOpenModal(null)}
                >
                  <Text style={[styles.btnText, { color: C.foreground }]}>
                    취소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { backgroundColor: C.primary, borderColor: C.primary },
                  ]}
                  onPress={handleAddGroup}
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: C.primaryForeground, fontWeight: "600" },
                    ]}
                  >
                    등록
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ════ 모달: 그룹 수정 ════ */}
      <Modal
        visible={openModal === "edit-group"}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenModal(null)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalBox,
                { backgroundColor: C.card, borderColor: C.border },
              ]}
            >
              <View style={[styles.modalHead, { borderBottomColor: C.border }]}>
                <Text style={[styles.modalTitle, { color: C.foreground }]}>
                  코드 그룹 수정
                </Text>
                <TouchableOpacity onPress={() => setOpenModal(null)}>
                  <Ionicons name="close" size={18} color={C.mutedForeground} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <ModalField label="그룹 코드" hint="등록 후 변경 불가" C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.muted,
                        color: C.mutedForeground,
                      },
                    ]}
                    value={editGroupCode}
                    editable={false}
                  />
                </ModalField>
                <ModalField label="그룹명" required C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                      },
                    ]}
                    value={editGroupName}
                    onChangeText={setEditGroupName}
                    placeholderTextColor={C.mutedForeground}
                  />
                </ModalField>
                <ModalField label="설명" C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      styles.fiTextarea,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                      },
                    ]}
                    value={editGroupDesc}
                    onChangeText={setEditGroupDesc}
                    multiline
                    textAlignVertical="top"
                  />
                </ModalField>
                <ModalField label="정렬 순서" C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                        width: 90,
                      },
                    ]}
                    keyboardType="numeric"
                    value={editGroupSort}
                    onChangeText={setEditGroupSort}
                  />
                </ModalField>
                <ModalField label="사용 여부" C={C}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingTop: 4,
                    }}
                  >
                    <Switch
                      value={editGroupActive}
                      onValueChange={setEditGroupActive}
                      trackColor={{ false: C.border, true: "#16A34A" }}
                      thumbColor="#fff"
                    />
                    <Text style={{ fontSize: 13, color: C.mutedForeground }}>
                      {editGroupActive ? "사용" : "미사용"}
                    </Text>
                  </View>
                </ModalField>
              </View>
              <View style={[styles.modalFoot, { borderTopColor: C.border }]}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { borderColor: C.border, backgroundColor: C.background },
                  ]}
                  onPress={() => setOpenModal(null)}
                >
                  <Text style={[styles.btnText, { color: C.foreground }]}>
                    취소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { backgroundColor: C.primary, borderColor: C.primary },
                  ]}
                  onPress={handleEditGroup}
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: C.primaryForeground, fontWeight: "600" },
                    ]}
                  >
                    저장
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ════ 모달: 그룹 삭제 확인 ════ */}
      <Modal
        visible={openModal === "del-group" || openModal === "del-detail"}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenModal(null)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalBox,
                { backgroundColor: C.card, borderColor: C.border },
              ]}
            >
              <View style={[styles.modalHead, { borderBottomColor: C.border }]}>
                <Text style={[styles.modalTitle, { color: C.foreground }]}>
                  {openModal === "del-group" ? "코드 그룹 삭제" : "코드 삭제"}
                </Text>
                <TouchableOpacity onPress={() => setOpenModal(null)}>
                  <Ionicons name="close" size={18} color={C.mutedForeground} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                {/* 경고 박스 */}
                <View
                  style={[
                    styles.alertWarn,
                    { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
                  ]}
                >
                  <Ionicons
                    name="warning-outline"
                    size={15}
                    color="#92400E"
                    style={{ marginTop: 1 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alertTitle, { color: "#92400E" }]}>
                      선택한 항목을 삭제하시겠습니까?
                    </Text>
                    {openModal === "del-group" && (
                      <Text style={[styles.alertDesc, { color: "#92400E" }]}>
                        해당 그룹의 모든 상세 코드가 함께 삭제됩니다. 이 작업은
                        되돌릴 수 없습니다.
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    styles.delInfo,
                    { backgroundColor: C.muted, borderRadius: Radius.md },
                  ]}
                >
                  <Text style={{ fontSize: 13, color: C.mutedForeground }}>
                    선택된 항목:{" "}
                    <Text style={{ fontWeight: "600", color: C.foreground }}>
                      {openModal === "del-group"
                        ? groups
                            .filter((g) => selectedGroupIds.includes(g.id))
                            .map((g) => g.code)
                            .join(", ")
                        : details
                            .filter((d) => selectedDetailIds.includes(d.id))
                            .map((d) => d.code)
                            .join(", ")}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={[styles.modalFoot, { borderTopColor: C.border }]}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { borderColor: C.border, backgroundColor: C.background },
                  ]}
                  onPress={() => setOpenModal(null)}
                >
                  <Text style={[styles.btnText, { color: C.foreground }]}>
                    취소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
                  ]}
                  onPress={() =>
                    openModal === "del-group"
                      ? handleDeleteGroups()
                      : handleDeleteDetails()
                  }
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: "#EF4444", fontWeight: "600" },
                    ]}
                  >
                    삭제
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ════ 모달: 코드 등록 ════ */}
      <Modal
        visible={openModal === "add-detail" || openModal === "edit-detail"}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenModal(null)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.modalBox,
                { backgroundColor: C.card, borderColor: C.border },
              ]}
            >
              <View style={[styles.modalHead, { borderBottomColor: C.border }]}>
                <Text style={[styles.modalTitle, { color: C.foreground }]}>
                  {openModal === "add-detail"
                    ? "코드 상세 등록"
                    : "코드 상세 수정"}
                </Text>
                <TouchableOpacity onPress={() => setOpenModal(null)}>
                  <Ionicons name="close" size={18} color={C.mutedForeground} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                {/* 그룹 정보 표시 */}
                <View
                  style={[
                    styles.groupInfoBanner,
                    { backgroundColor: C.muted, borderColor: C.border },
                  ]}
                >
                  <Text style={{ fontSize: 12, color: C.mutedForeground }}>
                    그룹
                  </Text>
                  <View
                    style={[
                      styles.codeChip,
                      { backgroundColor: C.background, borderColor: C.border },
                    ]}
                  >
                    <Text
                      style={[styles.codeChipText, { color: C.foreground }]}
                    >
                      {selectedGroup?.code}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "500",
                      color: C.foreground,
                    }}
                  >
                    {selectedGroup?.name}
                  </Text>
                </View>
                <ModalField
                  label="상세 코드"
                  required
                  hint="그룹 내 중복 불가"
                  C={C}
                >
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: openModal === "edit-detail" ? C.muted : C.background,
                        color: openModal === "edit-detail" ? C.mutedForeground : C.foreground,
                      },
                    ]}
                    placeholder={`예) ${selectedGroup?.code ?? "CODE"}_001`}
                    placeholderTextColor={C.mutedForeground}
                    value={detailCode}
                    onChangeText={setDetailCode}
                    editable={openModal === "add-detail"}
                  />
                </ModalField>
                <ModalField label="코드명" required C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                      },
                    ]}
                    placeholder="예) 냉난방 설비"
                    placeholderTextColor={C.mutedForeground}
                    value={detailName}
                    onChangeText={setDetailName}
                  />
                </ModalField>
                <ModalField label="설명" C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                      },
                    ]}
                    placeholder="코드 설명"
                    placeholderTextColor={C.mutedForeground}
                    value={detailDesc}
                    onChangeText={setDetailDesc}
                  />
                </ModalField>
                <ModalField label="정렬 순서" C={C}>
                  <TextInput
                    style={[
                      styles.fi,
                      {
                        borderColor: C.border,
                        backgroundColor: C.background,
                        color: C.foreground,
                        width: 90,
                      },
                    ]}
                    keyboardType="numeric"
                    value={detailSort}
                    onChangeText={setDetailSort}
                  />
                </ModalField>
                <ModalField label="사용 여부" C={C}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingTop: 4,
                    }}
                  >
                    <Switch
                      value={detailActive}
                      onValueChange={setDetailActive}
                      trackColor={{ false: C.border, true: "#16A34A" }}
                      thumbColor="#fff"
                    />
                    <Text style={{ fontSize: 13, color: C.mutedForeground }}>
                      {detailActive ? "사용" : "미사용"}
                    </Text>
                  </View>
                </ModalField>
              </View>
              <View style={[styles.modalFoot, { borderTopColor: C.border }]}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { borderColor: C.border, backgroundColor: C.background },
                  ]}
                  onPress={() => setOpenModal(null)}
                >
                  <Text style={[styles.btnText, { color: C.foreground }]}>
                    취소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { backgroundColor: C.primary, borderColor: C.primary },
                  ]}
                  onPress={() =>
                    openModal === "add-detail"
                      ? handleAddDetail()
                      : handleEditDetail()
                  }
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: C.primaryForeground, fontWeight: "600" },
                    ]}
                  >
                    {openModal === "add-detail" ? "등록" : "저장"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── 모달 필드 서브컴포넌트 ────────────────────────────────────────

function ModalField({
  label,
  required,
  hint,
  children,
  C,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  C: any;
}) {
  return (
    <View style={styles.formRow}>
      <Text style={[styles.formLabel, { color: C.foreground }]}>
        {label}
        {required && <Text style={{ color: "#EF4444" }}> *</Text>}
      </Text>
      <View style={{ flex: 1 }}>
        {children}
        {hint && (
          <Text style={[styles.fiHint, { color: C.mutedForeground }]}>
            {hint}
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── 스타일 ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  inner: { padding: 20, gap: 16 },

  // ── 탭 바
  tabBar: { flexDirection: "row", borderBottomWidth: 1, paddingHorizontal: 20 },
  tab: {
    paddingVertical: 13,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 13 },

  // ── 페이지 헤더
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  pageTitle: { fontSize: 20, fontWeight: "600", letterSpacing: -0.3 },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },

  // ── 버튼
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  btnText: { fontSize: 13 },
  divider: { width: 1, height: 18, marginHorizontal: 2 },

  // ── 통계 카드
  statsGrid: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  statLabel: { fontSize: 11 },
  statValue: { fontSize: 22, fontWeight: "600", letterSpacing: -0.5 },

  // ── 검색 바
  filterRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    height: 36,
    gap: 6,
  },
  searchInput: { flex: 1, fontSize: 13, height: 36 },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    height: 36,
    gap: 6,
    minWidth: 100,
  },
  dropdownText: { fontSize: 13, flex: 1 },
  dropdownList: {
    position: "absolute",
    top: 40,
    left: 0,
    minWidth: 120,
    borderWidth: 1,
    borderRadius: Radius.md,
    zIndex: 100,
    overflow: "hidden",
  },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12 },

  // ── 테이블 공통
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
  },
  headerText: { fontSize: 11, fontWeight: "600" },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  tableBottom: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
    height: 1,
  },
  colChk: { width: 36 },
  cellText: { fontSize: 13 },

  // ── 체크박스
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── 코드 칩
  codeChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  codeChipText: { fontSize: 11, fontFamily: "monospace" },

  // ── 뱃지
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 11, fontWeight: "500" },
  badgeGreen: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  badgeGray: { backgroundColor: "#F4F4F5", borderColor: "#E4E4E7" },

  // ── 액션 버튼
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: Radius.sm,
  },
  actionBtnText: { fontSize: 11, fontWeight: "500" },

  // ── 페이지네이션
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { fontSize: 13 },
  pageButtons: { flexDirection: "row", gap: 4 },
  pageBtn: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── 탭2 분할 레이아웃
  splitWrapper: { flex: 1 },
  split: { flex: 1, flexDirection: "row", padding: 20, gap: 16 },

  // ── 좌측 그룹 패널
  groupPanel: {
    width: 220,
    borderWidth: 1,
    borderRadius: Radius.lg,
    overflow: "hidden",
    height: "100%",
  },
  gpHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  gpHeadTitle: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gpSearchWrap: {
    flexDirection: "row",
    gap: 6,
    padding: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  gpSearch: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
  },
  gpSearchBtn: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  gpItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 14,
  },
  gpItemActive: { borderLeftWidth: 2, paddingLeft: 12 },
  gpItemName: { fontSize: 13, fontWeight: "500" },
  gpItemCode: { fontSize: 10, fontFamily: "monospace", marginTop: 1 },
  gpCount: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 100,
    borderWidth: 1,
  },

  // ── 우측 상세 헤더
  detailHeader: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: 16,
    gap: 12,
  },
  dhLeft: { flexDirection: "row", gap: 12, flex: 1 },
  dhIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  dhTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dhName: { fontSize: 15, fontWeight: "600", letterSpacing: -0.2 },
  dhStats: {
    flexDirection: "row",
    gap: 20,
    padding: 10,
    paddingHorizontal: 18,
  },
  dhStat: { alignItems: "center" },
  dhStatVal: { fontSize: 17, fontWeight: "600" },
  dhStatLabel: { fontSize: 11 },

  // ── 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 460,
    maxWidth: "92%",
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 15, fontWeight: "600" },
  modalBody: { padding: 22 },
  modalFoot: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    padding: 14,
    paddingHorizontal: 22,
    borderTopWidth: 1,
  },

  // ── 폼 (모달 내)
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    alignItems: "flex-start",
  },
  formLabel: { width: 80, fontSize: 13, fontWeight: "500", paddingTop: 8 },
  fi: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 11,
    paddingVertical: 7,
    fontSize: 13,
    height: 36,
  },
  fiTextarea: { height: 68, paddingTop: 8 },
  fiHint: { fontSize: 11, marginTop: 4 },

  // ── 경고 박스 (삭제 모달)
  alertWarn: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: 12,
  },
  alertTitle: { fontSize: 13, fontWeight: "600", marginBottom: 3 },
  alertDesc: { fontSize: 12 },
  delInfo: { padding: 10, paddingHorizontal: 14 },

  // ── 코드 등록 모달 그룹 배너
  groupInfoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: 16,
  },
});
