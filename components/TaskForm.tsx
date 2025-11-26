import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';
import { Task } from './types';

const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;

const taskSchema = z.object({
  title: z
    .string()
    .nonempty('El título es obligatorio. Imbécil')
    .regex(alphanumericRegex, 'Solo se permiten caracteres alfanuméricos y espacios.'),

  description: z
    .string()
    .nonempty('La descripción es obligatoria. Pendeje')
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
      let taskResponse: Task;

      if (urlApi && urlApi.includes('https')) {
          
          const response = await axios.post(urlApi, validationResult.data);
          taskResponse = response.data as Task; 

      } else {
          
          console.log("SIMULACIÓN ACTIVADA: La URL de la API no es válida. No se hará la llamada real.");
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          taskResponse = {
              id: Date.now().toString(),
              title: formData.title,
              description: formData.description,
          };
      }

      onTaskCreated(taskResponse); 
      
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
      <Text style={styles.title}>Nova Tasca Per A Tu</Text>

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
        placeholder="Agregale una descripción"
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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 20,
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
    fontWeight: 'bold',
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
    backgroundColor: 'white',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  }
});

export default TaskForm;