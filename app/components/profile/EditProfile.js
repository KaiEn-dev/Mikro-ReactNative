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

const profileSchema = yup.object().shape({
  username: yup
    .string()
    .min(6, ({ min }) => `minimum of ${min} characters`)
    .required("username required"),
  email: yup.string().email("invalid email").required("email required"),
  password: yup
    .string()
    .min(8, ({ min }) => `minimum of ${min} characters`)
    .required("password required"),
});

function EditProfile({ navigation, route }) {
  const { profile } = route.params;
  const endpoint = "/profile";
  const [profiles, setProfiles] = useState();
  const [censor, setCensor] = useState(true);
  const [dataError, setDataError] = useState({
    username: "",
    email: "",
  });
  const [errorFlag, setErrorFlag] = useState(false);

  useEffect(() => {
    getProfiles();
  }, []);

  const getProfiles = () => {
    apiClient.get(endpoint).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.profiles;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setProfiles(data);
      }
    });
  };

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
    if (profile.username !== values.username) {
      for (let item of profiles) {
        if (_.includes(item, values.username)) {
          usernameTaken = true;
        }
      }
    }
    // Check email
    if (profile.email !== values.email) {
      for (let item of profiles) {
        if (_.includes(item, values.email)) {
          emailTaken = true;
        }
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
    let newdata = { profile: values };
    updateProfile(newdata);
  };

  const updateProfile = (newdata) => {
    apiClient.put(endpoint + "/" + GLOBAL.USERID, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.profile;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          navigation.navigate("Home");
          Toast.show({
            type: "success",
            text1: "Data Update",
            text2: "profile updated!",
          });
        }
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          bg="#F3F3F3"
          flex={1}
          alignItems="center"
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
              <>
                <Box m="5" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
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
                <Box width="100%" alignItems="flex-end">
                  <Button
                    onPress={handleSubmit}
                    bg="#2b342d"
                    mr="5"
                    _pressed={{ bg: "#3D4F21" }}
                  >
                    save
                  </Button>
                </Box>
              </>
            )}
          </Formik>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default EditProfile;
