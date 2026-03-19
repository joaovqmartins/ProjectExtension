import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Modal, 
  SafeAreaView,
  Alert 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft, Plus, Trash2, DollarSign, X } from "lucide-react-native";

// --- Interfaces ---
interface Group {
  id: string;
  name: string;
  members: string[];
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
}

export default function DivisionScreen() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupData, setGroupData] = useState<any>(null);
  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  // Carregar dados
  useEffect(() => {
    loadData();
  }, [groupId]);

const loadGroupDetails = async () => {
    const savedGroups = await AsyncStorage.getItem("apportionGroups");
    if (savedGroups) {
      const allGroups = JSON.parse(savedGroups);
      const currentGroup = allGroups.find((g: any) => g.id === groupId);
      if (currentGroup) {
        setGroupData(currentGroup);
      }
    }
  };

  const loadData = async () => {
    try {
      const savedGroups = await AsyncStorage.getItem("apportionGroups");
      if (savedGroups) {
        const groups: Group[] = JSON.parse(savedGroups);
        const currentGroup = groups.find((g) => g.id === groupId);
        if (currentGroup) {
          setGroup(currentGroup);
          setPaidBy(currentGroup.members[0]);
        }
      }

      const savedExpenses = await AsyncStorage.getItem(`apportionExpenses_${groupId}`);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    } catch (e) {
      console.error("Erro ao carregar dados", e);
    }
  };

  const handleAddExpense = async () => {
    if (description.trim() && amount && parseFloat(amount) > 0 && paidBy) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        description: description.trim(),
        amount: parseFloat(amount),
        paidBy,
        splitAmong: group!.members, // Simplificado para todos os membros no Native
      };

      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      await AsyncStorage.setItem(`apportionExpenses_${groupId}`, JSON.stringify(updatedExpenses));

      // Reset
      setDescription("");
      setAmount("");
      setIsModalOpen(false);
    } else {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const updatedExpenses = expenses.filter((e) => e.id !== expenseId);
    setExpenses(updatedExpenses);
    await AsyncStorage.setItem(`apportionExpenses_${groupId}`, JSON.stringify(updatedExpenses));
  };

  // --- Lógica de Cálculos (Mesma do Web) ---
  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    group?.members.forEach((member) => { balances[member] = 0; });

    expenses.forEach((expense) => {
      const sharePerPerson = expense.amount / expense.splitAmong.length;
      balances[expense.paidBy] += expense.amount;
      expense.splitAmong.forEach((member) => {
        balances[member] -= sharePerPerson;
      });
    });
    return balances;
  };

  const calculateSettlements = () => {
    const balances = calculateBalances();
    const settlements: { from: string; to: string; amount: number }[] = [];
    const creditors = Object.entries(balances).filter(([_, amt]) => amt > 0.01).sort((a, b) => b[1] - a[1]);
    const debtors = Object.entries(balances).filter(([_, amt]) => amt < -0.01).sort((a, b) => a[1] - b[1]);

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const settleAmount = Math.min(creditors[i][1], -debtors[j][1]);
      if (settleAmount > 0.01) {
        settlements.push({ from: debtors[j][0], to: creditors[i][0], amount: settleAmount });
      }
      creditors[i][1] -= settleAmount;
      debtors[j][1] += settleAmount;
      if (creditors[i][1] < 0.01) i++;
      if (debtors[j][1] > -0.01) j++;
    }
    return settlements;
  };

  if (!group) return <View style={styles.center}><Text>Loading...</Text></View>;

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const settlements = calculateSettlements();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.title}>{group.name}</Text>
            <Text style={styles.subtitle}>{group.members.length} membros</Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.row}>
          <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.cardLabel}>Total</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.cardLabel} >R$</Text>
              <Text style={styles.amountText}>{totalExpenses.toFixed(2)}</Text>
            </View>
          </View>
          <View style={[styles.card, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.cardLabel}>Por Pessoa</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.cardLabel}>R$</Text>
              <Text style={styles.amountText}>
                {(totalExpenses / group.members.length).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Settlements */}
        {settlements.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Acertos</Text>
            {settlements.map((s, idx) => (
              <View key={idx} style={styles.settlementItem}>
                <Text style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600' }}>{s.from}</Text> deve para{" "}
                  <Text style={{ fontWeight: '600' }}>{s.to}</Text>
                </Text>
                <Text style={styles.settlementAmount}>R$ {s.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Expenses List */}
        <View style={[styles.card, { marginBottom: 100 }]}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Despesas</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
              <Plus color="#fff" size={16} />
              <Text style={{ color: '#fff', marginLeft: 5 }}>Add</Text>
            </TouchableOpacity>
          </View>

          {expenses.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma despesa ainda.</Text>
          ) : (
            expenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.expenseDesc}>{expense.description}</Text>
                  <Text style={styles.expenseSub}>Pago por {expense.paidBy}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.expenseValue}>R${expense.amount.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => handleDeleteExpense(expense.id)}>
                    <Trash2 size={18} color="#ef4444" style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal Add Expense */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.rowBetween}>
              <Text style={styles.modalTitle}>Nova Despesa</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X color="#000" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Descrição</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ex: Almoço"
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Valor</Text>
            <TextInput 
              style={styles.input} 
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleAddExpense}>
              <Text style={styles.saveButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e" },
  scrollContent: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { color: '#a1a1aa', fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  card: { backgroundColor: '#2d2d2d', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#3f3f46' },
  cardLabel: { color: '#a1a1aa', fontSize: 14, marginBottom: 5 },
  amountContainer: { flexDirection: 'row', alignItems: 'center' },
  amountText: { fontSize: 22, fontWeight: 'bold', marginLeft: 5, color: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  settlementItem: { flexDirection: 'row', backgroundColor: '#3f2641', padding: 12, borderRadius: 8, marginTop: 8 },
  settlementAmount: { color: '#d8b4fe', fontWeight: 'bold' }, // Roxo claro para o valor
  addButton: { backgroundColor: '#5b365d', flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#3f3f46' },
  expenseDesc: { fontSize: 16, fontWeight: '500', color: '#fff' },
  expenseSub: { fontSize: 12, color: '#a1a1aa' },
  expenseValue: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  
  // Modal (Modo Dark)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#2d2d2d', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  label: { fontSize: 14, fontWeight: '500', marginTop: 15, marginBottom: 5, color: '#d4d4d8' },
  input: { backgroundColor: '#1e1e1e', padding: 12, borderRadius: 8, fontSize: 16, color: '#fff', borderWidth: 1, borderColor: '#3f3f46' },
  saveButton: { backgroundColor: '#5b365d', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 25 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});