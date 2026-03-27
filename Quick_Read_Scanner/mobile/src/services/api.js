import axios from 'axios';
import { Platform } from 'react-native';

// ── Change this to your computer IP ───────────────────
const API_BASE = 'http://10.47.10.249:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Accept': 'application/json' },
});

// ── Scan prescription image ────────────────────────────
export async function scanPrescription(imageUri) {
  const safeUri = Platform.OS === 'android' && !imageUri.startsWith('file://') && !imageUri.startsWith('http')
    ? `file://${imageUri}`
    : imageUri;

  const formData = new FormData();
  formData.append('file', {
    uri:  safeUri,
    type: 'image/jpeg',
    name: 'prescription.jpg',
  });

  const response = await api.post('/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// ── Manual scan (returns word list for user selection) ─
export async function scanManual(imageUri) {
  const safeUri = Platform.OS === 'android' && !imageUri.startsWith('file://') && !imageUri.startsWith('http')
    ? `file://${imageUri}`
    : imageUri;

  const formData = new FormData();
  formData.append('file', {
    uri:  safeUri,
    type: 'image/jpeg',
    name: 'prescription.jpg',
  });

  const response = await api.post('/scan/manual', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// ── Check single drug word ─────────────────────────────
export async function checkDrug(word) {
  const response = await api.post(`/check-drug?word=${encodeURIComponent(word)}`);
  return response.data;
}

// ── Health check ───────────────────────────────────────
export async function checkHealth() {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch {
    return { status: 'error' };
  }
}