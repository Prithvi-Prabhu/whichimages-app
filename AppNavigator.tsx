//AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './frontend/src/components/Menu/Menu';
import AddImage from './frontend/src/components/AddImage/AddImage';
import RetrieveImageScreen from './frontend/src/components/RetrieveImage/RetrieveImageScreen';
import StartTesting from './frontend/src/components/StartTesting/StartTesting';
import OpenPhoto from './frontend/src/components/RetrieveImage/OpenPhoto';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Group>
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="AddImage" component={AddImage} />
        <Stack.Screen name="RetrieveImageScreen" component={RetrieveImageScreen} />
        <Stack.Screen name="StartTesting" component={StartTesting} />
        <Stack.Screen name="OpenPhoto" component={OpenPhoto}/>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;