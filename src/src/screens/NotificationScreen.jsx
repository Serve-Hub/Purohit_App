import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../components/LoadingIndicator';
import Navigation from '../components/Navigation';
import BASE_URL from '../config/requiredIP';

const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log("UserToken:",token)
        const response = await axios.get(`${BASE_URL}/api/v1/booking/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Update this line to access the notifications array correctly
        setNotifications(response?.data?.data?.notifications || []);
        // console.log('Notifications loaded:', response?.data?.data?.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(
        `${BASE_URL}/api/v1/booking/notifications/mark-all-as-read`,
        {
          isRead: 'true'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json',
          },
        }
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      className={`flex-row items-center p-4 border-b border-gray-200 ${
        !item.isRead ? 'bg-gray-100' : ''
      }`}
      onPress={() => {
        markAsRead(item._id);
        navigation.navigate('NotificationDetail', { notification: item });
      }}
    >
      <Ionicons
        name="notifications"
        size={24}
        color={item.isRead ? '#4B5563' : '#2563EB'}
        style={{ marginRight: 12 }}
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold mb-1">{item.type}</Text>
        <Text className="text-gray-600 mb-1">{item.message}</Text>
        {item.relatedModel && item.relatedId && (
          <Text className="text-blue-500 mb-1">Related to: {item.relatedModel}</Text>
        )}
        <Text className="text-gray-600 text-sm">Status: {item.status}</Text>
        <Text className="text-gray-400 text-xs">
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Navigation navigation={navigation}>
      <View className="flex-1  bg-white">
        {loading ? (
          <LoadingIndicator />
        ) : notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="notifications-off" size={50} color="#9CA3AF" />
            <Text className="text-lg text-gray-500 mt-2">No notifications yet!</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderNotificationItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </Navigation>
  );
};

export default Notification;