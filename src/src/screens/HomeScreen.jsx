import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({navigation}) => {
  const handlePress = () => {
    navigation.navigate('Services');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text >Hello, Welcome to React Native!</Text>
      <Button title="Press Me" onPress={handlePress} />
    </View>
  );
};

export default HomeScreen;