import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function DeliveryBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <BlurView intensity={40} tint="light" style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/delivery-home')}>
        {pathname === '/delivery-home' ? (
          <View style={styles.activeIconWrapper}>
            <Ionicons name="home" size={20} color="#8DA3FF" />
          </View>
        ) : (
          <Ionicons name="home" size={26} color="#FFF" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/delivery-notifications')}
      >
        {pathname === '/delivery-notifications' ? (
          <View style={styles.activeIconWrapper}>
            <Ionicons name="notifications" size={20} color="#8DA3FF" />
          </View>
        ) : (
          <Ionicons name="notifications" size={26} color="#FFF" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/delivery-profile')}
      >
        {pathname === '/delivery-profile' ? (
          <View style={styles.activeIconWrapper}>
            <Ionicons name="person" size={20} color="#8DA3FF" />
          </View>
        ) : (
          <Ionicons name="person" size={26} color="#FFF" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/delivery-settings')}
      >
        {pathname === '/delivery-settings' ? (
          <View style={styles.activeIconWrapper}>
            <Ionicons name="settings" size={20} color="#8DA3FF" />
          </View>
        ) : (
          <Ionicons name="settings" size={26} color="#FFF" />
        )}
      </TouchableOpacity>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  activeIconWrapper: {
    backgroundColor: '#FFFFFF',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
});
