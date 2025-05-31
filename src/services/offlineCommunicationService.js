import { BleManager, State } from 'react-native-ble-plx';
import { Buffer } from 'buffer'; // Para converter strings para base64 e vice-versa

// --- Configuração Única do Serviço e Características BLE ---

// Um UUID (Universally Unique Identifier) único para o seu serviço de comunicação.
// É crucial que todos os dispositivos usem o mesmo UUID para se encontrarem.
export const SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb'; // Exemplo - USE UM SEU!

// UUIDs únicos para as "características" (os canais de dados)
const MESSAGE_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb'; // Exemplo

// --- Instância do Gestor BLE e Callbacks ---

const bleManager = new BleManager();
let onMessageReceivedCallback = null;
let onPeersUpdateCallback = null;

// --- Funções do Serviço ---

/**
 * Inicializa o BleManager e verifica o estado do Bluetooth no dispositivo.
 */
export const initializeBLE = () => {
  return new Promise((resolve) => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === State.PoweredOn) {
        console.log('BLE está ligado e pronto.');
        subscription.remove();
        resolve(true);
      } else if (state === State.PoweredOff) {
        console.warn('BLE está desligado. Por favor, ligue o Bluetooth.');
        subscription.remove();
        resolve(false);
      }
    }, true);
  });
};

/**
 * Procura por outros dispositivos que estejam a anunciar o nosso serviço.
 */
export const discoverPeers = (onUpdate) => {
  onPeersUpdateCallback = onUpdate;
  const discoveredDevices = new Map();

  console.log('BLE: A procurar por peers...');
  bleManager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
    if (error) {
      console.error('Erro ao procurar dispositivos:', error);
      return;
    }
    if (device && device.name) {
      discoveredDevices.set(device.id, { id: device.id, name: device.name });
      if (onPeersUpdateCallback) {
        onPeersUpdateCallback(Array.from(discoveredDevices.values()));
      }
    }
  });
};

/**
 * Para a procura por dispositivos.
 */
export const stopDiscovery = () => {
  bleManager.stopDeviceScan();
  console.log('BLE: Procura por peers parada.');
};

/**
 * Conecta a um dispositivo específico pelo seu ID.
 */
export const connectToPeer = async (deviceId) => {
  console.log(`BLE: A tentar conectar a ${deviceId}...`);
  try {
    stopDiscovery();
    const device = await bleManager.connectToDevice(deviceId);
    console.log(`BLE: Conectado a ${device.name}`);
    await device.discoverAllServicesAndCharacteristics();
    console.log(`BLE: Serviços e características descobertos para ${device.name}`);
    return device;
  } catch (error) {
    console.error(`BLE: Falha ao conectar a ${deviceId}`, error);
    throw error;
  }
};

/**
 * Desconecta de um dispositivo.
 */
export const disconnectFromPeer = async (deviceId) => {
  try {
    await bleManager.cancelDeviceConnection(deviceId);
    console.log(`BLE: Desconectado de ${deviceId}`);
  } catch (error) {
    console.error(`BLE: Falha ao desconectar de ${deviceId}`, error);
  }
};

/**
 * Envia uma mensagem de texto para um dispositivo conectado.
 */
export const sendMessage = async (deviceId, messageObject) => {
  try {
    const messageString = JSON.stringify(messageObject);
    const messageBase64 = Buffer.from(messageString).toString('base64');
    
    await bleManager.writeCharacteristicWithResponseForDevice(
      deviceId,
      SERVICE_UUID,
      MESSAGE_CHARACTERISTIC_UUID,
      messageBase64
    );
    console.log(`BLE: Mensagem enviada para ${deviceId}`);
    return true;
  } catch (error) {
    console.error('BLE: Erro ao enviar mensagem', error);
    throw error;
  }
};

/**
 * Subscreve para receber mensagens de um dispositivo conectado.
 */
export const subscribeToMessages = (deviceId, onMessageCallback) => {
  const subscription = bleManager.monitorCharacteristicForDevice(
    deviceId,
    SERVICE_UUID,
    MESSAGE_CHARACTERISTIC_UUID,
    (error, characteristic) => {
      if (error) {
        console.error('BLE: Erro ao monitorizar característica de mensagem', error);
        return;
      }
      if (characteristic?.value) {
        const messageString = Buffer.from(characteristic.value, 'base64').toString('utf8');
        try {
          const messageObject = JSON.parse(messageString);
          console.log('BLE: Mensagem recebida:', messageObject);
          if (onMessageCallback) {
            onMessageCallback(messageObject);
          }
        } catch (parseError) {
          console.error('BLE: Erro ao processar mensagem JSON recebida', parseError);
        }
      }
    }
  );
  return () => {
    subscription.remove();
  };
};
