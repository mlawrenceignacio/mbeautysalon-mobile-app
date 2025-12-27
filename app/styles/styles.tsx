import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  authCont: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 100,
    justifyContent: "flex-start",
    backgroundColor: "white",
    overflowX: "hidden",
  },
  inputCont: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#790808",
    marginBottom: 8,
    width: "100%",
    overflow: "hidden",
    paddingRight: 30,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  inputField: {
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    width: "90%",
  },
  buttonCont: {
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  textButton: {
    color: "#790808",
    fontSize: 17,
  },
});
