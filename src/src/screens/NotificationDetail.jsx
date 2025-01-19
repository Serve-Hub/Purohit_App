import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const NotificationDetail = ({ navigation, route }) => {
    const { notification } = route.params;

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4 pt-10 bg-amber-100">
                {/* Header with Back Arrow */}
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold flex-1 text-center">
                        Notification Details
                    </Text>
                </View>

                {/* Box-like Container for Details */}
                <View className="bg-amber-200 p-4 rounded-lg shadow-md">
                    <View className="mb-3">
                        <Text className="text-base font-semibold text-gray-800">Type:</Text>
                        <Text className="text-base text-gray-600 mt-1">{notification.type}</Text>
                    </View>
                    <View className="mb-3">
                        <Text className="text-base font-semibold text-gray-800">Message:</Text>
                        <Text className="text-base text-gray-600 mt-1">{notification.message}</Text>
                    </View>
                    <View className="mb-3">
                        <Text className="text-base font-semibold text-gray-800">Status:</Text>
                        <Text className="text-base text-gray-600 mt-1">{notification.status}</Text>
                    </View>
                    <View className="mb-3">
                        <Text className="text-base font-semibold text-gray-800">Created At:</Text>
                        <Text className="text-base text-gray-600 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-base font-semibold text-gray-800">Updated At:</Text>
                        <Text className="text-base text-gray-600 mt-1">
                            {new Date(notification.updatedAt).toLocaleString()}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default NotificationDetail;
