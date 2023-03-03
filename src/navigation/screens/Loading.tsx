import { ActivityIndicator, View } from "react-native";
type Props = {
  onComplete: () => void;
};
export default function LoadingScreen({ onComplete }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
