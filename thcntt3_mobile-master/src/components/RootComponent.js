import React from 'react';
import Welcome from './Welcome';
import Home from './Home';
import List from './List';
import Add from './Add';
import Update from './Update';
import InfoUser from './InfoUser';
import BottomSheetInfo from './BottomSheetInfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

function RootComponent() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Welcome' component={Welcome} />
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='List' component={gestureHandlerRootHOC(List)} />
                <Stack.Screen name='Add' component={Add} />
                <Stack.Screen name='Update' component={Update} />
                <Stack.Screen name='InfoUser' component={InfoUser} />
                <Stack.Screen name='BottomSheetInfo' component={gestureHandlerRootHOC(BottomSheetInfo)} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootComponent;
