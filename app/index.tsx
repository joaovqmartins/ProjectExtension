import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Se o usuário já estiver logado, pula para a tela de grupos
    checkUser();
  }, []);

  const checkUser = async () => {
    const user = await AsyncStorage.getItem("apportionUser");
    if (user) router.replace("/groups");
  };

  const handleLogin = async () => {
    if (name.trim()) {
      await AsyncStorage.setItem("apportionUser", name.trim());
      router.replace("/groups");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.inner}>
         <View style={styles.logoPlaceholder}>
            <Image 
              source={require("../assets/images/logo.png")} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Apportion</Text>
          <Text style={styles.subtitle}>Divida despesas de forma justa com seu grupo</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Seu Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Como quer ser chamado?"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e" }, // Fundo escuro
  inner: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  logoPlaceholder: { width: 150, height: 150, marginBottom: 20 },
  logoImage: { width: "100%", height: "100%" },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 16, color: "#a1a1aa", textAlign: "center", marginTop: 8, marginBottom: 40 },
  inputContainer: { width: "100%", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: "#d4d4d8", marginBottom: 8 },
  input: { backgroundColor: "#2d2d2d", borderWidth: 1, borderColor: "#3f3f46", padding: 16, borderRadius: 12, fontSize: 16, color: "#fff" },
  button: { backgroundColor: "#5b365d", width: "100%", padding: 18, borderRadius: 12, alignItems: "center", shadowColor: "#9d5da3", shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});