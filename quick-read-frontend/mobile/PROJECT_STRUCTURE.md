# Quick-Read Project Structure

## Overview
Quick-Read is a Smart Pharmacy and Prescription Scanner app with three main user roles: Patient, Pharmacy, and Delivery.

## Project Structure

```
quick-read-frontend/
├── app/                          # Main application screens
│   ├── (tabs)/                   # Tab navigation screens (authenticated users)
│   │   ├── index.tsx            # Pharmacy Dashboard/Home
│   │   ├── profile.tsx          # User Profile
│   │   ├── explore.tsx          # Explore screen
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── screens/                  # Organized screen components (NEW)
│   │   ├── auth/                # Authentication screens
│   │   └── role-selection/      # Role selection components
│   ├── index.tsx                # Role Selection Entry Point
│   ├── login.tsx                # Login & Signup (merged)
│   ├── inventory.tsx            # Inventory Management (Pharmacy)
│   ├── orders.tsx               # Orders Management (Pharmacy)
│   ├── scan-prescription.tsx    # Prescription Scanner (Pharmacy)
│   ├── settings.tsx             # Settings Screen
│   └── _layout.tsx              # Root layout configuration
├── assets/
│   └── images/                  # App images and assets
│       ├── quick-read-logo.png  # Main app logo
│       ├── UI_Background.jpeg   # Background image
│       └── [icon files]         # App icons
├── components/                   # Reusable UI components
├── constants/                    # App constants and themes
├── hooks/                        # Custom React hooks
└── scripts/                      # Utility scripts

## User Roles

### 1. **Patient**
- View and manage prescriptions
- Order medications
- Track delivery status
- (To be implemented by Patient team)

### 2. **Pharmacy** (Current Implementation)
- Dashboard with stats
- Inventory management
- Orders processing
- Prescription scanning
- Settings management

### 3. **Delivery**
- View delivery orders
- Update delivery status
- Route management
- (To be implemented by Delivery team)

## Branch Structure

- `main` - Production-ready code
- `pharmacist` - Pharmacy features development
- `patient` - Patient features development (current branch)
- `delivery` - Delivery features development (future)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI

### Installation
```bash
cd quick-read-frontend
npm install
```

### Running the App
```bash
npx expo start
```

### Development Workflow
1. Create a branch for your role (patient/delivery/pharmacist)
2. Work on your features in `app/` or `app/screens/`
3. Test thoroughly
4. Commit with clear messages
5. Push to your branch
6. Create a pull request for review

## Key Files

- **app/index.tsx** - Role selection screen (entry point)
- **app/login.tsx** - Authentication screen (login + signup)
- **app/(tabs)/index.tsx** - Main dashboard after login
- **app/_layout.tsx** - Root navigation configuration

## Assets

Only essential assets are kept:
- `quick-read-logo.png` - App logo
- `UI_Background.jpeg` - Background image
- Icon files for app deployment

## Team Guidelines

1. **File Naming**: Use kebab-case for files (e.g., `scan-prescription.tsx`)
2. **Component Naming**: Use PascalCase for components (e.g., `RoleSelectionScreen`)
3. **Commits**: Use clear, descriptive commit messages
4. **Code Style**: Follow the existing ESLint configuration
5. **Testing**: Test on both iOS and Android before pushing

## Common Commands

```bash
# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Check for errors
npm run lint

# Clear cache
npx expo start --clear
```

## Contact
For questions about the project structure, contact the team leader.
