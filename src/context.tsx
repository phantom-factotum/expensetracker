import { NavigationContainer } from "@react-navigation/native";
import { useAtom } from "jotai";
import { View, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { themeAtom, userAtom } from "./atoms";

import Alert from "./components/Alert";

export type Props = {
  style?: ViewStyle;
  children?: React.ReactNode;
};

function ContextContainer(props: Props) {
  const [user, setUser] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);

  return (
    <View style={[props.style]}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <GestureHandlerRootView style={props.style}>
            <>
              {props.children}
              <Alert />
            </>
          </GestureHandlerRootView>
        </NavigationContainer>
      </PaperProvider>
    </View>
  );
}

export default ContextContainer;
