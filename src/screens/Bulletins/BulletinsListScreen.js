import React, { useEffect, useState, useCallback } from 'react'; 
import {
  SafeAreaView as SafeAreaViewBulletins, 
  View as ViewBulletins,
  Text as TextBulletins,
  FlatList,
  TouchableOpacity as TouchableOpacityBulletins,
  StyleSheet as StyleSheetBulletins,
  StatusBar as StatusBarBulletins, 
  ActivityIndicator, 
  RefreshControl, 
} from 'react-native';
import IconBulletins from 'react-native-vector-icons/MaterialCommunityIcons'; 
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
    <TouchableOpacityBulletins style={stylesBulletins.itemContainer} onPress={onPress}>
      <ViewBulletins style={[stylesBulletins.itemIconContainer, { backgroundColor: iconColor }]}>
        <IconBulletins name="alert-circle-outline" size={28} color="#FFFFFF" />
      </ViewBulletins>
      <ViewBulletins style={stylesBulletins.itemTextContainer}>
        <TextBulletins style={stylesBulletins.itemSender}>{item.sender || item.title || 'Boletim'}</TextBulletins>
        <TextBulletins style={stylesBulletins.itemTitle} numberOfLines={1}>{item.location || item.content?.substring(0,50) || 'Detalhes não disponíveis'}</TextBulletins>
      </ViewBulletins>
      <ViewBulletins style={stylesBulletins.itemTimeContainer}>
        <TextBulletins style={stylesBulletins.itemTimestamp}>{formattedTimestamp}</TextBulletins>
        {timeAgo ? <TextBulletins style={stylesBulletins.itemTimeAgo}>{timeAgo}</TextBulletins> : null}
      </ViewBulletins>
    </TouchableOpacityBulletins>
  );
};


const ScreenHeaderBulletins = ({ navigation }) => ( 
  <ViewBulletins style={stylesBulletins.headerContainer}>
    <ViewBulletins style={stylesBulletins.headerSidePlaceholder} />
    <TextBulletins style={stylesBulletins.headerTitle}>Boletins</TextBulletins>
    <TouchableOpacityBulletins onPress={() => navigation.navigate('CreateBulletin')} style={stylesBulletins.headerButton}>
      <IconBulletins name="plus-circle-outline" size={28} color="#0A84FF" />
    </TouchableOpacityBulletins>
  </ViewBulletins>
);

const BulletinsListScreen = ({ navigation }) => {
  const [bulletins, setBulletinsLocal] = useState([]); 
  const [isLoading, setIsLoadingLocal] = useState(false); 
  const [error, setErrorLocal] = useState(null); 
  const [isRefreshing, setIsRefreshingLocal] = useState(false); 

  const fetchBulletinsData = useCallback(async () => { 
    setIsLoadingLocal(true);
    setErrorLocal(null);
    try {
      const data = await getBulletins(); 
      if (data) {
        const sortedData = data.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        setBulletinsLocal(sortedData);
      } else {
        setBulletinsLocal([]);
      }
    } catch (e) {
      console.error("Erro na tela ao buscar boletins:", e);
      setErrorLocal(e.message || 'Ocorreu um erro ao buscar os boletins. Tente novamente.');
      setBulletinsLocal([]); 
    } finally {
      setIsLoadingLocal(false);
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
    setIsRefreshingLocal(true);
    await fetchBulletinsData();
    setIsRefreshingLocal(false);
  }, [fetchBulletinsData]);

  const handleBulletinPress = (bulletin) => {
    navigation.navigate('BulletinDetail', { bulletinData: bulletin });
  };

  if (isLoading && bulletins.length === 0 && !isRefreshing) {
    return (
      <SafeAreaViewBulletins style={stylesBulletins.safeArea}>
        <ScreenHeaderBulletins navigation={navigation} />
        <ViewBulletins style={stylesBulletins.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
          <TextBulletins style={stylesBulletins.loadingText}>A carregar boletins...</TextBulletins>
        </ViewBulletins>
      </SafeAreaViewBulletins>
    );
  }

  return (
    <SafeAreaViewBulletins style={stylesBulletins.safeArea}>
      <StatusBarBulletins barStyle="light-content" backgroundColor={stylesBulletins.container?.backgroundColor || '#1C1C1E'} />
      <ScreenHeaderBulletins navigation={navigation} />
      {error && !isRefreshing && ( 
        <ViewBulletins style={stylesBulletins.errorContainer}>
          <TextBulletins style={stylesBulletins.errorText}>{error}</TextBulletins>
          <TouchableOpacityBulletins onPress={fetchBulletinsData} style={stylesBulletins.retryButton}>
            <TextBulletins style={stylesBulletins.retryButtonText}>Tentar Novamente</TextBulletins>
          </TouchableOpacityBulletins>
        </ViewBulletins>
      )}
      <FlatList
        data={bulletins}
        renderItem={({ item }) => (
          <BulletinItem item={item} onPress={() => handleBulletinPress(item)} />
        )}
        keyExtractor={(item) => String(item.id)} 
        contentContainerStyle={stylesBulletins.listContentContainer}
        ItemSeparatorComponent={() => <ViewBulletins style={stylesBulletins.separator} />}
        ListEmptyComponent={() => (
          !isLoading && !error && ( 
            <ViewBulletins style={stylesBulletins.centeredMessageContainer}>
              <TextBulletins style={stylesBulletins.emptyListText}>Nenhum boletim encontrado.</TextBulletins>
            </ViewBulletins>
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
    </SafeAreaViewBulletins>
  );
};

const stylesBulletins = StyleSheetBulletins.create({
  safeArea: { flex: 1, backgroundColor: '#1C1C1E' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  headerSidePlaceholder: { width: 28 }, 
  headerButton: { padding: 5 },
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
  container: { backgroundColor: '#1C1C1E' }, 
});

export default BulletinsListScreen;

