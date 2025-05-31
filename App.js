import React, { useState, useEffect } from 'react';
import { StatusBar, LogBox, ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';

// Importe as suas telas aqui (certifique-se que os caminhos estão corretos)
import HomeScreen from './src/screens/Home/Homescreen';
import BulletinsListScreen from './src/screens/Bulletins/BulletinsListScreen';
import CreateBulletinScreen from './src/screens/Bulletins/CreateBulletinScreen';
import BulletinDetailScreen from './src/screens/Bulletins/BulletinDetailScreen';
import ChatListScreen from './src/screens/Chat/ChatListScreen';
import ChatScreen from './src/screens/Chat/ChatScreen';
import SOSScreen from './src/screens/SOS/SOSScreen';
import OnboardingScreen from './src/screens/Auth/OnboardingScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import MapScreen from './src/screens/Map/MapScreen';


// Ignorar um aviso comum que pode aparecer com a navegação por abas
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
]);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tema Escuro Personalizado
const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#0A84FF',
    background: '#121212',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#3A3A3C',
    notification: '#FF3B30',
  },
};

// Navegação por Abas Inferiores
function MainTabs() {
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: AppDarkTheme.colors.primary,
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: AppDarkTheme.colors.card,
              borderTopColor: AppDarkTheme.colors.border,
              height: 60 + (insets?.bottom ?? 0),
              paddingBottom: insets?.bottom ?? 0,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Início') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Mensagens') {
                iconName = focused ? 'message-processing' : 'message-processing-outline';
              } else if (route.name === 'BoletinsTab') {
                iconName = focused ? 'bulletin-board' : 'bulletin-board';
              } else if (route.name === 'SOS') {
                iconName = focused ? 'alert-octagon' : 'alert-octagon-outline';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}>
          <Tab.Screen name="Início" component={HomeScreen} />
          <Tab.Screen name="Mensagens" component={ChatListScreen} />
          <Tab.Screen name="BoletinsTab" component={BulletinsListScreen} options={{ title: 'Boletins' }} />
          <Tab.Screen name="SOS" component={SOSScreen} />
        </Tab.Navigator>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
}

const ONBOARDING_COMPLETED_KEY = '@ComUnidade:onboardingCompleted';

// Navegador Principal da Aplicação (Stack)
function AppNavigator() {
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        if (value !== null && value === 'true') {
          setHasCompletedOnboarding(true);
        }
      } catch (e) {
        console.error('Falha ao ler o estado do onboarding do AsyncStorage', e);
      } finally {
        setIsLoadingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      setHasCompletedOnboarding(true);
      console.log("Estado hasCompletedOnboarding atualizado para true no App.js");
    } catch (e) {
      console.error('Falha ao guardar o estado do onboarding no AsyncStorage (dentro do App.js)', e);
    }
  };

  if (isLoadingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppDarkTheme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: AppDarkTheme.colors.card },
        headerTintColor: AppDarkTheme.colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitleVisible: false,
      }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          initialParams={{ finishOnboarding: handleFinishOnboarding }}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="MainApp"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="CreateBulletin"
        component={CreateBulletinScreen}
        options={{ title: 'Criar Boletim' }}
      />
      <Stack.Screen
        name="BulletinDetail"
        component={BulletinDetailScreen}
        options={{ title: 'Detalhes do Boletim' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params?.chatName || 'Chat' })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Configurações' }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Mapa e Recursos' }}
      />
    </Stack.Navigator>
  );
}

// Componente App principal
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={AppDarkTheme}>
        <StatusBar hidden={true} />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Estilos para o ecrã de carregamento
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppDarkTheme.colors.background,
  },
});
