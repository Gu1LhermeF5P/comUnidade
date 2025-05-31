import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, // Importação padrão
    SafeAreaView, 
    FlatList, 
    TouchableOpacity, 
    StatusBar, 
    Alert,
    Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_STORAGE_KEY = '@ComUnidade:chats';

const ChatListItem = ({ item, onPress, onDeleteChat }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={styles.avatar}>
      <Icon name="account-group-outline" size={30} color="#FFFFFF" />
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemName}>{item.name || 'Nova Conversa'}</Text>
      <Text style={styles.itemLastMessage} numberOfLines={1}>
        {item.lastMessage || 'Toque para iniciar a conversa.'}
      </Text>
    </View>
    <TouchableOpacity onPress={onDeleteChat} style={styles.deleteChatButton}>
        <Icon name="trash-can-outline" size={24} color="#FF6B6B" />
    </TouchableOpacity>
  </TouchableOpacity>
);

const ScreenHeaderChatList = ({ onNewChat }) => (
  <View style={styles.customHeaderContainer}>
    <View style={styles.headerIconPlaceholder} />
    <Text style={styles.customHeaderTitle}>Mensagens (Local)</Text>
    <TouchableOpacity onPress={onNewChat} style={styles.headerActionButton}>
      <Icon name="plus-circle-outline" size={28} color="#0A84FF" />
    </TouchableOpacity>
  </View>
);

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const loadChats = useCallback(async () => {
    try {
      const storedChats = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
      if (storedChats !== null) {
        setChats(JSON.parse(storedChats).sort((a,b) => new Date(b.lastMessageTimestamp || 0) - new Date(a.lastMessageTimestamp || 0)));
      }
    } catch (e) {
      console.error("Erro ao carregar conversas:", e);
    }
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadChats(); 
    });
    loadChats(); 
    return unsubscribeFocus;
  }, [navigation, loadChats]);

  const saveChats = async (updatedChats) => {
    try {
      await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
    } catch (e) {
      console.error("Erro ao guardar conversas:", e);
    }
  };

  const handleNewChat = () => {
    const newChatId = `chat_${Date.now()}`;
    navigation.navigate('Chat', { chatId: newChatId, chatName: 'Nova Conversa', isNewChat: true });
  };
  
  const handleDeleteChat = (chatIdToDelete) => {
    Alert.alert(
        "Excluir Conversa",
        "Tem a certeza que deseja excluir esta conversa e todas as suas mensagens? Esta ação não pode ser desfeita.",
        [
            { text: "Cancelar", style: "cancel"},
            { text: "Excluir", style: "destructive", onPress: async () => {
                const updatedChats = chats.filter(chat => chat.id !== chatIdToDelete);
                setChats(updatedChats);
                await saveChats(updatedChats);
                await AsyncStorage.removeItem(`@ComUnidade:messages_${chatIdToDelete}`);
            }}
        ]
    );
  };

  const handleChatPress = (chat) => {
    navigation.navigate('Chat', { chatId: chat.id, chatName: chat.name });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={'#121212'} />
      <ScreenHeaderChatList onNewChat={handleNewChat} />
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatListItem 
            item={item} 
            onPress={() => handleChatPress(item)} 
            onDeleteChat={() => handleDeleteChat(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Icon name="message-text-off-outline" size={60} color="#555"/>
                <Text style={styles.emptyListText}>
                    Nenhuma conversa iniciada.{'\n'}Toque em (+) para criar uma nova.
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ // Usando StyleSheet.create padrão
  safeArea: { flex: 1, backgroundColor: '#121212' },
  customHeaderContainer: { 
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
  headerActionButton: { 
    padding: 5, 
  },
  listContentContainer: { paddingHorizontal: 0, paddingTop: 10, flexGrow:1 }, 
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingVertical: 12, paddingHorizontal:16},
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15, backgroundColor: '#3A3A3C' },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }, 
  itemTextContainer: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  itemLastMessage: { fontSize: 14, color: '#AEAEB2', marginTop: 2 },
  deleteChatButton: { padding: 8 },
  separator: { height: 1, backgroundColor: '#2C2C2E', }, 
  emptyContainer: { flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal: 20},
  emptyListText: { textAlign:'center', marginTop: 20, fontSize:16, color:'#AEAEB2', lineHeight:24},
});

export default ChatListScreen;