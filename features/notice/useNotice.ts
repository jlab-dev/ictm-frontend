import { useState } from 'react';

// ─── 타입 ──────────────────────────────────────────────────────────

export type NoticeTab    = 'all' | 'published' | 'draft' | 'closed';
export type ModalType    = 'add' | 'edit' | 'del' | null;
export type NoticeStatus = 'published' | 'draft' | 'closed';

export interface Notice {
  id: number;
  title: string;
  author: string;
  status: NoticeStatus;
  pinned: boolean;
  createdAt: string;
  startDate: string;
  endDate: string;
}

// ─── 목 데이터 ─────────────────────────────────────────────────────

export const MOCK_NOTICES: Notice[] = [
  { id: 1, title: '[필독] 2026년 1분기 시스템 점검 안내',       author: '관리자', status: 'published', pinned: true,  createdAt: '2026-03-25', startDate: '2026-03-25', endDate: '2026-04-30' },
  { id: 2, title: '장비 등록 절차 개선 안내',                   author: '홍길동', status: 'published', pinned: false, createdAt: '2026-03-20', startDate: '2026-03-20', endDate: '2026-12-31' },
  { id: 3, title: '5월 정기 유지보수 일정 공지',                author: '관리자', status: 'published', pinned: false, createdAt: '2026-03-18', startDate: '2026-04-01', endDate: '2026-05-31' },
  { id: 4, title: '보안 취약점 패치 완료 안내',                 author: '관리자', status: 'published', pinned: false, createdAt: '2026-03-15', startDate: '2026-03-15', endDate: '2026-03-31' },
  { id: 5, title: '신규 점검 항목 추가 예정',                   author: '홍길동', status: 'draft',     pinned: false, createdAt: '2026-03-10', startDate: '-',          endDate: '-'          },
  { id: 6, title: '모바일 앱 업데이트 안내 (준비 중)',           author: '관리자', status: 'draft',     pinned: false, createdAt: '2026-03-08', startDate: '-',          endDate: '-'          },
  { id: 7, title: '2025년 4분기 리포트 제출 안내',              author: '관리자', status: 'closed',    pinned: false, createdAt: '2025-12-01', startDate: '2025-12-01', endDate: '2026-01-15' },
  { id: 8, title: '동절기 설비 점검 강화 안내',                 author: '홍길동', status: 'closed',    pinned: false, createdAt: '2025-11-15', startDate: '2025-11-15', endDate: '2026-02-28' },
];

// ─── 상태 설정 맵 ──────────────────────────────────────────────────

export const STATUS_CONFIG: Record<NoticeStatus, { label: string; color: string; bg: string }> = {
  published: { label: '게시중',   color: '#16A34A', bg: '#DCFCE7' },
  draft:     { label: '임시저장', color: '#B45309', bg: '#FEF9C3' },
  closed:    { label: '종료',     color: '#71717A', bg: '#F4F4F5' },
};

// ─── 훅 ────────────────────────────────────────────────────────────

export function useNotice() {
  const [activeTab,      setActiveTab]      = useState<NoticeTab>('all');
  const [openModal,      setOpenModal]      = useState<ModalType>(null);
  const [selectedIds,    setSelectedIds]    = useState<number[]>([]);
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState<NoticeStatus | 'all'>('all');
  const [statusDropdown, setStatusDropdown] = useState(false);

  // ── 등록/수정 폼 상태
  const [formTitle,     setFormTitle]     = useState('');
  const [formContent,   setFormContent]   = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate,   setFormEndDate]   = useState('');
  const [formPinned,    setFormPinned]    = useState(false);
  const [formStatus,    setFormStatus]    = useState<NoticeStatus>('draft');

  // ── 필터링
  const tabFiltered = MOCK_NOTICES.filter((n) => {
    if (activeTab === 'published') return n.status === 'published';
    if (activeTab === 'draft')     return n.status === 'draft';
    if (activeTab === 'closed')    return n.status === 'closed';
    return true;
  });

  const filtered = tabFiltered.filter((n) => {
    const matchSearch  = search === '' || n.title.includes(search) || n.author.includes(search);
    const matchStatus  = statusFilter === 'all' || n.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── 탭 카운트
  const counts: Record<NoticeTab, number> = {
    all:       MOCK_NOTICES.length,
    published: MOCK_NOTICES.filter((n) => n.status === 'published').length,
    draft:     MOCK_NOTICES.filter((n) => n.status === 'draft').length,
    closed:    MOCK_NOTICES.filter((n) => n.status === 'closed').length,
  };

  // ── 체크박스
  const toggleItem = (id: number) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelectedIds((prev) => prev.length === filtered.length ? [] : filtered.map((n) => n.id));

  const hasSelected = selectedIds.length > 0;

  // ── 수정 모달 열기
  const openEdit = (notice: Notice) => {
    setFormTitle(notice.title);
    setFormPinned(notice.pinned);
    setFormStatus(notice.status);
    setFormStartDate(notice.startDate === '-' ? '' : notice.startDate);
    setFormEndDate(notice.endDate   === '-' ? '' : notice.endDate);
    setOpenModal('edit');
  };

  // ── 등록 모달 열기 (폼 초기화)
  const openAdd = () => {
    setFormTitle(''); setFormContent(''); setFormStartDate('');
    setFormEndDate(''); setFormPinned(false); setFormStatus('draft');
    setOpenModal('add');
  };

  return {
    activeTab, setActiveTab,
    openModal, setOpenModal,
    selectedIds, setSelectedIds,
    search, setSearch,
    statusFilter, setStatusFilter,
    statusDropdown, setStatusDropdown,
    formTitle, setFormTitle,
    formContent, setFormContent,
    formStartDate, setFormStartDate,
    formEndDate, setFormEndDate,
    formPinned, setFormPinned,
    formStatus, setFormStatus,
    filtered,
    counts,
    toggleItem, toggleAll,
    hasSelected,
    openEdit, openAdd,
  };
}
