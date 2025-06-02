import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView,TouchableOpacity, Alert, StatusBar, ActivityIndicator,Linking, Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location'; 

const SOSScreen = ({ navigation }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationInfo, setLocationInfo] = useState('Toque no botão SOS para partilhar a sua localização.');
  const [locationData, setLocationData] = useState(null); 

  const EMERGENCY_NUMBER = '193'; 

  const handleSOSPress = async () => {
    setIsLoadingLocation(true);
    setLocationInfo('A obter localização...');
    setLocationData(null);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
            "Permissão Negada", 
            "A permissão de acesso à localização é crucial. Por favor, ative-a nas configurações."
        );
        setLocationInfo('Permissão de localização negada.');
        setIsLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
      });
      
      const newLocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date(location.timestamp).toISOString(),
      };
      setLocationData(newLocationData); 
      
      const locationString = `Lat: ${newLocationData.latitude.toFixed(5)}, Lon: ${newLocationData.longitude.toFixed(5)}`;
      setLocationInfo(`Localização Atual: ${locationString}`);
      
      console.log("SOS Ativado! Localização:", newLocationData);

      Alert.alert(
        "SOS ATIVADO!",
        `Sua localização foi obtida:\n${locationString}\n\nConsidere ligar para a emergência e partilhar esta informação. A transmissão P2P (se ativa) tentaria enviar esta localização.`,
        [{ text: "Entendido" }]
      );

    } catch (error) {
      console.error("Erro ao obter localização para SOS:", error);
      setLocationInfo('Falha ao obter localização.');
      Alert.alert(
        "Erro de Localização", 
        "Não foi possível obter a sua localização atual. O SOS foi ativado, mas sem dados de posição. Tente ligar para a emergência."
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleCallEmergency = () => {
    const phoneNumber = Platform.OS === 'android' ? `tel:${EMERGENCY_NUMBER}` : `telprompt:${EMERGENCY_NUMBER}`;
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Erro', `Não é possível fazer chamadas a partir deste dispositivo ou para o número ${EMERGENCY_NUMBER}.`);
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.error('Erro ao tentar ligar para emergência:', err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={'#121212'} />

      <View style={styles.customHeaderContainer}>
          <Text style={styles.screenTitle}>EMERGÊNCIA SOS</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.instructionText}>Em caso de perigo iminente, pressione e segure o botão SOS.</Text>
        
        <TouchableOpacity 
            style={[styles.sosButton, isLoadingLocation && styles.sosButtonDisabled]} 
            onPress={handleSOSPress}
            disabled={isLoadingLocation}
            activeOpacity={0.7}
        >
          {isLoadingLocation ? (
            <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 80} color="#FFFFFF" />
          ) : (
            <>
              <Icon name="alarm-light" size={80} color="#FFFFFF" />
              <Text style={styles.sosButtonText}>SOS</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.locationInfoText}>{locationInfo}</Text>

        <View style={styles.actionsContainer}>
            <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleCallEmergency}
            >
                <Icon name="phone-dial-outline" size={26} color="#FFFFFF" style={styles.actionIcon}/>
                <Text style={styles.actionButtonText}>Ligar {EMERGENCY_NUMBER}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  customHeaderContainer: { 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20, 
    paddingBottom: 15, 
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#1C1C1E', 
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  container: { 
    flex: 1, 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    padding: 20 
  },
  instructionText: { 
    fontSize: 16, 
    color: '#AEAEB2', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  sosButton: {
    width: 220, 
    height: 220,
    borderRadius: 110, 
    backgroundColor: '#D9534F', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#FF0000', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
  },
  sosButtonDisabled: {
    backgroundColor: '#8C3A3A', 
  },
  sosButtonText: { 
    color: '#FFFFFF', 
    fontSize: 40, 
    fontWeight: 'bold', 
    marginTop: 10 
  },
  locationInfoText: { 
    fontSize: 14, 
    color: '#E0E0E0', 
    textAlign: 'center', 
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  actionsContainer: { 
    width: '100%', 
    alignItems:'center',
    paddingBottom: 20, 
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A84FF', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, 
    marginBottom: 15,
    width: '90%',
    justifyContent: 'center',
  },
  actionButtonDisabled: { 
    opacity: 0.5,
    backgroundColor: '#555'
  },
  actionIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SOSScreen;
