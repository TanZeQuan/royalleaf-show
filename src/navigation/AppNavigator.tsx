import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgetPassScreen from '../screens/Auth/ForgetPassScreen';
import OtpVerifyScreen from '../screens/Auth/OtpVerifyScreen';
import ResetPassScreen from '../screens/Auth/ResetPassScreen';
import RootNavigator from './RootNavigator';
import { getItem, setItem, removeItem } from '../utils/storage';
import { useDispatch } from 'react-redux';
import { login, logout as logoutAction } from 'store/userSlice';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
  OtpVerification: { email: string };
  ResetPassword: { user_id: string };
  Main: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AppNavigation() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      const username = await getItem('user');
      if (username) {
        dispatch(login(username));
        setIsLoggedIn(true);
      }
      setLoading(false);
    };
    checkLogin();
  }, [dispatch]);

  const handleLogin = async (username: string) => {
    await setItem('user', username);
    dispatch(login(username));
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await removeItem('user');
    dispatch(logoutAction());
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

          {/* 这里用 component 方式注册页面 */}
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassScreen} />
          <Stack.Screen name="OtpVerification" component={OtpVerifyScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPassScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
