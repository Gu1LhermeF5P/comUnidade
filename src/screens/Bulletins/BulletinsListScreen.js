import React, { useEffect, useState, useCallback } from 'react'; 
import {SafeAreaView, View,Text,FlatList,TouchableOpacity,StyleSheet,StatusBar, 
ActivityIndicator, RefreshControl,Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { getBulletins } from '../../services/bulletinService'; 

const BulletinItem = ({ item, onPress }) => {
  let iconColor = '#4ECDC4'; 
  let itemSeverity = item.severity || 'Info'; 

  if (itemSeverity.toLowerCase() === 'critical' || itemSeverity.toLowerCase() === 'alerta') {
    iconColor = '#FF6B6B'; 
  } else if (itemSeverity.toLowerCase() === 'warning' || itemSeverity.toLowerCase() === 'cuidado') {
    iconColor = '#FFD166'; 
  }

  const formattedTimestamp = item.timestamp 
    ? new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
    : 'N/A';
  const formattedDate = item.timestamp 
    ? new Date(item.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) 
    : '';

  return (
    <TouchableOpacity style={stylesBulletins.itemContainer} onPress={onPress}>
      <View style={[stylesBulletins.itemIconContainer, { backgroundColor: iconColor }]}>
        <Icon name="alert-circle-outline" size={28} color="#FFFFFF" />
      </View>
      <View style={stylesBulletins.itemTextContainer}>
        <Text style={stylesBulletins.itemSender}>{item.username || item.title || 'Boletim'}</Text> 
        <Text style={stylesBulletins.itemTitle} numberOfLines={1}>{item.location || item.content?.substring(0,50) || 'Detalhes não disponíveis'}</Text>
      </View>
      <View style={stylesBulletins.itemTimeContainer}>
        <Text style={stylesBulletins.itemTimestamp}>{formattedTimestamp}</Text>
        {formattedDate ? <Text style={stylesBulletins.itemTimeAgo}>{formattedDate}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const ScreenHeaderBulletins = ({ navigation }) => ( 
  <View style={stylesBulletins.customHeaderContainer}>
    <View style={stylesBulletins.headerIconPlaceholder} />
    <Text style={stylesBulletins.customHeaderTitle}>Boletins</Text>
    <TouchableOpacity onPress={() => navigation.navigate('CreateBulletin')} style={stylesBulletins.headerActionButton}>
      <Icon name="plus-circle-outline" size={28} color="#0A84FF" />
    </TouchableOpacity>
  </View>
);

const BulletinsListScreen = ({ navigation }) => {
  const [bulletins, setBulletins] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [isRefreshing, setIsRefreshing] = useState(false); 

  const fetchBulletinsData = useCallback(async () => { 
    if(!isRefreshing) setIsLoading(true);
    setError(null);
    try {
      const response = await getBulletins(); 
      if (response && response.content) { 
        setBulletins(response.content);
      } else if (Array.isArray(response)) { 
        setBulletins(response.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)));
      }
      else {
        setBulletins([]); 
        console.warn("Resposta da API de boletins não está no formato esperado:", response);
      }
    } catch (e) {
      console.error("Erro na tela ao buscar boletins da API:", e);
      setError(e.message || 'Ocorreu um erro ao buscar os boletins. Tente novamente.');
      setBulletins([]); 
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]); 

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBulletinsData();
    });
    return unsubscribe; 
  }, [navigation, fetchBulletinsData]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchBulletinsData(); 
  }, [fetchBulletinsData]);

  const handleBulletinPress = (bulletin) => {
    navigation.navigate('BulletinDetail', { bulletinData: bulletin, bulletinId: bulletin.id }); 
  };

  if (isLoading && bulletins.length === 0 && !isRefreshing) {
    return (
      <SafeAreaView style={stylesBulletins.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={'#121212'} />
        <ScreenHeaderBulletins navigation={navigation} />
        <View style={stylesBulletins.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
          <Text style={stylesBulletins.loadingText}>A carregar boletins da API...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={stylesBulletins.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={'#121212'} />
      <ScreenHeaderBulletins navigation={navigation} />
      {error && !isRefreshing && ( 
        <View style={stylesBulletins.errorContainer}>
          <Text style={stylesBulletins.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchBulletinsData} style={stylesBulletins.retryButton}>
            <Text style={stylesBulletins.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={bulletins} 
        renderItem={({ item }) => (
          <BulletinItem item={item} onPress={() => handleBulletinPress(item)} />
        )}
        keyExtractor={(item) => String(item.id)} 
        contentContainerStyle={stylesBulletins.listContentContainer}
        ItemSeparatorComponent={() => <View style={stylesBulletins.separator} />}
        ListEmptyComponent={() => (
          !isLoading && !error && ( 
            <View style={stylesBulletins.centeredMessageContainer}>
              <Icon name="information-off-outline" size={60} color="#555"/>
              <Text style={stylesBulletins.emptyListText}>Nenhum boletim encontrado na API.</Text>
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

const stylesBulletins = StyleSheet.create({
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
  emptyListText: { fontSize: 16, color: '#AEAEB2', textAlign: 'center', marginTop: 10 },
  container: { backgroundColor: '#121212' }, 
});

export default BulletinsListScreen;

