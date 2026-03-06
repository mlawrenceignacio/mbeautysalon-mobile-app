import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  authCont: {
    flex: 1,
    paddingHorizontal: 25,
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
    width: "100%",
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

  modernHeader: {
    backgroundColor: "#790808",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    gap: 15,
  },

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginVertical: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  chartCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#450101",
  },
  headerTitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },

  headerUsername: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 3,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    gap: 10,
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#ffd9eb",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    width: "48%",
  },

  infoNumber: {
    fontSize: 30,
    fontWeight: "800",
    color: "white",
  },

  infoLabel: {
    fontSize: 14,
    marginTop: 5,
    color: "white",
    textAlign: "center",
  },

  timeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
  },

  timeCard: {
    backgroundColor: "#ffffff",
    paddingVertical: 17,
    paddingHorizontal: 15,
    borderRadius: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f5c6cf",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  datePill: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginTop: 10,
    borderRadius: 50,
    fontWeight: "600",
    fontSize: 13,
    color: "#790808",
    backgroundColor: "#ffe5ea",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#450101",
  },

  actionText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
    color: "#790808",
  },

  actionGridNew: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  actionBox: {
    width: "48%",
    paddingVertical: 28,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f2ccd4",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  primaryAction: {
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#790808",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  primaryActionText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  headerCont: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },

  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#580000ff",
  },

  reservationCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#f5c6cf",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },

  cardName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#450101",
  },

  cardValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "left",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingLeft: 5,
    flex: 1,
  },

  cardStatusText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#450101",
  },

  cardNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff4f7",
    borderRadius: 12,
    gap: 10,
    padding: 10,
    marginTop: 12,
  },

  cardNoteText: {
    fontSize: 15,
    color: "#555",
  },

  cardStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#ffe5ea",
    borderRadius: 12,
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
  },

  subHeadText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },

  userCard: {
    marginTop: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  avatarCircle: {
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: "#fde7ea",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  usernameText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#790808",
    textAlign: "center",
  },

  emailText: {
    fontSize: 15,
    color: "#555",
    marginLeft: 6,
  },

  menuItem: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  menuText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#222",
  },
});
