import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "./../utils/Colors";
import * as AppAuth from "expo-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navigation from "./../";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");
      console.log("access token", accessToken);
      console.log("expiration date", expirationDate);

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate)) {
          //here the token is slitt valid
          navigation.replace("Main");
        } else {
          // token would be expired so wee need to remove it from the asnc storage
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
        }
      }
      checkTokenValidity();
    };
  }, []);
  async function authenticate() {
    const config = {
      issuer: "https://accounts/spotify.com",
      clientId: "09770138e58248e09a1bf96ff816adc2",
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public", //or "playlist-modify-private"
      ],
      redirectUrl: "exp://192.168.25.16:8081",
    };
    const result = await AppAuth.authAsync(config);
    console.log(result);
    if (result.accessToken) {
      const expirationDate = new Date(
        result.accessTokenExpirationDate
      ).getTime();
      AsyncStorage.setItem("token", result.accessToken);
      AsyncStorage.setItem("expirationDate", expirationDate.toString());
      navigation.navigate("Main");
    }
  }

  return (
    // <LinearGradient>
    //   <SafeAreaView>
    //     <Text>LoginScreen</Text>
    //   </SafeAreaView>
    // </LinearGradient>
    <View>
      <View style={styles.imageContainer}>
        <View style={{ height: 80 }}>
          <Image
            source={require("./../assets/images/login.png")}
            style={styles.image}
          />
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 50,
                fontWeight: "bold",
                color: Colors.PRIMARY,
                textAlign: "center",
              }}
            >
              SoulSync
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginTop: 6,
                textAlign: "center",
                color: Colors.GRAY,
              }}
            >
              Review your spirit with uplifting tunes on-the-go
            </Text>
          </View>

          <View style={{ height: 50 }} />
          <Pressable
            onPress={authenticate}
            style={{
              padding: 15,
              marginLeft: "auto",
              marginRight: "auto",
              width: 300,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            <Text
              style={{ textAlign: "center", color: Colors.WHITE, fontSize: 18 }}
            >
              Sign in
            </Text>
          </Pressable>
          <Pressable
            onPress={authenticate}
            style={{
              padding: 15,
              marginLeft: "auto",
              marginRight: "auto",
              width: 300,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            <Text
              style={{ textAlign: "center", color: Colors.WHITE, fontSize: 18 }}
            >
              Sign up
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginTop: 30,
    padding: 20,
  },
  image: {
    width: 300, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    borderRadius: 10,
    resizeMode: "cover",
  },
  button: {
    padding: 15,
    marginLeft: "auto",
    marginRight: "auto",
    width: 300,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
