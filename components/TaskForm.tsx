import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as z from 'zod'; // Importa zod
import axios from 'axios';

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
  onClose: () => void; // Para cerrar el modal
  onTaskCreated: (task: TaskData) => void; // Para notificar al componente padre
  onError: (message: string) => void;
  urlApi: string; // Recibimos la URL por props
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onTaskCreated, urlApi }) => {
  // Estados
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
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      // 🚀 Llamada a la API
      const response = await axios.post(urlApi, validationResult.data);
      
      // Notificar al componente padre y limpiar
      onTaskCreated(response.data); 
      setTitle('');
      setDescription('');
      
    } catch (error) {
      console.error('Error al enviar la tarea:', error);
      // Aquí podrías mostrar un error de la API si fuera necesario
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Crear Tarea</Text>

      {/* Campo Título */}
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        // Limpia errores al cambiar el foco
        onFocus={() => setErrors(prev => prev.filter(e => !e.path.includes('title')))} 
      />
      {getFieldError('title') && (
        <Text style={styles.errorText}>{getFieldError('title')}</Text>
      )}

      {/* Campo Descripción */}
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

      {/* Botones de Acción */}
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
    // El fondo se define en el ModalContent de index.tsx
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333333', // Fondo del input más oscuro
    color: '#E0E0E0', // Texto del input claro
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
    color: '#CF6679', // Color de error elegante (rojo apagado)
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