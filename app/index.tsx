import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import TaskForm from '../components/TaskForm';
import { Task } from './types'; 

const URLAPI = "";

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskCreated = (newTask: Task) => {
    // 1. Añade la nueva tarea al inicio del array de tareas (para verla primero)
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setModalVisible(false);
  };

  const handleNoOpError = (message: string) => {
    console.log("Error ignorado en index:", message);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mis Tareas</Text>

      <TouchableOpacity 
        style={styles.createButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ Crear Nueva Tarea</Text>
      </TouchableOpacity>
      
      {/* 2. Visualización de la lista de tareas */}
      {tasks.length === 0 ? (
        <View style={styles.listContainer}>
          <Text style={styles.emptyText}>No hay tareas pendientes. Presiona '+' para empezar.</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id.toString()}
          style={styles.taskList}
        />
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TaskForm 
              onClose={() => setModalVisible(false)}
              onTaskCreated={handleTaskCreated}
              onError={handleNoOpError}
              urlApi={URLAPI}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginTop: 40,
    marginBottom: 30,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos para la lista
  taskList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#1F1F1F', 
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#03DAC6', 
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  // Estilos para el mensaje de lista vacía
  listContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1F1F1F',
    borderRadius: 15,
    padding: 25,
    elevation: 20,
  }
});

export default Index;