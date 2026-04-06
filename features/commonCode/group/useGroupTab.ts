import api from '@/lib/api';
import { useState } from 'react';
import type { CodeGroup } from '../types';

const PAGE_SIZE = 10;

export function useGroupTab(groups: CodeGroup[], reload: () => void) {
  // ── 검색 / 필터
  const [groupSearch, setGroupSearch]             = useState('');
  const [groupStatusFilter, setGroupStatusFilter] = useState<'all' | 'use' | 'nouse'>('all');
  const [statusDropdown, setStatusDropdown]       = useState(false);

  // ── 선택
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  // ── 페이지네이션
  const [groupPage, setGroupPage] = useState(1);

  // ── 모달
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'del' | null>(null);

  // ── 파생 값
  const filteredGroups = groups.filter((g) => {
    const matchSearch =
      groupSearch === '' ||
      g.code.toLowerCase().includes(groupSearch.toLowerCase()) ||
      g.name.includes(groupSearch);
    const matchStatus =
      groupStatusFilter === 'all' ||
      (groupStatusFilter === 'use' && g.active) ||
      (groupStatusFilter === 'nouse' && !g.active);
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / PAGE_SIZE));
  const pagedGroups = filteredGroups.slice((groupPage - 1) * PAGE_SIZE, groupPage * PAGE_SIZE);

  const pageNumbers = (() => {
    const total = totalPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (groupPage <= 3) return [1, 2, 3, 4, 5];
    if (groupPage >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [groupPage - 2, groupPage - 1, groupPage, groupPage + 1, groupPage + 2];
  })();

  const selectedGroup = groups.find((g) => g.id === selectedGroupIds[0]) ?? null;

  const hasGroupSelected    = selectedGroupIds.length > 0;
  const canEditGroup        = selectedGroupIds.length === 1;
  const selectedSystemGroup = groups.some((g) => selectedGroupIds.includes(g.id) && g.systemYn);
  const canDeleteGroup      = hasGroupSelected && !selectedSystemGroup;

  // ── 체크박스
  const toggleGroup = (id: number) =>
    setSelectedGroupIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const toggleAllGroups = () =>
    setSelectedGroupIds((prev) =>
      prev.length === filteredGroups.length ? [] : filteredGroups.map((g) => g.id)
    );

  // ── 삭제
  const handleDelete = async () => {
    try {
      const codes = groups.filter((g) => selectedGroupIds.includes(g.id)).map((g) => g.code);
      await Promise.all(codes.map((code) => api.delete(`/codes/groups/${code}`)));
      setSelectedGroupIds([]);
      setOpenModal(null);
      reload();
    } catch (e) {
      console.error('그룹 삭제 실패:', e);
    }
  };

  const selectedCodes = groups.filter((g) => selectedGroupIds.includes(g.id)).map((g) => g.code);

  return {
    // search / filter
    groupSearch, setGroupSearch,
    groupStatusFilter, setGroupStatusFilter,
    statusDropdown, setStatusDropdown,
    // selection
    selectedGroupIds,
    selectedGroup,
    toggleGroup, toggleAllGroups,
    hasGroupSelected, canEditGroup, canDeleteGroup,
    // pagination
    groupPage, setGroupPage, totalPages, pagedGroups, pageNumbers,
    filteredGroups,
    // modal
    openModal, setOpenModal,
    // actions
    handleDelete,
    selectedCodes,
  };
}
