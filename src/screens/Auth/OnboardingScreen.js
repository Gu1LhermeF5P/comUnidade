import React from 'react'; 
import { 
    View as ViewOnboarding, 
    Text as TextOnboarding, 
    StyleSheet as StyleSheetOnboarding, 
    SafeAreaView as SafeAreaViewOnboarding, 
    TouchableOpacity as TouchableOpacityOnboarding, 
    Image as ImageOnboarding,
    Alert as AlertOnboarding,
    StatusBar as StatusBarOnboarding 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import AppLogo from '../../assets/logo_comunidade_icon.png'; 

const OnboardingScreen = ({ route, navigation }) => { 
  const finishOnboardingCallback = route.params?.finishOnboarding;

  const handleCompleteAndProceed = async () => {
    if (typeof finishOnboardingCallback === 'function') {
      try {
        await AsyncStorage.setItem('@ComUnidade:onboardingCompleted', 'true');
        console.log("Onboarding marcado como concluído no AsyncStorage (dentro do OnboardingScreen).");
        finishOnboardingCallback();
        console.log("Callback finishOnboarding do App.js chamado.");
      } catch (e) {
        console.error('Falha ao guardar ou processar o fim do onboarding', e);
        AlertOnboarding.alert("Erro", "Não foi possível finalizar a introdução. Tente novamente.");
      }
    } else {
      console.error("Erro Crítico: A função finishOnboarding não foi passada do App.js para OnboardingScreen nos route.params. A navegação não ocorrerá.");
      AlertOnboarding.alert("Erro de Configuração", "Ocorreu um problema ao tentar finalizar a introdução. Contacte o suporte.");
    }
  };

  return (
    <SafeAreaViewOnboarding style={stylesOnboarding.safeArea}>
      <StatusBarOnboarding barStyle="light-content" backgroundColor={'#121212'} /> {/* Usando StatusBarOnboarding (alias para StatusBar) */}
      <ViewOnboarding style={stylesOnboarding.container}>
        <ImageOnboarding source={AppLogo} style={stylesOnboarding.logo} />
        <TextOnboarding style={stylesOnboarding.title}>Bem-vindo ao ComUnidade</TextOnboarding>
        <TextOnboarding style={stylesOnboarding.subtitle}>Conectando comunidades, mesmo offline.</TextOnboarding>
        <TextOnboarding style={stylesOnboarding.description}>
          Em situações de emergência, comunique-se com outros próximos, partilhe alertas e aceda a informações importantes sem necessidade de internet.
        </TextOnboarding>
        <ViewOnboarding style={stylesOnboarding.permissionsInfo}>
            <TextOnboarding style={stylesOnboarding.permissionsTitle}>Permissões Necessárias (Exemplo):</TextOnboarding>
            <TextOnboarding style={stylesOnboarding.permissionItem}>• Localização (para mapas e SOS)</TextOnboarding>
            <TextOnboarding style={stylesOnboarding.permissionItem}>• Bluetooth/Wi-Fi (para comunicação offline)</TextOnboarding>
            <TextOnboarding style={stylesOnboarding.permissionItem}>• Armazenamento (para guardar dados offline)</TextOnboarding>
            <TextOnboarding style={stylesOnboarding.permissionNote}>Você será solicitado a conceder estas permissões quando necessário dentro do app.</TextOnboarding>
        </ViewOnboarding>
        <TouchableOpacityOnboarding style={stylesOnboarding.button} onPress={handleCompleteAndProceed}>
          <TextOnboarding style={stylesOnboarding.buttonText}>Aceito, Continuar</TextOnboarding>
        </TouchableOpacityOnboarding>
      </ViewOnboarding>
    </SafeAreaViewOnboarding>
  );
};

const stylesOnboarding = StyleSheetOnboarding.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#AEAEB2', textAlign: 'center', marginBottom: 25 },
  description: { fontSize: 15, color: '#E0E0E0', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  permissionsInfo: { backgroundColor:'#1C1C1E', padding:15, borderRadius:10, marginBottom:30, width:'100%'},
  permissionsTitle: { fontSize:16, fontWeight:'bold', color:'#FFFFFF', marginBottom:10},
  permissionItem: { fontSize:14, color:'#E0E0E0', marginBottom:5},
  permissionNote: {fontSize:12, color: '#8E8E93', marginTop:10, textAlign:'center'},
  button: { backgroundColor: '#0A84FF', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, width:'100%', alignItems:'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default OnboardingScreen;