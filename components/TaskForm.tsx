import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { Task } from '../app/types';

const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;

const taskSchema = z.object({
  title: z
    .string()
    .nonempty('El título es obligatorio.')
    .regex(alphanumericRegex, 'Solo se permiten caracteres alfanuméricos y espacios.'),

  description: z
    .string()
    .nonempty('La descripción es obligatoria.')
    .regex(alphanumericRegex, 'Solo se permiten caracteres alfanuméricos y espacios.'),
});

type TaskData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  onError: (message: string) => void;
  urlApi: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onTaskCreated, onError, urlApi }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFieldError = (fieldName: keyof TaskData) => {
    const error = errors.find(err => err.path.includes(fieldName));
    return error ? error.message : null;
  };

  const handleSubmit = async () => {
    const formData: TaskData = { title, description };
    const validationResult = taskSchema.safeParse(formData);

    if (!validationResult.success) {
      setErrors(validationResult.error.issues);
      onError('Error de validación: Revisa los campos del formulario.');
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      // 1. Definimos una variable para guardar la respuesta de la tarea
      let taskResponse: Task;

      // === LÓGICA DE MOCKING: Comprobamos si la URL es válida ===
      // Si urlApi está vacío O si no incluye 'https' (asumiendo que debe ser una URL segura),
      // entonces ejecutamos la simulación (mocking).
      if (urlApi && urlApi.includes('https')) {
          
          // --- LÓGICA DE API REAL (Si la URL es válida) ---
          const response = await axios.post(urlApi, validationResult.data);
          taskResponse = response.data as Task; // La respuesta del servidor es la tarea creada

      } else {
          
          // --- LÓGICA DE MOCKING (SIMULACIÓN DE ÉXITO) ---
          console.log("SIMULACIÓN ACTIVADA: La URL de la API no es válida. No se hará la llamada real.");
          await new Promise(resolve => setTimeout(resolve, 1500)); // Esperamos 1.5 segundos para simular una red
          
          // Creamos una tarea FAKE con un ID temporal
          taskResponse = {
              id: Date.now().toString(),
              title: formData.title,
              description: formData.description,
          };
      }
      // === FIN DE LÓGICA DE MOCKING ===

      // 2. Aquí llamamos a onTaskCreated con la tarea (real o simulada)
      onTaskCreated(taskResponse); 
      
      // 3. Limpiamos el formulario y cerramos el modal
      setTitle('');
      setDescription('');

    } catch (error) {
      console.error('Error al enviar la tarea:', error);
      
      let errorMessage = 'Fallo desconocido al conectar con el servidor.';

      if (axios.isAxiosError(error)) {
        errorMessage = `Fallo en el servidor. Código: ${error.response?.status || 'sin respuesta'}.`;
      }
      
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Crear Tarea</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        onFocus={() => setErrors(prev => prev.filter(e => !e.path.includes('title')))}
      />
      {getFieldError('title') && (
        <Text style={styles.errorText}>{getFieldError('title')}</Text>
      )}

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción detallada"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        onFocus={() => setErrors(prev => prev.filter(e => !e.path.includes('description')))}
      />
      {getFieldError('description') && (
        <Text style={styles.errorText}>{getFieldError('description')}</Text>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onClose}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? "Guardando..." : "Guardar Tarea"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333333',
    color: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#444444',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#CF6679',
    marginBottom: 10,
    fontSize: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#03DAC6',
  },
  cancelButton: {
    backgroundColor: '#333333',
    borderColor: '#444444',
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#121212',
    fontWeight: 'bold',
  }
});

export default TaskForm;