import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import TaskForm from '../components/TaskForm';
import { Task } from './types'; // 🚨 CORRECCIÓN DE RUTA
import axios from 'axios';

const URLAPI = ""; 

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setModalVisible(false);
  };

  const handleNoOpError = (message: string) => {
    console.log("Error ignorado:", message);
  };
  
  const handleDeleteTask = async (id: string) => {
    // 🚨 CORRECCIÓN: Aseguramos que URLAPI sea un string antes de usar includes
    if (typeof URLAPI === 'string' && URLAPI.includes('https')) {
        try {
            await axios.delete(`${URLAPI}/${id}`);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            return;
        }
    } else {
        await new Promise(resolve => setTimeout(resolve, 500)); 
    }
    
    setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDeleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
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

export const unstable_settings = {
  initialRouteName: 'index',
};

export function Screen() {
  return (
    <Stack.Screen 
      options={() => ({ 
        headerShown: false, 
        title: 'Mis Tareas'
      })} 
    />
  );
}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
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
  deleteButton: {
    backgroundColor: '#CF6679',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 15,
  },
  deleteButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
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