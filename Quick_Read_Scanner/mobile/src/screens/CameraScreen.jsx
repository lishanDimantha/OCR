import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Image, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { scanPrescription } from '../services/api';

export default function CameraScreen({ navigation }) {
  const [image,   setImage]   = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Gallery picker ─────────────────────────────────────
  const pickFromGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission', 'Gallery access අවශ්‍යයි');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType
        ? [ImagePicker.MediaType.Images]   // new API
        : ImagePicker.MediaTypeOptions.Images, // fallback
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]) {
      setImage(result.assets[0]);
    }
  };

  // ── Test Image ─────────────────────────────────────────
  const loadTestImage = () => {
    // Resolve the URI from the local asset
    const asset = Image.resolveAssetSource(require('../../assets/11.jpg'));
    setImage({ uri: asset.uri, name: '11.jpg', type: 'image/jpeg' });
  };

  // ── Camera ─────────────────────────────────────────────
  const takePhoto = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission', 'Camera access අවශ්‍යයි');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType
        ? [ImagePicker.MediaType.Images]
        : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]) {
      setImage(result.assets[0]);
    }
  };

  // ── Scan ───────────────────────────────────────────────
  const scanImage = async () => {
    if (!image) {
      Alert.alert('⚠️', 'පළමුව photo එකක් select කරන්න');
      return;
    }
    setLoading(true);
    try {
      navigation.navigate('Processing');
      const result = await scanPrescription(image.uri);

      // Manual needed → back to camera with message
      if (result.status === 'manual_needed') {
        navigation.replace('Result', {
          status:     'manual_needed',
          ocr_text:   result.ocr_text  ?? result.message ?? '',
          words:      result.words     ?? [],
          confidence: result.confidence ?? 0,
          prescription: [],
        });
        return;
      }

      // Server error
      if (result.status === 'server_error') {
        navigation.goBack();
        Alert.alert('❌ Server Error', result.message);
        return;
      }

      // Success
      navigation.replace('Result', {
        status:       result.status,
        prescription: result.prescription ?? [],
        ocr_text:     result.ocr_text     ?? '',
        confidence:   result.confidence   ?? 0,
        method:       result.method       ?? '',
      });

    } catch (error) {
      navigation.goBack();
      const msg = error?.response?.data?.detail
                  ?? error?.message
                  ?? 'Error occurred. Try again.';
      Alert.alert('❌ Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescription Scan</Text>

      {/* Image preview */}
      <View style={styles.previewBox}>
        {image ? (
          <Image source={{ uri: image.uri }}
                 style={styles.preview}
                 resizeMode="contain" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📄</Text>
            <Text style={styles.placeholderText}>
              Prescription photo මෙහි පෙනේ
            </Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.btnCamera}
                        onPress={takePhoto}>
        <Text style={styles.btnText}>📷  Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnGallery}
                        onPress={pickFromGallery}>
        <Text style={styles.btnText}>🖼️  Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnTest}
                        onPress={loadTestImage}>
        <Text style={styles.btnText}>🧪  Test 11.jpg</Text>
      </TouchableOpacity>

      {image && (
        <TouchableOpacity
          style={[styles.btnScan, loading && styles.btnDisabled]}
          onPress={scanImage}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>🔍  Scan Prescription</Text>
          }
        </TouchableOpacity>
      )}

      {image && (
        <TouchableOpacity style={styles.btnClear}
                          onPress={() => setImage(null)}>
          <Text style={styles.btnClearText}>✕  Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex:1, padding:20, backgroundColor:'#fff' },
  title:           { fontSize:22, fontWeight:'bold',
                     marginBottom:16, textAlign:'center' },

  previewBox:      { height:240, borderRadius:12,
                     borderWidth:1, borderColor:'#ddd',
                     borderStyle:'dashed', overflow:'hidden',
                     marginBottom:16, backgroundColor:'#f9f9f9' },
  preview:         { width:'100%', height:'100%' },
  placeholder:     { flex:1, justifyContent:'center',
                     alignItems:'center' },
  placeholderIcon: { fontSize:40, marginBottom:8 },
  placeholderText: { color:'#aaa', fontSize:14 },

  btnCamera:       { backgroundColor:'#185FA5', padding:14,
                     borderRadius:10, alignItems:'center',
                     marginBottom:10 },
  btnGallery:      { backgroundColor:'#1D9E75', padding:14,
                     borderRadius:10, alignItems:'center',
                     marginBottom:10 },
  btnTest:         { backgroundColor:'#8B5CF6', padding:14,
                     borderRadius:10, alignItems:'center',
                     marginBottom:10 },
  btnScan:         { backgroundColor:'#534AB7', padding:16,
                     borderRadius:10, alignItems:'center',
                     marginBottom:10 },
  btnDisabled:     { opacity:0.6 },
  btnText:         { color:'#fff', fontSize:16, fontWeight:'600' },

  btnClear:        { padding:10, alignItems:'center' },
  btnClearText:    { color:'#aaa', fontSize:14 },
});