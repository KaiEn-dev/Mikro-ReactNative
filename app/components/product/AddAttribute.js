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
  TextArea,
} from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import * as yup from "yup";
import { Formik, FieldArray, FastField } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import _ from "lodash";
import {
  AntDesign,
  Ionicons,
  Foundation,
  Feather,
  Entypo,
} from "@expo/vector-icons";

const categorySchema = yup.object().shape({
  name: yup
    .string()
    .max(20, ({ max }) => `maximum of ${max} characters`)
    .nullable()
    .required("name required"),
  note: yup
    .string()
    .max(40, ({ max }) => `maximum of ${max} characters`)
    .nullable()
    .required("note required"),
  optional: yup.boolean(),
  minimum: yup.number().when("optional", {
    is: true,
    then: yup
      .number("must be a number")
      .nullable()
      .required("minimum required")
      .moreThan(-1, "must be zero when optional is selected")
      .lessThan(1, "must be zero when optional is selected"),
    otherwise: yup
      .number("must be a number")
      .nullable()
      .required("minimum required")
      .moreThan(0, "must be at least one when optional is not selected"),
  }),
  maximum: yup
    .number("must be a number")
    .nullable()
    .required("maximum required")
    .nullable()
    .moreThan(-1, "must be a positive number"),
  attributes: yup
    .array()
    .of(
      yup.object().shape({
        a_name: yup
          .string()
          .nullable()
          .required("name is required")
          .max(40, ({ max }) => `maximum of ${max} characters`),
        charge: yup.string().nullable().required("charge is required"),
      })
    )
    .min(1, "attribute cannot be empty!"),
});

function AddAttribute({ route, navigation }) {
  const insertAttEndpoint = "/attribute";
  const updateAttEndpoint = "/attributeCategory/";
  const insertAttCategoryEndpoint = "/attributeCategory/";
  const updateProductEndpoint = "/product/";
  const [remove, setRemove] = useState(false);
  const [showPick, setShowPick] = useState(false);
  const [attributeList, setAttributeList] = useState([
    {
      a_category_id: null,
      a_id: null,
      a_name: "name",
      availability: true,
      charge: "0",
    },
  ]);

  const getBool = (value) => {
    if (value === true) {
      return 1;
    }
    if (value === false) {
      return 0;
    }
  };

  const handleInsertACategory = (values) => {
    let initdata = {
      attributeCategory: {
        shop_id: GLOBAL.SHOPID,
        a_category_name: values.name,
        note: values.note,
        optional: getBool(values.optional),
        minimum: values.minimum,
        maximum: values.maximum,
        attributes: null,
        availability: getBool(values.available),
        products: null,
      },
    };
    initAttributesCategory(values.attributes, initdata);
  };

  // initial attribute category insert
  const initAttributesCategory = (attributes, initData) => {
    apiClient.post(insertAttCategoryEndpoint, initData).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        let data = response.data.attributeCategory;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Update Error",
            text2: "data unavailable",
          });
        } else {
          data = data[0];
          let updatedata = {
            attributeCategory: {
              shop_id: data.shop_id,
              a_category_name: data.a_category_name,
              note: data.note,
              optional: data.optional,
              minimum: data.minimum,
              maximum: data.maximum,
              attributes: null,
              availability: data.available,
              products: null,
            },
          };
          insertNewAtt(attributes, updatedata, data.a_category_id);
        }
      }
    });
  };

  // Insert new attributes
  const insertNewAtt = (list, updatedata, categoryId) => {
    // data cleaning
    let newlist = [];
    for (let item of list) {
      let newdata = {
        attribute: {
          a_category_id: categoryId,
          a_name: item.a_name,
          charge: parseInt(item.charge),
          availability: getBool(item.availability),
        },
      };
      newlist.push(newdata);
    }

    let idList = [];
    let promises = [];
    for (let item of newlist) {
      promises.push(
        apiClient.post(insertAttEndpoint, item).then((response) => {
          if (!response.ok) {
            Toast.show({
              type: "error",
              text1: "Data Update Error",
              text2: "http request failed",
            });
          } else {
            const data = response.data.attribute[0];
            idList.push(data.a_id);
          }
        })
      );
    }

    Promise.all(promises).then(() => {
      updatedata.attributeCategory.attributes = JSON.stringify(idList);
      updateAttributes(updatedata, categoryId);
    });
  };

  const updateAttributes = (newdata, categoryId) => {
    apiClient.put(updateAttEndpoint + categoryId, newdata).then((response) => {
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
          navigation.navigate("Home");
          Toast.show({
            type: "success",
            text1: "Data Update",
            text2: "attribute created!",
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
            validationSchema={categorySchema}
            initialValues={{
              name: null,
              note: null,
              optional: false,
              minimum: 1,
              maximum: 1,
              available: false,
              attributes: attributeList,
            }}
            onSubmit={(values) => handleInsertACategory(values)}
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
                <Box
                  mx="5"
                  mt="5"
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
                </Box>
                <Box m="5" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
                  <Box w="100%" mb="3">
                    <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                      Note
                    </Text>
                    <TextArea
                      autoCorrect={false}
                      placeholder="note"
                      value={values.note}
                      onChangeText={handleChange("note")}
                      onBlur={handleBlur("note")}
                      type="text"
                      w="100%"
                      color="grey"
                      bg="#fff"
                      borderWidth="0"
                      _focus={{ bg: "#F8F8F8" }}
                      py="3"
                    />
                    {errors.note && touched.note && (
                      <Box alignItems="center">
                        <Text fontSize="10" color="#FF4F4F">
                          {errors.note}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box mx="5" p="5" bg="#e7f0df" borderRadius="3" shadow="1">
                  <Box w="100%">
                    <Box
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Optional
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          value={values.optional}
                          onValueChange={(value) =>
                            setFieldValue("optional", value)
                          }
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  mx="5"
                  mt="5"
                  p="5"
                  bg="#e7f0df"
                  borderRadius="3"
                  shadow="1"
                >
                  <Box w="100%" mb="3" flexDirection="row" alignItems="center">
                    <Text fontWeight="bold" color="#3D4F21">
                      Pick range
                    </Text>

                    <Button
                      bg="transparent"
                      _pressed={{ bg: "#DCE3D5" }}
                      borderRadius="full"
                      onPress={() => setShowPick(true)}
                    >
                      <Foundation name="info" size={20} color="#7D9253" />
                    </Button>
                    <Modal isOpen={showPick} onClose={() => setShowPick(false)}>
                      <Modal.Content maxWidth="60%" bg="#2B342D">
                        <Modal.Body
                          m="3"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Feather
                            name="more-horizontal"
                            size={24}
                            color="#fff"
                          />
                          <Text textAlign="center" mb="7" color="#fff">
                            Pick range are used to limit customers' number of
                            picks within an attribute during purchase.
                          </Text>
                          <AntDesign name="question" size={24} color="#fff" />
                          <Text textAlign="center" color="#fff">
                            set maximum to zero to not set a upper limit
                          </Text>
                        </Modal.Body>
                      </Modal.Content>
                    </Modal>
                  </Box>
                  <Box w="100%" mb="3" flexDirection="row">
                    <Box flex="1" mr="2">
                      <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                        Minimum
                      </Text>
                      <Input
                        keyboardType="numeric"
                        autoCorrect={false}
                        placeholder="minimum"
                        value={values.minimum.toString()}
                        onChangeText={handleChange("minimum")}
                        onBlur={handleBlur("minimum")}
                        w="100%"
                        color="grey"
                        bg="#fff"
                        borderWidth="0"
                        _focus={{ bg: "#F8F8F8" }}
                        py="3"
                      />
                      {errors.minimum && touched.minimum && (
                        <Box alignItems="center">
                          <Text fontSize="10" color="#FF4F4F">
                            {errors.minimum}
                          </Text>
                        </Box>
                      )}
                    </Box>
                    <Box flex="1" ml="2">
                      <Text color="#3d4f21" fontWeight="bold" ml="2" mb="1">
                        Maximum
                      </Text>
                      <Input
                        autoCorrect={false}
                        placeholder="maximum"
                        value={values.maximum.toString()}
                        onChangeText={handleChange("maximum")}
                        onBlur={handleBlur("maximum")}
                        type="text"
                        w="100%"
                        color="grey"
                        bg="#fff"
                        borderWidth="0"
                        _focus={{ bg: "#F8F8F8" }}
                        py="3"
                      />
                      {errors.maximum && touched.maximum && (
                        <Box alignItems="center">
                          <Text fontSize="10" color="#FF4F4F">
                            {errors.maximum}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                <FieldArray
                  name="attributes"
                  render={(arrayHelpers) => (
                    <Box
                      mx="5"
                      my="4"
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
                          <Text
                            flex="1"
                            color="#3d4f21"
                            fontWeight="bold"
                            ml="2"
                          >
                            Attribute
                          </Text>
                        </Box>

                        <Box flex="1">
                          {values.attributes &&
                            values.attributes.map((att, index) => {
                              return (
                                <Box
                                  key={index}
                                  bg="#fff"
                                  p="4"
                                  borderRadius="5"
                                  flexDirection="row"
                                  mb="2"
                                >
                                  <Box flex="4" position="relative">
                                    <Input
                                      autoCorrect={false}
                                      value={values.attributes[index].a_name}
                                      onChangeText={handleChange(
                                        `attributes.${index}.a_name`
                                      )}
                                      onBlur={handleBlur(
                                        `attributes.${index}.a_name`
                                      )}
                                      type="text"
                                      h="10"
                                      bg="#F3F3F3"
                                      borderWidth="0"
                                      mb="1"
                                      pl="10"
                                      fontSize="13"
                                      fontWeight="600"
                                      color="#3D4F21"
                                    />
                                    {errors.attributes &&
                                      errors.attributes[index] &&
                                      errors.attributes[index].a_name &&
                                      touched.attributes &&
                                      touched.attributes[index] &&
                                      touched.attributes[index].a_name && (
                                        <Box alignItems="center">
                                          <Text fontSize="10" color="#FF4F4F">
                                            {errors.attributes[index].a_name}
                                          </Text>
                                        </Box>
                                      )}
                                    <Input
                                      autoCorrect={false}
                                      value={values.attributes[index].charge}
                                      onChangeText={handleChange(
                                        `attributes.${index}.charge`
                                      )}
                                      onBlur={handleBlur(
                                        `attributes.${index}.charge`
                                      )}
                                      type="text"
                                      h="10"
                                      bg="#F3F3F3"
                                      borderWidth="0"
                                      mb="1"
                                      pl="10"
                                      fontSize="13"
                                      fontWeight="600"
                                      color="#3D4F21"
                                    />
                                    {errors.attributes &&
                                      errors.attributes[index] &&
                                      errors.attributes[index].charge &&
                                      touched.attributes &&
                                      touched.attributes[index] &&
                                      touched.attributes[index].charge && (
                                        <Box alignItems="center">
                                          <Text fontSize="10" color="#FF4F4F">
                                            {errors.attributes[index].charge}
                                          </Text>
                                        </Box>
                                      )}
                                    <Text
                                      fontSize="8"
                                      color="#B3B3B3"
                                      position="absolute"
                                      left="1"
                                    >
                                      name
                                    </Text>
                                    <Text
                                      fontSize="8"
                                      position="absolute"
                                      color="#B3B3B3"
                                      top="43"
                                      left="1"
                                    >
                                      charge
                                    </Text>
                                  </Box>
                                  <Center flex="1">
                                    <Switch
                                      size="sm"
                                      offTrackColor="#BEC4AA"
                                      onTrackColor="#3D4F21"
                                      value={
                                        values.attributes[index].availability
                                      }
                                      onValueChange={(value) =>
                                        setFieldValue(
                                          `attributes.${index}.availability`,
                                          value
                                        )
                                      }
                                    />
                                    {remove && (
                                      <Button
                                        mt="3"
                                        bg="transparent"
                                        _pressed={{ bg: "#EFEFEF" }}
                                        onPress={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <Ionicons
                                          name="trash"
                                          size={20}
                                          color="#FF0000"
                                        />
                                      </Button>
                                    )}
                                  </Center>
                                </Box>
                              );
                            })}
                        </Box>
                      </Box>
                      <Box flexDirection="row">
                        <Box flex="1" alignItems="flex-start">
                          {values.attributes && values.attributes.length !== 0 && (
                            <Button
                              bg="transparent"
                              _pressed={{ bg: "#FFF" }}
                              onPress={() => setRemove(!remove)}
                            >
                              {remove && <Text>done</Text>}
                              {!remove && (
                                <Ionicons
                                  name="remove"
                                  size={24}
                                  color="black"
                                />
                              )}
                            </Button>
                          )}
                        </Box>
                        <Box flex="1" alignItems="flex-end">
                          <Button
                            bg="transparent"
                            _pressed={{ bg: "#FFF" }}
                            onPress={() => {
                              let newdata = {
                                a_category_id: null,
                                a_id: null,
                                a_name: "name",
                                availability: true,
                                charge: "0",
                              };
                              arrayHelpers.push(newdata);
                            }}
                          >
                            <Ionicons name="add" size={24} color="black" />
                          </Button>
                        </Box>
                      </Box>
                      {errors.attributes && (
                        <Box alignItems="center">
                          <Text fontSize="10" color="#FF4F4F">
                            {errors.attributes}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  )}
                />
                <Box
                  width="100%"
                  flexDirection="row"
                  justifyContent="space-between"
                  mb="10"
                >
                  <Button
                    onPress={() => handleDeleteAttribute()}
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

export default AddAttribute;
