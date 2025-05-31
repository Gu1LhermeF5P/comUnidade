import React, { useEffect, useState, useCallback } from 'react'; 
import {
  SafeAreaView, // Removido alias
  View,         // Removido alias
  Text,         // Removido alias
  FlatList,
  TouchableOpacity, // Removido alias
  StyleSheet,     // Removido alias
  StatusBar,      // Removido alias
  ActivityIndicator, 
  RefreshControl, 
  Platform      // Adicionado Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Removido alias
import { getBulletins } from '../../services/bulletinService'; 

const BulletinItem = ({ item, onPress }) => {
  let iconColor = '#4ECDC4'; 
  if (item.severity === 'critical' || item.severity === 'Alerta') {
    iconColor = '#FF6B6B'; 
  } else if (item.severity === 'warning' || item.severity === 'Cuidado') {
    iconColor = '#FFD166'; 
  }

  const formattedTimestamp = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const timeAgo = item.timeAgo || (item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '');


  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={[styles.itemIconContainer, { backgroundColor: iconColor }]}>
        <Icon name="alert-circle-outline" size={28} color="#FFFFFF" />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemSender}>{item.sender || item.title || 'Boletim'}</Text>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.location || item.content?.substring(0,50) || 'Detalhes não disponíveis'}</Text>
      </View>
      <View style={styles.itemTimeContainer}>
        <Text style={styles.itemTimestamp}>{formattedTimestamp}</Text>
        {timeAgo ? <Text style={styles.itemTimeAgo}>{timeAgo}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};


const ScreenHeaderBulletins = ({ navigation }) => ( 
  <View style={styles.customHeaderContainer}> {/* Aplicando estilo do header customizado */}
    <View style={styles.headerIconPlaceholder} /> {/* Placeholder para alinhar o título */}
    <Text style={styles.customHeaderTitle}>Boletins</Text> {/* Título com estilo customizado */}
    <TouchableOpacity onPress={() => navigation.navigate('CreateBulletin')} style={styles.headerActionButton}>
      <Icon name="plus-circle-outline" size={28} color="#0A84FF" />
    </TouchableOpacity>
  </View>
);

const BulletinsListScreen = ({ navigation }) => {
  const [bulletins, setBulletins] = useState([]); // Removido alias setBulletinsLocal
  const [isLoading, setIsLoading] = useState(false); // Removido alias setIsLoadingLocal
  const [error, setError] = useState(null); // Removido alias setErrorLocal
  const [isRefreshing, setIsRefreshing] = useState(false); // Removido alias setIsRefreshingLocal

  const fetchBulletinsData = useCallback(async () => { 
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBulletins(); 
      if (data) {
        const sortedData = data.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        setBulletins(sortedData);
      } else {
        setBulletins([]);
      }
    } catch (e) {
      console.error("Erro na tela ao buscar boletins:", e);
      setError(e.message || 'Ocorreu um erro ao buscar os boletins. Tente novamente.');
      setBulletins([]); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBulletinsData();
    });
    fetchBulletinsData();
    return unsubscribe; 
  }, [navigation, fetchBulletinsData]);


  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchBulletinsData();
    setIsRefreshing(false);
  }, [fetchBulletinsData]);

  const handleBulletinPress = (bulletin) => {
    navigation.navigate('BulletinDetail', { bulletinData: bulletin });
  };

  if (isLoading && bulletins.length === 0 && !isRefreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeaderBulletins navigation={navigation} />
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
          <Text style={styles.loadingText}>A carregar boletins...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={styles.container?.backgroundColor || '#121212'} />
      <ScreenHeaderBulletins navigation={navigation} />
      {error && !isRefreshing && ( 
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchBulletinsData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={bulletins}
        renderItem={({ item }) => (
          <BulletinItem item={item} onPress={() => handleBulletinPress(item)} />
        )}
        keyExtractor={(item) => String(item.id)} 
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          !isLoading && !error && ( 
            <View style={styles.centeredMessageContainer}>
              <Text style={styles.emptyListText}>Nenhum boletim encontrado.</Text>
            </View>
          )
        )}
        refreshControl={ 
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#0A84FF" 
            colors={["#0A84FF"]} 
          />
        }
      />
    </SafeAreaView>
  );
};

// Renomeado stylesBulletins para styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' }, // Cor de fundo da SafeAreaView
  // Estilos do header customizado (copiados/adaptados do HomeScreen e ChatListScreen)
  customHeaderContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#1C1C1E', // Cor de fundo do header
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  customHeaderTitle: { 
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    // flex: 1, // Removido para melhor alinhamento com placeholders
    // textAlign: 'center', 
  },
  headerIconPlaceholder: { // Para alinhar o título se não houver ícone à esquerda
    width: 28, // Deve corresponder à largura do ícone da direita
  },
  headerActionButton: { // Para o botão de ação (ícone de +)
    padding: 5, 
  },
  // Estilos restantes da BulletinsListScreen
  listContentContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20, flexGrow: 1 }, 
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2C2C2E', padding: 15, borderRadius: 10 },
  itemIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTextContainer: { flex: 1 },
  itemSender: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  itemTitle: { fontSize: 14, color: '#E0E0E0', marginTop: 2 },
  itemTimeContainer: { alignItems: 'flex-end' },
  itemTimestamp: { fontSize: 14, fontWeight: '600', color: '#4A90E2' }, 
  itemTimeAgo: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  separator: { height: 10 },
  centeredMessageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#AEAEB2' },
  errorContainer: { backgroundColor: '#FFD2D2', padding: 15, marginHorizontal: 16, marginTop: 10, borderRadius: 8, alignItems: 'center' },
  errorText: { color: '#D8000C', fontSize: 15, textAlign: 'center', marginBottom:10 },
  retryButton: { backgroundColor: '#0A84FF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  retryButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  emptyListText: { fontSize: 16, color: '#AEAEB2', textAlign: 'center' },
  container: { backgroundColor: '#1C1C1E' }, // Usado para a cor de fundo da StatusBar
});

export default BulletinsListScreen;

