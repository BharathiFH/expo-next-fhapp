// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TimeScreen from "./pages/index";
import PostsScreen from "./pages/posts";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="time"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="time" component={TimeScreen} />
        <Stack.Screen name="posts" component={PostsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}