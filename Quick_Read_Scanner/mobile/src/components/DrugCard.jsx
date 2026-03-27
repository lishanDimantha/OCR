import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DrugCard({ drug }) {
  const isPrescription = drug.classification === 'Prescription';

  return (
    <View style={[styles.card, isPrescription && styles.prescCard]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.badge, isPrescription && styles.prescBadge]}>
          <Text style={styles.badgeText}>
            {isPrescription ? '⚠️ Prescription Only' : '✅ Found'}
          </Text>
        </View>
        <Text style={[styles.drugName, isPrescription && styles.prescText]}>{drug.drug_name}</Text>
      </View>

      {/* Generic name */}
      {drug.generic ? (
        <Text style={[styles.generic, isPrescription && styles.prescTextLight]}>
          Generic: {drug.generic}
        </Text>
      ) : null}

      {/* Class + Use */}
      {drug.class ? (
        <Text style={[styles.info, isPrescription && styles.prescTextLight]}>
          🔬 {drug.class}  •  {drug.use}
        </Text>
      ) : null}

      {/* Dosage */}
      {drug.dosage ? (
        <View style={styles.dosageRow}>
          <Text style={[styles.dosageLabel, isPrescription && styles.prescText]}>💊 Dosage:</Text>
          <Text style={[styles.dosageValue, isPrescription && styles.prescText]}>{drug.dosage}</Text>
        </View>
      ) : null}

      {/* Quantity */}
      {drug.quantity ? (
        <View style={styles.dosageRow}>
          <Text style={[styles.dosageLabel, isPrescription && styles.prescText]}>📦 Qty:</Text>
          <Text style={[styles.dosageValue, isPrescription && styles.prescText]}>{drug.quantity}</Text>
        </View>
      ) : null}

      {/* Instructions */}
      {drug.instructions ? (
        <View style={[styles.instructions, isPrescription && styles.prescInstructions]}>
          <Text style={[styles.instrLabel, isPrescription && styles.prescText]}>📋 Instructions:</Text>
          <Text style={[styles.instrText, isPrescription && styles.prescTextLight]}>{drug.instructions}</Text>
        </View>
      ) : null}

      {/* Side Effects */}
      {drug.side_effects ? (
        <View style={styles.sideEffects}>
          <Text style={styles.sideEffectsLabel}>⚠️ Side Effects:</Text>
          <Text style={styles.sideEffectsText}>{drug.side_effects}</Text>
        </View>
      ) : null}

      {/* OCR input */}
      <Text style={[styles.ocrText, isPrescription && styles.prescTextLight]}>
        OCR read: "{drug.input_word}"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:         { backgroundColor:'#EAF3DE', borderRadius:12,
                  padding:14, marginBottom:12,
                  borderWidth:0.5, borderColor:'#C0DD97' },
  header:       { flexDirection:'row', alignItems:'center',
                  gap:8, marginBottom:6 },
  badge:        { backgroundColor:'#3B6D11', borderRadius:6,
                  paddingHorizontal:8, paddingVertical:2 },
  badgeText:    { color:'#fff', fontSize:11, fontWeight:'600' },
  drugName:     { fontSize:17, fontWeight:'bold', color:'#173404' },
  generic:      { fontSize:13, color:'#3B6D11', marginBottom:4 },
  info:         { fontSize:12, color:'#639922', marginBottom:6 },

  dosageRow:    { flexDirection:'row', alignItems:'center',
                  gap:6, marginBottom:4 },
  dosageLabel:  { fontSize:13, fontWeight:'600', color:'#27500A' },
  dosageValue:  { fontSize:13, color:'#27500A',
                  fontWeight:'bold' },

  instructions: { backgroundColor:'#D4EDBC', borderRadius:8,
                  padding:8, marginTop:4, marginBottom:6 },
  instrLabel:   { fontSize:12, fontWeight:'600',
                  color:'#27500A', marginBottom:2 },
  instrText:    { fontSize:12, color:'#3B6D11', lineHeight:18 },

  ocrText:      { fontSize:11, color:'#639922',
                  marginTop:4, fontStyle:'italic' },

  // Prescription overrides
  prescCard:         { backgroundColor:'#FCEBEB', borderColor:'#F7C1C1' },
  prescBadge:        { backgroundColor:'#D32F2F' },
  prescText:         { color:'#A32D2D' },
  prescTextLight:    { color:'#c0392b' },
  prescInstructions: { backgroundColor:'#FAD4D4' },
  
  // Side effects
  sideEffects:       { backgroundColor:'#FFF0F0', borderRadius:8,
                       padding:8, marginTop:4, marginBottom:6, 
                       borderWidth: 0.5, borderColor: '#FAD4D4' },
  sideEffectsLabel:  { fontSize:12, fontWeight:'600',
                       color:'#D32F2F', marginBottom:2 },
  sideEffectsText:   { fontSize:12, color:'#A32D2D', lineHeight:18 },
});