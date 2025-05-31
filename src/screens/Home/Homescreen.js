import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={stylesHome.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />
      <View style={stylesHome.headerContainer}>
        <Text style={stylesHome.headerTitle}>ComUnidade</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={stylesHome.container}>
        <Text style={stylesHome.welcomeText}>Bem-vindo!</Text>
        <Text style={stylesHome.infoText}>Aceda às funcionalidades abaixo.</Text>
        
        <TouchableOpacity style={stylesHome.actionButton} onPress={() => navigation.navigate('BoletinsTab')}>
          <Icon name="bulletin-board" size={24} color="#FFFFFF" style={stylesHome.actionIcon} />
          <Text style={stylesHome.actionButtonText}>Ver Boletins Recentes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesHome.actionButton} onPress={() => navigation.navigate('Mensagens')}>
          <Icon name="message-processing-outline" size={24} color="#FFFFFF" style={stylesHome.actionIcon} />
          <Text style={stylesHome.actionButtonText}>Abrir Mensagens Offline</Text>
        </TouchableOpacity>
         <TouchableOpacity style={stylesHome.actionButton} onPress={() => navigation.navigate('Map')}>
          <Icon name="map-marker-outline" size={24} color="#FFFFFF" style={stylesHome.actionIcon} />
          <Text style={stylesHome.actionButtonText}>Mapa e Recursos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const stylesHome = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#AEAEB2',
    marginBottom: 30,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '90%',
  },
  actionIcon: {
    marginRight: 15,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
export default HomeScreen;
