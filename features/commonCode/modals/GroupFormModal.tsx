/**
 * GroupFormModal — 코드 그룹 등록/수정 모달 (mode prop으로 재사용)
 */
import { ModalField } from '@/components/ui/ModalField';
import { screenStyleDefs } from '@/constants/screenStyles';
import { Colors, Radius } from '@/constants/theme';
import api from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { CodeGroup } from '../types';

type ColorScheme = typeof Colors['light'];

interface AddProps {
  mode: 'add';
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  C: ColorScheme;
}

interface EditProps {
  mode: 'edit';
  visible: boolean;
  group: CodeGroup;
  onClose: () => void;
  onSuccess: () => void;
  C: ColorScheme;
}

type Props = AddProps | EditProps;

export function GroupFormModal(props: Props) {
  const { visible, onClose, onSuccess, C } = props;
  const isEdit = props.mode === 'edit';
  const initial = isEdit ? props.group : null;

  const [code,   setCode]   = useState(initial?.code   ?? '');
  const [name,   setName]   = useState(initial?.name   ?? '');
  const [desc,   setDesc]   = useState(initial?.desc   ?? '');
  const [sort,   setSort]   = useState(String(initial?.sort ?? 99));
  const [active, setActive] = useState(initial?.active ?? true);

  // 모달이 새로 열릴 때 edit 초기값으로 리셋
  const handleOpen = () => {
    setCode(initial?.code   ?? '');
    setName(initial?.name   ?? '');
    setDesc(initial?.desc   ?? '');
    setSort(String(initial?.sort ?? 99));
    setActive(initial?.active ?? true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      if (isEdit && initial) {
        await api.put(`/codes/groups/${initial.code}`, {
          groupName: name.trim(),
          description: desc.trim() || null,
          sortOrder: parseInt(sort) || 0,
          useYn: active,
        });
      } else {
        if (!code.trim()) return;
        await api.post('/codes/groups', {
          groupCode: code.trim(),
          groupName: name.trim(),
          description: desc.trim() || null,
          sortOrder: parseInt(sort) || 0,
        });
      }
      onClose();
      onSuccess();
    } catch (e) {
      console.error(isEdit ? '그룹 수정 실패:' : '그룹 등록 실패:', e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onShow={handleOpen}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={[styles.box, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={[styles.head, { borderBottomColor: C.border }]}>
              <Text style={[styles.title, { color: C.foreground }]}>
                {isEdit ? '코드 그룹 수정' : '코드 그룹 등록'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={18} color={C.mutedForeground} />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              {isEdit ? (
                <ModalField label="그룹 코드" hint="등록 후 변경 불가" C={C}>
                  <TextInput
                    style={[styles.fi, { borderColor: C.border, backgroundColor: C.muted, color: C.mutedForeground }]}
                    value={code}
                    editable={false}
                  />
                </ModalField>
              ) : (
                <ModalField label="그룹 코드" required hint="영문 대문자, 숫자, 언더스코어 · 중복 불가" C={C}>
                  <TextInput
                    style={[styles.fi, { borderColor: C.border, backgroundColor: C.background, color: C.foreground }]}
                    placeholder="예) MY_CODE"
                    placeholderTextColor={C.mutedForeground}
                    value={code}
                    onChangeText={setCode}
                  />
                </ModalField>
              )}
              <ModalField label="그룹명" required C={C}>
                <TextInput
                  style={[styles.fi, { borderColor: C.border, backgroundColor: C.background, color: C.foreground }]}
                  placeholder="예) 사용자 정의 코드"
                  placeholderTextColor={C.mutedForeground}
                  value={name}
                  onChangeText={setName}
                />
              </ModalField>
              <ModalField label="설명" C={C}>
                <TextInput
                  style={[styles.fi, styles.fiTextarea, { borderColor: C.border, backgroundColor: C.background, color: C.foreground }]}
                  placeholder="코드 그룹 설명"
                  placeholderTextColor={C.mutedForeground}
                  multiline
                  textAlignVertical="top"
                  value={desc}
                  onChangeText={setDesc}
                />
              </ModalField>
              <ModalField label="정렬 순서" C={C}>
                <TextInput
                  style={[styles.fi, { borderColor: C.border, backgroundColor: C.background, color: C.foreground, width: 90 }]}
                  keyboardType="numeric"
                  value={sort}
                  onChangeText={setSort}
                />
              </ModalField>
              <ModalField label="사용 여부" C={C}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4 }}>
                  <Switch
                    value={active}
                    onValueChange={setActive}
                    trackColor={{ false: C.border, true: '#16A34A' }}
                    thumbColor="#fff"
                  />
                  <Text style={{ fontSize: 13, color: C.mutedForeground }}>{active ? '사용' : '미사용'}</Text>
                </View>
              </ModalField>
            </View>
            <View style={[styles.foot, { borderTopColor: C.border }]}>
              <TouchableOpacity style={[styles.btn, { borderColor: C.border, backgroundColor: C.background }]} onPress={onClose}>
                <Text style={[styles.btnText, { color: C.foreground }]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: C.primary, borderColor: C.primary }]} onPress={handleSubmit}>
                <Text style={[styles.btnText, { color: C.primaryForeground, fontWeight: '600' }]}>
                  {isEdit ? '저장' : '등록'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  ...screenStyleDefs,
  overlay:    screenStyleDefs.modalOverlay,
  box: {
    width: 460,
    maxWidth: '92%' as any,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
  },
  title: { fontSize: 15, fontWeight: '600' as const },
  body:  { padding: 22 },
  foot: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    padding: 14,
    paddingHorizontal: 22,
    borderTopWidth: 1,
  },
  fi: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 11,
    paddingVertical: 7,
    fontSize: 13,
    height: 36,
  },
  fiTextarea: { height: 68, paddingTop: 8 },
});
