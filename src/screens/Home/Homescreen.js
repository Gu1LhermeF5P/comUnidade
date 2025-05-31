import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Image, Platform } from 'react-native'; // Adicionado Image e Platform
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppLogo from '../../assets/logo_comunidade_icon.png'; 

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={stylesHome.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" /> 
      {/* Header Customizado para HomeScreen */}
      <View style={stylesHome.customHeaderContainer}>
        {/* Espaço para um botão de voltar ou menu, se necessário no futuro */}
        <View style={stylesHome.headerIconPlaceholder} /> 
        <Text style={stylesHome.customHeaderTitle}>ComUnidade</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={stylesHome.settingsIcon}>
          <Icon name="cog-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={stylesHome.container}>
        <Image source={AppLogo} style={stylesHome.logo} />
        <Text style={stylesHome.welcomeText}>Bem-vindo!</Text>
        <Text style={stylesHome.infoText}>Aceda às funcionalidades abaixo para se conectar e manter-se informado.</Text>
        
        <TouchableOpacity style={stylesHome.actionButton} onPress={() => navigation.navigate('BoletinsTab')}>
          <Icon name="bulletin-board" size={24} color="#FFFFFF" style={stylesHome.actionIcon} />
          <Text style={stylesHome.actionButtonText}>Ver Boletins Recentes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesHome.actionButton} onPress={() => navigation.navigate('Mensagens')}>
          <Icon name="message-processing-outline" size={24} color="#FFFFFF" style={stylesHome.actionIcon} />
          <Text style={stylesHome.actionButtonText}>Mensagens Offline</Text>
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
  customHeaderContainer: { // Estilo para o header customizado da HomeScreen
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  customHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIconPlaceholder: { 
    width: 28, 
  },
  settingsIcon: {
    padding: 5, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150, 
    height: 150, 
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#AEAEB2',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '95%', // Um pouco mais largo
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
