import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Welcome, Login, Signup, Nutricao, Medicacao } from './screens';
import Preferencias from './screens/Preferencias';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Welcome') {
              iconName = 'home';
            } else if (route.name === 'Login') {
              iconName = 'person';
            } else if (route.name === 'Signup') {
              iconName = 'add-circle';
            } else if (route.name === 'Nutricao') {
              iconName = 'nutrition';
            } else if (route.name === 'Medicacao') {
              iconName = 'medkit';
            } else if (route.name === 'Preferencias') {
              iconName = 'settings'; // Ícone para a tela de Preferencias
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Welcome" component={Welcome} />
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="Signup" component={Signup} />
        <Tab.Screen name="Nutricao" component={Nutricao} />
        <Tab.Screen name="Medicacao" component={Medicacao} />
        <Tab.Screen name="Preferencias" component={Preferencias} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
