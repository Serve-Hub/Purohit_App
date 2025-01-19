import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';

const Navigation = ({ navigation, children }) => {
  const [navItem, setNavItem] = useState('Home'); // State to track the active item

  // Get the current active route name using useNavigationState
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  // Sync state with current route on navigation change
  useEffect(() => {
    setNavItem(currentRoute);
  }, [currentRoute]);

  const handleNavPress = (item) => {
    navigation.navigate(item);
  };

  const navItems = [
    { name: 'Home', icon: 'home-outline' },
    { name: 'Calendar', icon: 'calendar-outline' },
    { name: 'Inbox', icon: 'mail-outline' },
    { name: 'Notification', icon: 'notifications-outline' },
    { name: 'Profile', icon: 'person-outline' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-orange-500">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-orange-500">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="flex-row items-center bg-white px-3 py-2 rounded-full shadow-md">
            <Ionicons name="home-outline" size={20} color="black" />
            <Text className="mx-2 text-base text-black">/</Text>
            <Text className="text-base font-bold text-red-500">{navItem}</Text>
          </View>
        </View>
      </View>

      {/* Main Content (Children will be rendered here) */}
      <View className="flex-1">{children}</View>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around py-3 bg-amber-200 border-t border-gray-300 shadow-lg">
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            className="items-center"
            onPress={() => handleNavPress(item.name)}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={navItem === item.name ? 'red' : 'black'}
              className="mb-1"
            />
            <Text
              className={`mt-1 text-xs font-medium ${
                navItem === item.name ? 'text-red-500' : 'text-black'
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Navigation;
