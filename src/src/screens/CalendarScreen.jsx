import React from 'react';
import { View, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navigation from '../components/Navigation';

const Calendar = ({ navigation }) => {
  return (
    <Navigation navigation={navigation}>
      <SafeAreaView className='flex-1'>

        <Text className='text-2xl font-bold text-center'>Hello, This is Calender Screen!</Text>
      </SafeAreaView>
    </Navigation>
  );
};

export default Calendar;