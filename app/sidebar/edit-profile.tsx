import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, SafeAreaView, TextInput, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft, User, Mail, AtSign, Save } from "lucide-react-native";

export default function EditProfile() {
  const router = useRouter();
  
  // Estados para os campos do formulário
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    // Carrega o nome atual (que já usamos no resto do app)
    const currentName = await AsyncStorage.getItem("apportionUser");
    if (currentName) setName(currentName);

    // Carrega outros dados se existirem (como não tínhamos antes, pode vir vazio)
    const currentUsername = await AsyncStorage.getItem("apportionUsername");
    const currentEmail = await AsyncStorage.getItem("apportionEmail");
    
    if (currentUsername) setUsername(currentUsername);
    if (currentEmail) setEmail(currentEmail);
  };

  const handleSave = async () => {
    // Salva as informações de volta no AsyncStorage
    await AsyncStorage.setItem("apportionUser", name);
    await AsyncStorage.setItem("apportionUsername", username);
    await AsyncStorage.setItem("apportionEmail", email);

    // Volta para a tela anterior
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 40 }} /> {/* Espaçador para centralizar o título */}
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.content}>
          
          <Text style={styles.sectionText}>Informações Pessoais</Text>

          {/* Campo: Nome de Exibição */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome de Exibição</Text>
            <View style={styles.inputWrapper}>
              <User color="#71717a" size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor="#71717a"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Campo: Nome de Usuário (@) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome de Usuário</Text>
            <View style={styles.inputWrapper}>
              <AtSign color="#71717a" size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="@usuario"
                placeholderTextColor="#71717a"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Campo: Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Mail color="#71717a" size={20} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#71717a"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botão de Salvar Fixo no Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save color="#fff" size={20} style={{ marginRight: 10 }} />
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    marginTop: 10
  },
  backButton: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  
  content: { padding: 20 },
  sectionText: { 
    color: "#71717a", 
    fontSize: 13, 
    fontWeight: "700", 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    marginBottom: 20 
  },
  
  inputGroup: { marginBottom: 20 },
  label: { color: "#a1a1aa", fontSize: 14, marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3f3f46',
    paddingHorizontal: 15,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 15,
    fontSize: 16,
  },

  footer: { padding: 20, paddingBottom: 30, backgroundColor: "#1e1e1e" },
  saveButton: { 
    flexDirection: 'row',
    backgroundColor: "#5b365d", 
    padding: 18, 
    borderRadius: 15, 
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#9d5da3",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});