import { Button } from "react-native-paper";
export default function ModalButton({ item, index }: any) {
  const { title, onPress } = item;
  return (
    <Button
      onPress={onPress}
      style={{ backgroundColor: "orange", marginHorizontal: 5 }}
    >
      {title}
    </Button>
  );
}
