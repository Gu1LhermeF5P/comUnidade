import React, { useState } from 'react'; // Removido alias useStateCreate
import {
  SafeAreaView, // Removido alias
  View,         // Removido alias
  Text,         // Removido alias
  TextInput,
  TouchableOpacity, // Removido alias
  StyleSheet,     // Removido alias
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createBulletin as createBulletinService } from '../../services/bulletinService';

const CreateBulletinScreen = ({ navigation }) => {
  const [sender, setSender] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [severity, setSeverity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!sender.trim() || !title.trim() || !location.trim() || !content.trim() || !severity) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos e selecione a gravidade.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bulletinData = { sender, title, location, content, severity, timestamp: new Date().toISOString() };
      const result = await createBulletinService(bulletinData);
      if (result) {
        Alert.alert('Sucesso!', 'Boletim criado e enviado com sucesso.');
        navigation.goBack();
      } else {
        Alert.alert('Erro ao Criar', 'Não foi possível criar o boletim. Tente novamente.');
      }
    } catch (error) {
      console.error("Erro ao criar boletim na tela:", error);
      Alert.alert('Erro na API', error.message || 'Ocorreu um erro ao comunicar com o servidor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ScreenHeader = () => ( // Renomeado de ScreenHeaderCreate
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} disabled={isSubmitting}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Criar Boletim</Text>
      <View style={styles.headerActionPlaceholder} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={styles.container?.backgroundColor || '#121212'} />
      <ScreenHeader />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.formGroup}>
          <Text style={styles.label}>REMETENTE</Text>
          <TextInput style={styles.input} placeholder="Seu nome ou da organização" placeholderTextColor="#6E6E73" value={sender} onChangeText={setSender} editable={!isSubmitting} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>TÍTULO (O QUE HOUVE)</Text>
          <TextInput style={styles.input} placeholder="Ex: Falta de energia na Zona Norte" placeholderTextColor="#6E6E73" value={title} onChangeText={setTitle} editable={!isSubmitting} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>LOCAL</Text>
          <TextInput style={styles.input} placeholder="Bairro, rua ou ponto de referência" placeholderTextColor="#6E6E73" value={location} onChangeText={setLocation} editable={!isSubmitting} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>DESCRIÇÃO COMPLETA</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Forneça todos os detalhes relevantes sobre o ocorrido..." 
            placeholderTextColor="#6E6E73" 
            value={content} 
            onChangeText={setContent} 
            multiline 
            numberOfLines={4} 
            editable={!isSubmitting}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>GRAVIDADE</Text>
          <View style={styles.severityContainer}>
            <TouchableOpacity style={[styles.severityButton, severity === 'Alerta' && styles.severityButtonSelectedAlerta]} onPress={() => setSeverity('Alerta')} disabled={isSubmitting}>
              <Text style={[styles.severityButtonText, severity === 'Alerta' && styles.severityButtonTextSelected]}>Alerta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.severityButton, severity === 'Cuidado' && styles.severityButtonSelectedCuidado]} onPress={() => setSeverity('Cuidado')} disabled={isSubmitting}>
              <Text style={[styles.severityButtonText, severity === 'Cuidado' && styles.severityButtonTextSelected]}>Cuidado</Text>
            </TouchableOpacity>
             <TouchableOpacity style={[styles.severityButton, severity === 'Info' && styles.severityButtonSelectedInfo]} onPress={() => setSeverity('Info')} disabled={isSubmitting}>
              <Text style={[styles.severityButtonText, severity === 'Info' && styles.severityButtonTextSelected]}>Info</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Boletim</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Usando 'styles' como nome padrão para o objeto de estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30, backgroundColor: '#121212' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#3A3A3C' },
  backButton: { padding: 10 },
  backButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 28 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  headerActionPlaceholder: { width: 44 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#AEAEB2', marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
  input: { backgroundColor: '#2C2C2E', color: '#FFFFFF', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: '#3A3A3C' },
  textArea: { height: 100, textAlignVertical: 'top'},
  severityContainer: { flexDirection: 'row', justifyContent: 'flex-start', flexWrap:'wrap' },
  severityButton: { backgroundColor: '#2C2C2E', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginRight: 10, marginBottom:10, borderWidth: 1, borderColor: '#3A3A3C' },
  severityButtonSelectedAlerta: { backgroundColor: '#D9534F', borderColor: '#D9534F' },
  severityButtonSelectedCuidado: { backgroundColor: '#F0AD4E', borderColor: '#F0AD4E' },
  severityButtonSelectedInfo: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  severityButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  severityButtonTextSelected: { color: '#FFFFFF' },
  submitButton: { backgroundColor: '#0A84FF', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 20, height:50, justifyContent:'center' },
  submitButtonDisabled: { backgroundColor: '#555555'},
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default CreateBulletinScreen;