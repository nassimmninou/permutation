import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";

export default function Page1({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleLogin = () => {
    fetch("https://tiny-worm-nightgown.cyclic.app/professeurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Authentication successful") {
          fetch("https://tiny-worm-nightgown.cyclic.app/professeurs")
            .then((response) => response.json())
            .then((professeursData) => {
              const professor = professeursData.find(
                (prof) => prof.email === email
              );
              if (professor) {
                navigation.navigate("Drawer", { professor });
              }
            })
            .catch((error) => {
              console.error("Error retrieving professors data:", error);
            });
        } else {
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  return (
    <View style={styles.container}>

      <TextInput
        placeholder="User Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

<View style={styles.buttonContainer}>

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate("Page2")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      </View>

      {/* Modal to display incorrect information */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Incorrect information</Text>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 450,
    height: 300,
    resizeMode: "contain",
  },
  input: {
    borderWidth: 1,
    borderColor: "#446688",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 100,
    marginHorizontal:35,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#446688",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
