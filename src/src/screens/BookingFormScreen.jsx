import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import data from '../config/address';
import { Icon } from 'react-native-elements';
import BASE_URL from '../config/requiredIP';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userToken } from '../constants/Token';
const BookingForm = ({ route, navigation }) => {
    const { puja, baseFee, pujaId } = route.params;
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [purpose, setPurpose] = useState('');
    const [baseFare, setBaseFare] = useState('');
    const [addressInfo, setAddressInfo] = useState({
        province: null,
        district: null,
        municipality: null,
        address: '',
    });

    useEffect(() => {
        if (baseFee) {
            setBaseFare(baseFee.toString()); // Ensure it's a string for the TextInput
        }
        if (puja) {
            setPurpose(puja);
        }
    }, [baseFee, puja]); // Both dependencies should be in the same array



    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate); // Store the raw Date object
        }
    };

    const validateDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }

    const validateTime = (time) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime() ? time >= today : true;
    }

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };
    const formatTime = (time) => {
        let hours = time.getHours();
        const minutes = time.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero to minutes if needed
        return `${hours}:${formattedMinutes} ${period}`;
    };

    const handleInputChange = (field, value) => {
        setAddressInfo((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'province' && { district: null, municipality: null }),
            ...(field === 'district' && { municipality: null }),
        }));
    };

    const handleSubmit = async () => {
        if (!date || !time || !purpose || !addressInfo.province || !addressInfo.district || !addressInfo.municipality || !addressInfo.address || !baseFare) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        // Format the date and time
        const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;

        // Format the time as a string (e.g., "01:00 PM")
        const formattedTime = formatTime(time); // Use the formatTime function here

        const formData = {
            date: formattedDate,
            time: formattedTime,
            province: addressInfo.province,
            district: addressInfo.district,
            municipality: addressInfo.municipality,
            tollAddress: addressInfo.address, // Mapping `address` to `tollAddress`.
            amount: parseFloat(baseFare), // Ensure `amount` is a number.
        };

        console.log('Request Data:', JSON.stringify(formData, null, 2));

        try {
            const token = await AsyncStorage.getItem(userToken);
            if (!token) {
                Alert.alert('Error', 'User token is missing!');
                return;
            }

            console.log('Token:', token);

            const response = await axios.post(
                `${BASE_URL}/api/v1/booking/bookings/${pujaId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data?.success) {
                Alert.alert(
                    'Booking Confirmed',
                    `Thank you! Your booking is confirmed for ${purpose} on ${formData.date} at ${formattedTime}.`
                );

                setDate(new Date());
                setTime(new Date());
                setPurpose('');
                setBaseFare('');
                setAddressInfo({ province: null, district: null, municipality: null, address: '' });
                navigation.navigate("HomeScreen");
            } else {
                Alert.alert('Error', response.data?.message || 'Something went wrong!');
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong!');
        }
    };





    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#444" />
                    </TouchableOpacity>
                    <Text style={styles.heading}>Booking Form</Text>
                </View>

                <Text style={styles.label}>Date</Text>
                <Text style={styles.input} onPress={() => setShowDatePicker(true)}>
                    {`${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`}
                </Text>
                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Text style={styles.label}>Time</Text>
                <Text style={styles.input} onPress={() => setShowTimePicker(true)}>
                    {`${time.getHours() % 12 || 12}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()} ${time.getHours() >= 12 ? 'PM' : 'AM'}`}
                </Text>
                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}

                <Text style={styles.label}>Province</Text>
                <RNPickerSelect
                    onValueChange={(value) => handleInputChange('province', value)}
                    items={data.provinces.map((province) => ({
                        label: province.name,
                        value: province.name,
                    }))}
                    placeholder={{ label: 'Select a province', value: null }}
                    value={addressInfo.province}
                />

                <Text style={styles.label}>District</Text>
                <RNPickerSelect
                    onValueChange={(value) => handleInputChange('district', value)}
                    items={
                        data.provinces
                            .find((province) => province.name === addressInfo.province)?.districts.map((district) => ({
                                label: district.name,
                                value: district.name,
                            })) || []
                    }
                    placeholder={{ label: 'Select a district', value: null }}
                    value={addressInfo.district}
                />

                <Text style={styles.label}>Municipality</Text>
                <RNPickerSelect
                    onValueChange={(value) => handleInputChange('municipality', value)}
                    items={
                        data.provinces
                            .find((province) => province.name === addressInfo.province)?.districts
                            .find((district) => district.name === addressInfo.district)?.municipalities.map((municipality) => ({
                                label: municipality,
                                value: municipality,
                            })) || []
                    }
                    placeholder={{ label: 'Select a municipality', value: null }}
                    value={addressInfo.municipality}
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your address"
                    value={addressInfo.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                />

                <Text style={styles.label}>Purpose</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter purpose (e.g., Wedding, Puja) "
                    value={purpose}
                    editable={false}
                    onChangeText={setPurpose}
                />
                <Text style={styles.label}>Booking Charge</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Rs. 0.0"
                    value={baseFare}
                    onChangeText={setBaseFare}
                />

                <View style={styles.buttonContainer}>
                    <Button title="Submit" color="#e67e22" onPress={handleSubmit} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#f4f1e9',
        padding: 20,
        paddingTop: 40,
    },
    header: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#444',
    },

    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 20,
        backgroundColor: '#f4f1e9',
    },
});

export default BookingForm;
