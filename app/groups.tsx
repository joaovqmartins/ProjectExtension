import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Users, Plus, LogOut, ChevronRight } from "lucide-react-native";

interface Group {
  id: string;
  name: string;
  members: string[];
}

export default function Groups() {
  const [userName, setUserName] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await AsyncStorage.getItem("apportionUser");
    if (user) setUserName(user);

    const savedGroups = await AsyncStorage.getItem("apportionGroups");
    if (savedGroups) setGroups(JSON.parse(savedGroups));
  };

  const handleAction = async () => {
    if (!inputValue.trim()) return;

    let updatedGroups = [...groups];

    if (activeTab === "create") {
      const newGroup: Group = {
        id: Math.floor(1000 + Math.random() * 9000).toString(), // ID de 4 dígitos mais amigável
        name: inputValue.trim(),
        members: [userName],
      };
      updatedGroups.push(newGroup);
      await AsyncStorage.setItem("apportionGroups", JSON.stringify(updatedGroups));
      router.push({ pathname: "/division/[id]", params: { groupId: newGroup.id } });
    } else {
      // Lógica de Join
      const group = groups.find((g) => g.id === inputValue.trim());
      if (group) {
        if (!group.members.includes(userName)) {
          group.members.push(userName);
          await AsyncStorage.setItem("apportionGroups", JSON.stringify(updatedGroups));
        }
        router.push({ pathname: "/division/[id]", params: { groupId: group.id } });
      } else {
        alert("Grupo não encontrado!");
      }
    }
    setInputValue("");
    setGroups(updatedGroups);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("apportionUser");
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Olá, {userName}!</Text>
          <Text style={styles.subWelcome}>Gerencie seus grupos</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "create" && styles.activeTab]} 
          onPress={() => setActiveTab("create")}
        >
          <Text style={[styles.tabText, activeTab === "create" && styles.activeTabText]}>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "join" && styles.activeTab]} 
          onPress={() => setActiveTab("join")}
        >
          <Text style={[styles.tabText, activeTab === "join" && styles.activeTabText]}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionBox}>
        <TextInput
          style={styles.input}
          placeholder={activeTab === "create" ? "Nome do novo grupo" : "ID do grupo (Ex: 1234)"}
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TouchableOpacity style={styles.actionBtn} onPress={handleAction}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Seus Grupos</Text>
      
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.groupCard}
            onPress={() => router.push({ pathname: "/division/[id]", params: { groupId: item.id } })}
          >
            <View style={styles.groupIcon}>
              <Users size={20} color="#2563eb" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupMembers}>{item.members.length} membros • ID: {item.id}</Text>
            </View>
            <ChevronRight size={20} color="#cbd5e1" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Você ainda não participa de grupos.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30, marginTop: 20 },
  welcome: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subWelcome: { color: "#a1a1aa" },
  logoutBtn: { padding: 10, backgroundColor: "#3f1a1a", borderRadius: 10 }, // Vermelho escuro pro logout
  tabContainer: { flexDirection: "row", backgroundColor: "#2d2d2d", borderRadius: 10, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  activeTab: { backgroundColor: "#5b365d" },
  tabText: { fontWeight: "600", color: "#a1a1aa" },
  activeTabText: { color: "#fff" },
  actionBox: { flexDirection: "row", marginBottom: 30 },
  input: { flex: 1, backgroundColor: "#2d2d2d", padding: 15, borderRadius: 12, borderWidth: 1, borderColor: "#3f3f46", fontSize: 16, color: "#fff" },
  actionBtn: { backgroundColor: "#5b365d", marginLeft: 10, paddingHorizontal: 20, borderRadius: 12, justifyContent: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#fff" },
  groupCard: { backgroundColor: "#2d2d2d", flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#3f3f46" },
  groupIcon: { padding: 10, backgroundColor: "#3f2641", borderRadius: 12 },
  groupName: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  groupMembers: { fontSize: 13, color: "#a1a1aa", marginTop: 2 },
  empty: { textAlign: "center", color: "#71717a", marginTop: 40 }
});