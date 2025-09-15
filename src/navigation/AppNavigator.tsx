import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgetPasswordScreen from '../screens/Auth/ForgetPassScreen';
import OtpVerifyScreen from '../screens/Auth/OtpVerifyScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPassScreen';
import { getItem, setItem, removeItem } from '../utils/storage';
import RootNavigator from './RootNavigator';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  OtpVerify: { email: string }; // 需要传递邮箱
  ResetPassword: { email: string }; // 需要传递邮箱
  Main: undefined;
};


const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AppNavigation() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const username = await getItem('user'); // 读取存储
      if (username) setIsLoggedIn(true);
      setLoading(false);
    };
    checkLogin();
  }, []);

  const handleLogin = async (username: string) => {
    await setItem('user', username);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await removeItem('user');
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Main">
          {props => <RootNavigator {...props} onLogout={handleLogout} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
          <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );

}
