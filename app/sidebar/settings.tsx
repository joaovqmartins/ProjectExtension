import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert
} from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  ArrowLeft, Bell, Lock, Eye, 
  Globe, Moon, Trash2, ChevronRight, Info 
} from "lucide-react-native";

export default function Settings() {
  const router = useRouter();
  
  // Estados para os botões de ligar/desligar
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      "Limpar Dados",
      "Isso apagará todos os seus grupos e despesas. Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, Limpar", 
          style: "destructive", 
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/");
          } 
        }
      ]
    );
  };

  const SettingItem = ({ icon: Icon, label, value, onValueChange, type = "toggle", onPress }: any) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={type === "toggle"}
    >
      <View style={styles.iconContainer}>
        <Icon color="#9d5da3" size={20} />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
      
      {type === "toggle" ? (
        <Switch
          trackColor={{ false: "#3f3f46", true: "#5b365d" }}
          thumbColor={value ? "#9d5da3" : "#a1a1aa"}
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <ChevronRight color="#3f3f46" size={20} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Preferências</Text>
        <View style={styles.sectionCard}>
          <SettingItem 
            icon={Bell} 
            label="Notificações Push" 
            value={notifications} 
            onValueChange={setNotifications} 
          />
          <SettingItem 
            icon={Moon} 
            label="Modo Escuro" 
            value={darkMode} 
            onValueChange={setDarkMode} 
          />
          <SettingItem 
            icon={Globe} 
            label="Idioma" 
            type="link" 
            onPress={() => {}} 
          />
        </View>

        <Text style={styles.sectionTitle}>Segurança</Text>
        <View style={styles.sectionCard}>
          <SettingItem 
            icon={Lock} 
            label="Usar Biometria" 
            value={biometrics} 
            onValueChange={setBiometrics} 
          />
          <SettingItem 
            icon={Eye} 
            label="Privacidade do Perfil" 
            type="link" 
            onPress={() => {}} 
          />
        </View>

        <Text style={styles.sectionTitle}>Suporte</Text>
        <View style={styles.sectionCard}>
          <SettingItem 
            icon={Info} 
            label="Sobre o Apportion" 
            type="link" 
            onPress={() => {}} 
          />
        </View>

        <Text style={styles.sectionTitle}>Conta</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
          <Trash2 color="#ef4444" size={20} />
          <Text style={styles.dangerText}>Limpar Todos os Dados</Text>
        </TouchableOpacity>

      </ScrollView>
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
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  backButton: { padding: 8 },
  
  scrollContent: { padding: 20 },
  sectionTitle: { 
    color: "#71717a", 
    fontSize: 13, 
    fontWeight: "700", 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    marginBottom: 12,
    marginTop: 10
  },
  sectionCard: { 
    backgroundColor: "#2d2d2d", 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#3f3f46",
    overflow: 'hidden'
  },
  settingItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3f3f46"
  },
  iconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: "#3f2641", 
    justifyContent: "center", 
    alignItems: "center",
    marginRight: 15
  },
  itemLabel: { flex: 1, color: "#fff", fontSize: 16, fontWeight: "500" },
  
  dangerButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "#3f1a1a", 
    padding: 16, 
    borderRadius: 16, 
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ef444422"
  },
  dangerText: { color: "#ef4444", fontSize: 16, fontWeight: "bold", marginLeft: 10 }
});