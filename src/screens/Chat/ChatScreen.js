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
    // Alert as AlertChat // Não é mais necessário para esta versão simples
} from 'react-native';
import IconChat from 'react-native-vector-icons/MaterialCommunityIcons';
// import * as P2PService from '../../services/offlineCommunicationService'; // Removida importação do serviço P2P

const ChatScreen = ({ route, navigation }) => {
  const { chatId, chatName } = route.params || {}; 
  
  // Mensagens mockadas para este chat específico
  const [messages, setMessages] = useStateChat([
    { id: '1', text: `Conversa com ${chatName || 'Utilizador'}`, sender: 'system', timestamp: new Date().toISOString() },
    { id: '2', text: 'Esta é uma mensagem de exemplo.', sender: 'other', timestamp: new Date(Date.now() - 60000).toISOString() }, // sender 'other'
    { id: '3', text: 'E esta é a minha resposta!', sender: 'me', timestamp: new Date().toISOString() }, // sender 'me'
  ]);
  const [inputText, setInputText] = useStateChat('');

  // Não há mais subscrição a mensagens P2P
  useEffectChatScreen(() => {
    console.log(`A iniciar chat com ${chatName} (ID: ${chatId})`);
    // Lógica de limpeza (se houver alguma) pode ir aqui no retorno
    return () => {
      console.log(`A fechar chat com ${chatName}`);
    };
  }, [chatId, chatName]);

  const onSend = useCallbackChat(() => {
    if (inputText.trim().length > 0) {
      const myUniqueDeviceId = 'me'; // Simplesmente 'me' para o remetente local
      
      const newMessage = {
        id: String(Date.now()), 
        text: inputText,
        sender: myUniqueDeviceId, 
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [newMessage, ...prevMessages]); // Adiciona no início para ordem decrescente
      setInputText('');

      console.log("Mensagem adicionada localmente:", newMessage);
      // Não há chamada a P2PService.sendMessage
    }
  }, [inputText, messages]); // Removido chatId e isConnected das dependências

  const renderMessageItem = ({ item }) => (
    <ViewChat style={[stylesChat.messageBubble, item.sender === 'me' ? stylesChat.userMessage : stylesChat.otherMessage]}>
      {item.sender === 'system' ? (
         <TextChat style={stylesChat.systemMessageText}>{item.text}</TextChat>
      ) : (
        <TextChat style={stylesChat.messageText}>{item.text}</TextChat>
      )}
      <TextChat style={stylesChat.messageTimestamp}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TextChat>
    </ViewChat>
  );

  const ScreenHeaderChat = () => (
    <ViewChat style={stylesChat.headerContainer}>
      <TouchableOpacityChat onPress={() => navigation.goBack()} style={stylesChat.backButton}>
         <TextChat style={stylesChat.backButtonText}>‹</TextChat>
      </TouchableOpacityChat>
      <ViewChat style={stylesChat.headerTitleContainer}>
        <TextChat style={stylesChat.headerTitle} numberOfLines={1}>{chatName || 'Chat'}</TextChat>
        {/* Removido indicador de conexão, pois é apenas front-end */}
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} 
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
            placeholder={"Digite sua mensagem..."}
            placeholderTextColor="#8E8E93"
            value={inputText}
            onChangeText={setInputText}
            multiline
            />
            <TouchableOpacityChat style={stylesChat.sendButton} onPress={onSend} disabled={!inputText.trim()}>
            <IconChat name="send-circle" size={36} color={!inputText.trim() ? "#555" : "#0A84FF"} />
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
  // connectionDot: { width:8, height:8, borderRadius:4, marginLeft:8}, // Removido
  actionButton: { paddingHorizontal:10, paddingVertical:5 },
  messagesList: { flex: 1, paddingHorizontal: 10 },
  messageBubble: { maxWidth: '80%', padding: 10, borderRadius: 15, marginBottom: 10 },
  userMessage: { backgroundColor: '#0A84FF', alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  otherMessage: { backgroundColor: '#2C2C2E', alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  systemMessageText: { color: '#AEAEB2', fontStyle:'italic', fontSize:13, textAlign:'center'},
  messageText: { color: '#FFFFFF', fontSize: 15 },
  messageTimestamp: { color: '#E0E0E0', fontSize: 10, alignSelf: 'flex-end', marginTop: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  textInput: { flex: 1, backgroundColor: '#2C2C2E', color: '#FFFFFF', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize:15, maxHeight:100 },
  sendButton: { padding: 5 },
});

export default ChatScreen;