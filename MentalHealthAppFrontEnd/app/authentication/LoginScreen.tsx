import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { login } from "../../api/auth";
import { hasSubmittedDailyCheckin } from "@/api/checkin";
import { useAuth } from "../store/auth/auth-context";
import { router } from "expo-router";
import { useThemeContext } from "@/components/ThemeContext";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import { getData } from "../utilities/storage-utility";
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

  const getAuthState = async () => {
    const authState = await getData("mhAuthState");
    return authState ? JSON.parse(authState) : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAuthState();
      if (data) {
        setIsLoading(true);
        const { isAuthenticated, token, uid } = data;
        setIsAuthenticated(isAuthenticated, token, uid);
        router.replace("/home");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const validate = () => {
    let valid = true;

    // Simple email validation regex
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    } else {
      setEmailError(null);
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  };

  const handleLogin = () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    login(email, password)
      .then((response) => {
        console.log("Login successful:", response);

        setIsAuthenticated(true, response.token, response.uid);
        hasSubmittedDailyCheckin(response.uid).then((hasSubmitted) => {
          if (hasSubmitted) {
            router.replace("/home");
          } else {
            router.replace("/dailycheckin");
          }
        });
      })
      .catch((error: any) => {
        console.error("Login failed:", error);
        if (error instanceof Error) {
          Alert.alert("Login Error", error.message);
        } else {
          Alert.alert("Login Error", "An unknown error occurred");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return !isAuthenticated ? (
    <View style={styles.container}>
      <Text style={styles.title}>Mental Health App Placeholder</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, emailError ? styles.errorInput : {}]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#aaa"
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              passwordError ? styles.errorInput : { flex: 1 },
            ]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityLabel={
              isPasswordVisible ? "Hide password" : "Show password"
            }
          >
            <Text style={styles.showHideText}>
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isLoading && styles.buttonDisabled,
        ]}
        onPress={handleLogin}
        disabled={isLoading}
        accessibilityLabel="Login"
        accessibilityHint="Press to log into your account"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
      <Pressable
        style={styles.registerButton}
        onPress={() => router.replace("/register")}
        accessibilityLabel="Register"
        accessibilityHint="Press to create a new account"
      >
        <Text style={styles.registerButtonText}>
          Don't have an account? Register
        </Text>
      </Pressable>
      <Pressable onPress={() => setIsResetModalVisible(true)}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>

      <ResetPasswordModal
        visible={isResetModalVisible}
        onClose={() => setIsResetModalVisible(false)}
      />
    </View>
  ) : (
    <ActivityIndicator color="#fff" />
  );
}

const createStyles = (theme: string) => {
  const isDark = theme === "dark";
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: themeColors.background,
      justifyContent: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 40,
      color: themeColors.text,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
      width: "100%",
    },
    input: {
      backgroundColor: themeColors.surface,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: themeColors.border,
      color: themeColors.text,
      width: "100%",
    },
    errorInput: {
      borderColor: themeColors.error,
    },
    errorText: {
      color: themeColors.error,
      fontSize: 14,
      marginTop: 5,
    },
    button: {
      backgroundColor: themeColors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    buttonPressed: {
      opacity: 0.8,
    },
    buttonDisabled: {
      backgroundColor: themeColors.textTertiary,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },
    registerButton: {
      marginTop: 20,
      padding: 10,
    },
    registerButtonText: {
      color: themeColors.primary,
      fontSize: 16,
      textAlign: "center",
    },
    forgotPasswordText: {
      color: themeColors.primary,
      fontSize: 14,
      textAlign: "center",
      marginTop: 15,
      textDecorationLine: "underline",
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    showHideText: {
      color: themeColors.primary,
      paddingHorizontal: 10,
    },
  });
};
