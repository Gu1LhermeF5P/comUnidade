import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Alert, ActivityIndicator, Platform 
} from 'react-native';
import { createBulletin as createBulletinService } from '../../services/bulletinService';

const CreateBulletinScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [severity, setSeverity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim() || !content.trim() || !severity) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha título, local, descrição e selecione a gravidade.');
      return;
    }
    setIsSubmitting(true);
    try {
      const bulletinData = { 
        title, 
        location, 
        content, 
        severity,
      };
      const result = await createBulletinService(bulletinData); 
      if (result) {
        Alert.alert('Sucesso!', 'Boletim criado e enviado com sucesso.');
        navigation.goBack(); 
      } else {
        Alert.alert('Erro ao Criar', 'Não foi possível criar o boletim. Verifique os logs ou tente novamente.');
      }
    } catch (error) {
      console.error("Erro ao criar boletim na tela:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.messages?.join(', ') || error.message || 'Ocorreu um erro ao comunicar com o servidor.';
      Alert.alert('Erro na API', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
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

const styles = StyleSheet.create({ 
  safeArea: { flex: 1, backgroundColor: '#121212' },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
    backgroundColor: '#121212' 
  },
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