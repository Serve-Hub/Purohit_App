import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Alert } from 'react-native';
import BASE_URL from '../config/requiredIP';
import { verificationToken } from '../constants/Token';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EmailConfirmation = ({ route, navigation }) => {
    const [code, setCode] = useState(""); // Store the entire code
    const inputRef = useRef(null); // Ref for the hidden input

    const handleInputChange = (text) => {
        // Restrict the input to 4 digits
        if (text.length <= 4) {
            setCode(text);
        }
    };

    const { token, email } = route.params;
    const [isSendVisible, setIsSendVisible] = useState(true); // "Send code" button is initially visible
    const [isResendVisible, setIsResendVisible] = useState(false); // "Resend code" button is initially hidden
    const [otpSent, setOtpSent] = useState(false);

    console.log(token, email);

    // Mutation to send or resend OTP
    const sendOtpMutation = useMutation({
        mutationFn: async ({ email, token, isResend }) => {

            // Use different endpoints depending on whether it's a send or resend action
            const endpoint = isResend
                ? `${BASE_URL}/api/v1/users/register/verifyOTP/resendOTPCode`
                // ? 'http://192.168.1.6:6000/api/v1/users/register/verifyOTP/resendOTPCode'
                : `${BASE_URL}/api/v1/users/register/sendEmailOTP`;
            // : 'http://192.168.1.6:6000/api/v1/users/register/sendEmailOTP';
            // `${BASE_URL}/api/v1/users/login`

            return axios.post(
                endpoint,
                { email, token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        },

        onSuccess: async (response) => {
            console.log("OTP sent successfully:");
            Alert.alert("Success", "OTP sent to your email address.");
            // Set the flag to true after sending OTP
            // await AsyncStorage.setItem(verificationToken, response.data.token); // Store token in async storage
            // console.log(response.data.token); // Console the token
            setOtpSent(true);
        },
        onError: (error) => {
            console.error("Error:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
        }

    });

    // Function to send OTP
    const sendOTP = async (isResend = false) => {
        if (email && token) {
            sendOtpMutation.mutate({ email, token, isResend });

            setIsSendVisible(false); // Hide the "Send code" button after pressing it
            setIsResendVisible(true); // Show the "Resend code" button after pressing "Send code"
        }
    };

    const verifyOtpMutation = useMutation({
        mutationFn: async (userdata) => {
            return axios.post(
                `${BASE_URL}/api/v1/users/register/verifyOTP`, // Replace with your actual verification endpoint
                // 'http://192.168.1.6:6000/api/v1/users/register/verifyOTP', // Replace with your actual verification endpoint
                userdata,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        },
        onSuccess: (response) => {
            console.log("OTP verified successfully:");
            Alert.alert("Success", "Registration Successful!");
            navigation.navigate("Login");
        },
        onError: (error) => {
            console.error("Error verifying OTP:", error.response?.data || error.message);
            Alert.alert("Error", "OTP verification failed. Please try again.");
        },
    });

    // Function to handle OTP submission
    const handleSubmit = async () => {
        const userdata = {
            otp: code,
            token: await AsyncStorage.getItem(verificationToken), // Retrieve the token from async storage
        };

        // Call the verify OTP mutation
        verifyOtpMutation.mutate(userdata);
    };

    return (
        <View className="flex-1 justify-center items-center px-5 bg-white">
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

            <TouchableOpacity className="bg-blue-500 py-3 px-20 rounded-lg" onPress={handleSubmit}>
                <Text className="text-white text-lg text-center font-bold">Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EmailConfirmation;
