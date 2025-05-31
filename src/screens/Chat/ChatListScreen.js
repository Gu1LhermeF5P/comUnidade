import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useState, useEffect, useCallback
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    FlatList, 
    TouchableOpacity, 
    StatusBar,
    // ActivityIndicator, // Não é mais necessário para esta versão simples
    // Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import * as P2PService from '../../services/offlineCommunicationService'; // Removida importação do serviço P2P

const MOCK_CHATS = [ // Dados fictícios para a lista de chats
  { id: '1', name: 'Flavio Santos', lastMessage: 'Olá! Tudo bem?', timestamp: '17:30', unread: true, avatarColor: '#FF6B6B' },
  { id: '2', name: 'Alvaro D.', lastMessage: 'Sim, e consigo ver os boletins.', timestamp: '16:45', unread: false, avatarColor: '#4ECDC4' },
  { id: '3', name: 'Grupo da Vizinhança', lastMessage: 'Alguém tem notícias da zona norte?', timestamp: 'Ontem', unread: true, avatarColor: '#FFD166' },
];

const ChatListItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <View style={[styles.avatar, { backgroundColor: item.avatarColor || '#3A3A3C' }]}>
      <Text style={styles.avatarText}>{(item.name || 'U').substring(0,1).toUpperCase()}</Text>
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemName}>{item.name || 'Conversa Desconhecida'}</Text>
      <Text style={styles.itemLastMessage} numberOfLines={1}>{item.lastMessage}</Text>
    </View>
    <View style={styles.itemMetaContainer}>
      <Text style={styles.itemTimestamp}>{item.timestamp}</Text>
      {item.unread && <View style={styles.unreadDot} />}
    </View>
  </TouchableOpacity>
);

const ScreenHeaderChatList = ({ onNewChatPress }) => ( // Alterado para onNewChatPress
  <View style={styles.headerContainer}>
    <View style={styles.headerActionPlaceholder} />
    <Text style={styles.headerTitle}>Mensagens Offline</Text>
    <TouchableOpacity onPress={onNewChatPress}>
      <Icon name="plus-circle-outline" size={28} color="#0A84FF" />
    </TouchableOpacity>
  </View>
);

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState(MOCK_CHATS); // Usa os dados mock

  // Função para simular a criação de um novo chat ou outra ação
  const handleNewChat = () => {
    console.log("Botão de Nova Mensagem/Chat pressionado.");
    // Aqui você poderia adicionar lógica para criar um novo chat mockado
    // ou navegar para uma tela de seleção de contactos (se tivesse uma)
    // Por agora, apenas um log.
  };
  
  const handleChatPress = (chat) => {
    navigation.navigate('Chat', { chatId: chat.id, chatName: chat.name });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={'#1C1C1E'} />
      <ScreenHeaderChatList onNewChatPress={handleNewChat} />
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatListItem item={item} onPress={() => handleChatPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Icon name="message-off-outline" size={60} color="#555"/>
                <Text style={styles.emptyListText}>
                    Nenhuma conversa iniciada.
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1C1C1E' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  headerActionPlaceholder: { width: 28 }, 
  listContentContainer: { paddingHorizontal: 0, paddingTop: 10, flexGrow:1 }, 
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingVertical: 12, paddingHorizontal:16},
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15, backgroundColor: '#3A3A3C' },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  itemTextContainer: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  itemLastMessage: { fontSize: 14, color: '#AEAEB2', marginTop: 2 },
  itemMetaContainer: { alignItems: 'flex-end' },
  itemTimestamp: { fontSize: 12, color: '#8E8E93' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0A84FF', marginTop: 5 },
  separator: { height: 1, backgroundColor: '#2C2C2E', }, 
  emptyContainer: { flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal: 20},
  emptyListText: { textAlign:'center', marginTop: 20, fontSize:16, color:'#AEAEB2', lineHeight:24},
});

export default ChatListScreen;