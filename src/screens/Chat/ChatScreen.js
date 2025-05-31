import React, { useState, useCallback, useEffect } from 'react';
import { 
    View,         
    Text,         
    StyleSheet,   
    SafeAreaView, 
    TextInput, 
    FlatList, 
    TouchableOpacity, 
    StatusBar, 
    KeyboardAvoidingView, 
    Platform,     
    Alert         
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useHeaderHeight } from '@react-navigation/elements'; // Para obter a altura do header da Stack

const ChatScreen = ({ route, navigation }) => {
  const { chatId, chatName: initialChatName, isNewChat } = route.params || {}; 
  
  const [messages, setMessages] = useState([]); 
  const [inputText, setInputText] = useState(''); 
  const [currentChatName, setCurrentChatName] = useState(initialChatName || 'Nova Conversa'); 
  const MESSAGES_KEY = `@ComUnidade:messages_${chatId}`;
  const CHATS_KEY_FOR_LIST = '@ComUnidade:chats'; 
  const headerHeight = useHeaderHeight(); // Obtém a altura do header da Stack Navigator

  const loadMessages = useCallback(async () => { 
    if (!chatId) return;
    try {
      const storedMessages = await AsyncStorage.getItem(MESSAGES_KEY);
      if (storedMessages !== null) {
        setMessages(JSON.parse(storedMessages));
      } else if (isNewChat) {
        const systemMessage = {
            id: String(Date.now()), text: `Conversa iniciada com ${currentChatName}.`,
            sender: 'system', timestamp: new Date().toISOString(),
        };
        setMessages([systemMessage]);
      }
    } catch (e) { console.error("Erro ao carregar mensagens:", e); }
  }, [chatId, MESSAGES_KEY, isNewChat, currentChatName]);

  useEffect(() => { 
    loadMessages();
    // O título do header agora é definido no App.js nas options da Stack.Screen
    // Mas podemos atualizar o `currentChatName` se ele mudar após o prompt
    if (initialChatName !== currentChatName) {
        navigation.setOptions({ title: currentChatName });
    }
  }, [loadMessages, navigation, currentChatName, initialChatName]);

  const saveMessagesToStorage = async (updatedMessages) => { 
    if (!chatId) return;
    try {
      await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
    } catch (e) { console.error("Erro ao guardar mensagens:", e); }
  };
  
  const updateChatListSummary = async (lastMessageText) => { 
    try {
        const storedChats = await AsyncStorage.getItem(CHATS_KEY_FOR_LIST);
        let chatsArray = storedChats ? JSON.parse(storedChats) : [];
        const chatIndex = chatsArray.findIndex(c => c.id === chatId);

        const chatSummary = {
            id: chatId, name: currentChatName, 
            lastMessage: lastMessageText, lastMessageTimestamp: new Date().toISOString(),
        };

        if (chatIndex > -1) {
            chatsArray[chatIndex] = chatSummary;
        } else {
            chatsArray.unshift(chatSummary); 
        }
        chatsArray.sort((a,b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));

        await AsyncStorage.setItem(CHATS_KEY_FOR_LIST, JSON.stringify(chatsArray));
    } catch (e) { console.error("Erro ao atualizar lista de chats:", e); }
  };

  const onSend = useCallback(async () => { 
    if (inputText.trim().length > 0 && chatId) {
      const myUniqueDeviceId = 'me'; 
      const newMessage = {
        id: String(Date.now()), text: inputText,
        sender: myUniqueDeviceId, timestamp: new Date().toISOString(),
      };
      
      const updatedMessages = [newMessage, ...messages];
      setMessages(updatedMessages);
      await saveMessagesToStorage(updatedMessages); 
      
      if (isNewChat && currentChatName === 'Nova Conversa') {
        Alert.prompt(
          "Nome da Conversa", "Dê um nome para esta nova conversa:",
          [{ text: "Cancelar", style: "cancel" },
           { text: "Guardar", onPress: async (name) => {
                const finalName = name || `Conversa`;
                setCurrentChatName(finalName);
                await updateChatListSummary(inputText); 
                navigation.setParams({ chatName: finalName, isNewChat: false }); 
              }
           }], 'plain-text', currentChatName !== 'Nova Conversa' ? currentChatName : ''
        );
      } else {
        await updateChatListSummary(inputText); 
      }
      setInputText('');
    }
  }, [inputText, messages, chatId, saveMessagesToStorage, isNewChat, currentChatName, navigation, updateChatListSummary]);

  const renderMessageItem = ({ item }) => (
    <View style={[styles.messageBubble, 
        item.sender === 'me' ? styles.userMessage : 
        item.sender === 'system' ? styles.systemMessage : styles.otherMessage
    ]}>
      <Text style={item.sender === 'system' ? styles.systemMessageText : styles.messageText}>
        {item.text}
      </Text>
      {item.sender !== 'system' && (
        <Text style={styles.messageTimestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );

  // O ScreenHeaderChat foi removido daqui, pois o header agora é gerido pelo StackNavigator no App.js

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* A StatusBar hidden={true} está no App.js, então não precisamos de outra aqui */}
      {/* O header da StackNavigator é usado, então não precisamos do ScreenHeaderChat aqui */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} // 'height' pode ser problemático no Android com headers
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={headerHeight + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0) } // Ajuste com altura do header e status bar no Android
      >
        <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            inverted 
            contentContainerStyle={styles.messagesListContent}
        />
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.textInput}
            placeholder={"Digite sua mensagem..."}
            placeholderTextColor="#8E8E93"
            value={inputText}
            onChangeText={setInputText}
            multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSend} disabled={!inputText.trim()}>
            <Icon name="send-circle" size={36} color={!inputText.trim() ? "#555" : "#0A84FF"} />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  keyboardAvoidingContainer: { // Novo container para o KeyboardAvoidingView
    flex: 1,
  },
  // headerContainer: { ... }, // Removido, pois o header é da Stack
  messagesList: { 
    flex: 1, 
    paddingHorizontal: 10,
  },
  messagesListContent: { // Adicionado para padding na lista invertida
    paddingTop: 10, // Espaço no topo da lista (que é o fundo visualmente)
    paddingBottom:10, // Espaço no fundo da lista (que é o topo visualmente)
  },
  messageBubble: { maxWidth: '80%', padding: 10, borderRadius: 15, marginBottom: 10 },
  userMessage: { backgroundColor: '#0A84FF', alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  otherMessage: { backgroundColor: '#2C2C2E', alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  systemMessage: { backgroundColor: 'transparent', alignSelf: 'center', paddingVertical: 5},
  systemMessageText: { color: '#AEAEB2', fontStyle:'italic', fontSize:13, textAlign:'center'},
  messageText: { color: '#FFFFFF', fontSize: 15 },
  messageTimestamp: { color: '#E0E0E0', fontSize: 10, alignSelf: 'flex-end', marginTop: 5 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    paddingVertical: 8, // Ajustado padding
    borderTopWidth: 1, 
    borderTopColor: '#3A3A3C', 
    backgroundColor: '#1C1C1E' 
  },
  textInput: { 
    flex: 1, 
    backgroundColor: '#2C2C2E', 
    color: '#FFFFFF', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: Platform.OS === 'ios' ? 10 : 8, // Ajuste de padding para diferentes plataformas
    marginRight: 10, 
    fontSize:15, 
    maxHeight:100 
  },
  sendButton: { paddingLeft: 5 }, // Ajustado padding do botão de enviar
});

export default ChatScreen;