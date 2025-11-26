import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import React, { useState } from 'react';
import TaskForm from '../components/TaskForm';

const URLAPI = "https://3000-firebase-listatareas-1762974317595.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev/tareas";

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleTaskCreated = (task: any) => {
    setModalVisible(false);
  };

  const handleNoOpError = (message: string) => {
    console.log("Error ignorado en index:", message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mis Tareas</Text>

      <TouchableOpacity 
        style={styles.createButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ Crear Nueva Tarea</Text>
      </TouchableOpacity>

      <View style={styles.listContainer}>
        <Text style={styles.emptyText}>No hay tareas pendientes. Presiona '+' para empezar.</Text>
      </View>
      
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