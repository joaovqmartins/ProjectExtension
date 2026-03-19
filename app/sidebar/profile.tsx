import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft, Edit2, Settings, CreditCard, ShieldCheck, Copy, Camera } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker'; // Importando a biblioteca

export default function Profile() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  // Estado para armazenar a URI da imagem selecionada
  const [profileImage, setProfileImage] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Carrega o nome
    const name = await AsyncStorage.getItem("apportionUser");
    setUserName(name || "Usuário");
    
    // Carrega a imagem salva (se houver)
    const savedImage = await AsyncStorage.getItem("apportionUserProfileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
    
    // Gerando um ID fictício (como antes)
    const id = Math.random().toString(36).substring(2, 7).toUpperCase();
    setUserId(`#${id}`);
  };

  // FUNÇÃO PARA SELECIONAR IMAGEM DA GALERIA
  const pickImage = async () => {
    // 1. Pede permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Permissão Necessária", "Precisamos de acesso às suas fotos para alterar o perfil.");
      return;
    }

    // 2. Abre a galeria
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas fotos
      allowsEditing: true, // Permite cortar/girar
      aspect: [1, 1], // Força um corte quadrado
      quality: 0.8, // Qualidade da imagem (0 a 1)
    });

    // 3. Verifica se o usuário não cancelou
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri); // Atualiza a tela instantaneamente
      // Salva o caminho da imagem persistentemente
      await AsyncStorage.setItem("apportionUserProfileImage", uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header (Mantido) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit2 color="#9d5da3" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Seção da Foto/Avatar ATUALIZADA */}
        <View style={styles.avatarContainer}>
          <View style={styles.imageWrapper}>
            {/* Lógica Condicional para Foto */}
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} // Carrega a foto da galeria
                style={styles.profileImageFull} 
                resizeMode="cover" // Cobre todo o espaço
              />
            ) : (
              // Se não tiver foto, mostra a logo como padrão
              <Image 
                source={require("../../assets/images/logo.png")} 
                style={styles.profileImageDefault}
                resizeMode="contain"
              />
            )}
            
            {/* Botão flutuante para trocar foto */}
            <TouchableOpacity style={styles.changePictureBadge} onPress={pickImage}>
              <Camera color="#fff" size={16} />
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>{userName}</Text>
          <TouchableOpacity style={styles.idBadge}>
            <Text style={styles.idText}>ID: {userId}</Text>
            <Copy color="#a1a1aa" size={14} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Menu de Opções (Mantido) */}
        <View style={styles.menuSection}>
          <Text style={styles.menuLabel}>Conta</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#3f2641' }]}><Settings color="#9d5da3" size={22} /></View>
            <Text style={styles.menuItemText}>Configurações</Text>
            <ArrowLeft color="#3f3f46" size={20} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          {/* ... outras opções ... */}
        </View>

        <Text style={styles.versionText}>Apportion v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15, marginTop: 10 },
  backButton: { padding: 8 },
  editButton: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: { alignItems: "center", paddingBottom: 40 },
  
  // Avatar Styles ATUALIZADOS
  avatarContainer: { alignItems: "center", marginTop: 20, marginBottom: 30 },
  imageWrapper: { 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    backgroundColor: "#2d2d2d", 
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#5b365d",
    marginBottom: 15,
    position: 'relative', // Essencial para o badge flutuante
  },
  // Estilo para quando a foto da galeria é carregada (cover)
  profileImageFull: { width: "100%", height: "100%", borderRadius: 67 }, // Ligeiramente menor que o wrapper para borda
  // Estilo para a logo padrão (contain)
  profileImageDefault: { width: "90%", height: "90%" },
  
  changePictureBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#9d5da3', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1e1e1e' // Borda na cor do fundo para dar destaque
  },

  nameText: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  idBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#2d2d2d", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 8, borderWidth: 1, borderColor: "#3f3f46" },
  idText: { color: "#a1a1aa", fontSize: 14, fontWeight: "500" },
  menuSection: { width: "100%", paddingHorizontal: 20, marginTop: 10 },
  menuLabel: { color: "#71717a", fontSize: 14, fontWeight: "600", marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#2d2d2d", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#3f3f46" },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  menuItemText: { flex: 1, color: "#fff", fontSize: 16, marginLeft: 15, fontWeight: "500" },
  versionText: { color: "#3f3f46", fontSize: 12, marginTop: 20 }
});