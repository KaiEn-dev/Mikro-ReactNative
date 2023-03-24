import {
  Box,
  Button,
  Input,
  Text,
  Pressable,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
} from "native-base";
import React from "react";
import * as yup from "yup";
import { Formik } from "formik";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import _ from "lodash";

const operatingHourSchema = yup.object().shape({
  monOpen: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  monClose: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  tuesOpen: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  tuesClose: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  wedOpen: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  wedClose: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  thurOpen: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  thurClose: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  friOpen: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  friClose: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  satOpen: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  satClose: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  sunOpen: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  sunClose: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
});

function EditOperatingHour({ navigation, route }) {
  const { operatingHour } = route.params;
  const endpoint = "/operatingHour/";

  const truthy = (value) => {
    if (value) {
      return 1;
    } else {
      return 0;
    }
  };

  const handleUpdateHour = (values) => {
    let newdata = {
      shop_id: operatingHour.shop_id,
      mon: truthy(values.mon),
      mon_open: values.monOpen,
      mon_close: values.monClose,
      tues: truthy(values.tues),
      tues_open: values.tuesOpen,
      tues_close: values.tuesClose,
      wed: truthy(values.wed),
      wed_open: values.wedOpen,
      wed_close: values.wedClose,
      thur: truthy(values.thur),
      thur_open: values.thurOpen,
      thur_close: values.thurClose,
      fri: truthy(values.fri),
      fri_open: values.friOpen,
      fri_close: values.friClose,
      sat: truthy(values.sat),
      sat_open: values.satOpen,
      sat_close: values.satClose,
      sun: truthy(values.sun),
      sun_open: values.sunOpen,
      sun_close: values.sunClose,
    };

    let cleandata = { operatingHour: dataClean(newdata) };
    console.log(cleandata);
    updateOperatingHour(cleandata);
  };

  const dataClean = (data) => {
    let oh = { ...data };

    for (let key in oh) {
      if (oh[key] === "") {
        oh[key] = null;
      }
    }

    if (!oh.mon) {
      oh.mon_open = null;
      oh.mon_close = null;
    }

    if (!oh.tues) {
      oh.tues_open = null;
      oh.tues_close = null;
    }

    if (!oh.wed) {
      oh.wed_open = null;
      oh.wed_close = null;
    }

    if (!oh.thur) {
      oh.thur_open = null;
      oh.thur_close = null;
    }

    if (!oh.fri) {
      oh.fri_open = null;
      oh.fri_close = null;
    }

    if (!oh.sat) {
      oh.sat_open = null;
      oh.sat_close = null;
    }

    if (!oh.sun) {
      oh.sun_open = null;
      oh.sun_close = null;
    }

    if (oh.mon_open == null || oh.mon_close == null) {
      oh.mon = 0;
      oh.mon_open = null;
      oh.mon_close = null;
    }

    if (oh.tues_open == null || oh.tues_close == null) {
      oh.tues = 0;
      oh.tues_open = null;
      oh.tues_close = null;
    }

    if (oh.wed_open == null || oh.wed_close == null) {
      oh.wed = 0;
      oh.wed_open = null;
      oh.wed_close = null;
    }

    if (oh.thur_open == null || oh.thur_close == null) {
      oh.thur = 0;
      oh.thur_open = null;
      oh.thur_close = null;
    }

    if (oh.fri_open == null || oh.fri_close == null) {
      oh.fri = 0;
      oh.fri_open = null;
      oh.fri_close = null;
    }

    if (oh.sat_open == null || oh.sat_close == null) {
      oh.sat = 0;
      oh.sat_open = null;
      oh.sat_close = null;
    }

    if (oh.sun_open == null || oh.sun_close == null) {
      oh.sun = 0;
      oh.sun_open = null;
      oh.sun_close = null;
    }

    if (oh.mon) {
      let open = parseInt(oh.mon_open.replace(":", ""));
      let close = parseInt(oh.mon_close.replace(":", ""));
      if (close <= open) {
        oh.mon = 0;
        oh.mon_open = null;
        oh.mon_close = null;
      }
    }

    if (oh.tues) {
      let open = parseInt(oh.tues_open.replace(":", ""));
      let close = parseInt(oh.tues_close.replace(":", ""));
      if (close <= open) {
        oh.tues = 0;
        oh.tues_open = null;
        oh.tues_close = null;
      }
    }

    if (oh.wed) {
      let open = parseInt(oh.wed_open.replace(":", ""));
      let close = parseInt(oh.wed_close.replace(":", ""));
      if (close <= open) {
        oh.wed = 0;
        oh.wed_open = null;
        oh.wed_close = null;
      }
    }

    if (oh.thur) {
      let open = parseInt(oh.thur_open.replace(":", ""));
      let close = parseInt(oh.thur_close.replace(":", ""));
      if (close <= open) {
        oh.thur = 0;
        oh.thur_open = null;
        oh.thur_close = null;
      }
    }

    if (oh.fri) {
      let open = parseInt(oh.fri_open.replace(":", ""));
      let close = parseInt(oh.fri_close.replace(":", ""));
      if (close <= open) {
        oh.fri = 0;
        oh.fri_open = null;
        oh.fri_close = null;
      }
    }

    if (oh.sat) {
      let open = parseInt(oh.sat_open.replace(":", ""));
      let close = parseInt(oh.sat_close.replace(":", ""));
      if (close <= open) {
        oh.sat = 0;
        oh.sat_open = null;
        oh.sat_close = null;
      }
    }

    if (oh.sun) {
      let open = parseInt(oh.sun_open.replace(":", ""));
      let close = parseInt(oh.sun_close.replace(":", ""));
      if (close <= open) {
        oh.sun = 0;
        oh.sun_open = null;
        oh.sun_close = null;
      }
    }

    if (oh.mon_open) {
      oh.mon_open = oh.mon_open + ":00";
    }
    if (oh.mon_close) {
      oh.mon_close = oh.mon_close + ":00";
    }
    if (oh.tues_open) {
      oh.tues_open = oh.tues_open + ":00";
    }
    if (oh.tues_close) {
      oh.tues_close = oh.tues_close + ":00";
    }
    if (oh.wed_open) {
      oh.wed_open = oh.wed_open + ":00";
    }
    if (oh.wed_close) {
      oh.wed_close = oh.wed_close + ":00";
    }
    if (oh.thur_open) {
      oh.thur_open = oh.thur_open + ":00";
    }
    if (oh.thur_close) {
      oh.thur_close = oh.thur_close + ":00";
    }
    if (oh.fri_open) {
      oh.fri_open = oh.fri_open + ":00";
    }
    if (oh.fri_close) {
      oh.fri_close = oh.fri_close + ":00";
    }
    if (oh.sat_open) {
      oh.sat_open = oh.sat_open + ":00";
    }
    if (oh.sat_close) {
      oh.sat_close = oh.sat_close + ":00";
    }
    if (oh.sun_open) {
      oh.sun_open = oh.sun_open + ":00";
    }
    if (oh.sun_close) {
      oh.sun_close = oh.sun_close + ":00";
    }

    return oh;
  };

  const updateOperatingHour = (newdata) => {
    apiClient.put(endpoint + operatingHour.oh_id, newdata).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Update Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.operatingHour;
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
            text2: "operating hour updated!",
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
            validationSchema={operatingHourSchema}
            initialValues={{
              mon: operatingHour.mon == 1 && true,
              monOpen:
                operatingHour.mon_open && operatingHour.mon_open.slice(0, -3),
              monClose:
                operatingHour.mon_close && operatingHour.mon_close.slice(0, -3),
              tues: operatingHour.tues == 1 && true,
              tuesOpen:
                operatingHour.tues_open && operatingHour.tues_open.slice(0, -3),
              tuesClose:
                operatingHour.tues_close &&
                operatingHour.tues_close.slice(0, -3),
              wed: operatingHour.wed == 1 && true,
              wedOpen:
                operatingHour.wed_open && operatingHour.wed_open.slice(0, -3),
              wedClose:
                operatingHour.wed_close && operatingHour.wed_close.slice(0, -3),
              thur: operatingHour.thur == 1 && true,
              thurOpen:
                operatingHour.thur_open && operatingHour.thur_open.slice(0, -3),
              thurClose:
                operatingHour.thur_close &&
                operatingHour.thur_close.slice(0, -3),
              fri: operatingHour.fri == 1 && true,
              friOpen:
                operatingHour.fri_open && operatingHour.fri_open.slice(0, -3),
              friClose:
                operatingHour.fri_close && operatingHour.fri_close.slice(0, -3),
              sat: operatingHour.sat == 1 && true,
              satOpen:
                operatingHour.sat_open && operatingHour.sat_open.slice(0, -3),
              satClose:
                operatingHour.sat_close && operatingHour.sat_close.slice(0, -3),
              sun: operatingHour.sun == 1 && true,
              sunOpen:
                operatingHour.sun_open && operatingHour.sun_open.slice(0, -3),
              sunClose:
                operatingHour.sun_close && operatingHour.sun_close.slice(0, -3),
            }}
            onSubmit={(values) => handleUpdateHour(values)}
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
                        sad
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          value={values.mon}
                          onValueChange={(value) => setFieldValue("mon", value)}
                        />
                      </Box>
                    </Box>
                    {values.mon && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="open"
                          value={values.monOpen}
                          onChangeText={handleChange("monOpen")}
                          onBlur={handleBlur("monOpen")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                          mr="5"
                        />
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="close"
                          value={values.monClose}
                          onChangeText={handleChange("monClose")}
                          onBlur={handleBlur("monClose")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                        />
                      </Box>
                    )}
                    {values.mon && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        {errors.monOpen && touched.monOpen && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.monOpen}
                            </Text>
                          </Box>
                        )}

                        {errors.monClose && touched.monClose && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.monClose}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
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
                        Monday
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          value={values.mon}
                          onValueChange={(value) => setFieldValue("mon", value)}
                        />
                      </Box>
                    </Box>
                    {values.mon && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="open"
                          value={values.monOpen}
                          onChangeText={handleChange("monOpen")}
                          onBlur={handleBlur("monOpen")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                          mr="5"
                        />
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="close"
                          value={values.monClose}
                          onChangeText={handleChange("monClose")}
                          onBlur={handleBlur("monClose")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                        />
                      </Box>
                    )}
                    {values.mon && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        {errors.monOpen && touched.monOpen && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.monOpen}
                            </Text>
                          </Box>
                        )}

                        {errors.monClose && touched.monClose && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.monClose}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
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
                  <Box w="100%">
                    <Box
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Tuesday
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          value={values.tues}
                          onValueChange={(value) =>
                            setFieldValue("tues", value)
                          }
                        />
                      </Box>
                    </Box>
                    {values.tues && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="open"
                          value={values.tuesOpen}
                          onChangeText={handleChange("tuesOpen")}
                          onBlur={handleBlur("tuesOpen")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                          mr="5"
                        />
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="close"
                          value={values.tuesClose}
                          onChangeText={handleChange("tuesClose")}
                          onBlur={handleBlur("tuesClose")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                        />
                      </Box>
                    )}
                    {values.tues && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        {errors.tuesOpen && touched.tuesOpen && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.tuesOpen}
                            </Text>
                          </Box>
                        )}

                        {errors.tuesClose && touched.tuesClose && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.tuesClose}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
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
                  <Box w="100%">
                    <Box
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Wednesday
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          value={values.wed}
                          onValueChange={(value) => setFieldValue("wed", value)}
                        />
                      </Box>
                    </Box>
                    {values.wed && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="open"
                          value={values.wedOpen}
                          onChangeText={handleChange("wedOpen")}
                          onBlur={handleBlur("wedOpen")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                          mr="5"
                        />
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="close"
                          value={values.wedClose}
                          onChangeText={handleChange("wedClose")}
                          onBlur={handleBlur("wedClose")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                        />
                      </Box>
                    )}
                    {values.wed && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        {errors.wedOpen && touched.wedOpen && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.wedOpen}
                            </Text>
                          </Box>
                        )}

                        {errors.wedClose && touched.wedClose && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.wedClose}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
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
                  <Box w="100%">
                    <Box
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Thursday
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          onValueChange={(value) =>
                            setFieldValue("thur", value)
                          }
                          value={values.thur}
                        />
                      </Box>
                    </Box>
                    {values.thur && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="open"
                          value={values.thurOpen}
                          onChangeText={handleChange("thurOpen")}
                          onBlur={handleBlur("thurOpen")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                          mr="5"
                        />
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="close"
                          value={values.thurClose}
                          onChangeText={handleChange("thurClose")}
                          onBlur={handleBlur("thurClose")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                        />
                      </Box>
                    )}
                    {values.thur && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        {errors.thurOpen && touched.thurOpen && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.thurOpen}
                            </Text>
                          </Box>
                        )}

                        {errors.thurClose && touched.thurClose && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.thurClose}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
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
                  <Box w="100%">
                    <Box
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Friday
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          value={values.fri}
                          onValueChange={(value) => setFieldValue("fri", value)}
                        />
                      </Box>
                    </Box>
                    {values.fri && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="open"
                          value={values.friOpen}
                          onChangeText={handleChange("friOpen")}
                          onBlur={handleBlur("friOpen")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                          mr="5"
                        />
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="close"
                          value={values.friClose}
                          onChangeText={handleChange("friClose")}
                          onBlur={handleBlur("friClose")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                        />
                      </Box>
                    )}
                    {values.fri && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        {errors.friOpen && touched.friOpen && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.friOpen}
                            </Text>
                          </Box>
                        )}

                        {errors.friClose && touched.friClose && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.friClose}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
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
                  <Box w="100%">
                    <Box
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Saturday
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          value={values.sat}
                          onValueChange={(value) => setFieldValue("sat", value)}
                        />
                      </Box>
                    </Box>
                    {values.sat && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="open"
                          value={values.satOpen}
                          onChangeText={handleChange("satOpen")}
                          onBlur={handleBlur("satOpen")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                          mr="5"
                        />
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="close"
                          value={values.satClose}
                          onChangeText={handleChange("satClose")}
                          onBlur={handleBlur("satClose")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                        />
                      </Box>
                    )}
                    {values.sat && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        {errors.satOpen && touched.satOpen && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.satOpen}
                            </Text>
                          </Box>
                        )}

                        {errors.satClose && touched.satClose && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.satClose}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
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
                  <Box w="100%">
                    <Box
                      w="100%"
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Text flex="1" color="#3d4f21" fontWeight="bold" ml="2">
                        Sunday
                      </Text>
                      <Box flex="1" alignItems="flex-end">
                        <Switch
                          offTrackColor="#BEC4AA"
                          onTrackColor="#3D4F21"
                          size="sm"
                          value={values.sun}
                          onValueChange={(value) => setFieldValue("sun", value)}
                        />
                      </Box>
                    </Box>
                    {values.sun && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="open"
                          value={values.sunOpen}
                          onChangeText={handleChange("sunOpen")}
                          onBlur={handleBlur("sunOpen")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                          mr="5"
                        />
                        <Input
                          flex="1"
                          autoCorrect={false}
                          placeholder="close"
                          value={values.sunClose}
                          onChangeText={handleChange("sunClose")}
                          onBlur={handleBlur("sunClose")}
                          type="text"
                          w="100%"
                          color="grey"
                          bg="#fff"
                          borderWidth="0"
                          _focus={{ bg: "#F8F8F8" }}
                          py="3"
                        />
                      </Box>
                    )}
                    {values.sun && (
                      <Box mt="3" w="100%" display="flex" flexDirection="row">
                        {errors.sunOpen && touched.sunOpen && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.sunOpen}
                            </Text>
                          </Box>
                        )}

                        {errors.sunClose && touched.sunClose && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.sunClose}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box width="100%" alignItems="flex-end" mt="5" mb="20">
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

export default EditOperatingHour;
