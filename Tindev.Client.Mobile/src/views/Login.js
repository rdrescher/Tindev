import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  AsyncStorage
} from "react-native";
import Api from "../services/api";
import Logo from "../assets/logo.png";

export default function Login({ navigation }) {
  const [user, setUser] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        navigation.navigate("Main", { user });
      }
    });
  }, []);

  async function handleLogin() {
    const { data } = await Api.post("/devs", { user });

    if (data.success) {
      await AsyncStorage.setItem("user", data.data._id);

      navigation.navigate("Main", { user: data.data._id });
    } else {
      setError(data.data);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      enabled={Platform.OS === "ios"}
      behavior="padding"
    >
      <Image source={Logo} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usuário do GitHub"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setUser}
        value={user}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 30
  },
  input: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15
  },
  button: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#df4723",
    borderRadius: 4,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  error: {
    fontSize: 14,
    color: "red"
  }
});
