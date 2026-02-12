import { Pressable, PressableProps, Text, StyleSheet, TouchableOpacityProps, TouchableOpacity } from 'react-native';

type CustomButtonProps = { title: string } & TouchableOpacityProps;

export default function CustomButton({ title, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity {...props} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'royalblue',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});