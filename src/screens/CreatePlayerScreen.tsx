import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, TextInput, Alert, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
// Navigation
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { type RootStackParams } from '../routes/StackNavigator';
// Styles
import { globalStyles } from '../styles/theme/global.styles';
import { FontAwesome6 } from '@expo/vector-icons';
// Models & Services
import { Player } from '../models/Player';
import { addPlayer } from '../services/playerService';

const CreatePlayerScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Base');
  const [num, setNum] = useState('');
  const [age, setAge] = useState('');
  const [anillos, setAnillos] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        // Alert the user if permission is not granted
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleChooseImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [5, 4],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setImageFile(result.assets[0].uri);
      } else {
        console.error('No se seleccionó una imagen o la URI es inválida', result);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    }
  };

  const handleChooseVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setVideoFile(result.assets[0].uri);
      } else {
        console.error('No se seleccionó un video o la URI es inválida', result);
      }
    } catch (error) {
      console.error('Error al seleccionar el video:', error);
    }
  };

  const handleSubmit = async () => {
    if (parseInt(age) < 18 || parseInt(age) > 64) {
      Alert.alert('La edad debe estar entre 18 y 64 años');
      return;
    }

    if (parseInt(num) < 0 || parseInt(num) > 99) {
      Alert.alert('El número debe estar entre 0 y 99');
      return;
    }

    const player: Player = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random id
      name,
      position,
      num: parseInt(num),
      age,
      anillos,
      description,
      img: '',
      video: ''
    };
    setLoading(true);
    try {
      await addPlayer(player, imageFile, videoFile);
      setName('');
      setPosition('Base');
      setNum('');
      setAge('');
      setAnillos('');
      setDescription('');
      setImageFile(null);
      setVideoFile(null);
      Alert.alert('¡Jugador creado correctamente!');
      navigation.navigate('List', { newPlayer: player });
    } catch (error) {
      console.error('Error al añadir el jugador:', error);
      Alert.alert('Error al añadir el jugador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.form}>
      <TextInput
        placeholder="Nombre"
        autoCapitalize='words'
        style={globalStyles.formInput}
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        placeholder="Número"
        style={globalStyles.formInput}
        keyboardType="numeric"
        value={num}
        onChangeText={text => setNum(text)}
      />
      <TextInput
        placeholder="Edad"
        style={globalStyles.formInput}
        keyboardType="numeric"
        value={age}
        onChangeText={text => setAge(text)}
      />
      <TextInput
        placeholder="Anillos"
        style={globalStyles.formInput}
        keyboardType="numeric"
        value={anillos}
        onChangeText={text => setAnillos(text)}
      />
      <TextInput
        placeholder="Descripción"
        style={[globalStyles.formInput, { height: 100 }]} 
        value={description}
        multiline={true} 
        numberOfLines={4} 
        onChangeText={text => setDescription(text)}
      />
      <Picker
        selectedValue={position}
        style={globalStyles.pickerInput}
        onValueChange={(position) => setPosition(position)}
      >
        <Picker.Item label="Base" value="Base" />
        <Picker.Item label="Escolta" value="Escolta" />
        <Picker.Item label="Alero" value="Alero" />
        <Picker.Item label="Ala-Pivot" value="Ala-Pivot" />
        <Picker.Item label="Pivot" value="Pivot" />
      </Picker>
      <View style={globalStyles.buttonContainer}>
        <FontAwesome6.Button 
          name="image" 
          backgroundColor="#e65c00" 
          onPress={handleChooseImage}
        >
          Elige imagen
        </FontAwesome6.Button>
        <FontAwesome6.Button 
          name="video" 
          backgroundColor="#e65c00" 
          onPress={handleChooseVideo}
        >
          Elige video
        </FontAwesome6.Button>
      </View>
      <View style={globalStyles.formButtonSeparator} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Guardar cambios" onPress={handleSubmit} />
      )}
    </View>
  );
};

export default CreatePlayerScreen;