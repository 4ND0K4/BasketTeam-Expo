import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/theme/global.styles';
import { LinearGradient } from 'expo-linear-gradient'; // Importa LinearGradient
import { useNavigation, CommonActions } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
export const Navbar = () => {
    const navigator = useNavigation();

    return (
        <LinearGradient
            colors={['#1565C0', '#e65c00']} // Colores del degradado
            style={globalStyles.navBarContainer} // Estilo del contenedor
            start={{ x: 0, y: 0 }} // Punto inicial del degradado
            end={{ x: 1, y: 0 }}   // Punto final del degradado
        >
            <Text 
                onPress={() =>
                    navigator.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'List' }],
                        })
                    )
                }
                style={globalStyles.navBarTitle}
            >
              <FontAwesome6 name="basketball" size={24} color="#e65c00"></FontAwesome6>  Movicoders Basket Team
            </Text>
        </LinearGradient>
    );
};

export default Navbar;




