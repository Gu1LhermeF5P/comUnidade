import React from 'react'; 
import { View as ViewChatList, Text as TextChatList, StyleSheet as StyleSheetChatList, SafeAreaView as SafeAreaViewChatList, FlatList as FlatListChat, TouchableOpacity as TouchableOpacityChatList, StatusBar as StatusBarChatList } from 'react-native'; // Adicionado StatusBarChatList
import IconChatList from 'react-native-vector-icons/MaterialCommunityIcons'; 


const MOCK_CHATS = [
  { id: '1', name: 'Flavio Santos', lastMessage: 'Olá! Tudo bem?', timestamp: '17:30', unread: true, avatarColor: '#FF6B6B' },
  { id: '2', name: 'Alvaro D.', lastMessage: 'Sim, e consigo ver os boletins.', timestamp: '16:45', unread: false, avatarColor: '#4ECDC4' },
  { id: '3', name: 'Grupo da Vizinhança', lastMessage: 'Alguém tem notícias da zona norte?', timestamp: 'Ontem', unread: true, avatarColor: '#FFD166' },
];

const ChatListItem = ({ item, onPress }) => (
  <TouchableOpacityChatList style={stylesChatList.itemContainer} onPress={onPress}>
    <ViewChatList style={[stylesChatList.avatar, { backgroundColor: item.avatarColor }]}>
      <TextChatList style={stylesChatList.avatarText}>{item.name.substring(0,1)}</TextChatList>
    </ViewChatList>
    <ViewChatList style={stylesChatList.itemTextContainer}>
      <TextChatList style={stylesChatList.itemName}>{item.name}</TextChatList>
      <TextChatList style={stylesChatList.itemLastMessage} numberOfLines={1}>{item.lastMessage}</TextChatList>
    </ViewChatList>
    <ViewChatList style={stylesChatList.itemMetaContainer}>
      <TextChatList style={stylesChatList.itemTimestamp}>{item.timestamp}</TextChatList>
      {item.unread && <ViewChatList style={stylesChatList.unreadDot} />}
    </ViewChatList>
  </TouchableOpacityChatList>
);


const ScreenHeaderChatList = ({navigation}) => (
  <ViewChatList style={stylesChatList.headerContainer}>
    <ViewChatList style={stylesChatList.headerActionPlaceholder} />
    <TextChatList style={stylesChatList.headerTitle}>Mensagens Offline</TextChatList>
    <TouchableOpacityChatList onPress={() => console.log("Nova mensagem")}>
      <IconChatList name="plus-circle-outline" size={28} color="#0A84FF" />
    </TouchableOpacityChatList>
  </ViewChatList>
);


const ChatListScreen = ({ navigation }) => {
  const handleChatPress = (chat) => {
    navigation.navigate('Chat', { chatId: chat.id, chatName: chat.name });
  };

  return (
    <SafeAreaViewChatList style={stylesChatList.safeArea}>
      <StatusBarChatList barStyle="light-content" backgroundColor={'#1C1C1E'} /> {/* Usando StatusBarChatList (alias para StatusBar) */}
      <ScreenHeaderChatList navigation={navigation} />
      <FlatListChat
        data={MOCK_CHATS}
        renderItem={({ item }) => (
          <ChatListItem item={item} onPress={() => handleChatPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={stylesChatList.listContentContainer}
        ItemSeparatorComponent={() => <ViewChatList style={stylesChatList.separator} />}
        ListEmptyComponent={<TextChatList style={stylesChatList.emptyListText}>Nenhuma conversa iniciada.</TextChatList>}
      />
    </SafeAreaViewChatList>
  );
};

const stylesChatList = StyleSheetChatList.create({
  safeArea: { flex: 1, backgroundColor: '#1C1C1E' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  headerActionPlaceholder: { width: 28 }, 
  listContentContainer: { paddingHorizontal: 0, paddingTop: 10, flexGrow:1 }, 
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingVertical: 12, paddingHorizontal:16, borderBottomWidth:1, borderBottomColor: '#2C2C2E'},
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  itemTextContainer: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  itemLastMessage: { fontSize: 14, color: '#AEAEB2', marginTop: 2 },
  itemMetaContainer: { alignItems: 'flex-end' },
  itemTimestamp: { fontSize: 12, color: '#8E8E93' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0A84FF', marginTop: 5 },
  separator: { height: 1, backgroundColor: '#2C2C2E', marginLeft: 78 }, 
  emptyListText: { textAlign:'center', marginTop: 50, fontSize:16, color:'#AEAEB2'},
});
export default ChatListScreen;