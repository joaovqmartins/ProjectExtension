import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";

export default function Chat() {
  const { name } = useLocalSearchParams();
  const [msg, setMsg] = useState("");
  const router = useRouter();
  
  const [chat, setChat] = useState([
    { id: '1', text: 'Oi! Tudo certo sobre o churrasco?', sender: 'them' },
    { id: '2', text: 'Vou pagar minha parte hoje a noite.', sender: 'me' },
  ]);

  const send = () => {
    if (!msg) return;
    setChat([...chat, { id: Date.now().toString(), text: msg, sender: 'me' }]);
    setMsg("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>

      <FlatList 
        data={chat}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'me' ? styles.myBubble : styles.theirBubble]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputArea}>
          <TextInput 
            style={styles.msgInput} 
            placeholder="Mensagem..." 
            placeholderTextColor="#71717a"
            value={msg}
            onChangeText={setMsg}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send}>
            <Send color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e" },
  header: { flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: "#2d2d2d" },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 15 },
  bubble: { padding: 12, borderRadius: 18, marginBottom: 10, maxWidth: '80%' },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#5b365d', borderBottomRightRadius: 4 },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: '#2d2d2d', borderBottomLeftRadius: 4 },
  bubbleText: { color: '#fff' },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: '#2d2d2d', alignItems: 'center' },
  msgInput: { flex: 1, backgroundColor: '#1e1e1e', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10, color: '#fff' },
  sendBtn: { marginLeft: 10, backgroundColor: '#9d5da3', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' }
});