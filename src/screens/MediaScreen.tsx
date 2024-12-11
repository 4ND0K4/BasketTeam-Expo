import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
// Navigation
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../routes/StackNavigator';
// Styles
import { globalStyles } from '../styles/theme/global.styles';

// Definición de los parámetros de la navegación
type MediaScreenRouteProp = RouteProp<RootStackParams, 'Media'>;

export const MediaScreen: React.FC = () => {

  // Hook de ruta
  const route = useRoute<MediaScreenRouteProp>();
  // Parámetros de la ruta
  const { videoUrl } = route.params;

  // Hook de referencia al video
  const player = useVideoPlayer(videoUrl, player => {
    player.loop = true;
    player.play();
  });
 
  return (
    <View style={globalStyles.mediaContainer}>
      <View style={globalStyles.videoContainer}>
      <VideoView
          style={globalStyles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>
    </View>
  );
}

export default MediaScreen;