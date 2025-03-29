import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export default function Main({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("userToken");
        if (!userId || !token) return;

        const res = await axios.get(
          `https://port-0-autoreportsystem-back-m8u790x9772c113e.sel4.cloudtype.app/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data.data);
      } catch (err) {
        navigation.replace("Login");
      }
    };

    fetchUser();
  }, []);

  const handleCall = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    // 1️⃣ 위치 권한 요청
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("위치 권한이 필요합니다.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    const [addr] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const fullAddress = `${addr.region} ${addr.city || ""} ${
      addr.street || ""
    }`;

    await axios.post(
      `https://port-0-autoreportsystem-back-m8u790x9772c113e.sel4.cloudtype.app/api/sms/${userId}`,
      {
        address: fullAddress,
      }
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userId");
    navigation.replace("Login");
  };

  if (!user)
    return (
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
      <View style={styles.ImageWrap}>
        <Image style={styles.Image} source={require("../assets/Logo.png")} />
      </View>

      <View style={styles.userInfoBox}>
        <Text style={styles.nameCon}>
          <Text style={styles.name}>{user.name}</Text>님
        </Text>
        <Text style={styles.userInfoText}>{`생년월일: ${user.birth}`}</Text>
        <Text style={styles.userInfoText}>{`약물 알러지: ${user.nkda}`}</Text>
        <Text style={styles.userInfoText}>{`기저질환: ${user.disease}`}</Text>
        <Text
          style={styles.userInfoText}
        >{`비상 연락처: ${user.emergencyNumber}`}</Text>
        <Text style={styles.userInfoText}>{`주소: ${user.address}`}</Text>
      </View>
      <TouchableOpacity style={styles.CallButton} onPress={handleCall}>
        <Image
          style={styles.CallImage}
          source={require("../assets/phone.png")}
        />
        <Text style={styles.CallText}>긴급 신고</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  ImageWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  Image: {
    width: 200,
    height: 200,
  },
  userInfoBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 3,
  },
  nameCon: {
    fontSize: 24,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },

  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginRight: 10,
    position: "absolute",
    top: 50,
    right: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 12,
  },
  CallButton: {
    backgroundColor: "lightgray",
    borderRadius: 20,
    margin: 10,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  CallImage: {
    width: 80,
    height: 80,
  },
  CallText: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: "bold",
  },
});
