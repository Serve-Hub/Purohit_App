import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InfiniteCardSlider from '../components/InfinitySlider';
import Navigation from '../components/Navigation';
import BASE_URL from '../config/requiredIP';
import LoadingIndicator from '../components/LoadingIndicator';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories with async/await
  useEffect(() => {
    const fetchPujas = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        const response = await axios.get(`${BASE_URL}/api/v1/admin/getPujas`);
        const pujas = response.data?.data?.pujas;
        // console.log("response is",response)
        // console.log('Fetched categories:', response.data?.data?.pujas); // Debugging log
        if (response.data?.success && pujas) {
          setCategories(pujas); // Update state with fetched data
          console.log('Fetched Categories:', pujas); // Log fetched pujas
        } else {
          console.warn('Unexpected response structure or no pujas found');
          setCategories([]); // Handle empty or unexpected data
        }
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        setError(error.message || 'An error occurred'); // Set error for UI display
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPujas();
  }, []);

  const upcomingEvents = [
    { id: '1', title: 'Event 1', color: '#FFC1C1' },
    { id: '2', title: 'Event 2', color: '#C1FFC1' },
    { id: '3', title: 'Event 3', color: '#C1C1FF' },
  ];

  const featuredPandits = [
    { id: '1', title: 'Pandit Sharma', color: '#FFD700' },
    { id: '2', title: 'Pandit Verma', color: '#FFB6C1' },
    { id: '3', title: 'Pandit Gupta', color: '#90EE90' },
  ];

  return (
    <Navigation navigation={navigation}>
      <SafeAreaView className="flex-1 bg-amber-100 p-4">
        <View className="mt-1 mb-4">
          <TextInput
            placeholder="Search for Pandits or Services"
            className="bg-white p-3 rounded-lg shadow-md border border-yellow-300 text-yellow-800 placeholder-yellow-500"
          />
        </View>

        {/* Categories Dropdown */}
        <TouchableOpacity
          className="bg-orange-500 py-2 px-4 rounded-lg items-center mb-4"
          onPress={() => setDropdownVisible(!isDropdownVisible)}
        >
          <Text className="text-white text-lg font-semibold">Select Category</Text>
        </TouchableOpacity>

        {isDropdownVisible && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={isDropdownVisible}
            onRequestClose={() => setDropdownVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
              <View className="flex-1 justify-center bg-black/50">
                <TouchableWithoutFeedback>
                  <View className="bg-white rounded-lg p-4 mx-auto w-4/5 shadow-lg">
                    {loading ? (
                      <View className="flex justify-center items-center h-32">
                        <LoadingIndicator />
                        <Text className="text-gray-500 mt-2">Loading categories...</Text>
                      </View>
                    ) : error ? (
                      <Text className="text-center text-red-500">{error}</Text>
                    ) : categories.length > 0 ? (
                      <FlatList
                        data={categories}
                        keyExtractor={(item) => item._id}

                        renderItem={({ item }) => (
                          <TouchableOpacity
                            className="flex-row items-center mb-4"
                            onPress={() => {
                              console.log(`Category clicked: ${item.pujaName} with basefee of ${item.baseFare}`);
                              navigation.navigate("BookingForm", {
                                pujaId: item._id,
                                puja: item.pujaName,
                                baseFee: item.baseFare,
                              });
                              setDropdownVisible(false);
                            }}
                          >
                            <Image
                              source={{ uri: item.pujaImage }}
                              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                            />
                            <View>
                              <Text className="text-lg font-bold">{item.pujaName}</Text>
                              <Text className="text-sm text-gray-500">{item.category}</Text>
                              <Text className="text-sm text-gray-400">{item.description}</Text>
                              {/* <Text className="text-sm text-gray-400">{item.baseFare}</Text> */}
                            </View>
                          </TouchableOpacity>
                        )}
                      />

                    ) : (
                      <Text className="text-center text-gray-500">No categories found.</Text>
                    )}

                    <TouchableOpacity
                      className="absolute top-3 right-3"
                      onPress={() => setDropdownVisible(false)}
                    >
                      <Ionicons name="close-outline" size={40} color="#000" />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

        {/* Upcoming Events Slider */}
        <View className="flex-row items-center justify-between my-3">
          <Text className="text-xl font-bold text-gray-700">Upcoming Events</Text>
          <TouchableOpacity onPress={() => console.log('Upcoming Events arrow clicked')}>
            <Ionicons name="arrow-forward-outline" size={24} color="#444" />
          </TouchableOpacity>
        </View>
        <InfiniteCardSlider data={upcomingEvents} />

        {/* Featured Pandits Slider */}
        <View className="flex-row items-center justify-between my-3">
          <Text className="text-xl font-bold text-gray-700">Featured Pandits</Text>
          <TouchableOpacity onPress={() => console.log('Featured Pandits arrow clicked')}>
            <Ionicons name="arrow-forward-outline" size={24} color="#444" />
          </TouchableOpacity>
        </View>
        <InfiniteCardSlider data={featuredPandits} />
      </SafeAreaView>
    </Navigation>
  );
};

export default HomeScreen;
