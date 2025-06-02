import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Image, ScrollView, 
TextInput, Alert,Modal,Platform,FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; 

const MAP_IMAGE_URI_KEY = '@ComUnidade:localMapImageUri'; 
const MAP_POINTS_STORAGE_KEY = '@ComUnidade:mapPoints';

const CATEGORIES = [
    { name: 'Geral', icon: 'map-marker-outline', color: '#757575' },
    { name: 'Abrigo', icon: 'home-roof', color: '#4CAF50' },
    { name: 'Água', icon: 'water-pump', color: '#2196F3' },
    { name: 'Comida', icon: 'food-apple-outline', color: '#FF9800' },
    { name: 'Perigo', icon: 'alert-octagon-outline', color: '#F44336' },
    { name: 'Ajuda Médica', icon: 'medical-bag', color: '#E91E63' },
    { name: 'Ponto de Encontro', icon: 'account-group-outline', color: '#9C27B0'}
];

const getCategoryDetails = (categoryName) => {
    const category = CATEGORIES.find(cat => cat.name === categoryName);
    return category || CATEGORIES[0]; 
};

const PointOfInterestItem = ({ point, onDelete }) => {
    const categoryDetails = getCategoryDetails(point.category);
    return (
        <View style={[styles.pointItemContainer, { borderLeftColor: categoryDetails.color }]}>
            <View style={styles.pointItemHeader}>
                <Icon name={categoryDetails.icon} size={24} color={categoryDetails.color} style={styles.pointItemIcon} />
                <Text style={styles.pointItemTitle}>{point.title}</Text>
                <TouchableOpacity onPress={() => onDelete(point.id)}>
                    <Icon name="trash-can-outline" size={22} color="#FF6B6B"/>
                </TouchableOpacity>
            </View>
            <Text style={styles.pointItemCategoryValue}>Categoria: {point.category || 'Geral'}</Text>
            {point.notes && <Text style={styles.pointItemNotes}>Observações: {point.notes}</Text>}
            <Text style={styles.pointItemTimestamp}>Adicionado: {new Date(point.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
        </View>
    );
};

const MapScreen = ({ navigation }) => {
  const [localMapImageUri, setLocalMapImageUri] = useState(null); 
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPointTitle, setNewPointTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name); 
  const [newPointNotes, setNewPointNotes] = useState('');

  
  const loadMapData = useCallback(async () => {
    try {
      const storedImageUri = await AsyncStorage.getItem(MAP_IMAGE_URI_KEY);
      if (storedImageUri !== null) {
        setLocalMapImageUri(storedImageUri);
      }
      const storedPoints = await AsyncStorage.getItem(MAP_POINTS_STORAGE_KEY);
      if (storedPoints !== null) {
        setPointsOfInterest(JSON.parse(storedPoints).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do mapa:", e);
    }
  }, []);

  useEffect(() => {
    loadMapData();
    const unsubscribe = navigation.addListener('focus', loadMapData); 
    return unsubscribe;
  }, [navigation, loadMapData]);

  const savePoints = async (newPoints) => {
    try {
      const jsonValue = JSON.stringify(newPoints);
      await AsyncStorage.setItem(MAP_POINTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Erro ao guardar pontos do mapa:", e);
    }
  };

  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão Necessária", "Você precisa de conceder acesso à galeria para selecionar uma imagem de mapa.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], 
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setLocalMapImageUri(selectedImageUri);
      try {
        await AsyncStorage.setItem(MAP_IMAGE_URI_KEY, selectedImageUri);
        Alert.alert("Mapa Atualizado", "A imagem do mapa local foi atualizada com sucesso!");
      } catch (e) {
        console.error("Erro ao guardar URI da imagem do mapa:", e);
        Alert.alert("Erro", "Não foi possível guardar a imagem do mapa selecionada.");
      }
    }
  };

  
  const handleClearMapImage = async () => {
    Alert.alert(
        "Remover Mapa",
        "Tem a certeza que deseja remover a imagem do mapa local atual?",
        [
            {text: "Cancelar", style: "cancel"},
            {text: "Remover", style: "destructive", onPress: async () => {
                setLocalMapImageUri(null);
                try {
                    await AsyncStorage.removeItem(MAP_IMAGE_URI_KEY);
                } catch (e) { console.error("Erro ao remover URI da imagem do mapa:", e); }
            }}
        ]
    );
  };

  const handleAddPoint = () => {
    if (!newPointTitle.trim()) {
      Alert.alert("Campo Obrigatório", "Por favor, insira um título para o ponto de interesse.");
      return;
    }
    const newPoint = {
      id: String(Date.now()),
      title: newPointTitle,
      category: selectedCategory,
      notes: newPointNotes,
      timestamp: new Date().toISOString(),
    };
    const updatedPoints = [newPoint, ...pointsOfInterest].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    setPointsOfInterest(updatedPoints);
    savePoints(updatedPoints);
    setModalVisible(false);
    setNewPointTitle('');
    setSelectedCategory(CATEGORIES[0].name);
    setNewPointNotes('');
  };

  const handleDeletePoint = (id) => {
    Alert.alert(
        "Confirmar Exclusão",
        "Tem a certeza que deseja excluir este ponto de interesse?",
        [
            {text: "Cancelar", style: "cancel"},
            {text: "Excluir", style: "destructive", onPress: () => {
                const updatedPoints = pointsOfInterest.filter(point => point.id !== id);
                setPointsOfInterest(updatedPoints);
                savePoints(updatedPoints);
            }}
        ]
    );
  };

  const ScreenHeaderMap = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
         <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Mapa e Recursos</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.actionButtonHeader}>
        <Icon name="map-marker-plus-outline" size={28} color="#0A84FF" />
      </TouchableOpacity>
    </View>
  );
  
  const renderListHeader = () => (
    <>
      <View style={styles.mapActionsContainer}>
        <TouchableOpacity style={styles.mapActionButton} onPress={pickImage}>
            <Icon name="image-plus" size={20} color="#FFFFFF" style={{marginRight: 8}}/>
            <Text style={styles.mapActionButtonText}>Selecionar Mapa</Text>
        </TouchableOpacity>
        {localMapImageUri && (
            <TouchableOpacity style={[styles.mapActionButton, styles.clearMapButton]} onPress={handleClearMapImage}>
                <Icon name="image-remove" size={20} color="#FFFFFF" style={{marginRight: 8}}/>
                <Text style={styles.mapActionButtonText}>Remover Mapa</Text>
            </TouchableOpacity>
        )}
      </View>
      <View style={styles.mapImageContainer}>
        {localMapImageUri ? (
          <Image source={{ uri: localMapImageUri }} style={styles.mapImage} resizeMode="contain" />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Icon name="map-search-outline" size={60} color="#555" />
            <Text style={styles.mapPlaceholderText}>Nenhum Mapa Local Selecionado</Text>
            <Text style={styles.mapPlaceholderSubText}>
              Toque em "Selecionar Mapa" acima para escolher uma imagem da sua galeria.
            </Text>
            <Text style={styles.mapInstructionText}>
              Dica: Use o Google Maps para fazer download de uma área offline e tire um screenshot.
            </Text>
          </View>
        )}
      </View>
      <View style={styles.pointsListSectionHeader}>
        <Text style={styles.pointsListTitle}>Pontos de Interesse Adicionados:</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={'#1C1C1E'} />
      <ScreenHeaderMap />
      <FlatList
        data={pointsOfInterest}
        renderItem={({item}) => <PointOfInterestItem point={item} onDelete={handleDeletePoint} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={ 
            <View style={styles.emptyPointsContainer}>
                <Icon name="information-off-outline" size={40} color="#555" />
                <Text style={styles.emptyPointsText}>Nenhum ponto adicionado ainda. Toque em (+) no cabeçalho para adicionar.</Text>
            </View>
        }
        contentContainerStyle={styles.listContentContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Adicionar Ponto de Interesse</Text>
                <TextInput
                    style={styles.modalInput}
                    placeholder="Título / Descrição Curta*"
                    placeholderTextColor="#8E8E93"
                    value={newPointTitle}
                    onChangeText={setNewPointTitle}
                />
                <Text style={styles.modalLabel}>Categoria:</Text>
                <View style={styles.categorySelectorContainer}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity 
                            key={cat.name} 
                            style={[
                                styles.categoryButton, 
                                selectedCategory === cat.name && { backgroundColor: cat.color, borderColor: cat.color }
                            ]} 
                            onPress={() => setSelectedCategory(cat.name)}
                        >
                            <Icon name={cat.icon} size={18} color={selectedCategory === cat.name ? '#FFFFFF' : cat.color} style={{marginRight: 5}}/>
                            <Text style={[styles.categoryButtonText, selectedCategory === cat.name && {color: '#FFFFFF'}]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    style={[styles.modalInput, styles.modalTextArea]}
                    placeholder="Observações adicionais..."
                    placeholderTextColor="#8E8E93"
                    value={newPointNotes}
                    onChangeText={setNewPointNotes}
                    multiline
                    numberOfLines={3}
                />
                <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, styles.modalButtonSave]} onPress={handleAddPoint}>
                        <Text style={styles.modalButtonText}>Guardar Ponto</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  backButton: { padding: 10 },
  backButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 28 },
  headerTitle: { flex:1, textAlign:'center', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  actionButtonHeader: { padding: 10 },
  
  listContentContainer: { 
    paddingBottom: 15, 
  },
  mapActionsContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  mapActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  clearMapButton: {
      backgroundColor: '#D9534F', 
  },
  mapActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mapImageContainer: {
    minHeight: 220, 
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10, 
    marginHorizontal: 15, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    padding: 5, 
    overflow: 'hidden', 
  },
  mapImage: {
    width: '100%',
    height: 210, 
  },
  mapPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, 
  },
  mapPlaceholderText: { fontSize: 17, color: '#FFFFFF', fontWeight:'bold', marginTop:8, marginBottom: 8, textAlign: 'center' }, 
  mapPlaceholderSubText: { fontSize: 13, color: '#AEAEB2', marginTop:5, textAlign:'center', marginBottom: 8 }, 
  mapInstructionText: { fontSize: 12, color: '#E0E0E0', textAlign:'center', width: '100%', marginBottom:4, lineHeight: 16}, 
  
  pointsListSectionHeader: { 
    paddingHorizontal: 15, 
    paddingTop: 10, 
  },
  pointsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15, 
  },
  emptyPointsContainer: { 
    alignItems: 'center',
    paddingTop: 30, 
    paddingBottom:20,
    paddingHorizontal: 15, 
  },
  emptyPointsText: {
    fontSize: 15,
    color: '#AEAEB2',
    textAlign: 'center',
    marginTop: 10,
  },
  pointItemContainer: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12, 
    borderLeftWidth: 5,
    marginHorizontal: 15,
  },
  pointItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, 
  },
  pointItemIcon: {
    marginRight: 10,
  },
  pointItemTitle: {
    fontSize: 17, 
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1, 
  },
  pointItemCategoryValue: { 
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 5, 
    color: '#AEAEB2',
  },
  pointItemNotes: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 8, 
    lineHeight: 18, 
  },
  pointItemTimestamp: {
      fontSize: 11,
      color: '#8E8E93',
      textAlign: 'right',
      marginTop: 5,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 20,
    alignItems: 'stretch', 
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20, 
    textAlign: 'center',
  },
  modalLabel: { 
    fontSize: 14,
    color: '#AEAEB2',
    marginBottom: 5,
    marginTop: 5,
  },
  modalInput: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    marginBottom: 15, 
  },
  modalTextArea: {
      height: 80,
      textAlignVertical: 'top',
  },
  categorySelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', 
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#555', 
    margin: 4,
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#AEAEB2', 
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12, 
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1, 
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#555',
    marginRight: 5,
  },
  modalButtonSave: {
    backgroundColor: '#0A84FF',
    marginLeft: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  }
});

export default MapScreen;
