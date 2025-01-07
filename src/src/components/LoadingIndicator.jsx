import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingIndicator = () => {
  return (
    <View className=" justify-center items-center">
      <View className="p-3 bg-white rounded-lg shadow-lg">
        <ActivityIndicator size="large" color="#e67e22" />
      </View>
    </View>
  );
};

export default LoadingIndicator;
