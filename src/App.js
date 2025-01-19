import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './src/screens/WelcomeScreen';
import Signup from './src/screens/SignupScreen';
import Login from './src/screens/LoginScreen';
import PhoneSignup from './src/screens/PhoneSignupScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmailConfirmation from './src/screens/EmailConfirmationPage';
import PhoneConfirmation from './src/screens/PhoneConfirmationScreen';
import Notification from './src/screens/NotificationScreen';
import Calendar from './src/screens/CalendarScreen';
import Profile from './src/screens/ProfileScreen';
import Inbox from './src/screens/InboxScreen';
import EmailForgotPassword from './src/screens/EmailForgotPasswordScreen';
import PhoneForgotPassword from './src/screens/PhoneForgotPasswordScreen';
import PhoneLogin from './src/screens/PhoneLoginScreen';
import KYP from './src/screens/KYP';
import BookingForm from './src/screens/BookingFormScreen';
import NotificationDetail from './src/screens/NotificationDetail';
import HomeScreen from './src/screens/HomeScreen';
const Stack = createStackNavigator();
const queryClient = new QueryClient();

const App = () => {
    return (
        // Wrap the app with QueryClientProvider
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome" >
                    <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}}/>
                    <Stack.Screen name="Login" component={Login}  options={{headerShown:false}}/>
                    <Stack.Screen name="PhoneLogin" component={PhoneLogin}  options={{headerShown:false}}/>
                    <Stack.Screen name="EmailForgotPassword" component={EmailForgotPassword}  options={{headerShown:false}}/>

                    <Stack.Screen name="Signup" component={Signup}  options={{headerShown:false}}/>

                    <Stack.Screen name="PhoneSignup" component={PhoneSignup}  options={{headerShown:false}}/>
                    <Stack.Screen name="PhoneForgotPassword" component={PhoneForgotPassword}  options={{headerShown:false}}/>
                    <Stack.Screen name="EmailConfirmation" component={EmailConfirmation}  options={{headerShown:false}}/>
                    <Stack.Screen name="PhoneConfirmation" component={PhoneConfirmation}  options={{headerShown:false}}/>
                    <Stack.Screen name="HomeScreen" component={HomeScreen}  options={{headerShown:false}}/>
                    <Stack.Screen name="Notification" component={Notification}  options={{headerShown:false}}/>
                    <Stack.Screen name="NotificationDetail" component={NotificationDetail}  options={{headerShown:false}}/>

                    <Stack.Screen name="Calendar" component={Calendar}  options={{headerShown:false}}/>
                    <Stack.Screen name="Inbox" component={Inbox}  options={{headerShown:false}}/>
                    <Stack.Screen name="Profile" component={Profile}  options={{headerShown:false}}/>

                    <Stack.Screen name="KYP" component={KYP}  options={{headerShown:false}}/>

                    <Stack.Screen name="BookingForm" component={BookingForm}  options={{headerShown:false}}/>

                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    );
};

export default App;
