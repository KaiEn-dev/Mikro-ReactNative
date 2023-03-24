import {
  Box,
  Button,
  Input,
  Modal,
  Text,
  TextArea,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
} from "native-base";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Foundation } from "@expo/vector-icons";
import { Keyboard } from "react-native";
import _ from "lodash";
import GLOBAL from "../../global";

const addressSchema = yup.object().shape({
  address: yup.string().required("address required"),
  postcode: yup
    .string()
    .required("postcode required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, "Must be exactly 5 digits")
    .max(5, "Must be exactly 5 digits"),
  latitude: yup
    .string()
    .required("latitude required")
    .matches(/^[0-9.]+$/, "contains invalid character"),
  longitude: yup
    .string()
    .required("latitude required")
    .matches(/^[0-9.]+$/, "contains invalid character"),
});

function EditLocation({ navigation, route }) {
  const { address } = route.params;
  const endpoint = "/address";
  const shopEndpoint = "/shop/putAddress/";
  const [showInfo, setShowInfo] = useState(false);

  const handleUpdateLocation = (values) => {
    sendData(values);
  };

  const sendData = (values) => {
    let newdata = {
      address: {
        shop_id: GLOBAL.SHOPID,
        address: values.address,
        postcode: parseInt(values.postcode),
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      },
    };
    if (address) {
      updateAddress(newdata);
    } else {
      createAddress(newdata);
    }
  };

  const updateAddress = (newdata) => {
    apiClient.put(endpoint + "/" + GLOBAL.SHOPID, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.address;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          updateShopAddress(data[0].address_id);
        }
      }
    });
  };

  const createAddress = (newdata) => {
    apiClient.post(endpoint, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Creation Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.address;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Creation Error",
            text2: "data failed to create",
          });
        } else {
          updateShopAddress(data[0].address_id);
        }
      }
    });
  };

  const updateShopAddress = (id) => {
    const newdata = { shop: { address: id } };
    apiClient.put(shopEndpoint + GLOBAL.SHOPID, newdata).then((response) => {
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
        }
        navigation.navigate("Home");
        Toast.show({
          type: "success",
          text1: "Data Update",
          text2: "shop location updated!",
        });
      }
    });
  };

  const getInit = () => {
    if (address) {
      return {
        address: address.address,
        postcode: JSON.stringify(address.postcode),
        latitude: JSON.stringify(address.latitude),
        longitude: JSON.stringify(address.longitude),
      };
    } else {
      return {
        address: "",
      };
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
          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            validationSchema={addressSchema}
            initialValues={getInit()}
            onSubmit={(values) => handleUpdateLocation(values)}
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
                      Address
                    </Text>
                    <TextArea
                      //   onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="address"
                      value={values.address}
                      onChangeText={handleChange("address")}
                      onBlur={handleBlur("address")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.address && touched.address && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.address}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Postcode
                    </Text>
                    <Input
                      //   onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="postcode"
                      value={values.postcode}
                      onChangeText={handleChange("postcode")}
                      onBlur={handleBlur("postcode")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.postcode && touched.postcode && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.postcode}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box mt="3" flexDirection="row" alignItems="center">
                    <Text ml="1" my="2" mr="2" color="#7D9253">
                      Coordinates
                    </Text>
                    <Foundation
                      name="info"
                      size={20}
                      color="#7D9253"
                      onPress={() => setShowInfo(true)}
                    />
                    <Modal isOpen={showInfo} onClose={() => setShowInfo(false)}>
                      <Modal.Content maxWidth="60%" bg="#2B342D">
                        <Modal.Body
                          m="3"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Foundation name="map" size={24} color="#fff" />
                          <Text textAlign="center" mt="3" color="#fff">
                            Coordinates will be feed into GoogleMaps and Waze to
                            obtain your shop location, make sure their correct!
                          </Text>
                        </Modal.Body>
                      </Modal.Content>
                    </Modal>
                  </Box>
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Latitude
                    </Text>
                    <Input
                      //   onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="latitude"
                      value={values.latitude}
                      onChangeText={handleChange("latitude")}
                      onBlur={handleBlur("latitude")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.latitude && touched.latitude && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.latitude}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Longitude
                    </Text>
                    <Input
                      //   onKeyPress={resetErrorFlag}
                      autoCorrect={false}
                      placeholder="longitude"
                      value={values.longitude}
                      onChangeText={handleChange("longitude")}
                      onBlur={handleBlur("longitude")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.longitude && touched.longitude && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.longitude}
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

export default EditLocation;
