import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  FlatList, SafeAreaView, Modal, Pressable, Animated 
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  Users, Plus, LogOut, ChevronRight, Menu, 
  User, Settings, UserPlus, X 
} from "lucide-react-native";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado do Menu Lateral
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
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        name: inputValue.trim(),
        members: [userName],
      };
      updatedGroups.push(newGroup);
      await AsyncStorage.setItem("apportionGroups", JSON.stringify(updatedGroups));
      router.push({ pathname: "/division/[id]", params: { groupId: newGroup.id } });
    } else {
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
    setIsMenuOpen(false);
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- MENU LATERAL (SIDEBAR) --- */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setIsMenuOpen(false)}>
          <Animated.View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <View style={styles.avatarPlaceholder}>
                <User color="#fff" size={30} />
              </View>
              <Text style={styles.sidebarUser}>{userName}</Text>
            </View>

            <View style={styles.sidebarContent}>
             <TouchableOpacity 
                style={styles.sidebarItem} 
                onPress={() => {
                  setIsMenuOpen(false); // Fecha o menu primeiro
                  router.push("/sidebar/profile");
                }}
              >
                <User color="#9d5da3" size={22} />
                <Text style={styles.sidebarItemText}>Perfil</Text>
              </TouchableOpacity>

               <TouchableOpacity style={styles.sidebarItem}
                  onPress={() => {
                    setIsMenuOpen(false); router.push("/sidebar/settings");
                      }}
                        >
                <Settings color="#9d5da3" size={22} />
                <Text style={styles.sidebarItemText}>Configurações</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={styles.sidebarItem} 
                  onPress={() => {
                    setIsMenuOpen(false); 
                    router.push("/sidebar/friends");
                  }}
                >
                  <UserPlus color="#9d5da3" size={22} />
                  <Text style={styles.sidebarItemText}>Amigos</Text>
                </TouchableOpacity>

              <View style={styles.sidebarSeparator} />

              <TouchableOpacity style={[styles.sidebarItem]} onPress={handleLogout}>
                <LogOut color="#ef4444" size={22} />
                <Text style={[styles.sidebarItemText, { color: "#ef4444" }]}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* --- HEADER COM BOTÃO DE MENU --- */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.menuButton}>
          <Menu color="#fff" size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Olá, {userName}!</Text>
          <Text style={styles.subWelcome}>Gerencie seus grupos</Text>
        </View>
      </View>

      {/* ... Resto do código (Tabs e Listagem) ... */}
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
          placeholder={activeTab === "create" ? "Nome do novo grupo" : "ID do grupo"}
          placeholderTextColor="#71717a"
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
              <Users size={20} color="#9d5da3" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupMembers}>{item.members.length} membros • ID: {item.id}</Text>
            </View>
            <ChevronRight size={20} color="#3f3f46" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Você ainda não participa de grupos.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", paddingHorizontal: 20 },
  topBar: { marginTop: 20, marginBottom: 10 },
  menuButton: { width: 40, height: 40, justifyContent: 'center' },
  header: { marginBottom: 30 },
  welcome: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subWelcome: { color: "#a1a1aa" },
  
  // Sidebar Styles
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  sidebar: { width: '75%', height: '100%', backgroundColor: '#2d2d2d', padding: 24, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  sidebarHeader: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#5b365d', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  sidebarUser: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  sidebarContent: { flex: 1 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginBottom: 5 },
  sidebarItemText: { color: '#fff', fontSize: 16, marginLeft: 15, fontWeight: '500' },
  sidebarSeparator: { height: 1, backgroundColor: '#3f3f46', my: 20, marginVertical: 20 },

// 1. Ajuste nos Tabs (Criar/Entrar)
  tabContainer: { 
    flexDirection: "row", 
    backgroundColor: "#2d2d2d", 
    borderRadius: 14, // Bordas um pouco mais arredondadas
    padding: 6,      // Espaço interno para as "pílulas" não tocarem no fundo
    marginBottom: 12, // Menos margem para ficar "perto" do input mas com respiro
    marginTop: 10     // Padding suave em relação ao texto de boas-vindas
  },
  tab: { 
    flex: 1, 
    paddingVertical: 12, // Aumentei o clique para ser mais confortável
    alignItems: "center", 
    borderRadius: 10 
  },

  // 2. Ajuste na Caixa de Ação (Input + Botão)
  actionBox: { 
    flexDirection: "row", 
    marginBottom: 35, // Espaço maior antes de começar a lista de grupos
    alignItems: 'center',
    // Adicionei um padding horizontal suave para não colar nas bordas do ecrã
    paddingHorizontal: 2 
  },

  // 3. Ajuste no Campo de Texto (Input)
  input: { 
    flex: 1, 
    backgroundColor: "#2d2d2d", 
    paddingHorizontal: 18, // Espaço maior para o texto não começar colado à esquerda
    paddingVertical: 15,   // Altura mais "gorda" e moderna
    borderRadius: 15,      // Combinando com a fluidez do design
    borderWidth: 1, 
    borderColor: "#3f3f46", 
    fontSize: 16, 
    color: "#fff",
    // Sombra suave para dar profundidade
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  actionBtn: { 
    backgroundColor: "#5b365d", 
    marginLeft: 12,        // Mais espaço entre o input e o botão
    height: 55,            // Altura igual à do input para alinhar perfeitamente
    width: 60,             // Botão mais quadrado/robusto
    borderRadius: 15, 
    justifyContent: "center",
    alignItems: 'center',
    shadowColor: "#9d5da3",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },

  // Resto dos Estilos (Mantidos do anterior)
  activeTab: { backgroundColor: "#5b365d" },
  tabText: { fontWeight: "600", color: "#a1a1aa" },
  activeTabText: { color: "#fff" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#fff" },
  groupCard: { backgroundColor: "#2d2d2d", flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#3f3f46" },
  groupIcon: { padding: 10, backgroundColor: "#3f2641", borderRadius: 12 },
  groupName: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  groupMembers: { fontSize: 13, color: "#a1a1aa", marginTop: 2 },
  empty: { textAlign: "center", color: "#71717a", marginTop: 40 }
});