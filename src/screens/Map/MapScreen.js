import React from 'react'; 
import { View as ViewMap, Text as TextMap, StyleSheet as StyleSheetMap, SafeAreaView as SafeAreaViewMap, TouchableOpacity as TouchableOpacityMap, StatusBar as StatusBarMap } from 'react-native'; // Adicionado StatusBarMap
// import MapView, { Marker } from 'react-native-maps'; 

const MapScreen = ({ navigation }) => {

  const ScreenHeaderMap = () => (
    <ViewMap style={stylesMap.headerContainer}>
      <TouchableOpacityMap onPress={() => navigation.goBack()} style={stylesMap.backButton}>
         <TextMap style={stylesMap.backButtonText}>‹</TextMap>
      </TouchableOpacityMap>
      <TextMap style={stylesMap.headerTitle}>Mapa e Recursos</TextMap>
      <TouchableOpacityMap onPress={() => console.log("Adicionar Ponto")} style={stylesMap.actionButton}>
        <TextMap style={stylesMap.backButtonText}>+</TextMap>
      </TouchableOpacityMap>
    </ViewMap>
  );

  return (
    <SafeAreaViewMap style={stylesMap.safeArea}>
      <StatusBarMap barStyle="light-content" backgroundColor={'#1C1C1E'} /> {/* Usando StatusBarMap (alias para StatusBar) */}
      <ScreenHeaderMap />
      <ViewMap style={stylesMap.mapPlaceholder}>
        <TextMap style={stylesMap.mapPlaceholderText}>Componente de Mapa Offline aqui</TextMap>
        <TextMap style={stylesMap.mapPlaceholderSubText}>(Ex: Imagem do mapa da área ou tiles pré-carregados)</TextMap>
      </ViewMap>
      <ViewMap style={stylesMap.legendContainer}>
        <TextMap style={stylesMap.legendTitle}>Legenda:</TextMap>
        <ViewMap style={stylesMap.legendItem}><ViewMap style={[stylesMap.legendColorBox, {backgroundColor: '#4CAF50'}]} /><TextMap style={stylesMap.legendText}>Abrigo Seguro</TextMap></ViewMap>
        <ViewMap style={stylesMap.legendItem}><ViewMap style={[stylesMap.legendColorBox, {backgroundColor: '#2196F3'}]} /><TextMap style={stylesMap.legendText}>Ponto de Água</TextMap></ViewMap>
        <ViewMap style={stylesMap.legendItem}><ViewMap style={[stylesMap.legendColorBox, {backgroundColor: '#FFC107'}]} /><TextMap style={stylesMap.legendText}>Área de Cuidado</TextMap></ViewMap>
        <ViewMap style={stylesMap.legendItem}><ViewMap style={[stylesMap.legendColorBox, {backgroundColor: '#F44336'}]} /><TextMap style={stylesMap.legendText}>Zona de Perigo</TextMap></ViewMap>
      </ViewMap>
    </SafeAreaViewMap>
  );
};

const stylesMap = StyleSheetMap.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  backButton: { padding: 10 },
  backButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 28 },
  headerTitle: { flex:1, textAlign:'center', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  actionButton: { padding: 10 },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E', 
    margin:10,
    borderRadius:10,
  },
  mapPlaceholderText: { fontSize: 18, color: '#AEAEB2', fontWeight:'bold' },
  mapPlaceholderSubText: { fontSize: 14, color: '#8E8E93', marginTop:5 },
  legendContainer: { padding: 15, backgroundColor: '#1C1C1E', borderTopWidth:1, borderTopColor:'#3A3A3C'},
  legendTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  legendItem: { flexDirection:'row', alignItems:'center', marginBottom:5},
  legendColorBox: {width:15, height:15, borderRadius:3, marginRight:10},
  legendText: {fontSize:14, color:'#E0E0E0'},
});

export default MapScreen;
