import api from '@/lib/api';
import { useState } from 'react';
import type { CodeDetail, CodeGroup } from '../types';

export function useDetailTab(
  groups: CodeGroup[],
  details: CodeDetail[],
  selectedGroupId: number,
  setSelectedGroupId: (id: number) => void,
  reload: () => void,
) {
  const [gpSearch, setGpSearch]               = useState('');
  const [detailSearch, setDetailSearch]       = useState('');
  const [detailStatusFilter, setDetailStatusFilter] = useState<'all' | 'use' | 'nouse'>('all');
  const [detailStatusDropdown, setDetailStatusDropdown] = useState(false);
  const [selectedDetailIds, setSelectedDetailIds] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'del' | null>(null);
  const [editTarget, setEditTarget] = useState<CodeDetail | null>(null);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? groups[0] ?? null;

  const filteredGroups = groups.filter(
    (g) => gpSearch === '' || g.name.includes(gpSearch) || g.code.toLowerCase().includes(gpSearch.toLowerCase())
  );

  const filteredDetails = details.filter((d) => {
    const matchGroup  = d.groupId === selectedGroupId;
    const matchSearch = detailSearch === '' ||
      d.code.toLowerCase().includes(detailSearch.toLowerCase()) ||
      d.name.includes(detailSearch);
    const matchStatus =
      detailStatusFilter === 'all' ||
      (detailStatusFilter === 'use' && d.active) ||
      (detailStatusFilter === 'nouse' && !d.active);
    return matchGroup && matchSearch && matchStatus;
  });

  const hasDetailSelected = selectedDetailIds.length > 0;

  const toggleDetail = (id: number) =>
    setSelectedDetailIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const toggleAllDetails = () =>
    setSelectedDetailIds((prev) =>
      prev.length === filteredDetails.length ? [] : filteredDetails.map((d) => d.id)
    );

  const openEditDetail = (d: CodeDetail) => {
    setEditTarget(d);
    setOpenModal('edit');
  };

  const handleDelete = async () => {
    if (!selectedGroup) return;
    try {
      const codes = details.filter((d) => selectedDetailIds.includes(d.id)).map((d) => d.code);
      await Promise.all(codes.map((code) => api.delete(`/codes/groups/${selectedGroup.code}/details/${code}`)));
      setSelectedDetailIds([]);
      setOpenModal(null);
      reload();
    } catch (e) {
      console.error('상세코드 삭제 실패:', e);
    }
  };

  const selectedDetailCodes = details
    .filter((d) => selectedDetailIds.includes(d.id))
    .map((d) => d.code);

  return {
    gpSearch, setGpSearch,
    detailSearch, setDetailSearch,
    detailStatusFilter, setDetailStatusFilter,
    detailStatusDropdown, setDetailStatusDropdown,
    selectedDetailIds, setSelectedDetailIds,
    selectedGroup,
    filteredGroups,
    filteredDetails,
    hasDetailSelected,
    toggleDetail, toggleAllDetails,
    openModal, setOpenModal,
    editTarget,
    openEditDetail,
    handleDelete,
    selectedDetailCodes,
    setSelectedGroupId,
  };
}
