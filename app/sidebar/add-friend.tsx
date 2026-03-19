import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, QrCode } from "lucide-react-native";

export default function AddFriend() {
  const [friendId, setFriendId] = useState("");
  const router = useRouter();

  const handleAdd = () => {
    Alert.alert("Sucesso", `Pedido de amizade enviado para ${friendId}`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
        <Text style={styles.title}>Adicionar Amigo</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Digite o ID ou Nome de Usuário</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={styles.input} 
            placeholder="#ABC12 ou @usuario" 
            placeholderTextColor="#71717a"
            value={friendId}
            onChangeText={setFriendId}
          />
          <TouchableOpacity style={styles.qrBtn}><QrCode color="#fff" size={24} /></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mainBtn} onPress={handleAdd}>
          <Text style={styles.mainBtnText}>Enviar Convite</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30, marginTop: 10 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 15 },
  content: { flex: 1 },
  label: { color: "#a1a1aa", marginBottom: 10 },
  inputRow: { flexDirection: "row", marginBottom: 20 },
  input: { flex: 1, backgroundColor: "#2d2d2d", borderRadius: 12, padding: 15, color: "#fff", borderWidth: 1, borderColor: "#3f3f46" },
  qrBtn: { backgroundColor: "#3f2641", marginLeft: 10, padding: 15, borderRadius: 12, justifyContent: "center" },
  mainBtn: { backgroundColor: "#5b365d", padding: 18, borderRadius: 15, alignItems: "center" },
  mainBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});