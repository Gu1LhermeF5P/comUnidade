import React, { useState, useCallback, useEffect } from 'react'; 
import { View,Text,StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, 
StatusBar, KeyboardAvoidingView, Platform,Alert         
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useHeaderHeight } from '@react-navigation/elements'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChatScreen = ({ route, navigation }) => {
  const { chatId, chatName, channelDescription, isFixedChannel } = route.params || {}; 
  
  const [messages, setMessages] = useState([]); 
  const [inputText, setInputText] = useState(''); 
  const MESSAGES_KEY = `@ComUnidade:messages_${chatId}`; 

  const loadMessages = useCallback(async () => { 
    if (!chatId) return;
    try {
      const storedMessages = await AsyncStorage.getItem(MESSAGES_KEY);
      let initialMessages = [];
      if (storedMessages !== null) {
        initialMessages = JSON.parse(storedMessages);
      }
      
      if (isFixedChannel && initialMessages.length === 0 && channelDescription) {
        const systemMessage = {
            id: `system_${chatId}_desc`, text: channelDescription,
            sender: 'system', timestamp: new Date().toISOString(),
        };
        initialMessages.unshift(systemMessage); 
      }
      setMessages(initialMessages);
    } catch (e) { console.error("Erro ao carregar mensagens:", e); }
  }, [chatId, MESSAGES_KEY, isFixedChannel, channelDescription]);

  useEffect(() => { 
    loadMessages();
    navigation.setOptions({ title: chatName || "Canal" });
  }, [loadMessages, navigation, chatName]);

  const saveMessagesToStorage = async (updatedMessages) => { 
    if (!chatId) return;
    try {
      await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
    } catch (e) { console.error("Erro ao guardar mensagens:", e); }
  };
  
  const updateChatListSummary = async (lastMessageText) => { 
    if(!chatId || isFixedChannel) return; 
    
    const CHATS_KEY_FOR_LIST = '@ComUnidade:chats';
     try {
        const storedChats = await AsyncStorage.getItem(CHATS_KEY_FOR_LIST);
        let chatsArray = storedChats ? JSON.parse(storedChats) : [];
        const chatIndex = chatsArray.findIndex(c => c.id === chatId);

        const chatSummary = {
            id: chatId, name: chatName, 
            lastMessage: lastMessageText, lastMessageTimestamp: new Date().toISOString(),
        };

        if (chatIndex > -1) {
            chatsArray[chatIndex] = chatSummary; 
        } else {
            
        }
        chatsArray.sort((a,b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
        await AsyncStorage.setItem(CHATS_KEY_FOR_LIST, JSON.stringify(chatsArray));
    } catch (e) { console.error("Erro ao atualizar resumo da lista de chats:", e); }
  };

  const onSend = useCallback(async () => { 
    if (inputText.trim().length > 0 && chatId) {
      const myUniqueDeviceId = 'me'; 
      const newMessage = {
        id: String(Date.now()), 
        text: inputText,
        sender: myUniqueDeviceId, 
        timestamp: new Date().toISOString(),
      };
      
      const updatedMessages = [newMessage, ...messages]; 
      setMessages(updatedMessages);
      await saveMessagesToStorage(updatedMessages); 
      
      if (!isFixedChannel) {
        await updateChatListSummary(inputText); 
      } else {
        console.log(`Mensagem enviada para o canal ${chatName}: ${inputText}`);
        Alert.alert("Relatório Enviado", "A sua mensagem foi registada localmente.");
      }
      setInputText('');
    }
  }, [inputText, messages, chatId, saveMessagesToStorage, isFixedChannel, chatName, updateChatListSummary]);

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

  const headerHeight = useHeaderHeight(); 
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Usando Platform diretamente
        style={[styles.keyboardAvoidingContainer, { paddingBottom: insets ? insets.bottom : 0 }]} 
        keyboardVerticalOffset={headerHeight} 
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
            placeholder={isFixedChannel ? "Digite seu relatório/informação..." : "Digite sua mensagem..."}
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
  safeArea: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  messagesList: { 
    flex: 1, 
    paddingHorizontal: 10,
  },
  messagesListContent: { 
    paddingTop: 10, 
  },
  messageBubble: { maxWidth: '80%', padding: 10, borderRadius: 15, marginBottom: 10 },
  userMessage: { backgroundColor: '#0A84FF', alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  otherMessage: { backgroundColor: '#2C2C2E', alignSelf: 'flex-start', borderBottomLeftRadius: 5 }, 
  systemMessage: { backgroundColor: 'transparent', alignSelf: 'center', paddingVertical: 8, marginHorizontal:10, borderBottomWidth:1, borderBottomColor:'#3A3A3C', marginBottom:10},
  systemMessageText: { color: '#AEAEB2', fontStyle:'italic', fontSize:14, textAlign:'center', lineHeight: 18},
  messageText: { color: '#FFFFFF', fontSize: 15 },
  messageTimestamp: { color: '#E0E0E0', fontSize: 10, alignSelf: 'flex-end', marginTop: 5 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    paddingVertical: 8, 
    borderTopWidth: 1, 
    borderTopColor: '#3A3A3C', 
    backgroundColor: '#1C1C1E',
  },
  textInput: { 
    flex: 1, 
    backgroundColor: '#2C2C2E', 
    color: '#FFFFFF', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: Platform.OS === 'ios' ? 10 : 8, // Usando Platform diretamente
    marginRight: 10, 
    fontSize:15, 
    maxHeight:100 
  },
  sendButton: { paddingLeft: 5 }, 
});


export default ChatScreen;