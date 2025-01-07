import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'; // Import axios for API requests
import Navigation from '../components/Navigation'; // Import Navigation

const Services = ({ navigation }) => {
  return (
    <Navigation navigation={navigation}>
      <SafeAreaView className='flex-1'>

        <Text className='text-2xl font-bold text-center'>Hello, This is Service Screen!</Text>
      </SafeAreaView>
    </Navigation>
  );
};

export default Services;
