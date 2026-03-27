import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SimilarDrugs({ result }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>⚠️ "{result.input_word}" හඳුනා නොගනී</Text>
      <Text style={styles.sub}>මෙවා අදහස් කරන්නේද?</Text>
      {(result.suggestions || []).map((drug, i) => (
        <TouchableOpacity key={i} style={styles.suggestion}>
          <Text style={styles.sugName}>{drug.name}</Text>
          {drug.similarity ? (
            <Text style={styles.score}>{drug.similarity}% match</Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card:       { backgroundColor:'#FAEEDA', borderRadius:10, padding:14, marginBottom:10, borderWidth:0.5, borderColor:'#FAC775' },
  title:      { fontSize:15, fontWeight:'600', color:'#854F0B', marginBottom:4 },
  sub:        { fontSize:13, color:'#854F0B', marginBottom:8 },
  suggestion: { backgroundColor:'#fff8ee', borderRadius:8, padding:10, marginBottom:6, borderWidth:0.5, borderColor:'#FAC775' },
  sugName:    { fontSize:14, fontWeight:'500', color:'#633806' },
  score:      { fontSize:12, color:'#BA7517', marginTop:2 },
});