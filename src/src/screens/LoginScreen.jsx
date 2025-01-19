import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import googleLogo from '../Images/google.png';
import logo from '../Images/logo.png';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingIndicator from '../components/LoadingIndicator';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import BASE_URL from '../config/requiredIP';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userToken } from '../constants/Token';

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const GOOGLE_CLIENT_ID = '484205526182-lhdpnunqris1m4bk7hi8ndpa8alr94sd.apps.googleusercontent.com'; // Replace with your client ID

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: GOOGLE_CLIENT_ID,
            redirectUri: AuthSession.makeRedirectUri({
                useProxy: true, // For Expo development
            }),
            scopes: ['profile', 'email'],
        },
        {
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        }
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                handleGoogleLogin(authentication.accessToken);
            }
        }
    }, [response]);

    // Google Login Handler
    const handleGoogleLogin = async (googleAccessToken) => {
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/users/google-login`, {
                token: googleAccessToken, // Send Google access token to your backend
            });

            if (res.data.success) {
                Alert.alert("Success", "Logged in with Google successfully!");
                navigation.navigate('Home'); // Navigate to Home screen
            }
        } catch (error) {
            Alert.alert("Error", "Google login failed!");
            console.error('Google login error:', error);
        } finally {
            setLoading(false);
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

    // Login Functionality
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in both email and password.");
            return;
        }

        setLoading(true); // Show loading spinner
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/users/login`, {
                email,
                password,
            });

            if (response.data.success) {
                console.log(response.data.data.accessToken); // Console the token
                Alert.alert("Success", "Login Successful!");
                await AsyncStorage.setItem(userToken, response.data.data.accessToken); // Store token in async storage
                setLoading(false); // Hide spinner
                navigation.navigate('HomeScreen');
            } else {
                setLoading(false); // Hide spinner
                Alert.alert("Error", "Invalid credentials");
            }
        }
        catch (error) {
            // setLoading(false); // Hide spinner
            // Alert.alert("Error", "Invalid credentials");
            console.error('Login error:', error);
            Alert.alert("Error", "Syster error. Please try again.");
        }
    };

    const handleforgotpassword = async () => {
        navigation.navigate('EmailForgotPassword');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {loading && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 10,
                    }}
                >
                    <LoadingIndicator />
                </View>
            )}

            <KeyboardAvoidingView className="flex-1">
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 items-center justify-center bg-white">
                        {/* Logo and Welcome Text */}
                        <View className="flex-row items-center justify-center mb-10">
                            <Image
                                source={logo}
                                style={{ width: 80, height: 70, marginRight: 10 }}
                            />
                            <Text className="text-2xl font-bold text-center">Welcome Back!</Text>
                        </View>

                        {/* Email Input */}
                        <View className="mb-3 w-full">
                            <TextInput
                                placeholder="Enter Your Email"
                                className="border border-borders rounded-lg w-full py-3 px-4"
                                style={{ height: 50 }}
                                value={email}
                                onChangeText={validateEmail}
                            />
                            {emailError ? <Text className="text-error-message text-sm">{emailError}</Text> : null}
                        </View>

                        {/* Password Input with Show/Hide */}
                        <View className="mb-3 w-full">
                            <View className="border border-borders rounded-lg w-full flex-row items-center px-4">
                                <TextInput
                                    placeholder="Enter Your Password"
                                    style={{ flex: 1, height: 50 }}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <FontAwesome
                                        name={showPassword ? 'eye' : 'eye-slash'}
                                        size={24}
                                        color="gray"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity onPress={handleforgotpassword}>
                            <Text className="text-blue-500 underline text-right mb-5">Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity className="bg-button w-full py-3 rounded-lg mb-3" onPress={handleLogin}>
                            <Text className="text-white text-center text-lg font-semibold">Login</Text>
                        </TouchableOpacity>

                        {/* Signup Link */}
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text className="text-blue-500 underline font-semibold text-sm mb-4">
                                Don't have an account?
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center w-full mb-4">
                            <View className="flex-1 h-px bg-gray-300" />
                            <Text className="text-gray-600 px-2">Or</Text>
                            <View className="flex-1 h-px bg-gray-300" />
                        </View>

                        {/* Google Login Button */}
                        <TouchableOpacity
                            className="bg-google w-full py-3 rounded-lg flex-row items-center mb-3 border border-gray-400"
                            onPress={() => handleGoogleLogin()}
                        >
                            <View className="w-1/6 flex items-center">
                                <Image source={googleLogo} style={{ width: 30, height: 30 }} />
                            </View>
                            <View className="w-5/6">
                                <Text className="text-black text-center text-lg font-semibold">Login with Google</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-phone w-full py-3 rounded-lg flex-row items-center mb-3" onPress={() => navigation.navigate('PhoneLogin')}>
                            <View className="w-[15%] flex items-center">
                                <FontAwesome name="phone" size={30} color="white" />
                            </View>
                            <View className="w-[85%]">
                                <Text className="text-white text-center text-base font-semibold">Continue with Phone</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
