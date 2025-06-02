import React, { useState as useStateDetail, useEffect as useEffectDetail, useCallback as useCallbackDetail } from 'react'; // Removido alias useCallbackDetailDetail
import { View, Text,StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,StatusBar, 
Alert,ActivityIndicator, RefreshControl 
} from 'react-native';
import { getBulletinById, deleteBulletin as deleteBulletinService } from '../../services/bulletinService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Usando Icon padrão

const BulletinDetailScreen = ({ route, navigation }) => {
  const { bulletinData: initialBulletinData, bulletinId: initialBulletinId } = route.params || {};
  const [bulletin, setBulletin] = useStateDetail(initialBulletinData);
  const [isLoading, setIsLoading] = useStateDetail(!initialBulletinData && !!initialBulletinId); // Renomeado para isLoading
  const [error, setError] = useStateDetail(null); 

  const fetchDetails = useCallbackDetail(async (idToFetch) => {
    if (!idToFetch) {
        if (initialBulletinData) setBulletin(initialBulletinData);
        else setError("ID do boletim não fornecido.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBulletinById(idToFetch);
      if (data) {
        setBulletin(data);
      } else {
        setError("Boletim não encontrado.");
        setBulletin(initialBulletinData);
      }
    } catch (err) {
      console.error("Erro ao buscar detalhes do boletim:", err);
      setError(err.message || "Não foi possível carregar os detalhes deste boletim.");
      setBulletin(initialBulletinData); 
    } finally {
      setIsLoading(false);
    }
  }, [initialBulletinData]);

  useEffectDetail(() => {
    if (!initialBulletinData && initialBulletinId) {
      fetchDetails(initialBulletinId);
    }
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.refresh && (bulletin?.id || initialBulletinId)) {
        fetchDetails(bulletin?.id || initialBulletinId);
        navigation.setParams({ refresh: false }); 
      } else if (route.params?.updatedBulletinData) { 
        setBulletin(route.params.updatedBulletinData);
        navigation.setParams({ updatedBulletinData: null });
      }
    });
    return unsubscribe;
  }, [navigation, route.params?.refresh, route.params?.updatedBulletinData, initialBulletinData, initialBulletinId, bulletin?.id, fetchDetails]);
  

  const handleDelete = () => {
    if (!bulletin?.id) {
        Alert.alert("Erro", "ID do boletim não disponível para exclusão.");
        return;
    }
    Alert.alert(
      "Confirmar Exclusão",
      `Tem a certeza que deseja excluir o boletim "${bulletin.title || 'este boletim'}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            setIsLoading(true); 
            try {
              await deleteBulletinService(bulletin.id);
              Alert.alert("Sucesso", "Boletim excluído com sucesso.");
              navigation.goBack(); 
            } catch (err) { 
              console.error("Erro ao excluir boletim:", err);
              Alert.alert("Erro", err.message || "Não foi possível excluir o boletim.");
              setIsLoading(false);
            }
          } 
        }
      ],
      { cancelable: true }
    );
  };
  
  const handleEdit = () => {
    if (!bulletin) {
        Alert.alert("Erro", "Dados do boletim não disponíveis para edição.");
        return;
    }
    navigation.navigate('EditBulletin', { bulletinData: bulletin });
  };

  const ScreenHeader = () => ( 
    <View style={stylesDetail.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={stylesDetail.backButton}>
         <Text style={stylesDetail.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={stylesDetail.headerTitle} numberOfLines={1}>{bulletin?.title || 'Detalhes'}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={handleEdit} style={stylesDetail.actionButton} disabled={!bulletin || isLoading}>
          <Icon name="pencil-outline" size={24} color={!bulletin || isLoading ? "#555" : "#0A84FF"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={stylesDetail.actionButton} disabled={!bulletin || isLoading}>
          <Icon name="trash-can-outline" size={24} color={!bulletin || isLoading ? "#555" : "#FF6B6B"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={stylesDetail.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={'#121212'} />
        <ScreenHeader />
        <View style={stylesDetail.centeredMessageContainer}><ActivityIndicator size="large" color="#0A84FF" /></View>
      </SafeAreaView>
    );
  }
  
  if (error && !bulletin) { 
     return (
      <SafeAreaView style={stylesDetail.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={'#121212'} />
        <ScreenHeader />
        <View style={stylesDetail.centeredMessageContainer}><Text style={stylesDetail.errorText}>{error}</Text></View>
      </SafeAreaView>
    );
  }
  
  if (!bulletin) { 
     return (
      <SafeAreaView style={stylesDetail.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={'#121212'} />
        <ScreenHeader />
        <View style={stylesDetail.centeredMessageContainer}><Text style={stylesDetail.errorText}>Boletim não encontrado.</Text></View>
      </SafeAreaView>
    );
  }
  
  let iconColorDisplay = '#AEAEB2'; 
  if (bulletin.severity === 'critical' || bulletin.severity === 'Alerta') {
    iconColorDisplay = '#FF6B6B'; 
  } else if (bulletin.severity === 'warning' || bulletin.severity === 'Cuidado') {
    iconColorDisplay = '#FFD166'; 
  } else if (bulletin.severity === 'info' || bulletin.severity === 'Info') {
    iconColorDisplay = '#4A90E2'; 
  }

  return (
    <SafeAreaView style={stylesDetail.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={'#121212'} />
      <ScreenHeader />
      <ScrollView 
        style={stylesDetail.container}
        refreshControl={ 
          <RefreshControl
            refreshing={isLoading} 
            onRefresh={() => fetchDetails(bulletin.id || initialBulletinId)}
            tintColor="#0A84FF"
            colors={["#0A84FF"]}
          />
        }
      >
        <View style={stylesDetail.bulletinHeader}>
          <View style={[stylesDetail.severityIndicator, { backgroundColor: iconColorDisplay }]} />
          <Text style={stylesDetail.bulletinTitle}>{bulletin.title}</Text>
        </View>
        <Text style={stylesDetail.bulletinMeta}>Por: {bulletin.sender || 'N/A'}</Text>
        <Text style={stylesDetail.bulletinMeta}>Local: {bulletin.location || 'N/A'}</Text>
        <Text style={stylesDetail.bulletinTimestamp}>
          Publicado: {bulletin.timestamp ? new Date(bulletin.timestamp).toLocaleString('pt-BR', { dateStyle:'short', timeStyle:'short'}) : 'N/A'}
        </Text>
        <Text style={stylesDetail.bulletinContent}>
          {bulletin.content || `Conteúdo não disponível.`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesDetail = StyleSheet.create({ 
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, padding: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  backButton: { padding: 10 },
  backButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 28 },
  headerTitle: { flex:1, textAlign:'center', fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginHorizontal:5 }, 
  actionButton: { padding: 10 },
  bulletinHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  severityIndicator: { width: 10, height: 20, borderRadius: 3, marginRight: 10 },
  bulletinTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', flexShrink:1 },
  bulletinMeta: { fontSize: 14, color: '#AEAEB2', marginBottom: 5 },
  bulletinTimestamp: { fontSize: 13, color: '#8E8E93', marginBottom: 20, fontStyle:'italic' },
  bulletinContent: { fontSize: 16, color: '#E0E0E0', lineHeight: 24 },
  centeredMessageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding:20 }, 
  errorText: { color: '#FF6B6B', fontSize: 16, textAlign:'center' }, 
});
export default BulletinDetailScreen;