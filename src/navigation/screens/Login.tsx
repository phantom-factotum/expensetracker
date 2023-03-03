import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import Background from "../../components/Background";
import { useAlert } from "../../hooks/handleAlert";
type Props = {};
export default function Login({}: Props) {
  const { showAlert } = useAlert();
  return (
    <Background
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
      startPointRatio={[0.1, 0.25]}
      endPointRatio={[1, 1]}
      // invertClip
      showSegmentPoints
      source={require("../../../assets/abstract.jpg")}
      isSVG={false}
      segments={50}
    >
      <Text>Login Screen</Text>
      <Button
        onPress={() => {
          console.log("Button presseds");
          showAlert(
            "Hello there",
            "A good old message. This most likely be used to trigger error messages that I am likely to create, even though this will be the third time I've recreated this app",
            [{ title: "Okay" }, { title: "Okay7" }]
          );
        }}
      >
        Hi Push this button please
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  contentContainerStyle: {
    flex: 1,
    zIndex: 10000,
    justifyContent: "center",
    alignItems: "center",
  },
});
