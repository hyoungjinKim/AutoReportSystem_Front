import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  View,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, "");

    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 8)
      return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(
      7,
      11
    )}`;
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://port-0-autoreportsystem-back-m8u790x9772c113e.sel4.cloudtype.app/api/auth/login",
        {
          phoneNumber: phone,
          password: password,
        }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("userId", String(response.data.userId));
        navigation.navigate("Main");
      } else {
        Alert.alert(
          "로그인 실패",
          response.data.message || "아이디/비밀번호 확인"
        );
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      Alert.alert(
        "에러",
        error.response?.data?.message || "서버 연결에 실패했습니다."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>로그인</Text>

          <TextInput
            style={styles.input}
            placeholder="핸드폰 번호"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => setPhone(formatPhoneNumber(text))}
          />

          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
          <Text
            style={styles.signup}
            onPress={() => navigation.navigate("Signup")}
          >
            회원가입
          </Text>
          <StatusBar style="auto" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signup: {
    margin: 10,
    alignSelf: "flex-end",
  },
});
