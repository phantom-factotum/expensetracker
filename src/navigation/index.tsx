import { useAtom } from "jotai";
import { View, ViewStyle } from "react-native";
import { userAtom } from "../atoms";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

type Props = {
  style: ViewStyle;
};

export default function Navigation({ style }: Props) {
  const [user] = useAtom(userAtom);
  return (
    <View style={style}>
      {user.isAuthenticated ? <MainTabs /> : <AuthStack />}
    </View>
  );
}
