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
import { Keyboard } from "react-native";
import _ from "lodash";
import GLOBAL from "../../global";
import * as ImagePicker from "expo-image-picker";
import firebaseUpload from "../../api/firebaseImageUpload";

const shopSchema = yup.object().shape({
  name: yup
    .string()
    .required("name required")
    .max(15, ({ max }) => `maximum of ${max} characters`),
  description: yup
    .string()
    .required("description required")
    .max(50, ({ max }) => `maximum of ${max} characters`),
});

function EditShop({ navigation, route }) {
  const { shop, shopImg } = route.params;
  const endpoint = "/shop";
  const imgEndpoint = "/image";
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUpdateShop = (values) => {
    sendData(values);
  };

  const sendData = (values) => {
    let newdata = {
      shop: {
        user_id: shop.user_id,
        shop_name: values.name,
        shop_image: shop.shop_image,
        shop_description: values.description,
        availability: shop.availability,
        p_category: shop.p_category,
        address: shop.address,
      },
    };
    updateShop(newdata);
  };

  const updateShop = (newdata) => {
    apiClient.put(endpoint + "/" + shop.shop_id, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.shop;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          if (selectedImage) {
            firebaseUpload(selectedImage).then((url) => {
              updateImageLink(url);
            });
          } else {
            navigation.navigate("Home");
            Toast.show({
              type: "success",
              text1: "Data Update",
              text2: "shop updated!",
            });
          }
        }
      }
    });
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

    setSelectedImage(pickerResult.uri);
  };

  const updateImageLink = (url) => {
    let newdata = { image: { image_link: url } };
    apiClient
      .put(imgEndpoint + "/" + shopImg.image_id, newdata)
      .then((response) => {
        if (!response.ok) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "http request failed",
          });
        } else {
          const data = response.data.image;
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
              text2: "shop updated!",
            });
          }
        }
      });
  };

  const getImageSrc = () => {
    if (selectedImage) {
      return selectedImage;
    } else {
      return shopImg.image_link;
    }
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
          <Box w="100%">
            <Pressable
              onPress={openImagePickerAsync}
              m="5"
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
                    src={getImageSrc()}
                    alt="Shop image"
                  />
                </Box>
              </Box>
            </Pressable>
          </Box>

          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            validationSchema={shopSchema}
            initialValues={{
              name: shop.shop_name,
              description: shop.shop_description,
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
              <>
                <Box m="5" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
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

export default EditShop;
