import { StyleSheet, Text, View } from "react-native";

type Props = {};
export default function SignUp({}: Props) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
