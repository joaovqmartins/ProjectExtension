import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Image
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft, Search, UserPlus, MessageCircle, MoreVertical } from "lucide-react-native";

// Dados fictícios para simular seus amigos
const FRIENDS_DATA = [
  { id: '1', name: 'Ana Silva', username: '@anasilva', status: 'online' },
  { id: '2', name: 'Bruno Costa', username: '@bruno_c', status: 'offline' },
  { id: '3', name: 'Carla Souza', username: '@carlasouza', status: 'online' },
  { id: '4', name: 'Diego Lima', username: '@diegol', status: 'online' },
  { id: '5', name: 'Fernanda M.', username: '@fer_m', status: 'offline' },
];


export default function Friends() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // 1. Lógica de Filtro (Certifique-se que está exatamente assim)
  const filteredFriends = FRIENDS_DATA.filter(friend => 
    friend.name.toLowerCase().includes(search.toLowerCase()) || 
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  // 2. Função de Renderização (Verifique se item.name está sendo chamado)
  const renderFriend = ({ item }: { item: typeof FRIENDS_DATA[0] }) => (
    <View style={styles.friendCard}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        {item.status === 'online' && <View style={styles.onlineStatus} />}
      </View>
      
      <View style={styles.friendInfo}>
        {/* AQUI É ONDE O NOME APARECE */}
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendUsername}>{item.username}</Text>
      </View>

      <TouchableOpacity 
        style={styles.actionIconButton}
        onPress={() => router.push({ pathname: "/sidebar/chat", params: { name: item.name } })}
      >
        <MessageCircle color="#9d5da3" size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft color="#fff" size={24} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Amigos</Text>
        <TouchableOpacity onPress={() => router.push("/sidebar/add-friend")}>
          <UserPlus color="#9d5da3" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search color="#71717a" size={20} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar amigos..."
            placeholderTextColor="#71717a"
            value={search}
            onChangeText={setSearch} 
          />
        </View>
      </View>

      <FlatList
        data={filteredFriends} // Passando a lista filtrada
        keyExtractor={(item) => item.id}
        renderItem={renderFriend} // Usando a função corrigida acima
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum amigo encontrado.</Text>
        }
      />
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
  iconButton: { padding: 8 },
  
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3f3f46',
    paddingHorizontal: 15,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },

  content: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { color: "#71717a", fontSize: 13, fontWeight: "700", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  
  friendCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#2d2d2d", 
    padding: 12, 
    borderRadius: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3f3f46"
  },
  avatarCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: "#5b365d", 
    justifyContent: "center", 
    alignItems: "center",
    position: 'relative'
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  onlineStatus: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#2d2d2d"
  },
  friendInfo: { flex: 1, marginLeft: 15 },
  friendName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  friendUsername: { color: "#71717a", fontSize: 14 },
  actionIconButton: { padding: 8, marginLeft: 5 },
  emptyText: { color: "#71717a", textAlign: "center", marginTop: 50 }
});