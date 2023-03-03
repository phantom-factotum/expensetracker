import { useAtom } from "jotai";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { alertAtom } from "../atoms";
// import { useAlert } from "../hooks/handleAlert";
import ModalButton from "./ModalButton";
type Props = {};

export default function Alert({}: Props) {
  const [{ visible, title, message, buttons }] = useAtom(alertAtom);
  const { width, height } = useWindowDimensions();
  const modalWidth = width * 0.8;
  const modalHeight = height * 0.8;
  return (
    <Modal visible={visible} transparent>
      <View
        style={[
          styles.modalContainer,
          {
            width: modalWidth,
            //height: modalHeight,
            top: height * 0.25,
            left: width * 0.1,
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.messageView}>
          <Text style={styles.message}>{message}</Text>
        </View>
        <View
          style={[
            styles.buttonRowContainer,
            {
              width: modalWidth - styles.modalContainer.padding * 2,
            },
          ]}
        >
          <FlatList
            style={{ flexDirection: "row" }}
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            data={buttons}
            horizontal
            renderItem={ModalButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    opacity: 1,
    backgroundColor: "lightgreen",
    overflow: "hidden",
    padding: 5,
    borderRadius: 15,
  },
  titleRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  buttonRowContainer: {
    marginVertical: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
  },
  messageView: {
    marginVertical: 5,
    padding: 5,
  },
});
