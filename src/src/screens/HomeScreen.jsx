import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InfiniteCardSlider from '../components/InfinitySlider'; // Importing the InfiniteCardSlider component
import Navigation from '../components/Navigation';

const HomeScreen = ({ navigation }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const categories = [
    { id: '1', name: 'Weddings', icon: require('../Images/logo.png') },
    { id: '2', name: 'Pujas', icon: require('../Images/logo.png') },
    { id: '3', name: 'Homas', icon: require('../Images/logo.png') },
  ];

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
        {/* Greeting */}
        {/* <Text className="text-2xl font-bold text-center mb-5">Hello, This is Home Screen!</Text> */}

        {/* Search Bar */}
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
                    <FlatList
                      data={categories}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          className="flex-row items-center p-3 border-b border-gray-300"
                          onPress={() => setDropdownVisible(false)}
                        >
                          <Image source={item.icon} className="w-8 h-8 mr-3" />
                          <Text className="text-lg font-medium text-gray-700">{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
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
