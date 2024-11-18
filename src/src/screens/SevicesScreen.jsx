import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'; // Import axios for API requests

const ServicesScreen = () => {
  const [services, setServices] = useState([]); // State to store services
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://192.168.1.6:6000/services'); // Replace with your actual API URL
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load services.');
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []); // Empty dependency array ensures it runs once on mount

  // Function to display each service card
  const ServiceCard = ({ service }) => {
    const statusColor = service.status === 'Available' ? 'bg-green-500' : 'bg-red-500';

    return (
      <View className="border p-4 mb-4 rounded-lg bg-white shadow-md">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-lg font-bold">{service.name}</Text>
            <Text className="text-gray-500">BA9212320</Text>
            <Text className="mt-2">Pandits</Text>
          </View>
          <Image
            source={{ uri: service.panditImg }}
            className="w-10 h-10 rounded-full"
          />
        </View>

        <View className="mt-4">
          <Text className="mb-1">Status</Text>
          <View className={`py-1 px-2 rounded-full ${statusColor}`}>
            <Text className="text-white">{service.status}</Text>
          </View>
        </View>

        <Text className="mt-4 text-gray-700">Address: {service.address}</Text>
        <Text className="mt-2 text-gray-700">Price: ₹{service.price}</Text>

        <TouchableOpacity className="mt-4 p-2 bg-gray-200 rounded-full">
          <Text className="text-center">Go Review</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-md">
        <TouchableOpacity onPress={() => console.log('Go Back')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-bold">Services</Text>
      </View>

      {/* Results Count */}
      <View className="px-4 mt-4 flex-row justify-between items-center">
        <Text className="text-gray-500">{services.length} results</Text>
        <TouchableOpacity>
          <MaterialIcons name="filter-list" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Loading & Error Handling */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ServiceCard service={item} />}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Bottom Navigation */}
      <View className="flex-row justify-around py-4 bg-white border-t">
        <TouchableOpacity onPress={() => console.log('Go to Home')}>
          <Ionicons name="home-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Go to Services')}>
          <Ionicons name="cube-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Go to Calendar')}>
          <Ionicons name="calendar-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Go to Inbox')}>
          <Ionicons name="mail-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Go to Profile')}>
          <Ionicons name="person-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ServicesScreen;
