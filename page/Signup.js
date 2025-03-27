import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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
} from "react-native";
import axios from "axios";

export default function Signup({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [nkda, setNkda] = useState("");
  const [disease, setDisease] = useState("");
  const [address, setAddress] = useState("");
  const [device, setDevice] = useState("");

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

  const formatBirth = (value) => {
    const onlyNums = value.replace(/[^0-9]/g, "");

    if (onlyNums.length <= 4) {
      return onlyNums;
    } else if (onlyNums.length <= 6) {
      return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4)}`;
    } else if (onlyNums.length <= 8) {
      return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 6)}-${onlyNums.slice(
        6
      )}`;
    } else {
      return `${onlyNums.slice(0, 4)}-${onlyNums.slice(4, 6)}-${onlyNums.slice(
        6,
        8
      )}`;
    }
  };

  const handleSignup = async () => {
    const payload = {
      name,
      phoneNumber: phone,
      password,
      emergencyNumber,
      birth,
      nkda,
      disease,
      address,
      device,
    };

    try {
      const response = await axios.post(
        "http://192.168.0.15:8080/api/auth/signup",
        payload
      );

      if (response.status === 201) {
        navigation.navigate("Login");
      } else {
        Alert.alert("회원가입 실패", response.data.error || "오류 발생");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      Alert.alert(
        "에러",
        error.response?.data?.error || "서버와의 연결에 실패했습니다."
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
          <Text style={styles.title}>회원가입</Text>

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
          <TextInput
            style={styles.input}
            placeholder="비상 핸드폰 번호"
            keyboardType="phone-pad"
            value={emergencyNumber}
            onChangeText={(text) => setEmergencyNumber(formatPhoneNumber(text))}
          />
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="주소"
            value={address}
            onChangeText={setAddress}
          />

          <TextInput
            style={styles.input}
            placeholder="생년월일 (YYYYMMDD)"
            keyboardType="number-pad"
            maxLength={10}
            value={birth}
            onChangeText={(text) => setBirth(formatBirth(text))}
          />

          <TextInput
            style={styles.input}
            placeholder="약물 알레르기 (없으면 없음)"
            value={nkda}
            onChangeText={setNkda}
          />

          <TextInput
            style={styles.input}
            placeholder="기저질환 (없으면 없음)"
            value={disease}
            onChangeText={setDisease}
          />

          <TextInput
            style={styles.input}
            placeholder="연결 기기 일련번호"
            value={device}
            onChangeText={setDevice}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
          <Text
            style={styles.login}
            onPress={() => navigation.navigate("Login")}
          >
            로그인
          </Text>
          <StatusBar style="auto" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  login: {
    margin: 10,
    alignSelf: "flex-end",
  },
});
