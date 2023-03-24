import {
  Box,
  Button,
  Image,
  Input,
  Pressable,
  Text,
  TextArea,
  ScrollView,
  KeyboardAvoidingView,
} from "native-base";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard, Image as rnImg } from "react-native";
import empty from "../../assets/empty.png";
import _ from "lodash";
import * as ImagePicker from "expo-image-picker";

const shopSchema = yup.object().shape({
  name: yup
    .string()
    .nullable()
    .required("name required")
    .max(15, ({ max }) => `maximum of ${max} characters`),
  description: yup
    .string()
    .nullable()
    .required("description required")
    .max(60, ({ max }) => `maximum of ${max} characters`),
});

function RegisterShop({
  shop,
  setShop,
  image,
  setImage,
  setPosition,
  pick,
  setPick,
}) {
  const [error, setError] = useState();

  const handleUpdateShop = (values) => {
    if (pick == false) {
      setError("image required");
    } else {
      sendData(values);
    }
  };

  const sendData = (values) => {
    console.log(values);
    console.log(image);
    setShop(values);
    setPosition(2);
  };

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    setImage(pickerResult.uri);
    setPick(true);
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        validationSchema={shopSchema}
        initialValues={{
          name: shop.name,
          description: shop.description,
        }}
        onSubmit={(values) => handleUpdateShop(values)}
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
                mb="50"
              >
                <Box m="5" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
                  <Box>
                    <Text
                      fontSize="18"
                      color="#7D9253"
                      fontWeight="bold"
                      ml="1"
                      mb="6"
                    >
                      Create shop.
                    </Text>
                  </Box>
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Name
                    </Text>
                    <Input
                      //   onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="name"
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.name && touched.name && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.name}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Description
                    </Text>
                    <TextArea
                      //   onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="description"
                      value={values.description}
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.description && touched.description && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.description}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box w="100%">
                  <Pressable
                    onPress={openImagePickerAsync}
                    mx="5"
                    mb="5"
                    p="5"
                    bg="#e7f0df"
                    borderRadius="3"
                    shadow="1"
                    _pressed={{ bg: "#E0E9D8" }}
                  >
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="2">
                      Image
                    </Text>
                    <Box w="100%" mb="3">
                      <Box h="40" bg="#fff" p="5" borderRadius="3">
                        <Image
                          size="100%"
                          resizeMode="contain"
                          src={image}
                          alt="Shop image"
                        />
                      </Box>
                      {error && (
                        <Box alignItems="center">
                          <Text fontSize="10" color="#FF4F4F">
                            {error}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Pressable>
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
                  px="4"
                  borderRadius="full"
                  onPress={() => setPosition(0)}
                  bg="#fff"
                  _pressed={{ bg: "#D0D0D0" }}
                >
                  <Text color="#A4A4A4">back</Text>
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

export default RegisterShop;
