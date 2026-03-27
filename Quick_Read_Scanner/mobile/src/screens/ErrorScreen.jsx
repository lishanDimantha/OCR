import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ErrorScreen({ route, navigation }) {
  const { message, type } = route?.params || {};

  const errors = {
    blurry:      { icon:'📷', title:'පින්තූරය අපැහැදිලිය',    tip:'හොඳ ආලෝකයේ නැවත ගන්න' },
    underexposed:{ icon:'🌑', title:'ඡායාරූපය ඕනෑවට අඳුරුය', tip:'ආලෝකය වැඩි කරන්න' },
    overexposed: { icon:'☀️', title:'ඡායාරූපය ඕනෑවට ආලෝකිතය', tip:'සෙවණෙහිදී ගන්න' },
    default:     { icon:'❌', title:'Error',                     tip: message || 'නැවත උත්සාහ කරන්න' },
  };

  const err = errors[type] || errors.default;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{err.icon}</Text>
      <Text style={styles.title}>{err.title}</Text>
      <Text style={styles.tip}>{err.tip}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.btnText}>🔄  නැවත උත්සාහ කරන්න</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnHome}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.btnHomeText}>🏠  Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center',
               backgroundColor:'#fff', padding:30 },
  icon:      { fontSize:64, marginBottom:16 },
  title:     { fontSize:20, fontWeight:'bold', color:'#A32D2D', marginBottom:8 },
  tip:       { fontSize:15, color:'#666', marginBottom:32, textAlign:'center' },
  btn:       { backgroundColor:'#185FA5', padding:14, borderRadius:10,
               width:'100%', alignItems:'center', marginBottom:10 },
  btnText:   { color:'#fff', fontSize:16, fontWeight:'600' },
  btnHome:   { padding:14, borderRadius:10, width:'100%', alignItems:'center',
               borderWidth:1, borderColor:'#ddd' },
  btnHomeText:{ color:'#666', fontSize:15 },
});