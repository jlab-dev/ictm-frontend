// ─── API 응답 타입 ─────────────────────────────────────────────────

export interface ApiDetail {
  code: string;
  codeName: string;
  description: string | null;
  sortOrder: number;
  useYn: boolean;
}

export interface ApiGroup {
  groupCode: string;
  groupName: string;
  description: string | null;
  useYn: boolean;
  systemYn: boolean;
  details: ApiDetail[];
}

// ─── 내부 도메인 타입 ──────────────────────────────────────────────

export interface CodeGroup {
  id: number;
  code: string;
  name: string;
  desc: string;
  count: number;
  sort: number;
  active: boolean;
  systemYn: boolean;
  updatedAt: string;
}

export interface CodeDetail {
  id: number;
  groupId: number;
  code: string;
  name: string;
  desc: string;
  sort: number;
  active: boolean;
  updatedAt: string;
}

export type Tab = 'group' | 'detail';

// ─── API 응답 파싱 헬퍼 ───────────────────────────────────────────

export function parseApiGroups(apiGroups: ApiGroup[]): { groups: CodeGroup[]; details: CodeDetail[] } {
  let detailId = 1;
  const groups: CodeGroup[] = apiGroups.map((g, idx) => ({
    id: idx + 1,
    code: g.groupCode,
    name: g.groupName,
    desc: g.description ?? '',
    count: g.details.length,
    sort: idx + 1,
    active: g.useYn,
    systemYn: g.systemYn,
    updatedAt: '-',
  }));
  const details: CodeDetail[] = apiGroups.flatMap((g, gIdx) =>
    g.details.map((d) => ({
      id: detailId++,
      groupId: gIdx + 1,
      code: d.code,
      name: d.codeName,
      desc: d.description ?? '',
      sort: d.sortOrder,
      active: d.useYn,
      updatedAt: '-',
    }))
  );
  return { groups, details };
}
