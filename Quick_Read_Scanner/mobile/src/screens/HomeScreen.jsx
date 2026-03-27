import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar, ScrollView
} from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#185FA5" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>💊</Text>
        <Text style={styles.headerTitle}>Prescription OCR</Text>
        <Text style={styles.headerSub}>Doctor handwriting → Digital</Text>
      </View>

      {/* How it works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it works</Text>

        <View style={styles.step}>
          <View style={[styles.stepIcon, { backgroundColor:'#E6F1FB' }]}>
            <Text style={styles.stepEmoji}>📷</Text>
          </View>
          <View style={styles.stepText}>
            <Text style={styles.stepTitle}>Photo Upload</Text>
            <Text style={styles.stepSub}>Camera හෝ Gallery එකෙන් prescription ගන්න</Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepIcon, { backgroundColor:'#EEEDFE' }]}>
            <Text style={styles.stepEmoji}>🔍</Text>
          </View>
          <View style={styles.stepText}>
            <Text style={styles.stepTitle}>Quality Check</Text>
            <Text style={styles.stepSub}>Blur / dark / overexposed image reject කරනවා</Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepIcon, { backgroundColor:'#FAEEDA' }]}>
            <Text style={styles.stepEmoji}>🤖</Text>
          </View>
          <View style={styles.stepText}>
            <Text style={styles.stepTitle}>AI Reading</Text>
            <Text style={styles.stepSub}>Letters detect → ['A','s','p'...] → "Aspocid"</Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={[styles.stepIcon, { backgroundColor:'#EAF3DE' }]}>
            <Text style={styles.stepEmoji}>💊</Text>
          </View>
          <View style={styles.stepText}>
            <Text style={styles.stepTitle}>Digital Prescription</Text>
            <Text style={styles.stepSub}>Drug database check → Found / Similar / Error</Text>
          </View>
        </View>
      </View>

      {/* Scan button */}
      <TouchableOpacity
        style={styles.scanBtn}
        onPress={() => navigation.navigate('Camera')}
        activeOpacity={0.85}
      >
        <Text style={styles.scanBtnText}>📷  Prescription Scan කරන්න</Text>
      </TouchableOpacity>

      {/* Status bar */}
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Text style={styles.statusDot}>🟢</Text>
          <Text style={styles.statusText}>API Connected</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusDot}>🟢</Text>
          <Text style={styles.statusText}>Drug DB Ready</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:        { flex:1, backgroundColor:'#fff' },
  container:     { padding:20, paddingBottom:40 },

  header:        { backgroundColor:'#185FA5', borderRadius:16, padding:24,
                   alignItems:'center', marginBottom:24 },
  headerIcon:    { fontSize:48, marginBottom:8 },
  headerTitle:   { fontSize:26, fontWeight:'bold', color:'#fff', marginBottom:4 },
  headerSub:     { fontSize:14, color:'rgba(255,255,255,0.8)' },

  section:       { marginBottom:24 },
  sectionTitle:  { fontSize:16, fontWeight:'600', color:'#333',
                   marginBottom:14 },

  step:          { flexDirection:'row', alignItems:'center',
                   marginBottom:14, gap:12 },
  stepIcon:      { width:44, height:44, borderRadius:10,
                   justifyContent:'center', alignItems:'center' },
  stepEmoji:     { fontSize:20 },
  stepText:      { flex:1 },
  stepTitle:     { fontSize:14, fontWeight:'600', color:'#1a1a1a' },
  stepSub:       { fontSize:12, color:'#666', marginTop:2 },

  scanBtn:       { backgroundColor:'#185FA5', padding:18, borderRadius:14,
                   alignItems:'center', marginBottom:16 },
  scanBtnText:   { color:'#fff', fontSize:18, fontWeight:'700' },

  statusRow:     { flexDirection:'row', justifyContent:'center',
                   gap:20, marginTop:4 },
  statusItem:    { flexDirection:'row', alignItems:'center', gap:4 },
  statusDot:     { fontSize:10 },
  statusText:    { fontSize:12, color:'#666' },
});