import { StyleSheet, Text, View } from 'react-native';
import SignUp from './screens/SignUp';
import AddMyMaterialScreen from './screens/AddMyMaterialScreen';
// import SearchScreen from './screens/SearchScreen';
// import ExchangeScreen from './screens/ExchangeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {LogBox} from 'react-native';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen'
import ExchangeScreen from './screens/ExchangeScreen';
import AddMyNeedScreen from './screens/AddMyNeedScreen';
import NotificationScreen from './screens/NotificationScreen';
import SignUpScreen from './screens/SignUpScreen';
import LogInScreen from './screens/LoginScreen';
import TradeDetailScreen from './screens/TradeDetailScreen';
import PointHistoryScreen from './screens/PointHistoryScreen';
import EditMyMaterialScreen from './screens/EditMyMaterialScreen';
import EditMyNeedScreen from './screens/EditMyNeedScreen';
import UserInfoScreen from './screens/UserInfoScreen';

// Ignore all log notifications:
LogBox.ignoreAllLogs();

const HomeStack = () => { 
  const Stack = createNativeStackNavigator()
  return(
    <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Trade Detail" component={TradeDetailScreen} />
        <Stack.Screen name="Point History" component={PointHistoryScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen}  />
        <Stack.Screen name="User Info" component={UserInfoScreen}  />
        <Stack.Screen name="Exchange" component={ExchangeScreen} />
        <Stack.Screen name="AddMyMaterial" component={AddMyMaterialScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditMyMaterial" component={EditMyMaterialScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditMyNeed" component={EditMyNeedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddMyNeed" component={AddMyNeedScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
 }

 const SearchStack = () => { 
  const Stack = createNativeStackNavigator()
  return(
    <Stack.Navigator>
        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Exchange" component={ExchangeScreen} />
    </Stack.Navigator>
  )
 }

 const BottomTab = () => { 
   const Tab = createBottomTabNavigator()
   return(
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({focused, color, size }) => (
            <MaterialCommunityIcons name="home" color={focused ? '#63529F': color} size={size} />
          ),
          tabBarLabelStyle: {
            color: '#63529F', // Change this color to match your focused color
          },
        }}
        />
      <Tab.Screen name="Search" component={SearchStack} options={{
          headerShown: false,
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name="magnify" color={focused ? '#63529F': color} size={size} />
          ),
          tabBarLabelStyle: {
            color: '#63529F', // Change this color to match your focused color
          },
        }}
        />  
      <Tab.Screen name="Add Material" component={AddMyMaterialScreen} options={{
          headerShown: false,
          tabBarLabel: 'Add Material',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name="plus-box" color={focused ? '#63529F': color} size={size} />
          ),
          tabBarLabelStyle: {
            color: '#63529F', // Change this color to match your focused color
          },
        }}
        />    
    </Tab.Navigator>
   )

  }

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LogInScreen} options={{ headerShown: false }} />        
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
