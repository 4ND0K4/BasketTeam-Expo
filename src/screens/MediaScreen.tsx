import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
// Navigation
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
// Styles
import { globalStyles } from '../styles/theme/global.styles';
import { FontAwesome6 } from '@expo/vector-icons';

// Definición de los parámetros de la navegación
type MediaScreenRouteProp = RouteProp<RootStackParams, 'Media'>;

export const MediaScreen: React.FC = () => {
  // Hook de ruta
  const route = useRoute<MediaScreenRouteProp>();
  // Parámetros de la ruta
  const { videoUrl } = route.params;

  // Referencia al video
  const videoRef = useRef<Video>(null);

  // Estado para controlar la reproducción del video
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const seekForward = async () => {
    const status = await videoRef.current?.getStatusAsync();
    if (status?.isLoaded) {
      videoRef.current?.setPositionAsync(status.positionMillis + 5000); // Avanzar 10 segundos
    }
  };

  const seekBackward = async () => {
    const status = await videoRef.current?.getStatusAsync();
    if (status?.isLoaded) {
      videoRef.current?.setPositionAsync(status.positionMillis - 5000); // Retroceder 10 segundos
    }
  };

  const rewind = async () => {
    const status = await videoRef.current?.getStatusAsync();
    if (status?.isLoaded) {
      videoRef.current?.setPositionAsync(status.positionMillis - 30000); // Rebobinar 30 segundos
    }
  };

  const forward = async () => {
    const status = await videoRef.current?.getStatusAsync();
    if (status?.isLoaded) {
      videoRef.current?.setPositionAsync(status.positionMillis + 30000); // Avanzar 30 segundos
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && !status.isPlaying && isPlaying) {
          setIsPlaying(false);
        }
      });
    }
  }, [isPlaying]);

  return (
    <View style={globalStyles.mediaContainer}>
      <View style={globalStyles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={globalStyles.video}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          isLooping
        />
      </View>
      <View style={globalStyles.controlsContainer}>
        <TouchableOpacity onPress={rewind} style={globalStyles.controlButton}>
          <FontAwesome6 name="backward" size={24} color="black" />
          <Text style={globalStyles.controlText}>-30s</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={seekBackward} style={globalStyles.controlButton}>
          <FontAwesome6 name="backward-step" size={24} color="black" />
          <Text style={globalStyles.controlText}>-5s</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlay} style={globalStyles.controlButton}>
          <FontAwesome6 name={isPlaying ? "pause" : "play"} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={seekForward} style={globalStyles.controlButton}>
          <FontAwesome6 name="forward-step" size={24} color="black" />
          <Text style={globalStyles.controlText}>+5s</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={forward} style={globalStyles.controlButton}>
          <FontAwesome6 name="forward" size={24} color="black" />
          <Text style={globalStyles.controlText}>+30s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MediaScreen;