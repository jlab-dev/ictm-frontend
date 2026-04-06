/**
 * ConfirmModal — 범용 삭제 확인 모달
 * 나중에 components/ui/ConfirmModal.tsx 로 이동하면 모든 화면에서 재사용 가능
 */
import { screenStyleDefs } from '@/constants/screenStyles';
import { Colors, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ColorScheme = typeof Colors['light'];

interface Props {
  visible: boolean;
  title: string;
  warning?: string;
  selectedCodes: string[];
  onConfirm: () => void;
  onCancel: () => void;
  C: ColorScheme;
}

export function ConfirmModal({ visible, title, warning, selectedCodes, onConfirm, onCancel, C }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={[styles.box, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={[styles.head, { borderBottomColor: C.border }]}>
              <Text style={[styles.title, { color: C.foreground }]}>{title}</Text>
              <TouchableOpacity onPress={onCancel}>
                <Ionicons name="close" size={18} color={C.mutedForeground} />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={[styles.alertWarn, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                <Ionicons name="warning-outline" size={15} color="#92400E" style={{ marginTop: 1 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.alertTitle, { color: '#92400E' }]}>선택한 항목을 삭제하시겠습니까?</Text>
                  {warning && <Text style={[styles.alertDesc, { color: '#92400E' }]}>{warning}</Text>}
                </View>
              </View>
              <View style={[styles.delInfo, { backgroundColor: C.muted, borderRadius: Radius.md }]}>
                <Text style={{ fontSize: 13, color: C.mutedForeground }}>
                  선택된 항목:{' '}
                  <Text style={{ fontWeight: '600', color: C.foreground }}>{selectedCodes.join(', ')}</Text>
                </Text>
              </View>
            </View>
            <View style={[styles.foot, { borderTopColor: C.border }]}>
              <TouchableOpacity
                style={[styles.btn, { borderColor: C.border, backgroundColor: C.background }]}
                onPress={onCancel}
              >
                <Text style={[styles.btnText, { color: C.foreground }]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }]}
                onPress={onConfirm}
              >
                <Text style={[styles.btnText, { color: '#EF4444', fontWeight: '600' }]}>삭제</Text>
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
  overlay: screenStyleDefs.modalOverlay,
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
  title:  { fontSize: 15, fontWeight: '600' as const },
  body:   { padding: 22 },
  foot: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    padding: 14,
    paddingHorizontal: 22,
    borderTopWidth: 1,
  },
  alertWarn: {
    flexDirection: 'row' as const,
    gap: 10,
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: 12,
  },
  alertTitle: { fontSize: 13, fontWeight: '600' as const, marginBottom: 3 },
  alertDesc:  { fontSize: 12 },
  delInfo:    { padding: 10, paddingHorizontal: 14 },
});
