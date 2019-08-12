import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  View,
  AsyncStorage,
  YellowBox
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import io from "socket.io-client";
import Api from "../services/api";
import Logo from "../assets/logo.png";
import Like from "../assets/like.png";
import Dislike from "../assets/dislike.png";
import Match from "../assets/itsamatch.png";

export default function Main({ navigation }) {
  const loggedUser = navigation.getParam("user");
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  YellowBox.ignoreWarnings(["Unrecognized WebSocket"]);

  useEffect(() => {
    async function loadUsers() {
      let { data } = await Api.get("/devs", {
        headers: { user: loggedUser }
      });
      setUsers(data);
    }
    let socket = io("http://10.20.18.117:3333", {
      query: { user: loggedUser }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });

    loadUsers();
    setMatchDev(users[0]);
  }, [loggedUser]);

  async function handleLike() {
    let [user, ...rest] = users;
    await Api.post(`devs/${user._id}/like`, null, {
      headers: { user: loggedUser }
    });

    setUsers(rest);
  }

  async function handleDislike() {
    let [user, ...rest] = users;
    await Api.post(`devs/${user._id}/dislike`, null, {
      headers: { user: loggedUser }
    });

    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={Logo} />
      </TouchableOpacity>
      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>Não há mais Devs!</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, { zIndex: users.length - index }]}
            >
              <Image style={styles.avatar} source={{ uri: user.avatar }} />
              <View style={styles.footer}>
                <Text style={styles.user}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
      {users.length === 0 ? (
        <View />
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleLike} style={styles.button}>
            <Image source={Like} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDislike} style={styles.button}>
            <Image source={Dislike} />
          </TouchableOpacity>
        </View>
      )}

      {matchDev && (
        <View style={styles.matchContainer}>
          <Image source={Match} alt="It's a Match" style={styles.matchImage} />
          <Image
            source={{ uri: matchDev.avatar }}
            style={styles.matchAvatar}
            alt="Avatar"
          />
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.matchButton}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-around"
  },
  cardsContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  footer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  user: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 18
  },
  avatar: {
    flex: 1,
    height: 300
  },
  logo: {
    marginTop: 30
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 30
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    },
    padding: 10
  },
  empty: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9998
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: "#fff",
    marginVertical: 30
  },
  matchName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff"
  },
  matchImage: {
    height: 60,
    resizeMode: "contain"
  },
  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 30
  },
  matchButton: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "bold",
    zIndex: 9999
  }
});
