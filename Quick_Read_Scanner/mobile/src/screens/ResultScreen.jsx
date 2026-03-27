import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Share, Platform
} from 'react-native';
import DrugCard from '../components/DrugCard';
import SimilarDrugs from '../components/SimilarDrugs';

export default function ResultScreen({ route, navigation }) {
  // ── Safe defaults — never crash on undefined ──────────
  const prescription = route?.params?.prescription ?? [];
  const ocrText      = route?.params?.ocr_text ?? '';
  const confidence   = route?.params?.confidence ?? 0;
  const method       = route?.params?.method ?? '';
  const needsManual  = route?.params?.status === 'manual_needed';

  const found    = prescription.filter(p => p?.status === 'found').length;
  const similar  = prescription.filter(p => p?.status === 'similar_found').length;
  const notFound = prescription.filter(p => p?.status === 'not_found').length;

  const sharePrescription = async () => {
    if (!prescription.length) return;
    const text = prescription.map((p, i) => {
      if (p.status === 'found')
        return `${i+1}. ${p.drug_name} (${p.synonym || ''})`;
      if (p.status === 'similar_found')
        return `${i+1}. ${p.input_word} → Similar: ${p.suggestions?.[0]?.name || '?'}`;
      return `${i+1}. ${p.input_word} → NOT FOUND`;
    }).join('\n');
    await Share.share({ message: `Digital Prescription:\n\n${text}` });
  };

  // ── Manual needed screen ───────────────────────────────
  if (needsManual) {
    return (
      <ScrollView style={styles.scroll}
                  contentContainerStyle={styles.container}>
        <View style={styles.manualCard}>
          <Text style={styles.manualTitle}>⚠️ Manual Review අවශ්‍යයි</Text>
          <Text style={styles.manualSub}>
            බෙහෙත් හඳුනාගැනීමට අපහසුයි
          </Text>
          <Text style={styles.manualText}>{ocrText || 'No text detected'}</Text>
        </View>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.retryBtnText}>🔄  නැවත Scan කරන්න</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Empty result screen ────────────────────────────────
  if (!prescription.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyText}>Drugs හඳුනා නොගනී</Text>
        <Text style={styles.emptySub}>
          Image clear නැතිනම් retry කරන්න
        </Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.retryBtnText}>🔄  නැවත try කරන්න</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Normal result screen ───────────────────────────────
  return (
    <ScrollView style={styles.scroll}
                contentContainerStyle={styles.container}>

      {/* OCR info bar */}
      {confidence > 0 && (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            OCR Confidence: {confidence}%  |  {method}
          </Text>
        </View>
      )}

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor:'#EAF3DE' }]}>
          <Text style={styles.summaryNum}>{found}</Text>
          <Text style={styles.summaryLbl}>Found ✅</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor:'#FAEEDA' }]}>
          <Text style={styles.summaryNum}>{similar}</Text>
          <Text style={styles.summaryLbl}>Similar ⚠️</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor:'#FCEBEB' }]}>
          <Text style={styles.summaryNum}>{notFound}</Text>
          <Text style={styles.summaryLbl}>Not Found ❌</Text>
        </View>
      </View>

      {/* Drug list */}
      {prescription.map((item, index) => {
        if (!item) return null;
        if (item.status === 'found')
          return <DrugCard key={index} drug={item} />;
        if (item.status === 'similar_found')
          return <SimilarDrugs key={index} result={item} />;
        return (
          <View key={index} style={styles.errorCard}>
            <View style={styles.errorHeader}>
              <Text style={styles.errorBadge}>❌ Not Found</Text>
              <Text style={styles.errorWord}>{item.input_word}</Text>
            </View>
            <Text style={styles.errorMsg}>{item.message}</Text>
          </View>
        );
      })}

      {/* Raw OCR Output */}
      {!!ocrText && (
        <View style={styles.rawOutputCard}>
          <Text style={styles.rawOutputText}>{ocrText}</Text>
        </View>
      )}

      {/* Buttons */}
      <TouchableOpacity style={styles.shareBtn}
                        onPress={sharePrescription}>
        <Text style={styles.shareBtnText}>📤  Share Prescription</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.retryBtn}
                        onPress={() => navigation.navigate('Camera')}>
        <Text style={styles.retryBtnText}>🔄  Scan Another</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:          { flex:1, backgroundColor:'#fff' },
  container:       { padding:16, paddingBottom:40 },

  infoBar:         { backgroundColor:'#E6F1FB', borderRadius:8,
                     padding:8, marginBottom:12 },
  infoText:        { fontSize:12, color:'#185FA5', textAlign:'center' },

  summaryRow:      { flexDirection:'row', gap:8, marginBottom:16 },
  summaryCard:     { flex:1, borderRadius:10, padding:12,
                     alignItems:'center' },
  summaryNum:      { fontSize:22, fontWeight:'bold', color:'#333' },
  summaryLbl:      { fontSize:11, color:'#555', marginTop:2 },

  emptyContainer:  { flex:1, justifyContent:'center',
                     alignItems:'center', padding:30,
                     backgroundColor:'#fff' },
  emptyIcon:       { fontSize:48, marginBottom:12 },
  emptyText:       { fontSize:18, color:'#888', marginBottom:6 },
  emptySub:        { fontSize:13, color:'#aaa', marginBottom:24 },

  manualCard:      { backgroundColor:'#FAEEDA', borderRadius:12,
                     padding:16, marginBottom:16,
                     borderWidth:0.5, borderColor:'#FAC775' },
  manualTitle:     { fontSize:16, fontWeight:'600',
                     color:'#854F0B', marginBottom:6 },
  manualSub:       { fontSize:13, color:'#854F0B', marginBottom:8 },
  manualText:      { fontSize:13, color:'#633806',
                     fontFamily:'monospace' },

  errorCard:       { backgroundColor:'#FCEBEB', borderRadius:12,
                     padding:14, marginBottom:10,
                     borderWidth:0.5, borderColor:'#F7C1C1' },
  errorHeader:     { flexDirection:'row', alignItems:'center',
                     gap:8, marginBottom:4 },
  errorBadge:      { fontSize:12, color:'#A32D2D', fontWeight:'600' },
  errorWord:       { fontSize:15, fontWeight:'bold', color:'#A32D2D' },
  errorMsg:        { fontSize:13, color:'#c0392b' },

  rawOutputCard:   { backgroundColor:'#1E1E1E', padding:12,
                     borderRadius:12, marginBottom:16, marginTop:8 },
  rawOutputText:   { color:'#4AF626', fontSize:12,
                     fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  shareBtn:        { backgroundColor:'#185FA5', padding:15,
                     borderRadius:12, alignItems:'center',
                     marginTop:8, marginBottom:10 },
  shareBtnText:    { color:'#fff', fontSize:16, fontWeight:'600' },
  retryBtn:        { borderWidth:1, borderColor:'#ddd', padding:15,
                     borderRadius:12, alignItems:'center' },
  retryBtnText:    { color:'#555', fontSize:15 },
});