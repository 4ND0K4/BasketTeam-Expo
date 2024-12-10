import { TouchableOpacity } from 'react-native';
import { globalStyles } from "../../styles/theme/global.styles";
import { FontAwesome6 } from '@expo/vector-icons';

// Propiedades del componente
interface Props {
    onPress: () => void;
    label: string;
}

export const CreationButton = ({ onPress, label }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={globalStyles.fab}>
      <FontAwesome6 name="plus" size={24} color="white"></FontAwesome6>
    </TouchableOpacity>
  );
};

export default CreationButton;