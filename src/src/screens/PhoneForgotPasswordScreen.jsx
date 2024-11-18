import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';



const PhoneForgotPassword = ({ route, navigation }) => {
    const [code, setCode] = useState(""); // Store the entire code
    const inputRef = useRef(null); // Ref for the hidden input

    // const { token, email } = route.params;
    const [isSendVisible, setIsSendVisible] = useState(true); // "Send code" button is initially visible
    const [isResendVisible, setIsResendVisible] = useState(false); // "Resend code" button is initially hidden
    const [otpSent, setOtpSent] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('NP');
    const [callingCode, setCallingCode] = useState('+977');
    const [isValid, setIsValid] = useState(true);
    const [isPickerVisible, setPickerVisible] = useState(false);

    const handleInputChange = (text) => {
        // Restrict the input to 4 digits
        if (text.length <= 4) {
            setCode(text);
        }
    };

    // Phone number Validation
    const validatePhoneNumber = (text, callingCode) => {
        console.log(callingCode, text)
        setPhoneNumber(`${callingCode}${text}`); // Combine calling code with phone number
        // Basic phone number validation (checks for 10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        setIsValid(phoneRegex.test(text)); // Check only the entered digits, without calling code
    };

    // console.log(token, email);
    // // Mutation to send or resend OTP
    // const sendOtpMutation = useMutation({
    //     mutationFn: async ({ email, token, isResend }) => {

    //         // Use different endpoints depending on whether it's a send or resend action
    //         const endpoint = isResend
    //             ? 'http://192.168.1.4:6000/api/v1/users/register/verifyOTP/resendOTPCode'
    //             : 'http://192.168.1.4:6000/api/v1/users/register/sendEmailOTP';


    //         return axios.post(
    //             endpoint,
    //             { email, token },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    //     },
    //     onSuccess: (response) => {
    //         console.log("OTP sent successfully:");
    //         Alert.alert("Success", "OTP sent to your email address.");
    //         // Set the flag to true after sending OTP
    //         setOtpSent(true);
    //     },
    //     onError: (error) => {
    //         console.error("Error:", error.response?.data || error.message);
    //         Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
    //     }

    // });

    // // Function to send OTP
    // const sendOTP = async (isResend = false) => {
    //     if (email && token) {
    //         sendOtpMutation.mutate({ email, token,  isResend});


    //         setIsSendVisible(false); // Hide the "Send code" button after pressing it
    //         setIsResendVisible(true); // Show the "Resend code" button after pressing "Send code"
    //     }
    // };

    // const verifyOtpMutation = useMutation({
    //     mutationFn: async (userdata) => {
    //         return axios.post(
    //             'http://192.168.1.4:6000/api/v1/users/register/verifyOTP', // Replace with your actual verification endpoint
    //             userdata,
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    //     },
    //     onSuccess: (response) => {
    //         console.log("OTP verified successfully:");
    //         Alert.alert("Success", "Registration Successful!");
    //         navigation.navigate("Login");
    //     },
    //     onError: (error) => {
    //         console.error("Error verifying OTP:", error.response?.data || error.message);
    //         Alert.alert("Error", "OTP verification failed. Please try again.");
    //     },
    // });

    // // Function to handle OTP submission
    // const handleSubmit = async () => {
    //     const userdata = {
    //         otp: code,
    //         token: token,
    //     };

    //     // Call the verify OTP mutation
    //     verifyOtpMutation.mutate(userdata);
    // };
    const handleSubmit = () => { }
    return (


        <View className="flex-1 justify-center items-center px-5 bg-white ">
            <Text className="text-2xl font-bold text-center mb-4">Enter your Mobile number</Text>

            {/* Phone Number Input */}
            <View className="flex-row items-center border border-borders rounded-lg px-3 py-2 mb-4 w-full">
                {/* Country Picker */}
                <TouchableOpacity onPress={() => setPickerVisible(true)} className="flex-row items-center mr-3">
                    <CountryPicker
                        countryCode={countryCode}
                        withFilter
                        withFlag
                        withCallingCode
                        withEmoji
                        onSelect={(country) => {
                            setCountryCode(country.cca2);
                            setCallingCode(country.callingCode[0]);
                        }}
                        visible={isPickerVisible}
                        onClose={() => setPickerVisible(false)}
                    />
                    <Text className="ml-1">{callingCode}</Text>
                </TouchableOpacity>

                {/* Phone Number Input Field */}
                <TextInput
                    className="flex-1 text-lg py-1 px-2"
                    placeholder="Enter your mobile number"
                    keyboardType="numeric"
                    value={phoneNumber.replace(`${callingCode}`, '')}  // Display number without `+` and calling code
                    onChangeText={(text) => validatePhoneNumber(text, callingCode)}
                />
            </View>
            {!isValid && (
                <Text className="text-error-message text-sm mb-2">This phone number is invalid</Text>
            )}

            <View>
                {/* "Send code" button */}
                {isSendVisible && (
                    <TouchableOpacity onPress={() => sendOTP(false)}>
                        <Text className="text-blue-500 font-bold text-sm mb-8">Send code</Text>
                    </TouchableOpacity>
                )}

                {/* "Resend code" button */}
                {isResendVisible && (
                    <View>
                        <Text className="text-center font-semibold text-gray-500 text-sm mb-9">
                            A 4-digit code was sent to your Email.
                        </Text>
                        <TouchableOpacity onPress={() => sendOTP(true)} accessible={true} accessibilityLabel="Resend code">
                            <Text className="text-center text-blue-500 font-bold text-sm mb-8">Resend code</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>

            <Text className="text-2xl font-bold text-center mb-4">Enter OTP</Text>

            {/* Hidden input for entering the entire OTP */}
            <TextInput
                ref={inputRef}
                className="opacity-0 absolute"
                maxLength={4}
                keyboardType="numeric"
                value={code}
                onChangeText={handleInputChange}
                autoFocus={true} // Automatically focus the input
            />

            {/* Box design with the code split across the boxes */}
            <View className="flex-row justify-between mb-10 w-3/4" onPress={() => inputRef.current.focus()}>
                {Array(4).fill('').map((_, index) => (
                    <View
                        key={index}
                        className="border border-gray-500 rounded-lg w-12 h-12 justify-center items-center">
                        <Text className="text-xl">{code[index] || ""}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity className="bg-blue-500 py-3 px-20 rounded-lg mb-4" onPress={handleSubmit}>
                <Text className="text-white text-lg text-center font-bold">Confirm</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center w-full mb-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="text-gray-600 px-2">Or</Text>
                <View className="flex-1 h-px bg-gray-300" />
            </View>

            <TouchableOpacity className="bg-blue-500 w-full py-3 rounded-lg flex-row items-center mb-3" onPress={() => navigation.navigate('EmailForgotPassword')}>
                <View className="w-1/6 flex items-center">
                    <FontAwesome name="envelope" size={30} color="white" />
                </View>
                <View className="w-5/6">
                    <Text className="text-white text-center text-lg font-semibold">Continue with Email</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default PhoneForgotPassword;
