import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from 'react-native-picker-select';
import data from '../config/address';
import BASE_URL from '../config/requiredIP';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userToken, verificationToken } from '../constants/Token';

const initialLayout = { width: Dimensions.get('window').width };

const KYCForm = ({ navigation}) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      // name: "",
      // email: "",
      phone: "",
      dob: "",
    },
    addressInfo: {
      province: "",
      district: "",
      municipality: "",
      address: "",
      pmProvince: "",
      pmDistrict: "",
      pmMunicipality: "",
      pmAddress: "",
    },
    educationInfo: {
      experience: "",
      qualification: "",
      institute: "",
      // service: "",
      // language: "",
    },
    documentInfo: {
      citizenshipFront: null,
      citizenshipBack: null,
      certificate: null,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const { citizenshipFront, citizenshipBack, certificate } = formData.documentInfo;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'personalInfo', title: 'Personal' },
    { key: 'addressInfo', title: 'Address' },
    { key: 'educationInfo', title: 'Education' },
    { key: 'documentInfo', title: 'Document' },
  ]);

  const validateForm = () => {
    const requiredFields = [
      // formData.personalInfo?.name,
      // formData.personalInfo?.email,
      formData.personalInfo?.phone,
      formData.personalInfo?.dob,

      formData.addressInfo?.province,
      formData.addressInfo?.district,
      formData.addressInfo?.municipality,
      formData.addressInfo?.address,
      formData.addressInfo?.pmProvince,
      formData.addressInfo?.pmDistrict,
      formData.addressInfo?.pmMunicipality,
      formData.addressInfo?.pmAddress,
      formData.educationInfo?.experience,
      formData.educationInfo?.qualification,
      formData.educationInfo?.institute,
      // formData.educationInfo?.service,
      // formData.educationInfo?.language,
      formData.documentInfo?.citizenshipFront,
      formData.documentInfo?.citizenshipBack,
      formData.documentInfo?.certificate,
    ];

    if (requiredFields.some(field => !field)) {
      return false;
    }

    return true;
  };

  const validateDOB = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) {
      return "Date of Birth cannot be in the future";
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 16) {
      return "User must be at least 16 years old";
    }

    return true;
  };


  const handleInputChange = (tab, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [tab]: {
        ...prevData[tab],
        [field]: value,
      },
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          dob: selectedDate,
        },
      }));
    }
  };

  const handleCopy = () => {
    console.log("Copy button clicked");
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        addressInfo: {
          ...prevFormData.addressInfo,
          pmProvince: prevFormData.addressInfo.province,
          pmDistrict: prevFormData.addressInfo.district,
          pmMunicipality: prevFormData.addressInfo.municipality,
          pmAddress: prevFormData.addressInfo.address,
        },
      };
      // console.log("Updated Form Data", updatedFormData);
      return updatedFormData;
    });
  };

  // const convertImageToBlob = async (imageUri) => {
  //   try {
  //     const response = await fetch(imageUri);
  //     const blob = await response.blob();
  //     return blob;
  //   } catch (error) {
  //     console.error("Error converting image to blob:", error);
  //   }
  // };
  
  const handleSubmit = async () => {
    try {
      // Validate the form
      const isFormValid = validateForm();
      if (!isFormValid) {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }
  
      // Validate DOB
      const dobValidationResult = validateDOB(formData.personalInfo.dob);
      if (dobValidationResult !== true) {
        Alert.alert("Error", dobValidationResult); // If DOB is invalid, show the error
        return;
      }
  
      // Format the date of birth
      const dob = new Date(formData.personalInfo.dob);
      const formattedDob = {
        day: dob.getUTCDate(),
        month: dob.getUTCMonth() + 1,
        year: dob.getUTCFullYear(),
      };
  
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Authentication token is missing!");
        return;
      }
  
      const requestData = new FormData();
  
      // Personal Info
      requestData.append("phoneNumber", formData.personalInfo.phone);
      requestData.append("day", formattedDob.day);
      requestData.append("month", formattedDob.month);
      requestData.append("year", formattedDob.year);
  
      // Address Info
      requestData.append("province", formData.addressInfo.province);
      requestData.append("district", formData.addressInfo.district);
      requestData.append("municipality", formData.addressInfo.municipality);
      requestData.append("tolAddress", formData.addressInfo.address);
      requestData.append("pmProvince", formData.addressInfo.pmProvince);
      requestData.append("pmDistrict", formData.addressInfo.pmDistrict);
      requestData.append("pmMun", formData.addressInfo.pmMunicipality);
      requestData.append("pmToladdress", formData.addressInfo.pmAddress);
  
      // Education Info
      requestData.append("qualification", formData.educationInfo.qualification);
      requestData.append("experience", formData.educationInfo.experience);
      requestData.append("institution", formData.educationInfo.institute);
  
      // Append image URIs instead of converting to Blob
      if (formData.documentInfo.citizenshipFront) {
        const frontUri = formData.documentInfo.citizenshipFront.uri;
        requestData.append("citizenshipFrontPhoto", { uri: frontUri, name: "citizenshipFront.jpg", type: "image/jpeg" });
      }
  
      if (formData.documentInfo.citizenshipBack) {
        const backUri = formData.documentInfo.citizenshipBack.uri;
        requestData.append("citizenshipBackPhoto", { uri: backUri, name: "citizenshipBack.jpg", type: "image/jpeg" });
      }
  
      if (formData.documentInfo.certificate) {
        const certificateUri = formData.documentInfo.certificate.uri;
        requestData.append("qcertificate", { uri: certificateUri, name: "certificate.jpg", type: "image/jpeg" });
      }
  
      // Log FormData contents (including image URIs)
      const jsonifyFormData = (formData) => {
        const jsonObject = {};
        formData.forEach((value, key) => {
          if (value instanceof Object && value.uri) {
            jsonObject[key] = {
              uri: value.uri || "unknown",
              name: value.name || "unknown",
              type: value.type || "unknown",
            };
          } else {
            jsonObject[key] = value;
          }
        });
        return jsonObject;
      };
  
      // Log FormData as JSON
      console.log("FormData JSON:", JSON.stringify(jsonifyFormData(requestData), null, 2));
  
      // Make the API call
      const response = await axios.post(
        `${BASE_URL}/api/v1/kyp/fillKYP`,
        // "http://192.168.1.64:6000/api/v1/kyp/fillKYP",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // Handle the response
      if (response.data?.success) {
        Alert.alert("Success", "Purohit added successfully! Please wait to be verified by the system.");
        navigation.navigate("HomeScreen");
      } else {
        Alert.alert("Error", response.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", error.response?.data?.message ||"Something went wrong!");
    }
  };

  // console.log(formData.personalInfo.dob);

  const pickMedia = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: "photo",
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        documentInfo: {
          ...prevFormData.documentInfo,
          [field]: { uri: result.assets[0].uri }, // Update the document field with selected URI
        },
      }));

    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        documentInfo: {
          ...prevFormData.documentInfo,
          [field]: null, // Reset to null if canceled or invalid
        },
      }));
    }
  };

  const handleRemove = (field) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      documentInfo: {
        ...prevFormData.documentInfo,
        [field]: null, // Reset the document field
      },
    }));
  };

  const renderTab = ({ route }) => {
    switch (route.key) {
      case 'personalInfo':
        return (
          <ScrollView style={styles.scene}>
            {/* <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.personalInfo.name}
                onChangeText={(text) => handleInputChange("personalInfo", "name", text)}
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.personalInfo.email}
                onChangeText={(text) => handleInputChange("personalInfo", "email", text)}
                keyboardType="email-address"
              /> */}

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.personalInfo.phone}
              onChangeText={(text) => handleInputChange("personalInfo", "phone", text)}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Date of Birth</Text>
            <View style={styles.datePickerContainer}>
              <Text style={styles.dateText}>
                {formData.personalInfo.dob
                  ? formData.personalInfo.dob.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "Select a date"}
              </Text>
              <Button title="Select Date" onPress={() => setShowDatePicker(true)} />

            </View>
            {showDatePicker && (
              <DateTimePicker
                value={formData.personalInfo.dob || new Date()} // Default to current date if `dob` is null
                mode="date"
                onChange={handleDateChange}
              />
            )}
          </ScrollView>
        );

      case 'addressInfo':
        return (
          <ScrollView style={styles.scene}>
            {/* Current Address Section */}
            <Text style={styles.title}>Current Address</Text>

            <Text style={styles.inputLabel}>Province</Text>
            <RNPickerSelect
              style={styles.input}
              onValueChange={(value) => {
                handleInputChange("addressInfo", "province", value);
                handleInputChange("addressInfo", "district", null); // Reset district
                handleInputChange("addressInfo", "municipality", null); // Reset municipality
              }}
              items={data.provinces.map((province) => ({
                label: province.name,
                value: province.name,
              }))}
              placeholder={{ label: "Select a province", value: null }}
              value={formData.addressInfo.province}
            />

            <Text style={styles.inputLabel}>District</Text>
            <RNPickerSelect
              style={styles.input}
              onValueChange={(value) => {
                handleInputChange("addressInfo", "district", value);
                handleInputChange("addressInfo", "municipality", null); // Reset municipality
              }}
              items={data.provinces
                .find((province) => province.name === formData.addressInfo.province)?.districts.map((district) => ({
                  label: district.name,
                  value: district.name,
                })) || []}
              placeholder={{ label: "Select a district", value: null }}
              value={formData.addressInfo.district}
            />

            <Text style={styles.inputLabel}>Municipality</Text>
            <RNPickerSelect
              style={styles.input}
              onValueChange={(value) =>
                handleInputChange("addressInfo", "municipality", value)
              }
              items={data.provinces
                .find((province) => province.name === formData.addressInfo.province)
                ?.districts.find((district) => district.name === formData.addressInfo.district)
                ?.municipalities.map((municipality) => ({
                  label: municipality,
                  value: municipality,
                })) || []}
              placeholder={{ label: "Select a municipality", value: null }}
              value={formData.addressInfo.municipality}
            />

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={formData.addressInfo.address}
              onChangeText={(text) => handleInputChange("addressInfo", "address", text)}
            />

            {/* Permanent Address Section */}
            <View style={styles.currentAddressHeader}>
              <Text style={styles.title}>Permanent Address</Text>
              <Button
                title="Copy Current Address"
                style={styles.copyButton}
                onPress={handleCopy}
              />
            </View>

            <Text style={styles.inputLabel}>Province</Text>
            <RNPickerSelect
              style={styles.input}
              onValueChange={(value) => {
                handleInputChange("addressInfo", "pmProvince", value);
                handleInputChange("addressInfo", "pmDistrict", null); // Reset district
                handleInputChange("addressInfo", "pmMunicipality", null); // Reset municipality
              }}
              items={data.provinces.map((province) => ({
                label: province.name,
                value: province.name,
              }))}
              placeholder={{ label: "Select a province", value: null }}
              value={formData.addressInfo.pmProvince}
            />

            <Text style={styles.inputLabel}>District</Text>
            <RNPickerSelect
              style={styles.input}
              onValueChange={(value) => {
                handleInputChange("addressInfo", "pmDistrict", value);
                handleInputChange("addressInfo", "pmMunicipality", null); // Reset municipality
              }}
              items={data.provinces
                .find((province) => province.name === formData.addressInfo.pmProvince)?.districts.map((district) => ({
                  label: district.name,
                  value: district.name,
                })) || []}
              placeholder={{ label: "Select a district", value: null }}
              value={formData.addressInfo.pmDistrict}
            />

            <Text style={styles.inputLabel}>Municipality</Text>
            <RNPickerSelect
              style={styles.input}
              onValueChange={(value) =>
                handleInputChange("addressInfo", "pmMunicipality", value)
              }
              items={data.provinces
                .find((province) => province.name === formData.addressInfo.pmProvince)
                ?.districts.find((district) => district.name === formData.addressInfo.pmDistrict)
                ?.municipalities.map((municipality) => ({
                  label: municipality,
                  value: municipality,
                })) || []}
              placeholder={{ label: "Select a municipality", value: null }}
              value={formData.addressInfo.pmMunicipality}
            />

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={formData.addressInfo.pmAddress}
              onChangeText={(text) => handleInputChange("addressInfo", "pmAddress", text)}
            />
          </ScrollView>

        );



      case 'educationInfo':
        return (
          <ScrollView style={styles.scene}>
            <Text style={styles.inputLabel}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your years of experience"
              value={formData.educationInfo.experience}
              onChangeText={(text) => handleInputChange("educationInfo", "experience", text)}
            />
            <Text style={styles.inputLabel}>Qualification</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your qualification"
              value={formData.educationInfo.qualification}
              onChangeText={(text) => handleInputChange("educationInfo", "qualification", text)}
            />
            <Text style={styles.inputLabel}>Institute</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Institute"
              value={formData.educationInfo.institute}
              onChangeText={(text) => handleInputChange("educationInfo", "institute", text)}
            />
            {/* <Text style={styles.inputLabel}>Services Offered</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your offered services"
              value={formData.educationInfo.service}
              onChangeText={(text) => handleInputChange("educationInfo", "service", text)}
            />
            <Text style={styles.inputLabel}>Languages Spoken</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your known languages"
              value={formData.educationInfo.language}
              onChangeText={(text) => handleInputChange("educationInfo", "language", text)}
            /> */}
          </ScrollView>
        );

      case 'documentInfo':
        return (
          <ScrollView style={styles.scene}>
            {/* Citizenship Front */}
            <Text style={styles.inputLabel}>Citizenship Front</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => pickMedia("citizenshipFront")}
            >
              <Text style={styles.buttonText}>Pick CitizenshipFront</Text>
            </TouchableOpacity>
            {citizenshipFront?.uri && (
              <View style={styles.mediaContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: citizenshipFront.uri }}
                    style={styles.mediaPreview}
                  />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove("citizenshipFront")}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Citizenship Back */}
            <Text style={styles.inputLabel}>Citizenship Back</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => pickMedia("citizenshipBack")}
            >
              <Text style={styles.buttonText}>Pick CitizenshipBack</Text>
            </TouchableOpacity>
            {citizenshipBack?.uri && (
              <View style={styles.mediaContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: citizenshipBack.uri }}
                    style={styles.mediaPreview}
                  />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove("citizenshipBack")}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Certificate */}
            <Text style={styles.inputLabel}>Certificate</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => pickMedia("certificate")}
            >
              <Text style={styles.buttonText}>Pick Certificate</Text>
            </TouchableOpacity>

            {certificate?.uri && (
              <View style={styles.mediaContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: certificate.uri }}
                    style={styles.mediaPreview}
                  />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove("certificate")}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderTab}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar {...props} style={styles.tabBar} labelStyle={styles.tabLabel} />
        )}
      />
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f1e9", // Matches the tab content background color
  },
  scene: {
    // bottom:20,
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f1e9", // Soft religious beige
  },

  tabBar: {
    backgroundColor: "#e67e22",
    paddingTop: 20,
  },
  indicator: {
    backgroundColor: "#F1C40F", // Gold
    height: 4,
  },
  tab: {
    height: 50,
  },

  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold"
  },

  text: {
    fontSize: 18,
    color: "#2C3E50", // Deep navy for text
    fontWeight: "600",
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C3E50",
    marginBottom: 8,
  },

  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  dateText: {
    fontSize: 16,
    color: "#2C3E50",
  },

  currentAddressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#007BFF", // Blue color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    marginBottom: 40, // Add margin to raise the button slightly above the bottom
    alignItems: "center",
    justifyContent: "center",
  },
  
  buttonText: {
    color: "#ffffff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },

  copyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  mediaContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  mediaPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#ff6b6b",
    borderRadius: 4,
    marginBottom: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 8,
  },
});

export default KYCForm;
