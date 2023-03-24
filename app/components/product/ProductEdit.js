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
  Switch,
  Modal,
} from "native-base";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik, getActiveElement } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import _, { isNull } from "lodash";
import GLOBAL from "../../global";
import * as ImagePicker from "expo-image-picker";
import firebaseUpload from "../../api/firebaseImageUpload";
import { Entypo, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("name required")
    .max(25, ({ max }) => `maximum of ${max} characters`),
  description: yup
    .string()
    .required("description required")
    .max(50, ({ max }) => `maximum of ${max} characters`),
  price: yup
    .string()
    .required("price required")
    .matches(/^[0-9.]+$/, "contains invalid character"),
});

function ProductEdit({ route, navigation }) {
  const { product, image } = route.params;
  const categoryEndpoint = "/productCategory/shop/";
  const updateCategoryEndpoint = "/productCategory/products/";
  const attEndpoint = "/attributeCategory/products/";
  const productEndpoint = "/product/";
  const imgEndpoint = "/image/";
  const attributeShopEndpoint = "/attributeCategory/shop/";
  const [selectedImage, setSelectedImage] = useState(null);
  const [available, setAvailable] = useState(product.availability == 1 && true);
  const [attributePick, setAttributePick] = useState(false);
  const [oldAttList, setOldAttList] = useState([]);
  const [attributes, setAttributes] = useState();
  const [newAttList, setNewAttList] = useState([]);
  const [remove, setRemove] = useState(false);
  const [categories, setCategories] = useState();

  const getCategories = () => {
    apiClient.get(categoryEndpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.categories;
        if (data.length == 0) {
          setCategories(null);
        } else {
          setCategories(data);
        }
      }
    });
  };

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
    initAttList();
    getCategories();
  }, []);

  const initAttList = () => {
    if (product.product_attribute) {
      setNewAttList(JSON.parse(product.product_attribute));
      setOldAttList(JSON.parse(product.product_attribute));
    } else {
      setNewAttList([]);
      setOldAttList([]);
    }
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

  const getImageSrc = () => {
    if (selectedImage) {
      return selectedImage;
    } else {
      return image.image_link;
    }
  };

  const getAv = () => {
    if (available) {
      return 1;
    } else {
      return 0;
    }
  };

  const handleUpdateProduct = (values) => {
    sendData(values);
    handleUpdateAttributes();
  };

  const handleUpdateAttributes = () => {
    let oldarr = oldAttList.slice();
    let newarr = newAttList.slice();
    let samearr = [];

    for (let x of oldarr) {
      let target = _.remove(newarr, function (n) {
        return n == x;
      });
      samearr = samearr.concat(target);
    }

    for (let x of samearr) {
      _.remove(oldarr, function (n) {
        return n == x;
      });
      _.remove(newarr, function (n) {
        return n == x;
      });
    }

    //remove
    for (let attId of oldarr) {
      let target = attributes.find((item) => item.a_category_id == attId);
      let newlist = JSON.parse(target.products);
      _.remove(newlist, function (n) {
        return n == product.product_id;
      });
      let newdata = {
        attributeCategory: {
          products: JSON.stringify(newlist),
        },
      };
      updateAtttributes(newdata, target.a_category_id);
    }

    //add
    for (let attId of newarr) {
      let target = attributes.find((item) => item.a_category_id == attId);
      let newlist = JSON.parse(target.products);
      if (!newlist) {
        newlist = [];
      }
      newlist.push(product.product_id);
      let newdata = {
        attributeCategory: {
          products: JSON.stringify(newlist),
        },
      };
      updateAtttributes(newdata, target.a_category_id);
    }
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

  const getAList = () => {
    if (newAttList.length == 0) {
      return null;
    } else {
      return JSON.stringify(newAttList);
    }
  };

  const sendData = (values) => {
    let newdata = {
      product: {
        shop_id: GLOBAL.SHOPID,
        product_name: values.name,
        product_image: product.product_image,
        product_description: values.description,
        price: parseFloat(values.price),
        product_attribute: getAList(),
        availability: getAv(),
      },
    };
    updateProduct(newdata);
  };

  const updateProduct = (newdata) => {
    apiClient
      .put(productEndpoint + product.product_id, newdata)
      .then((response) => {
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

  const updateImageLink = (url) => {
    let newdata = { image: { image_link: url } };
    apiClient.put(imgEndpoint + image.image_id, newdata).then((response) => {
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

  const handleDeleteProduct = () => {
    handleUpdatePCategories();
    updateAttOnDelete();
    deleteProduct();
  };

  const deleteProduct = () => {
    apiClient.delete(productEndpoint + product.product_id).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        navigation.navigate("Home");
        Toast.show({
          type: "success",
          text1: "Data Update",
          text2: "product deleted!",
        });
      }
    });
  };

  const handleUpdatePCategories = () => {
    let targetList = [];
    for (let category of categories) {
      let p = JSON.parse(category.products).find(
        (item) => item == product.product_id
      );
      if (p) {
        targetList.push(category.p_category_id);
      }
    }
    if (targetList.length > 0) {
      for (let x of targetList) {
        let target = categories.find((item) => item.p_category_id == x);
        let newarr = JSON.parse(target.products);
        _.remove(newarr, function (n) {
          return n == product.product_id;
        });

        let newdata = {
          productCategory: {
            products: JSON.stringify(newarr),
          },
        };

        updateCategory(newdata, x);
      }
    }
  };
  const updateCategory = (newdata, id) => {
    apiClient.put(updateCategoryEndpoint + id, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.productCategory;
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

  const updateAttOnDelete = () => {
    for (let attId of oldAttList) {
      let target = attributes.find((item) => item.a_category_id == attId);
      let newlist = JSON.parse(target.products);
      _.remove(newlist, function (n) {
        return n == product.product_id;
      });
      let newdata = {
        attributeCategory: {
          products: JSON.stringify(newlist),
        },
      };
      updateAtttributes(newdata, target.a_category_id);
    }
  };

  const addSelectedAtt = (id) => {
    let newdata = [];
    //remove same time
    for (let item of newAttList) {
      if (item !== id) {
        newdata = newdata.concat(item);
      }
    }
    newdata = newdata.concat(id);
    setNewAttList(newdata);
  };

  const removeSelectedAtt = (id) => {
    let newdata = newAttList.slice();
    newdata = _.remove(newdata, (a) => {
      return a !== id;
    });
    setNewAttList(newdata);
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
                    alt="Product image"
                  />
                </Box>
              </Box>
            </Pressable>
          </Box>
          <Box mx="5" mt="4" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
            <Box w="100%">
              <Box
                w="100%"
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                  Available
                </Text>
                <Box flex="1" alignItems="flex-end">
                  <Switch
                    offTrackColor="#BEC4AA"
                    onTrackColor="#3D4F21"
                    size="sm"
                    value={available}
                    onValueChange={(value) => setAvailable(value)}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            validationSchema={productSchema}
            initialValues={{
              name: product.product_name,
              description: product.product_description,
              price: JSON.stringify(product.price),
              availability: product.availability == 1 && true,
            }}
            onSubmit={(values) => handleUpdateProduct(values)}
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
                        newAttList &&
                        newAttList.map((aId) => {
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
                        {newAttList && newAttList.length !== 0 && (
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

                <Box
                  width="100%"
                  flexDirection="row"
                  justifyContent="space-between"
                  mb="10"
                >
                  <Button
                    onPress={() => handleDeleteProduct()}
                    bg="#EC0000"
                    ml="5"
                    _pressed={{ bg: "#ED3030" }}
                  >
                    delete
                  </Button>
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

export default ProductEdit;
