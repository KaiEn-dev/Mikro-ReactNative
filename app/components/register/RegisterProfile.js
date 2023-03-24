import {
  Box,
  Button,
  Icon,
  Input,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from "native-base";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { Keyboard } from "react-native";
import _ from "lodash";
import GLOBAL from "../../global";
import { NavigationContainer } from "@react-navigation/native";

const profileSchema = yup.object().shape({
  username: yup
    .string()
    .nullable()
    .min(6, ({ min }) => `minimum of ${min} characters`)
    .required("username required"),
  email: yup
    .string()
    .nullable()
    .email("invalid email")
    .required("email required"),
  password: yup
    .string()
    .nullable()
    .min(8, ({ min }) => `minimum of ${min} characters`)
    .required("password required"),
});

function RegisterProfile({
  navigation,
  profiles,
  profile,
  setProfile,
  setPosition,
}) {
  const [censor, setCensor] = useState(true);
  const [dataError, setDataError] = useState({
    username: "",
    email: "",
  });
  const [errorFlag, setErrorFlag] = useState(false);

  const handleUpdateProfile = (values) => {
    Keyboard.dismiss();
    let complete = checkData(values);
    if (!complete) {
      sendData(values);
    } else {
    }
  };

  const checkData = (values) => {
    let usernameTaken = false;
    let emailTaken = false;
    // Check username
    for (let item of profiles) {
      if (_.includes(item, values.username)) {
        usernameTaken = true;
      }
    }
    // Check email
    for (let item of profiles) {
      if (_.includes(item, values.email)) {
        emailTaken = true;
      }
    }

    let newFlag = false;
    let newError = { ...dataError };
    if (usernameTaken) {
      newFlag = true;
      newError.username = "username taken";
    }
    if (emailTaken) {
      newFlag = true;
      newError.email = "email already has an account";
    }

    setErrorFlag(newFlag);
    setDataError(newError);
    return newFlag;
  };

  const resetErrorFlag = () => {
    if (errorFlag) {
      setErrorFlag(false);
    }
  };

  const sendData = (values) => {
    console.log(values);
    setProfile(values);
    setPosition(1);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        validationSchema={profileSchema}
        initialValues={{
          username: profile.username,
          email: profile.email,
          password: profile.password,
        }}
        onSubmit={(values) => handleUpdateProfile(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <Box w="100%" h="88%">
            <ScrollView>
              <Pressable
                onPress={() => Keyboard.dismiss()}
                bg="#F3F3F3"
                flex={1}
                alignItems="center"
                w="100%"
                h="100%"
              >
                <Box m="5" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
                  <Box>
                    <Text
                      fontSize="18"
                      color="#7D9253"
                      fontWeight="bold"
                      ml="1"
                      mb="7"
                    >
                      Create profile.
                    </Text>
                  </Box>
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Username
                    </Text>
                    <Input
                      onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="username"
                      value={values.username}
                      onChangeText={handleChange("username")}
                      onBlur={handleBlur("username")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.username && touched.username && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.username}
                        </Text>
                      </Box>
                    )}
                    {dataError.username.length !== 0 && errorFlag && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {dataError.username}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Email
                    </Text>
                    <Input
                      onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="email"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.email && touched.email && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.email}
                        </Text>
                      </Box>
                    )}
                    {dataError.email.length !== 0 && errorFlag && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {dataError.email}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Password
                    </Text>
                    <Input
                      //   onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="password"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      type={censor ? "password" : "text"}
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                      InputRightElement={
                        <Icon
                          as={Ionicons}
                          name={censor ? "eye-off" : "eye"}
                          size={5}
                          color="grey"
                          onPress={() => setCensor(!censor)}
                          mr="2"
                        ></Icon>
                      }
                    />
                    {errors.password && touched.password && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.password}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Pressable>
            </ScrollView>
            <Box
              position="absolute"
              bottom="0%"
              w="100%"
              flexDirection="row"
              p="4"
            >
              <Box flex="1" alignItems="flex-start">
                <Button
                  shadow="1"
                  py="2"
                  borderRadius="full"
                  onPress={() => navigation.navigate("Login")}
                  bg="#fff"
                  _pressed={{ bg: "#D0D0D0" }}
                >
                  <Text color="#A4A4A4">cancel</Text>
                </Button>
              </Box>
              <Box flex="1" alignItems="flex-end">
                <Button
                  shadow="1"
                  py="2"
                  px="4"
                  borderRadius="full"
                  onPress={handleSubmit}
                  bg="#fff"
                  _pressed={{ bg: "#D0D0D0" }}
                >
                  <Text color="#A4A4A4">next</Text>
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

export default RegisterProfile;
