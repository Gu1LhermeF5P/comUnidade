import React from 'react'; 
import { View as ViewSettings, Text as TextSettings, StyleSheet as StyleSheetSettings, SafeAreaView as SafeAreaViewSettings, TouchableOpacity as TouchableOpacitySettings, ScrollView as ScrollViewSettings, StatusBar as StatusBarSettings, Alert as AlertSettings } from 'react-native'; // Adicionado StatusBarSettings e AlertSettings
import IconSettings from 'react-native-vector-icons/MaterialCommunityIcons'; 

const SettingItem = ({ icon, title, onPress }) => (
    <TouchableOpacitySettings style={stylesSettings.itemContainer} onPress={onPress}>
        <IconSettings name={icon} size={24} color="#AEAEB2" style={stylesSettings.itemIcon}/>
        <TextSettings style={stylesSettings.itemText}>{title}</TextSettings>
        <IconSettings name="chevron-right" size={24} color="#AEAEB2"/>
    </TouchableOpacitySettings>
);

const SettingsScreen = ({ navigation }) => {

  const ScreenHeaderSettings = () => (
    <ViewSettings style={stylesSettings.headerContainer}>
      <TouchableOpacitySettings onPress={() => navigation.goBack()} style={stylesSettings.backButton}>
         <TextSettings style={stylesSettings.backButtonText}>‹</TextSettings>
      </TouchableOpacitySettings>
      <TextSettings style={stylesSettings.headerTitle}>Configurações</TextSettings>
      <ViewSettings style={stylesSettings.headerActionPlaceholder} />
    </ViewSettings>
  );


  return (
    <SafeAreaViewSettings style={stylesSettings.safeArea}>
      <StatusBarSettings barStyle="light-content" backgroundColor={'#1C1C1E'} /> {/* Usando StatusBarSettings (alias para StatusBar) */}
      <ScreenHeaderSettings />
      <ScrollViewSettings style={stylesSettings.container}>
        <TextSettings style={stylesSettings.sectionTitle}>Conta</TextSettings>
        <SettingItem icon="account-circle-outline" title="Editar Perfil Local" onPress={() => console.log("Editar Perfil")} />
        
        <TextSettings style={stylesSettings.sectionTitle}>Rede Offline</TextSettings>
        <SettingItem icon="wifi-cog" title="Preferências de Rede P2P" onPress={() => console.log("Preferências de Rede")} />
        <SettingItem icon="access-point-network-off" title="Dispositivos Próximos" onPress={() => console.log("Dispositivos Próximos")} />

        <TextSettings style={stylesSettings.sectionTitle}>Geral</TextSettings>
        <SettingItem icon="bell-outline" title="Notificações" onPress={() => console.log("Notificações")} />
        <SettingItem icon="theme-light-dark" title="Aparência (Tema)" onPress={() => console.log("Aparência")} />
        
        <TextSettings style={stylesSettings.sectionTitle}>Sobre</TextSettings>
        <SettingItem icon="help-circle-outline" title="Ajuda e FAQ" onPress={() => console.log("Ajuda")} />
        <SettingItem icon="information-outline" title="Sobre o ComUnidade" onPress={() => console.log("Sobre")} />
        <SettingItem icon="shield-lock-outline" title="Política de Privacidade" onPress={() => console.log("Política de Privacidade")} />
        <SettingItem icon="logout" title="Sair (Limpar Dados Locais)" onPress={() => AlertSettings.alert("Sair", "Tem a certeza que deseja limpar os dados locais e sair?")} />
      </ScrollViewSettings>
    </SafeAreaViewSettings>
  );
};

const stylesSettings = StyleSheetSettings.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  backButton: { padding: 10 },
  backButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 28 },
  headerTitle: { flex:1, textAlign:'center', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  headerActionPlaceholder: { width: 44 },
  container: { flex: 1 },
  sectionTitle: { fontSize: 14, fontWeight:'600', color: '#8E8E93', paddingHorizontal: 20, paddingTop: 25, paddingBottom:10, textTransform:'uppercase' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth:1, borderBottomColor:'#303030'},
  itemIcon: {marginRight:15},
  itemText: { flex:1, fontSize: 16, color: '#FFFFFF' },
});
export default SettingsScreen;