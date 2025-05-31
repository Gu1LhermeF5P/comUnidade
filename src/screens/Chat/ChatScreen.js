import React, { useState as useStateChat, useCallback as useCallbackChat, useEffect as useEffectChatScreen } from 'react';
import { 
    View as ViewChat, 
    Text as TextChat, 
    StyleSheet as StyleSheetChat, 
    SafeAreaView as SafeAreaViewChat, 
    TextInput as TextInputChat, 
    FlatList as FlatListMessages, 
    TouchableOpacity as TouchableOpacityChat, 
    StatusBar as StatusBarChat, 
    KeyboardAvoidingView, 
    Platform,
    Alert as AlertChat
} from 'react-native';
import IconChat from 'react-native-vector-icons/MaterialCommunityIcons';
// O serviço P2PService é importado pela ChatListScreen, mas se esta tela for acessada
// de outra forma, ou para clareza, pode importar P2PService aqui também.
// import * as P2PService from '../../services/offlineCommunicationService';


const ChatScreen = ({ route, navigation }) => {
  const { deviceId, deviceName } = route.params || {}; 
  const [messages, setMessages] = useStateChat([]);
  const [inputText, setInputText] = useStateChat('');
  // O estado da conexão pode ser mais complexo, vindo de um listener do serviço P2P
  const [isConnected, setIsConnected] = useStateChat(true); // Assume conectado ao entrar na tela

  useEffectChatScreen(() => {
    if (!deviceId) {
      AlertChat.alert("Erro", "ID do dispositivo não fornecido para o chat. A voltar...");
      navigation.goBack();
      return;
    }

    const onNewMessage = (messageObject) => {
      console.log("Nova mensagem BLE recebida na ChatScreen:", messageObject);
      // Adicionar lógica para garantir que a mensagem é deste chat (se o serviço não filtrar)
      // e para não adicionar a própria mensagem se a biblioteca BLE ecoar.
      const messageForUi = {
        id: messageObject.payload.id || String(Date.now()), // Garante um ID
        text: messageObject.payload.text,
        sender: messageObject.payload.senderId === 'meuDispositivoId' ? 'me' : 'other', // 'meuDispositivoId' deve ser um ID único do dispositivo atual
        timestamp: messageObject.payload.timestamp || new Date().toISOString(),
      };
      setMessages(prevMessages => [messageForUi, ...prevMessages]);
    };
    
    const unsubscribeFromMessages = P2PService.subscribeToMessages(deviceId, onNewMessage);

    // TODO: Adicionar um listener para atualizações de conexão do P2PService
    // e atualizar o estado `setIsConnected` com base nisso.

    return () => {
      unsubscribeFromMessages();
      P2PService.disconnectFromPeer(deviceId); // Desconectar ao sair da tela
    };
  }, [deviceId, navigation]);

  const onSend = useCallbackChat(async () => {
    if (inputText.trim().length > 0 && isConnected && deviceId) {
      const myUniqueDeviceId = 'meuDispositivoId'; // Obtenha um ID único para este dispositivo
      
      const messageObject = {
        type: 'text_message', // Tipo da mensagem para o serviço P2P
        payload: {
          id: String(Date.now()), // ID único para a mensagem na UI
          text: inputText,
          senderId: myUniqueDeviceId, 
          timestamp: new Date().toISOString(),
        }
      };
      
      // Adiciona à UI localmente (renderização otimista)
      const messageForUi = {
        ...messageObject.payload,
        sender: 'me', 
      };
      setMessages(prevMessages => [messageForUi, ...prevMessages]);
      const currentInput = inputText; // Guarda o texto antes de limpar
      setInputText('');

      try {
        await P2PService.sendMessage(deviceId, messageObject);
        console.log("Mensagem enviada via BLE.");
      } catch (error) {
        console.error("Erro ao enviar mensagem BLE:", error);
        AlertChat.alert("Erro de Envio", "Não foi possível enviar a sua mensagem.");
        // Opcional: Reverter a mensagem na UI ou marcá-la como "não enviada"
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageForUi.id));
        setInputText(currentInput); // Restaura o texto no input
      }
    }
  }, [inputText, messages, deviceId, isConnected]);

  const renderMessageItem = ({ item }) => (
    <ViewChat style={[stylesChat.messageBubble, item.sender === 'me' ? stylesChat.userMessage : stylesChat.otherMessage]}>
      <TextChat style={stylesChat.messageText}>{item.text}</TextChat>
      <TextChat style={stylesChat.messageTimestamp}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TextChat>
    </ViewChat>
  );

  const ScreenHeaderChat = () => (
    <ViewChat style={stylesChat.headerContainer}>
      <TouchableOpacityChat onPress={() => navigation.goBack()} style={stylesChat.backButton}>
         <TextChat style={stylesChat.backButtonText}>‹</TextChat>
      </TouchableOpacityChat>
      <ViewChat style={stylesChat.headerTitleContainer}>
        <TextChat style={stylesChat.headerTitle} numberOfLines={1}>{deviceName || 'Chat'}</TextChat>
        <ViewChat style={[stylesChat.connectionDot, {backgroundColor: isConnected ? '#4CAF50' : '#D9534F'}]}/>
      </ViewChat>
      <TouchableOpacityChat onPress={() => console.log("Info do chat")} style={stylesChat.actionButton}>
        <IconChat name="information-outline" size={26} color="#FFFFFF" />
      </TouchableOpacityChat>
    </ViewChat>
  );

  return (
    <SafeAreaViewChat style={stylesChat.safeArea}>
      <StatusBarChat barStyle="light-content" backgroundColor={'#1C1C1E'} />
      <ScreenHeaderChat />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Ajuste conforme a altura do seu header
      >
        <FlatListMessages
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            style={stylesChat.messagesList}
            inverted 
            contentContainerStyle={{paddingVertical:10}}
        />
        <ViewChat style={stylesChat.inputContainer}>
            <TextInputChat
            style={stylesChat.textInput}
            placeholder={isConnected ? "Digite sua mensagem..." : "A conectar..."}
            placeholderTextColor="#8E8E93"
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={isConnected}
            />
            <TouchableOpacityChat style={stylesChat.sendButton} onPress={onSend} disabled={!isConnected || !inputText.trim()}>
            <IconChat name="send-circle" size={36} color={!isConnected || !inputText.trim() ? "#555" : "#0A84FF"} />
            </TouchableOpacityChat>
        </ViewChat>
      </KeyboardAvoidingView>
    </SafeAreaViewChat>
  );
};

const stylesChat = StyleSheetChat.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  backButton: { paddingHorizontal:10, paddingVertical:5 },
  backButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 28 },
  headerTitleContainer: { flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginHorizontal:5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  connectionDot: { width:8, height:8, borderRadius:4, marginLeft:8},
  actionButton: { paddingHorizontal:10, paddingVertical:5 },
  messagesList: { flex: 1, paddingHorizontal: 10 },
  messageBubble: { maxWidth: '80%', padding: 10, borderRadius: 15, marginBottom: 10 },
  userMessage: { backgroundColor: '#0A84FF', alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  otherMessage: { backgroundColor: '#2C2C2E', alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  messageText: { color: '#FFFFFF', fontSize: 15 },
  messageTimestamp: { color: '#E0E0E0', fontSize: 10, alignSelf: 'flex-end', marginTop: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  textInput: { flex: 1, backgroundColor: '#2C2C2E', color: '#FFFFFF', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize:15, maxHeight:100 },
  sendButton: { padding: 5 },
});

export default ChatScreen;