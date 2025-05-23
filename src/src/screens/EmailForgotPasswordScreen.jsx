import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


const EmailForgotPassword = ({ route, navigation }) => {
    const [code, setCode] = useState(""); // Store the entire code
    const inputRef = useRef(null); // Ref for the hidden input

    // const { token, email } = route.params;
    const [isSendVisible, setIsSendVisible] = useState(true); // "Send code" button is initially visible
    const [isResendVisible, setIsResendVisible] = useState(false); // "Resend code" button is initially hidden
    const [otpSent, setOtpSent] = useState(false);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleInputChange = (text) => {
        // Restrict the input to 4 digits
        if (text.length <= 4) {
            setCode(text);
        }
    };

    // Email Validation
    const validateEmail = (value) => {
        setEmail(value);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.match(emailPattern)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError('');
        }
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
            {/* Email Input */}
            <View className="mb-4 w-full ">
            <Text className="text-2xl font-bold text-center mb-4">Enter your email</Text>

                <TextInput
                    placeholder="Enter Your Email"
                    className="border border-borders rounded-lg w-full py-3 px-4"
                    value={email}
                    onChangeText={validateEmail}
                />
                {emailError ? <Text className="text-error-message text-sm">{emailError}</Text> : null}
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

            <TouchableOpacity className="bg-phone w-full py-3 rounded-lg flex-row items-center mb-3" onPress={() => navigation.navigate('PhoneForgotPassword')}>
                <View className="w-[15%] flex items-center">
                    <FontAwesome name="phone" size={30} color="white" />
                </View>
                <View className="w-[85%]">
                    <Text className="text-white text-center text-base font-semibold">Continue with Phone</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default EmailForgotPassword;
