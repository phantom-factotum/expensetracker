import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ContextContainer from "./src/context";
import Screens from "./src/navigation";
import Loading from "./src/navigation/screens/Loading";

type Props = {};

export default function App(props: Props) {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {isLoaded ? (
        <SafeAreaProvider>
          <ContextContainer style={styles.container}>
            <Screens style={styles.container} />
          </ContextContainer>
        </SafeAreaProvider>
      ) : (
        <Loading onComplete={() => setIsLoaded(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
