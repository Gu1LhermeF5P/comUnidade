import React from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    ScrollView, 
    StatusBar, // Importado StatusBar diretamente
    Alert // Importado Alert diretamente
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Usando Icon padrão

const SettingItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <Icon name={icon} size={24} color="#AEAEB2" style={styles.itemIcon}/>
        <Text style={styles.itemText}>{title}</Text>
        <Icon name="chevron-right" size={24} color="#AEAEB2"/>
    </TouchableOpacity>
);

const SettingsScreen = ({ navigation }) => {

  const ScreenHeader = () => ( 
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
         <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Configurações</Text>
      <View style={styles.headerActionPlaceholder} />
    </View>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={'#1C1C1E'} />
      <ScreenHeader />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <SettingItem icon="account-circle-outline" title="Editar Perfil Local" onPress={() => console.log("Editar Perfil")} />
      
        <Text style={styles.sectionTitle}>Geral</Text>
        <SettingItem icon="bell-outline" title="Notificações" onPress={() => console.log("Notificações")} /> 
        <View style={{marginTop: 20, marginBottom: 40}}>
            <SettingItem icon="logout" title="Sair (Limpar Dados Locais)" onPress={() => Alert.alert("Sair", "Tem a certeza que deseja limpar os dados locais e sair?")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  safeArea: { flex: 1, backgroundColor: '#121212' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C', backgroundColor: '#1C1C1E' },
  backButton: { padding: 10 },
  backButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 28 },
  headerTitle: { flex:1, textAlign:'center', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  headerActionPlaceholder: { width: 44 },
  container: { flex: 1 },
  sectionTitle: { fontSize: 14, fontWeight:'600', color: '#8E8E93', paddingHorizontal: 20, paddingTop: 25, paddingBottom:10, textTransform:'uppercase' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor:'#303030'}, // Usado hairlineWidth para uma linha mais fina
  itemIcon: {marginRight:15},
  itemText: { flex:1, fontSize: 16, color: '#FFFFFF' },
});

export default SettingsScreen;