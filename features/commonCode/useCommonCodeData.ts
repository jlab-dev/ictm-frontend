import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { type ApiGroup, type CodeDetail, type CodeGroup, type Tab, parseApiGroups } from './types';

export function useCommonCodeData() {
  const [groups, setGroups]     = useState<CodeGroup[]>([]);
  const [details, setDetails]   = useState<CodeDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab]             = useState<Tab>('group');
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);

  const reload = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: ApiGroup[] }>('/codes');
      const { groups, details } = parseApiGroups(res.data.data);
      setGroups(groups);
      setDetails(details);
    } catch (e) {
      console.error('공통코드 재조회 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    groups,
    details,
    isLoading,
    reload,
    activeTab,
    setActiveTab,
    selectedGroupId,
    setSelectedGroupId,
  };
}
