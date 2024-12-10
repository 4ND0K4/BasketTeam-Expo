import React from 'react';
import { View, Text, Image, Alert } from 'react-native';
// Navigator
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
// Models & Services
import { Player } from '../models/Player';
import { deletePlayer } from '../services/playerService';
// Styles
import { globalStyles } from '../styles/theme/global.styles';
import { FontAwesome6 } from '@expo/vector-icons';

// Propiedades del componente
type PlayerCardProps = {
  player: Player;
  onDelete: (id: string) => void;
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onDelete }) => {
  // Hook de navegación
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  // Función para eliminar un jugador
  const handleDelete = async () => {
    try {
      await deletePlayer(player.id);
      onDelete(player.id);
    } catch (error) {
      console.error('Error al eliminar el jugador:', error);
      Alert.alert('Error al eliminar el jugador');
    }
  };

  return (
    <View style={globalStyles.cardBody}>
      <Image source={{ uri: player.img }} style={globalStyles.cardImage} />
      <Text style={globalStyles.cardTitle}>{player.name}</Text>
      <Text style={globalStyles.cardText}>
        <Text style={globalStyles.boldText}>Posición:</Text> {player.position}
      </Text>
      <Text style={globalStyles.cardText}>
        <Text style={globalStyles.boldText}>Edad:</Text> {player.age}
      </Text>
      {player.anillos && player.anillos !== '0' ? (
        <Text style={globalStyles.cardText}>
          <Text style={globalStyles.boldText}>Anillos NBA:</Text> {player.anillos}
        </Text>
      ) : (
        <Text style={globalStyles.cardText}>
          <Text style={globalStyles.boldText}>Anillos NBA:</Text> Ninguno
        </Text>
      )}
      <View style={globalStyles.buttonContainer}>
        <FontAwesome6.Button 
          name="eye" 
          backgroundColor="#007bff" 
          onPress={() => navigation.navigate('Detail', { player })}
        >Detalle</FontAwesome6.Button>
        <FontAwesome6.Button 
          name="trash" 
          backgroundColor="#dc3545" 
          onPress={handleDelete} 
        >Eliminar</FontAwesome6.Button>
      </View>
    </View>
  );
};

export default PlayerCard;