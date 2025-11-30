import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as z from 'zod';

const esquemaLogin = z.object({
  correo: z.string().email('El correo no es válido'),
  nombre: z.string().nonempty('El nombre es obligatorio').regex(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios'),
  edad: z.number().min(18, 'Debes ser mayor de 18 años').max(120, 'La edad no es válida'),
  genero: z.enum(['Masculino', 'Femenino', 'Otro'], {
    message: 'Selecciona un género válido',
  }),
});

type DatosLogin = z.infer<typeof esquemaLogin>;

interface PropsLogin {
  alIniciarSesion: () => void;
}

const LogIn: React.FC<PropsLogin> = ({ alIniciarSesion }) => {
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [errores, setErrores] = useState<z.ZodIssue[]>([]);

  const opcionesGenero = [
    { etiqueta: 'Macho', valor: 'Masculino' },
    { etiqueta: 'Hembra', valor: 'Femenino' },
    { etiqueta: 'Otro', valor: 'Otro' }
  ];

  const obtenerErrorDeCampo = (nombreDelCampo: keyof DatosLogin) => {
    const error = errores.find(err => err.path.includes(nombreDelCampo));
    return error ? error.message : null;
  };

  const manejarInicioSesion = () => {
    const edadComoNumero = parseInt(edad, 10);
    const datosDelFormulario = {
      correo,
      nombre,
      edad: isNaN(edadComoNumero) ? 0 : edadComoNumero,
      genero,
    };

    const resultadoDeValidacion = esquemaLogin.safeParse(datosDelFormulario);

    if (resultadoDeValidacion.success) {
      alIniciarSesion();
    } else {
      setErrores(resultadoDeValidacion.error.issues);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.tituloPrincipal}>Bienvenido a iTasks</Text>
      <Text style={estilos.titulo}>Inicia Sesión Aquí</Text>

      <Text style={estilos.etiqueta}>Correo electrónico</Text>
      <TextInput
        style={[estilos.input, obtenerErrorDeCampo('correo') && estilos.inputConError]}
        placeholder="ejemplo@correo.com"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
        onFocus={() => setErrores(prev => prev.filter(e => !e.path.includes('correo')))}
      />
      {obtenerErrorDeCampo('correo') && <Text style={estilos.textoDeError}>{obtenerErrorDeCampo('correo')}</Text>}
      
      <View style={estilos.separador} />

      <Text style={estilos.etiqueta}>Nombre</Text>
      <TextInput
        style={[estilos.input, obtenerErrorDeCampo('nombre') && estilos.inputConError]}
        placeholder="Tu nombre completo"
        placeholderTextColor="#888"
        autoCapitalize="words"
        value={nombre}
        onChangeText={setNombre}
        onFocus={() => setErrores(prev => prev.filter(e => !e.path.includes('nombre')))}
      />
      {obtenerErrorDeCampo('nombre') && <Text style={estilos.textoDeError}>{obtenerErrorDeCampo('nombre')}</Text>}
      
      <View style={estilos.separador} />

      <Text style={estilos.etiqueta}>Edad</Text>
      <TextInput
        style={[estilos.input, obtenerErrorDeCampo('edad') && estilos.inputConError]}
        placeholder="18"
        placeholderTextColor="#888"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
        onFocus={() => setErrores(prev => prev.filter(e => !e.path.includes('edad')))}
      />
      {obtenerErrorDeCampo('edad') && <Text style={estilos.textoDeError}>{obtenerErrorDeCampo('edad')}</Text>}
      
      <View style={estilos.separador} />

      <Text style={estilos.etiqueta}>Género</Text>
      <View style={estilos.contenedorOpciones}>
        {opcionesGenero.map((opcion) => (
          <TouchableOpacity
            key={opcion.valor}
            style={[
              estilos.opcion,
              genero === opcion.valor && estilos.opcionSeleccionada,
              obtenerErrorDeCampo('genero') && estilos.opcionConError
            ]}
            onPress={() => {
              setGenero(opcion.valor);
              setErrores(prev => prev.filter(e => !e.path.includes('genero')));
            }}
          >
            <Text style={[
              estilos.textoOpcion,
              genero === opcion.valor && estilos.textoOpcionSeleccionada
            ]}>
              {opcion.etiqueta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {obtenerErrorDeCampo('genero') && <Text style={estilos.textoDeError}>{obtenerErrorDeCampo('genero')}</Text>}

      <TouchableOpacity style={estilos.boton} onPress={manejarInicioSesion}>
        <Text style={estilos.textoDelBoton}>Entrarle</Text>
      </TouchableOpacity>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  tituloPrincipal: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 30,
  },
  etiqueta: {
    color: '#E0E0E0',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
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
  inputConError: {
    borderColor: '#CF6679',
  },
  separador: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 20,
    opacity: 0.3,
  },
  contenedorOpciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  opcion: {
    flex: 1,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#444444',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  opcionSeleccionada: {
    backgroundColor: 'gray',
  },
  opcionConError: {
    borderColor: '#CF6679',
  },
  textoOpcion: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '600',
  },
  textoOpcionSeleccionada: {
    color: '#FFFFFF',
  },
  textoDeError: {
    color: '#CF6679',
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  boton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  textoDelBoton: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LogIn;