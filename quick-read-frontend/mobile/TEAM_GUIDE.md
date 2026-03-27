# Quick-Read Team Development Guide

## Welcome Team Members! 👋

This guide will help you understand the project structure and start contributing.

## 🎯 Your Role

This project has three main user roles. You'll be working on one of them:

### 1. **Patient Team**
- **Branch**: `patient`
- **Responsibilities**:
  - Patient registration and login
  - View prescriptions
  - Order medications
  - Track deliveries
  - Manage patient profile

### 2. **Pharmacy Team**
- **Branch**: `pharmacist` (Already implemented)
- **Screens**:
  - Dashboard with stats
  - Inventory management
  - Orders management
  - Prescription scanner
  - Settings

### 3. **Delivery Team**
- **Branch**: `delivery`
- **Responsibilities**:
  - Delivery personnel registration/login
  - View delivery assignments
  - Update delivery status
  - Route management
  - Delivery history

## 🚀 Getting Started

### Step 1: Clone and Setup
```bash
cd quick-read-frontend
npm install
```

### Step 2: Switch to Your Branch
```bash
# For Patient team
git checkout patient

# For Delivery team
git checkout delivery

# For Pharmacy team
git checkout pharmacist
```

### Step 3: Run the App
```bash
npx expo start
```

## 📁 Where to Add Your Code

### For New Screens
Place your screens in:
```
app/
  ├── screens/
  │   ├── patient/          # Patient-specific screens
  │   ├── delivery/         # Delivery-specific screens
  │   ├── pharmacy/         # Pharmacy-specific screens
  │   └── shared/           # Shared screens
```

### For Tab Navigation (After Login)
Add your tabs in:
```
app/(tabs)/
  ├── patient-tabs/         # Patient tabs
  ├── delivery-tabs/        # Delivery tabs
  └── (existing pharmacy tabs)
```

## 🔧 Common Tasks

### 1. Creating a New Screen
```typescript
// Example: app/screens/patient/PatientDashboard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PatientDashboard() {
  return (
    <View style={styles.container}>
      <Text>Patient Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### 2. Adding Navigation
Update `app/_layout.tsx`:
```typescript
<Stack.Screen name="patient-dashboard" options={{ headerShown: false }} />
```

### 3. Using AsyncStorage for Auth
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
await AsyncStorage.setItem('userToken', 'your_token');
await AsyncStorage.setItem('userRole', 'patient');

// Get data
const token = await AsyncStorage.getItem('userToken');
const role = await AsyncStorage.getItem('userRole');
```

## 🎨 Design Guidelines

### Colors
```typescript
const COLORS = {
  primary: '#4A3F9B',      // Purple
  secondary: '#8B7FE8',    // Light Purple
  patient: '#4A90E2',      // Blue
  pharmacy: '#8B7FE8',     // Purple
  delivery: '#50C878',     // Green
  background: '#F5F5F5',
  text: '#333333',
};
```

### Typography
```typescript
const FONTS = {
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' },
};
```

## 🔄 Git Workflow

### Daily Workflow
```bash
# 1. Pull latest changes
git pull origin patient  # or your branch

# 2. Create feature branch (optional)
git checkout -b patient-prescription-view

# 3. Make your changes

# 4. Commit changes
git add .
git commit -m "Add prescription view screen"

# 5. Push to your branch
git push origin patient
```

### Commit Message Format
```
Add [feature name]
Update [what you updated]
Fix [what you fixed]
Refactor [what you refactored]

Examples:
✅ Add patient prescription list screen
✅ Update patient profile UI
✅ Fix navigation issue in patient dashboard
✅ Refactor patient API calls
```

## 📱 Testing Your Code

### Before Committing, Test:
1. ✅ App starts without errors
2. ✅ Navigation works correctly
3. ✅ All buttons are functional
4. ✅ Forms validate properly
5. ✅ Data saves/loads correctly
6. ✅ No console errors

### Test Commands
```bash
# Clear cache if issues
npx expo start --clear

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

## 🤝 Collaboration

### Role Selection Integration
The entry point (`app/index.tsx`) has role selection. Update the handler:

```typescript
// In app/screens/role-selection/RoleSelectionScreen.tsx
const handleRoleSelection = (role: 'patient' | 'pharmacy' | 'delivery') => {
  switch (role) {
    case 'patient':
      router.push('/patient-login');  // Add your screen
      break;
    case 'pharmacy':
      router.push('/login');  // Already implemented
      break;
    case 'delivery':
      router.push('/delivery-login');  // Add your screen
      break;
  }
};
```

## 📚 Useful Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **Expo Router**: https://expo.github.io/router/docs/
- **AsyncStorage**: https://react-native-async-storage.github.io/async-storage/

## ❓ Common Questions

### Q: Where do I add my login screen?
A: Create it in `app/screens/[your-role]/LoginScreen.tsx`

### Q: How do I navigate between screens?
A: Use Expo Router:
```typescript
import { useRouter } from 'expo-router';
const router = useRouter();
router.push('/screen-name');
```

### Q: How do I share code between roles?
A: Put shared components in `components/` or `app/screens/shared/`

### Q: What if I need help?
A: Ask your team leader or check the main README.md

## 🎉 Ready to Code!

1. Understand your role (Patient/Delivery/Pharmacy)
2. Check out your branch
3. Look at existing pharmacy code for reference
4. Create your screens in the appropriate folders
5. Test thoroughly
6. Commit and push
7. Communicate with your team

Happy coding! 🚀
