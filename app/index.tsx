import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import TaskForm from '../components/TaskForm';
import { Task } from '../components/types'; 

const URLAPI = "";

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setModalVisible(false);
  };

  const handleDeleteTask = (idToDelete: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== idToDelete));
  };

  const handleNoOpError = (message: string) => {
    console.log("Error ignorado en index:", message);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskTextContainer}>
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
      <Text style={styles.header}>iTasks</Text>

      {tasks.length === 0 ? (
        <View style={styles.listContainer}>
          <Text style={styles.emptyText}>No hi ha tasques per mostrar</Text>
          <Text style={styles.emptyText}>No hay tareas para mostrar</Text>
          <Text style={styles.emptyText}>There's no tasks to show</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id.toString()}
          style={styles.taskList}
          contentContainerStyle={{ paddingBottom: 100 }} 
        />
      )}
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

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
    marginBottom: 20,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#DBA94D',
    borderRadius: 30,
    elevation: 8,    
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  fabIcon: {
    fontSize: 40, 
    color: 'black',
    fontWeight: 'bold',
    marginTop: -2, 
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
    borderLeftColor: 'white', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  taskTextContainer: {
    flex: 1, 
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 22,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 14,
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