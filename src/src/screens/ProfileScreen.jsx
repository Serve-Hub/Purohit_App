import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Alert,
  localStorage
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from '../components/Navigation';

const Profile = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.error('Failed to load profile image', error);
      }
    };

    loadProfileImage();
  }, []);


  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: 'photo',
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      try {
        await AsyncStorage.setItem('profileImage', imageUri);
      } catch (error) {
        console.error('Failed to save profile image', error);
      }
    }
  };

  const handleLongPress = () => {
    Alert.alert('Profile Picture Options', 'Choose an action', [
      { text: 'Update Picture', onPress: pickMedia },
      { text: 'Remove Picture', onPress: async () => {
        setProfileImage(null);
        try {
          await AsyncStorage.removeItem('profileImage');
        } catch (error) {
          console.error('Failed to remove profile image', error);
        }
      }, style: 'destructive' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };


  const menuItems = [
    { icon: 'heart-outline', label: 'Favourites' },
    { icon: 'download-outline', label: 'Downloads' },
    { icon: 'location-on', label: 'Location', type: 'material' },
    { icon: 'delete-outline', label: 'Clear Cache', type: 'material' },
    { icon: 'history', label: 'Clear History', type: 'material' },
    { icon: 'exit-outline', label: 'Log Out', type: 'ion' },
    { icon: 'person-add', label: 'Register as Purohit', type: 'ion', navigateTo: 'KYP' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => item.navigateTo && navigation.navigate(item.navigateTo)}
    >
      {item.type === 'material' ? (
        <MaterialIcons name={item.icon} size={24} color="black" />
      ) : (
        <Ionicons name={item.icon} size={24} color="black" />
      )}
      <Text style={styles.menuText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <Navigation navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            <TouchableWithoutFeedback onLongPress={handleLongPress}>
              <View style={styles.profileImageContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <Ionicons name="person-circle-outline" size={100} color="gray" />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.profileName}>Your Name</Text>
          <Text style={styles.profileEmail}>Your email</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.menuList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </Navigation>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef3c7',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileEmail: {
    color: 'gray',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuList: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});

export default Profile;
