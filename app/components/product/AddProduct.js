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
  Modal,
} from "native-base";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik, getActiveElement } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard, Image as rnImg } from "react-native";
import _ from "lodash";
import GLOBAL from "../../global";
import * as ImagePicker from "expo-image-picker";
import firebaseUpload from "../../api/firebaseImageUpload";
import { Entypo, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import empty from "../../assets/empty.png";

const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("name required")
    .max(25, ({ max }) => `maximum of ${max} characters`)
    .nullable(),
  description: yup
    .string()
    .required("description required")
    .max(50, ({ max }) => `maximum of ${max} characters`)
    .nullable(),
  price: yup
    .string()
    .required("price required")
    .matches(/^[0-9.]+$/, "contains invalid character")
    .nullable(),
});

function AddProduct({ navigation }) {
  const productEndpoint = "/product";
  const attEndpoint = "/attributeCategory/products/";
  const imgEndpoint = "/image";
  const attributeShopEndpoint = "/attributeCategory/shop/";
  const [selectedImage, setSelectedImage] = useState(
    rnImg.resolveAssetSource(empty).uri
  );
  const [imagePick, setImagePick] = useState(false);
  const [error, setError] = useState();
  const [attributePick, setAttributePick] = useState(false);
  const [attributes, setAttributes] = useState();
  const [attList, setAttList] = useState([]);
  const [remove, setRemove] = useState(false);

  const getAttributeCategories = () => {
    apiClient.get(attributeShopEndpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.attributeCategory;
        if (data.length == 0) {
          setAttributes(null);
        } else {
          setAttributes(data);
        }
      }
    });
  };

  useEffect(() => {
    getAttributeCategories();
  }, []);

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
    setImagePick(true);
    setError(null);
    setSelectedImage(pickerResult.uri);
  };

  const handleAddProduct = (values) => {
    if (imagePick == false) {
      setError("image required");
    } else {
      sendData(values);
    }
  };

  const getSelectedAtt = () => {
    if (attList.length == 0) {
      return null;
    } else {
      return JSON.stringify(attList);
    }
  };

  const sendData = (values) => {
    let newdata = {
      product: {
        shop_id: GLOBAL.SHOPID,
        product_name: values.name,
        product_image: null,
        product_description: values.description,
        price: parseFloat(values.price),
        product_attribute: getSelectedAtt(),
        availability: 1,
      },
    };
    console.log(newdata);
    firebaseUpload(selectedImage).then((url) => {
      insertImage(newdata, url);
    });
  };

  const insertImage = (newdata, url) => {
    let newimg = { image: { image_link: url } };
    apiClient.post(imgEndpoint, newimg).then((response) => {
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
          let imgId = data[0].image_id;
          newdata.product.product_image = imgId;
          insertProduct(newdata);
        }
      }
    });
  };

  const insertProduct = (newdata) => {
    apiClient.post(productEndpoint, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.product;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          let productId = data[0].product_id;
          for (let item of attList) {
            handleUpdateAttributes(item, productId);
          }
          navigation.navigate("Home");
          Toast.show({
            type: "success",
            text1: "Data Update",
            text2: "product created!",
          });
        }
      }
    });
  };

  const handleUpdateAttributes = (attId, productId) => {
    let target = attributes.find((item) => item.a_category_id == attId);
    let newarr = JSON.parse(target.products);
    if (!newarr) {
      newarr = [];
    }
    newarr.push(productId);
    let newdata = {
      attributeCategory: {
        products: JSON.stringify(newarr),
      },
    };
    updateAtttributes(newdata, target.a_category_id);
  };

  const updateAtttributes = (newdata, attId) => {
    apiClient.put(attEndpoint + attId, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.attributeCategory;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
        }
      }
    });
  };

  const addSelectedAtt = (id) => {
    let newdata = [];
    //remove same time
    for (let item of attList) {
      if (item !== id) {
        newdata = newdata.concat(item);
      }
    }
    newdata = newdata.concat(id);
    setAttList(newdata);
    console.log(newdata);
  };

  const removeSelectedAtt = (id) => {
    let newdata = attList.slice();
    newdata = _.remove(newdata, (a) => {
      return a !== id;
    });
    setAttList(newdata);
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
                    src={selectedImage}
                    alt="Product image"
                  />
                </Box>
              </Box>
              {error && (
                <Box alignItems="center">
                  <Text fontSize="10" color="#FF4F4F">
                    {error}
                  </Text>
                </Box>
              )}
            </Pressable>
          </Box>
          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            validationSchema={productSchema}
            initialValues={{
              name: null,
              description: null,
              price: null,
            }}
            onSubmit={(values) => handleAddProduct(values)}
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
                <Box
                  m="5"
                  mb="1"
                  p="5"
                  bg="#e7f0df"
                  borderRadius="3"
                  shadow="1"
                >
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Name
                    </Text>
                    <Input
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
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Price
                    </Text>
                    <Input
                      autoCorrect={false}
                      placeholder="price"
                      value={values.price}
                      onChangeText={handleChange("price")}
                      onBlur={handleBlur("price")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.price && touched.price && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.price}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  mx="5"
                  my="4"
                  p="5"
                  bg="#e7f0df"
                  borderRadius="3"
                  shadow="1"
                  onPress={() => setAttributePick(true)}
                  _pressed={{ bg: "#DBE5D3" }}
                >
                  <Box w="100%">
                    <Box
                      mb="1"
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Attributes
                      </Text>
                    </Box>
                    <Box>
                      {attributes &&
                        attList &&
                        attList.map((aId) => {
                          return (
                            <Box
                              key={_.uniqueId("attsl")}
                              p="3"
                              borderRadius="4"
                              bg="#fff"
                              w="100%"
                              alignItems="center"
                              mb="1"
                              flexDirection="row"
                            >
                              <Text
                                textAlign="center"
                                fontWeight="500"
                                color="#7D9253"
                                flex="1"
                              >
                                {
                                  attributes.find(
                                    (item) => item.a_category_id == aId
                                  ).a_category_name
                                }
                              </Text>
                              {remove && (
                                <Button
                                  bg="transparent"
                                  _pressed={{ bg: "#EFEFEF" }}
                                  onPress={() => removeSelectedAtt(aId)}
                                >
                                  <Ionicons
                                    name="trash"
                                    size={20}
                                    color="#FF0000"
                                  />
                                </Button>
                              )}
                            </Box>
                          );
                        })}
                    </Box>

                    <Box flexDirection="row">
                      <Box flex="1" alignItems="flex-start">
                        {attList && attList.length !== 0 && (
                          <Button
                            bg="transparent"
                            _pressed={{ bg: "#FFF" }}
                            onPress={() => setRemove(!remove)}
                          >
                            {remove && <Text>done</Text>}
                            {!remove && (
                              <Ionicons name="remove" size={24} color="black" />
                            )}
                          </Button>
                        )}
                      </Box>
                      <Box flex="1" alignItems="flex-end">
                        <Button
                          bg="transparent"
                          _pressed={{ bg: "#FFF" }}
                          onPress={() => {
                            setAttributePick(true);
                          }}
                        >
                          <Ionicons name="add" size={24} color="black" />
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Modal
                  isOpen={attributePick}
                  onClose={() => setAttributePick(false)}
                >
                  <Modal.Content maxWidth="100%" bg="#2B342D">
                    <Modal.Body
                      m="3"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FontAwesome5 name="clipboard" size={24} color="#fff" />
                      {attributes && (
                        <Text
                          fontWeight="500"
                          textAlign="center"
                          my="2"
                          color="#fff"
                        >
                          choose attributes
                        </Text>
                      )}
                      {!attributes && (
                        <Text
                          fontWeight="500"
                          textAlign="center"
                          my="3"
                          color="#fff"
                        >
                          No products using this attribute
                        </Text>
                      )}
                      <Text
                        fontSize="10"
                        fontWeight="400"
                        textAlign="center"
                        my="3"
                        color="#fff"
                      >
                        new attributes can be created {`\n`}under the attributes
                        tab later
                      </Text>
                      <Box w="100%">
                        {attributes &&
                          attributes.map((att) => {
                            return (
                              <Pressable
                                key={_.uniqueId("addatt")}
                                px="3"
                                py="2"
                                borderRadius="4"
                                bg="#fff"
                                w="100%"
                                alignItems="center"
                                mb="1"
                                flexDirection="row"
                                justifyContent="center"
                                _pressed={{ bg: "#EEEEEE" }}
                                onPress={() => {
                                  addSelectedAtt(att.a_category_id);
                                }}
                              >
                                <Box>
                                  <Text
                                    textAlign="center"
                                    fontWeight="500"
                                    color="#7D9253"
                                  >
                                    {att.a_category_name}
                                  </Text>
                                  <Text
                                    textAlign="center"
                                    fontSize="10"
                                    fontWeight="500"
                                    color="#7D9253"
                                  >
                                    {att.note}
                                  </Text>
                                </Box>
                              </Pressable>
                            );
                          })}
                      </Box>
                    </Modal.Body>
                  </Modal.Content>
                </Modal>
                <Box width="100%" alignItems="flex-end" mb="20">
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

export default AddProduct;
