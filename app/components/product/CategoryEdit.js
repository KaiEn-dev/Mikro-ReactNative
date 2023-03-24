import {
  Box,
  Button,
  Input,
  Text,
  Pressable,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Modal,
  Center,
} from "native-base";
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import _ from "lodash";
import { Ionicons } from "@expo/vector-icons";
import GLOBAL from "../../global";

const categorySchema = yup.object().shape({
  name: yup
    .string()
    .max(20, ({ max }) => `maximum of ${max} characters`)
    .required("name required"),
});

function CategoryEdit({ route, navigation }) {
  const endpoint = "/productCategory/";
  const shopendpoint = "/shop/";
  const { category, products } = route.params;
  const [productList, setProductList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [remove, setRemove] = useState(false);
  const [shop, setShop] = useState();

  const getShop = () => {
    apiClient.get(shopendpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.shop;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setShop(data[0]);
      }
    });
  };

  useEffect(() => {
    if (category.products) {
      setProductList(JSON.parse(category.products));
    }
    getShop();
  }, []);

  const updateShop = (newdata) => {
    apiClient.put(shopendpoint + GLOBAL.SHOPID, newdata).then((response) => {
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
        }
      }
    });
  };

  const handleUpdateShop = (id) => {
    let newdata = {
      shop: {
        user_id: shop.user_id,
        shop_name: shop.shop_name,
        shop_image: shop.shop_image,
        shop_description: shop.shop_description,
        availability: shop.availability,
        p_category: shop.p_category,
        address: shop.address,
      },
    };
    let newarr = JSON.parse(shop.p_category);
    _.remove(newarr, function (n) {
      return n == id;
    });
    if (newarr.length == 0) {
      newdata.shop.p_category = null;
    } else {
      newdata.shop.p_category = JSON.stringify(newarr);
    }
    updateShop(newdata);
  };

  const handleUpdateCategory = (values) => {
    console.log("updateCategory");
    sendData(values);
  };

  const getList = () => {
    if (productList) {
      if (productList.length > 0) {
        return JSON.stringify(productList);
      }
    } else {
      return null;
    }
  };

  const getBool = (value) => {
    if (value) {
      return 1;
    } else {
      return 0;
    }
  };

  const sendData = (values) => {
    let newdata = {
      productCategory: {
        shop_id: category.shop_id,
        p_category_name: values.name,
        products: getList(),
        availability: getBool(values.available),
      },
    };
    console.log("senddata");
    updateCategory(newdata);
  };

  const updateCategory = (newdata) => {
    apiClient
      .put(endpoint + category.p_category_id, newdata)
      .then((response) => {
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
            navigation.navigate("ProductSetting", { products: products });
            Toast.show({
              type: "success",
              text1: "Data Update",
              text2: "product category updated!",
            });
          }
        }
      });
  };

  const removeP = (pId) => {
    let newdata = productList.slice();
    newdata = _.remove(newdata, (p) => {
      return p !== pId;
    });
    setProductList(newdata);
  };

  const addP = (pId) => {
    let newdata = [];
    //remove same time
    for (let item of productList) {
      if (item !== pId) {
        newdata = newdata.concat(item);
      }
    }
    newdata = newdata.concat(pId);
    setProductList(newdata);
  };

  const handleDeleteCategory = () => {
    deleteCategory();
    handleUpdateShop(category.p_category_id);
  };

  const deleteCategory = () => {
    apiClient.delete(endpoint + category.p_category_id).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        navigation.navigate("ProductSetting", { products: products });
        Toast.show({
          type: "success",
          text1: "Data Update",
          text2: "product category deleted!",
        });
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
            validationSchema={categorySchema}
            initialValues={{
              name: category.p_category_name,
              available: category.availability == 1 && true,
            }}
            onSubmit={(values) => handleUpdateCategory(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <>
                <Box
                  mx="5"
                  mt="4"
                  p="5"
                  bg="#e7f0df"
                  borderRadius="3"
                  shadow="1"
                >
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
                          value={values.available}
                          onValueChange={(value) =>
                            setFieldValue("available", value)
                          }
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box m="5" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
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
                </Box>
                <Box
                  mx="5"
                  mb="4"
                  p="5"
                  bg="#e7f0df"
                  borderRadius="3"
                  shadow="1"
                >
                  <Box w="100%">
                    <Box
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      mb="1"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Products
                      </Text>
                    </Box>
                    <Box>
                      {productList &&
                        productList.map((pId) => {
                          return (
                            <Box
                              key={_.uniqueId("cps")}
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
                                  products.find((p) => p.product_id == pId)
                                    .product_name
                                }
                              </Text>
                              {remove && (
                                <Button
                                  bg="transparent"
                                  _pressed={{ bg: "#EFEFEF" }}
                                  onPress={() => removeP(pId)}
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
                  </Box>
                  <Box flexDirection="row">
                    <Box flex="1" alignItems="flex-start">
                      {productList && productList.length !== 0 && (
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
                          setShowAdd(true);
                        }}
                      >
                        <Ionicons name="add" size={24} color="black" />
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box
                  width="100%"
                  flexDirection="row"
                  justifyContent="space-between"
                  mb="10"
                >
                  <Button
                    onPress={() => handleDeleteCategory()}
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
          <Modal isOpen={showAdd} onClose={() => setShowAdd(false)}>
            <Modal.Content maxWidth="100%" bg="#2B342D">
              <Modal.Body
                m="3"
                alignItems="center"
                justifyContent="center"
                _scrollview={false}
              >
                <Center w="100%" mt="2" p="3" bg="#7D9253" borderRadius="5">
                  <Text fontWeight="bold" textAlign="center" color="#FFF">
                    Select product
                  </Text>
                </Center>
                <Box w="100%" mt="3">
                  {!products && <Text>No products available</Text>}
                  {products &&
                    products.map((p) => {
                      return (
                        <Button
                          key={_.uniqueId("pbtn")}
                          bg="transparent"
                          borderTopWidth="0.5"
                          borderBottomWidth="0.5"
                          borderColor="#fff"
                          py="3"
                          _pressed={{ bg: "#374239" }}
                          onPress={() => addP(p.product_id)}
                        >
                          <Text fontWeight="500" color="#fff">
                            {p.product_name}
                          </Text>
                        </Button>
                      );
                    })}
                </Box>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default CategoryEdit;
