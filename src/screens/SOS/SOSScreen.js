import React, { useState as useStateSOS } from 'react'; // Adicionado useStateSOS
import { View as ViewSOS, Text as TextSOS, StyleSheet as StyleSheetSOS, SafeAreaView as SafeAreaViewSOS, TouchableOpacity as TouchableOpacitySOS, Alert as AlertSOS, StatusBar as StatusBarSOS, ActivityIndicator as ActivityIndicatorSOS } from 'react-native'; // Adicionado ActivityIndicatorSOS
import IconSOS from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location'; // Importa a biblioteca de localização

const SOSScreen = ({ navigation }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useStateSOS(false); // Estado para controlar o loading da localização

  const handleSOSPress = async () => {
    setIsLoadingLocation(true); // Inicia o loading
    let locationData = null;

    try {
      // 1. Solicitar permissão de localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        AlertSOS.alert(
            "Permissão Negada", 
            "A permissão de acesso à localização é necessária para enviar um SOS eficaz. Por favor, ative-a nas configurações do seu dispositivo."
        );
        setIsLoadingLocation(false);
        return;
      }

      // 2. Obter a localização atual
      // getCurrentPositionAsync pode demorar alguns segundos
      let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High, // Alta precisão
      });
      locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp).toISOString(),
      };
      
      console.log("Localização obtida para SOS:", locationData);

      // 3. Simular o envio do SOS com a localização
      // Numa aplicação real, você enviaria locationData para a sua API ou para um serviço de emergência.
      // Poderia também iniciar a partilha contínua da localização (mais complexo).

      AlertSOS.alert(
        "Alerta SOS Enviado!",
        `O seu pedido de SOS foi transmitido para a rede local.\n\nSua localização aproximada:\nLatitude: ${locationData.latitude.toFixed(5)}\nLongitude: ${locationData.longitude.toFixed(5)}\n\nMantenha a calma e aguarde.`,
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error("Erro ao obter localização para SOS:", error);
      AlertSOS.alert(
        "Erro de Localização", 
        "Não foi possível obter a sua localização atual. O SOS foi enviado, mas sem dados de posição. Tente partilhar a localização manualmente se possível."
      );
      // Mesmo com erro de localização, o alerta SOS "genérico" é enviado.
      // Se quiser que o SOS só seja enviado COM localização, mova o Alert.alert de "Alerta SOS Enviado" para dentro do try.
    } finally {
      setIsLoadingLocation(false); // Termina o loading
    }
  };

  const handleShareLocationManual = async () => { // Função separada para partilha manual
    setIsLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        AlertSOS.alert("Permissão Negada", "A permissão de acesso à localização é necessária.");
        setIsLoadingLocation(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      AlertSOS.alert(
        "Localização Atual", 
        `Latitude: ${location.coords.latitude.toFixed(5)}\nLongitude: ${location.coords.longitude.toFixed(5)}\n\n(Numa app real, esta informação seria enviada para os seus contactos de emergência ou para a rede local.)`
      );
    } catch (error) {
        AlertSOS.alert("Erro", "Não foi possível obter a sua localização atual.");
    } finally {
        setIsLoadingLocation(false);
    }
  };

  const handleCallEmergencyContact = () => {
    // Aqui você implementaria a lógica para ligar para um número de emergência
    // Ex: Linking.openURL('tel:190'); (para ligar para a polícia no Brasil)
    // Ou para um contacto pré-definido.
    AlertSOS.alert("Ligar Contacto", "Tentando ligar para o seu contacto de emergência pré-definido ou para o número de emergência local...");
  };

  return (
    <SafeAreaViewSOS style={stylesSOS.safeArea}>
      <StatusBarSOS barStyle="light-content" backgroundColor={'#121212'} />
      <ViewSOS style={stylesSOS.container}>
        <TextSOS style={stylesSOS.infoTextTop}>Em caso de emergência, pressione o botão SOS.</TextSOS>
        <TouchableOpacitySOS 
            style={[stylesSOS.sosButton, isLoadingLocation && stylesSOS.sosButtonDisabled]} 
            onPress={handleSOSPress}
            disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicatorSOS size="large" color="#FFFFFF" />
          ) : (
            <>
              <IconSOS name="alarm-light" size={80} color="#FFFFFF" />
              <TextSOS style={stylesSOS.sosButtonText}>SOS</TextSOS>
            </>
          )}
        </TouchableOpacitySOS>
        <TextSOS style={stylesSOS.infoTextBottom}>A sua localização (se disponível) será partilhada.</TextSOS>

        <ViewSOS style={stylesSOS.actionsContainer}>
            <TouchableOpacitySOS 
                style={[stylesSOS.actionButtonSOS, isLoadingLocation && stylesSOS.actionButtonDisabled]} 
                onPress={handleShareLocationManual}
                disabled={isLoadingLocation}
            >
                <IconSOS name="map-marker-radius-outline" size={24} color="#FFFFFF" style={stylesSOS.actionIconSOS}/>
                <TextSOS style={stylesSOS.actionButtonTextSOS}>Partilhar Localização</TextSOS>
            </TouchableOpacitySOS>
            <TouchableOpacitySOS 
                style={[stylesSOS.actionButtonSOS, isLoadingLocation && stylesSOS.actionButtonDisabled]} 
                onPress={handleCallEmergencyContact}
                disabled={isLoadingLocation} // Pode querer permitir mesmo se estiver a carregar localização
            >
                <IconSOS name="phone-outline" size={24} color="#FFFFFF" style={stylesSOS.actionIconSOS}/>
                <TextSOS style={stylesSOS.actionButtonTextSOS}>Ligar Contacto</TextSOS>
            </TouchableOpacitySOS>
        </ViewSOS>
      </ViewSOS>
    </SafeAreaViewSOS>
  );
};

const stylesSOS = StyleSheetSOS.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  infoTextTop: { fontSize: 16, color: '#AEAEB2', textAlign: 'center', marginBottom: 20 },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#D9534F', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  sosButtonDisabled: {
    backgroundColor: '#8C3A3A', // Cor mais escura quando desabilitado
  },
  sosButtonText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', marginTop:5 },
  infoTextBottom: { fontSize: 14, color: '#8E8E93', textAlign: 'center', marginBottom: 40 },
  actionsContainer: { width: '100%', alignItems:'center' },
  actionButtonSOS: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '90%',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionIconSOS: {
    marginRight: 15,
  },
  actionButtonTextSOS: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SOSScreen;
