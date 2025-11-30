import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as z from 'zod';

const loginSchema = z.object({
  name: z.string().nonempty('El nombre es obligatorio').regex(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios'),
  gender: z.enum(['Masculino', 'Femenino', 'Otro'], {
    message: 'Selecciona un género válido',
  }),
});

type LoginData = z.infer<typeof loginSchema>;

interface LogInProps {
  onLogin: () => void;
}

const LogIn: React.FC<LogInProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const getFieldError = (fieldName: keyof LoginData) => {
    const error = errors.find(err => err.path.includes(fieldName));
    return error ? error.message : null;
  };

  const handleLogin = () => {
    const formData = {
      name,
      gender,
    };

    const validationResult = loginSchema.safeParse(formData);

    if (validationResult.success) {
      onLogin();
    } else {
      setErrors(validationResult.error.issues);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        onFocus={() => setErrors(prev => prev.filter(e => !e.path.includes('name')))}
      />
      {getFieldError('name') && <Text style={styles.errorText}>{getFieldError('name')}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Género (Masculino, Femenino, Otro)"
        placeholderTextColor="#888"
        value={gender}
        onChangeText={setGender}
        onFocus={() => setErrors(prev => prev.filter(e => !e.path.includes('gender')))}
      />
      {getFieldError('gender') && <Text style={styles.errorText}>{getFieldError('gender')}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#333333',
    color: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#444444',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  errorText: {
    color: '#CF6679',
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LogIn;
