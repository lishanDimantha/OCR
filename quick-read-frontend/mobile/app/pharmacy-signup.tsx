import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import config from '@/constants/config';

export default function PharmacySignupScreen() {
  const router = useRouter();

  const [pharmacyName, setPharmacyName] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [registeredNo, setRegisteredNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const handleSignup = async () => {
    if (!pharmacyName.trim() || !email.trim() || !signupPassword.trim() || !registeredNo.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pharmacyName,
          email: email,
          password: signupPassword,
          address: registeredNo, // Using registeredNo as address for this role or we could add address field
          role: "pharmacist",
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setPendingEmail(email);
        setShowOTP(true);
        Alert.alert("Success", "Registration successful. Please enter the OTP sent to your email.");
      } else {
        Alert.alert("Signup Failed", result.message || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, otp }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP verified! You can now login.", [
          { text: "OK", onPress: () => router.replace("/pharmacy-login") }
        ]);
      } else {
        Alert.alert("Verification Failed", result.message || "Invalid OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('@/assets/images/UI_Background.jpeg')} style={styles.background} resizeMode='cover'>
      <StatusBar style='dark' />
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/images/quick-read-logo.png')} style={styles.logo} resizeMode='contain' />
          </View>

          <Text style={styles.helloText}>Hello Pharmacist...</Text>

          {showOTP ? (
            <View style={styles.formContainer}>
              <Text style={{color: '#0B0B87', marginBottom: 20, textAlign: 'center', fontWeight: '600'}}>
                Enter the code sent to {pendingEmail}
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder='Enter OTP' 
                  placeholderTextColor='#0B0B87' 
                  value={otp} 
                  onChangeText={setOtp} 
                  keyboardType="number-pad"
                />
              </View>
              <TouchableOpacity style={styles.buttonContainer} onPress={handleVerifyOTP} disabled={loading}>
                <LinearGradient colors={['#A388EE', '#5A67D8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.signupButton}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signupButtonText}>VERIFY OTP</Text>}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowOTP(false)}>
                <Text style={styles.loginLink}>Back to Signup</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder='Pharmacy Name' placeholderTextColor='#0B0B87' value={pharmacyName} onChangeText={setPharmacyName} />
                  <Ionicons name='business' size={20} color='#0B0B87' style={styles.inputIcon} />
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder='Email' placeholderTextColor='#0B0B87' value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none' />
                  <Ionicons name='mail' size={20} color='#0B0B87' style={styles.inputIcon} />
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder='Password' placeholderTextColor='#0B0B87' value={signupPassword} onChangeText={setSignupPassword} secureTextEntry />
                  <Ionicons name='lock-closed' size={20} color='#0B0B87' style={styles.inputIcon} />
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder='Registered No / Address' placeholderTextColor='#0B0B87' value={registeredNo} onChangeText={setRegisteredNo} />
                  <Ionicons name='document-text' size={20} color='#0B0B87' style={styles.inputIcon} />
                </View>
              </View>

              <TouchableOpacity style={styles.buttonContainer} onPress={handleSignup} disabled={loading}>
                <LinearGradient colors={['#A388EE', '#5A67D8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.signupButton}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signupButtonText}>SIGN UP</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => router.push('/pharmacy-login')}>
            <Text style={styles.loginLink}>Already have an account? <Text style={styles.loginLinkBold}>Log In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#0B0B87" />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  backButton: {
    position: 'absolute',
    top: 54,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center", paddingTop: 80, paddingBottom: 100, paddingHorizontal: 30 },
  logoContainer: { alignItems: "center", width: "100%", marginBottom: 10, marginTop: 40 },
  logo: { width: 220, height: 80 },
  helloText: { fontSize: 26, color: "#0B0B87", textAlign: "center", width: "100%", marginBottom: 40, fontWeight: "500" },
  formContainer: { width: "100%", marginBottom: 40, gap: 16 },
  inputWrapper: { flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.4)", borderRadius: 30, paddingHorizontal: 20, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.6)", height: 55 },
  input: { flex: 1, fontSize: 16, color: "#0B0B87", fontWeight: "700" },
  inputIcon: { marginLeft: 10, opacity: 0.8 },
  buttonContainer: { width: "70%", marginBottom: 20, borderRadius: 25, overflow: "hidden", marginTop: 20 },
  signupButton: { paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  signupButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold", fontStyle: "italic", letterSpacing: 1 },
  loginLink: { fontSize: 16, color: "#0B0B87", fontStyle: "italic", fontWeight: "500", marginTop: 10 },
  loginLinkBold: { fontWeight: 'bold' }
});
