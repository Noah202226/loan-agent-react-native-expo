import "react-native-gesture-handler";

import * as SQLite from "expo-sqlite";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import AboutScreen from "./screens/AboutScreen";
import { View } from "react-native";
import { StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FAB } from "@rneui/themed";
import SettingScreen from "./screens/SettingScreen";

function openDatabase() {
  const db = SQLite.openDatabase("db.db");
  return db;
}
const db = openDatabase();

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();
function MyStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "playlist-add-check" : "featured-play-list";
          } else if (route.name === "About") {
            iconName = focused ? "view-list" : "list-alt";
          } else if (route.name === "Settings") {
            iconName = focused ? "app-settings-alt" : "settings";
          }

          // You can return any component that you like here!
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabelStyle: { fontSize: 16 },
        }}
      >
        {(props) => <HomeScreen {...props} db={db} />}
      </Tab.Screen>
      <Tab.Screen
        name="About"
        options={{
          tabBarLabelStyle: { fontSize: 16 },
          tabBarLabel: "Approved Clients",
        }}
      >
        {(props) => <AboutScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          tabBarLabelStyle: { fontSize: 16 },
        }}
      >
        {(props) => <SettingScreen {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" barStyle={"light-content"} />
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </View>
  );
}
