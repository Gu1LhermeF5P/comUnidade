import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, Alert,Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_STORAGE_KEY = '@ComUnidade:chats'; 
const BOMBEIROS_CHAT_ID = 'fixed_channel_bombeiros'; 
const DEFESA_CIVIL_CHAT_ID = 'fixed_channel_defesacivil';

const FIXED_CHANNELS = [
    {
        id: BOMBEIROS_CHAT_ID,
        name: 'Bombeiros (Relatar Emergência)',
        icon: 'fire-truck',
        avatarColor: '#D9534F',
        description: 'Envie informações sobre incêndios, resgates, etc. As suas mensagens ficam registadas localmente.',
        lastMessage: 'Toque para enviar um relatório ou informação.', 
        lastMessageTimestamp: new Date(0).toISOString(), 
    },
    {
        id: DEFESA_CIVIL_CHAT_ID,
        name: 'Defesa Civil (Alertas)',
        icon: 'shield-alert-outline',
        avatarColor: '#0A84FF',
        description: 'Canal para visualizar informações e alertas importantes da Defesa Civil (simulado).',
        lastMessage: 'Verifique aqui por alertas e informações oficiais.', 
        lastMessageTimestamp: new Date(0).toISOString(),
    }
];

const ChatListItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={[styles.avatar, {backgroundColor: item.avatarColor || '#3A3A3C'}]}>
      <Icon 
        name={item.icon || "account-group-outline"} 
        size={30} 
        color={"#FFFFFF"} 
      />
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemName}>
        {item.name}
      </Text>
      <Text style={styles.itemLastMessage} numberOfLines={2}>
        {item.lastMessage}
      </Text>
    </View>
  </TouchableOpacity>
);

const ScreenHeaderChatList = () => ( 
  <View style={styles.customHeaderContainer}>
    <View style={styles.headerIconPlaceholder} /> 
    <Text style={styles.customHeaderTitle}>Canais de Comunicação</Text>
    <View style={styles.headerIconPlaceholder} /> 
  </View>
);

const ChatListScreen = ({ navigation }) => {
  const [channels, setChannels] = useState([]);

  const loadChannels = useCallback(async () => {
    try {
      const storedChatSummaries = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
      let chatSummariesArray = storedChatSummaries ? JSON.parse(storedChatSummaries) : [];
      
      
      const finalChannels = FIXED_CHANNELS.map(fixedChannel => {
          const storedSummary = chatSummariesArray.find(summary => summary.id === fixedChannel.id);
          if (storedSummary) {
            
            return { 
                ...fixedChannel, 
                lastMessage: storedSummary.lastMessage, 
                lastMessageTimestamp: storedSummary.lastMessageTimestamp 
            };
          }
          return fixedChannel; 
      }).sort((a,b) => new Date(b.lastMessageTimestamp || 0) - new Date(a.lastMessageTimestamp || 0));

      setChannels(finalChannels);
    } catch (e) {
      console.error("Erro ao carregar canais/conversas:", e);
      
      setChannels(FIXED_CHANNELS.sort((a,b) => new Date(b.lastMessageTimestamp || 0) - new Date(a.lastMessageTimestamp || 0)));
    }
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      loadChannels(); 
    });
    loadChannels(); 
    return unsubscribeFocus;
  }, [navigation, loadChannels]);

  const handleChannelPress = (channel) => {
    navigation.navigate('Chat', { 
        chatId: channel.id, 
        chatName: channel.name,
        channelDescription: channel.description,
        isFixedChannel: true 
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={'#121212'} />
      <ScreenHeaderChatList />
      <FlatList
        data={channels}
        renderItem={({ item }) => (
          <ChatListItem 
            item={item} 
            onPress={() => handleChannelPress(item)} 
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={ 
            <View style={styles.emptyContainer}>
                <Icon name="message-text-off-outline" size={60} color="#555"/>
                <Text style={styles.emptyListText}>
                    Nenhum canal de comunicação disponível.
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    flex: 1, 
    textAlign: 'center', 
  },
  headerIconPlaceholder: { 
    width: 28, 
  },
  listContentContainer: { paddingHorizontal: 0, paddingTop: 10, flexGrow:1 }, 
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingVertical: 15, paddingHorizontal:16},
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTextContainer: { flex: 1 },
  itemName: { fontSize: 17, fontWeight: '600', color: '#FFFFFF', marginBottom: 3 },
  itemLastMessage: { fontSize: 14, color: '#AEAEB2' },
  separator: { height: 1, backgroundColor: '#2C2C2E', }, 
  emptyContainer: { flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal: 20},
  emptyListText: { textAlign:'center', marginTop: 20, fontSize:16, color:'#AEAEB2', lineHeight:24},
});

export default ChatListScreen;