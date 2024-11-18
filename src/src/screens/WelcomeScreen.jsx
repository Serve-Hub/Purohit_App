import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import logo from '../Images/logo.png';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      {/* Logo */}
      <Image
        source={logo}
        style={{ width: 150, height: 150, marginBottom: 40 }}
      />

      {/* Welcome Text */}
      <Text className="text-indigo-600 text-3xl font-bold mb-3">Welcome to Purohit</Text>
      <Text className="text-gray-700 text-base text-center italic mb-8 px-4">
        "Explore the mysteries of the cosmos and find your true path."
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        className="bg-indigo-600 w-full py-4 rounded-full mb-4 shadow-lg"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-white text-center text-lg font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
