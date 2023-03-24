import { Box, Text, Image, Input, Button, Modal } from "native-base";
import React, { useState, useEffect } from "react";
import loadinglogo from "../../assets/loadinglogo.png";
import _, { set } from "lodash";
import * as yup from "yup";
import { Formik } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import Loading from "./Loading";

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("email required"),
  password: yup
    .string()
    .min(8, ({ min }) => `minimum of ${min} characters`)
    .required("password required"),
});

function LoginScreen({ navigation }) {
  const endpoint = "/profile";
  const [profiles, setProfiles] = useState();
  const [dataError, setDataError] = useState({
    email: "",
    password: "",
  });
  const [errorFlag, setErrorFlag] = useState(false);
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);

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

  const handleLogin = (values) => {
    Keyboard.dismiss();
    let complete = checkData(values);
    if (complete) {
      console.log("Login!");
      setShow(true);
    } else {
      console.log("Incorrect!");
    }
  };

  const checkData = (values) => {
    let complete = false;
    let pw;
    let id;
    let outId = null;
    let foundEmail = false;
    if (profiles) {
      // Check email
      for (let profile of profiles) {
        if (_.includes(profile, values.email)) {
          pw = profile.password;
          id = profile.user_id;
          foundEmail = true;
        }
      }
      let newFlag = true;
      let newdata = { email: "", password: "" };
      if (foundEmail == false) {
        newdata.email = "email not found";
      } else {
        if (values.password == pw) {
          complete = true;
          newFlag = false;
          outId = id;
        } else {
          newdata.password = "incorrect password";
        }
      }
      setDataError(newdata);
      setErrorFlag(newFlag);
      setUser(outId);
      console.log(outId);
      return complete;
    }
  };

  const resetErrorFlag = () => {
    if (errorFlag) {
      setErrorFlag(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <Box bg="#2B342D" flex={1} alignItems="center" justifyContent="center">
      <Box w="100%" alignItems="center" top="-7%">
        <Image size="150" source={loadinglogo} alt="logo" mb="6"></Image>
        <Box>
          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            validationSchema={loginSchema}
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <Input
                  onKeyPress={resetErrorFlag}
                  placeholder="email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  type="text"
                  textAlign="center"
                  w="50%"
                  color="#fff"
                  _focus={{ bg: "#445047", borderColor: "#fff" }}
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
                <Input
                  onKeyPress={resetErrorFlag}
                  placeholder="password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  type="password"
                  mt="2"
                  w="50%"
                  textAlign="center"
                  color="#fff"
                  _focus={{ bg: "#445047", borderColor: "#fff" }}
                />
                {errors.password && touched.password && (
                  <Box alignItems="center">
                    <Text fontSize="10" color="#FF4F4F">
                      {errors.password}
                    </Text>
                  </Box>
                )}
                {dataError.password.length !== 0 && errorFlag && (
                  <Box alignItems="center">
                    <Text fontSize="10" color="#FF4F4F">
                      {dataError.password}
                    </Text>
                  </Box>
                )}
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="baseline"
                  mt="3"
                >
                  <Button
                    onPress={handleRegister}
                    bg="#2B342D"
                    py="0"
                    px="1"
                    _pressed={{ bg: "#2B342D" }}
                    textDecoration="underline"
                    borderBottomWidth="0.6"
                    borderBottomColor="#bec4aa"
                  >
                    <Text color="#bec4aa" textDecoration="underline">
                      register
                    </Text>
                  </Button>
                  <Button
                    onPress={handleSubmit}
                    bg="#7d9253"
                    py="2"
                    _pressed={{ bg: "#fff" }}
                  >
                    <Text color="#fff">Login</Text>
                  </Button>
                </Box>
              </>
            )}
          </Formik>
        </Box>
      </Box>
      <Modal
        isOpen={show}
        flex={1}
        bg="#2B342D"
        alignItems="center"
        justifyContent="center"
      >
        {show && (
          <Loading user={user} setShow={setShow} navigation={navigation} />
        )}
      </Modal>
    </Box>
  );
}

export default LoginScreen;
