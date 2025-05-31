import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    FlatList, 
    TouchableOpacity, 
    StatusBar, 
    Alert, // Alert ainda é usado em handleDeleteChat (que foi removido)
    Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_STORAGE_KEY = '@ComUnidade:chats'; // Mantido caso queira reativar chats locais no futuro
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
        lastMessageTimestamp: new Date(Date.now() + 2000).toISOString(), 
    },
    {
        id: DEFESA_CIVIL_CHAT_ID,
        name: 'Defesa Civil (Alertas)',
        icon: 'shield-alert-outline',
        avatarColor: '#0A84FF',
        description: 'Canal para visualizar informações e alertas importantes da Defesa Civil (simulado).',
        lastMessage: 'Verifique aqui por alertas e informações oficiais.',
        lastMessageTimestamp: new Date(Date.now() + 1000).toISOString(), 
    }
];

const ChatListItem = ({ item, onPress }) => ( // Removido onDeleteChat, pois não haverá chats locais para excluir
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
      <Text style={styles.itemLastMessage} numberOfLines={2}> {/* Aumentado para 2 linhas */}
        {item.lastMessage}
      </Text>
    </View>
    {/* Removido botão de delete individual para simplificar */}
  </TouchableOpacity>
);

// Removido onNewChat do header
const ScreenHeaderChatList = () => ( 
  <View style={styles.customHeaderContainer}>
    {/* Placeholder para alinhar o título, pode ser removido se o título for naturalmente centralizado */}
    <View style={styles.headerIconPlaceholder} /> 
    <Text style={styles.customHeaderTitle}>Canais de Comunicação</Text>
    <View style={styles.headerIconPlaceholder} /> {/* Placeholder para equilibrar o título */}
  </View>
);

const ChatListScreen = ({ navigation }) => {
  // A lista de "chats" agora é apenas os canais fixos.
  // A lógica de carregar/guardar chats do AsyncStorage pode ser removida ou adaptada
  // se você quiser guardar o "lastMessage" dos canais fixos após interação.
  // Por simplicidade, vamos apenas usar a lista de canais fixos.
  const [channels, setChannels] = useState(FIXED_CHANNELS.sort((a,b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)));

  // A função loadChats e saveChats não são mais necessárias se só tivermos canais fixos
  // e não guardarmos o estado da "última mensagem" deles no AsyncStorage.
  // Se quiser guardar a última mensagem enviada pelo utilizador para um canal fixo,
  // a lógica de AsyncStorage precisaria ser mantida e adaptada.

  // useEffect para carregar/atualizar os canais fixos (poderia buscar de uma config ou API no futuro)
  useEffect(() => {
    // Ordena os canais fixos (pode ser útil se a ordem mudar ou se vierem de uma fonte dinâmica)
    setChannels(FIXED_CHANNELS.sort((a,b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)));
  }, []);


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
        // ListEmptyComponent já não é estritamente necessário se sempre tivermos os canais fixos
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  customHeaderContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between', // Mantém o título centralizado com placeholders
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
    flex: 1, // Permite que o título ocupe espaço e se centralize
    textAlign: 'center', // Centraliza o texto
  },
  headerIconPlaceholder: { // Usado para equilibrar o título se não houver botões
    width: 28, // Largura aproximada de um ícone de ação
  },
  // headerActionButton: { // Removido pois não há mais botão de ação no header
  //   padding: 5, 
  // },
  listContentContainer: { paddingHorizontal: 0, paddingTop: 10, flexGrow:1 }, 
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingVertical: 15, paddingHorizontal:16},
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  // bombeirosAvatar e bombeirosName não são mais necessários se a cor e ícone vêm de item.avatarColor e item.icon
  itemTextContainer: { flex: 1 },
  itemName: { fontSize: 17, fontWeight: '600', color: '#FFFFFF', marginBottom: 3 },
  itemLastMessage: { fontSize: 14, color: '#AEAEB2' },
  // deleteChatButton: { padding: 8 }, // Removido
  separator: { height: 1, backgroundColor: '#2C2C2E', }, 
  emptyContainer: { flex:1, justifyContent:'center', alignItems:'center', paddingHorizontal: 20},
  emptyListText: { textAlign:'center', marginTop: 20, fontSize:16, color:'#AEAEB2', lineHeight:24},
});


export default ChatListScreen;