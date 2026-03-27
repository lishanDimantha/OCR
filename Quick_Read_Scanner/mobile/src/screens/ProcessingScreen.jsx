import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function ProcessingScreen() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue:1, duration:400, useNativeDriver:true }),
        Animated.timing(dot, { toValue:0, duration:400, useNativeDriver:true }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  const dotStyle = (anim) => ({
    width:12, height:12, borderRadius:6,
    backgroundColor:'#185FA5', marginHorizontal:4,
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange:[0,1], outputRange:[0,-10] }) }]
  });

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔬</Text>
      <Text style={styles.title}>Prescription Reading...</Text>

      <View style={styles.dots}>
        <Animated.View style={dotStyle(dot1)} />
        <Animated.View style={dotStyle(dot2)} />
        <Animated.View style={dotStyle(dot3)} />
      </View>

      <View style={styles.steps}>
        <Text style={styles.step}>✅ Image quality checked</Text>
        <Text style={styles.step}>✅ Preprocessing complete</Text>
        <Text style={styles.step}>⏳ Reading letters...</Text>
        <Text style={styles.stepDim}>⏳ Checking drug database...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center',
               backgroundColor:'#fff', padding:30 },
  emoji:     { fontSize:56, marginBottom:16 },
  title:     { fontSize:20, fontWeight:'600', color:'#185FA5', marginBottom:24 },
  dots:      { flexDirection:'row', marginBottom:32 },
  steps:     { width:'100%', backgroundColor:'#f5f5f5',
               borderRadius:12, padding:16 },
  step:      { fontSize:14, color:'#333', marginBottom:8 },
  stepDim:   { fontSize:14, color:'#aaa', marginBottom:8 },
});