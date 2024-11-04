import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, StackActions} from '@react-navigation/native';

// screens
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Dashboard from './screens/Dashboard.js';
import EmergencyCall from "./screens/EmergencyCall.js";
import InteractiveMap from "./screens/InteractiveMap";
import ReportEmergency from "./screens/ReportEmergency";
import ViewAlert from "./screens/ViewAlert";
import Contact from "./screens/Contact";
import Messaging from "./screens/Messaging";
// import Educational from "./screens/Educational";
// import CommunitySupport from "./screens/CommunitySupport";
import ReportHistory from "./screens/ReportHistory";
import ResponderSide from "./screens/ResponderSide";
import ResponderAlert from "./screens/ResponderAlert";
import Setting from "./screens/Setting";
import Profile from './screens/Profile.js';
import MessagingItem from './screens/MessagingItem.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="EmergencyCall" component={EmergencyCall} />
        <Stack.Screen name="Map" component={InteractiveMap} />
        <Stack.Screen name="ReportEmergency" component={ReportEmergency} />
        <Stack.Screen name="ViewAlert" component={ViewAlert} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="Messaging" component={Messaging} />
        <Stack.Screen name="MessagingItem" component={MessagingItem} />
        {/* <Stack.Screen name="Educational" component={Educational} />
        <Stack.Screen name="CommunitySupport" component={CommunitySupport} /> */}
        <Stack.Screen name="ReportHistory" component={ReportHistory} />
        <Stack.Screen name="ResponderSide" component={ResponderSide} />
        <Stack.Screen name="ResponderAlert" component={ResponderAlert} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
