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
  mon_open: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  mon_close: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  tues_open: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  tues_close: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  wed_open: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  wed_close: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  thur_open: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  thur_close: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  fri_open: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  fri_close: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  sat_open: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  sat_close: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  sun_open: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
  sun_close: yup
    .string()
    .matches(/^[0-9:]+$/, "Time must be in HH:MM format")
    .nullable()
    .min(5, "Must be exactly 5 characters")
    .max(5, "Must be exactly 5 characters"),
});

function RegisterOperatingHour({
  operatingHour,
  setOperatingHour,
  setPosition,
  navigation,
}) {
  const handleUpdateHour = (values) => {
    console.log(dataClean(values));
    setOperatingHour(dataClean(values));
    setPosition(3);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        validationSchema={operatingHourSchema}
        initialValues={{
          mon: operatingHour.mon == 1 && true,
          mon_open:
            operatingHour.mon_open && operatingHour.mon_open.slice(0, -3),
          mon_close:
            operatingHour.mon_close && operatingHour.mon_close.slice(0, -3),
          tues: operatingHour.tues == 1 && true,
          tues_open:
            operatingHour.tues_open && operatingHour.tues_open.slice(0, -3),
          tues_close:
            operatingHour.tues_close && operatingHour.tues_close.slice(0, -3),
          wed: operatingHour.wed == 1 && true,
          wed_open:
            operatingHour.wed_open && operatingHour.wed_open.slice(0, -3),
          wed_close:
            operatingHour.wed_close && operatingHour.wed_close.slice(0, -3),
          thur: operatingHour.thur == 1 && true,
          thur_open:
            operatingHour.thur_open && operatingHour.thur_open.slice(0, -3),
          thur_close:
            operatingHour.thur_close && operatingHour.thur_close.slice(0, -3),
          fri: operatingHour.fri == 1 && true,
          fri_open:
            operatingHour.fri_open && operatingHour.fri_open.slice(0, -3),
          fri_close:
            operatingHour.fri_close && operatingHour.fri_close.slice(0, -3),
          sat: operatingHour.sat == 1 && true,
          sat_open:
            operatingHour.sat_open && operatingHour.sat_open.slice(0, -3),
          sat_close:
            operatingHour.sat_close && operatingHour.sat_close.slice(0, -3),
          sun: operatingHour.sun == 1 && true,
          sun_open:
            operatingHour.sun_open && operatingHour.sun_open.slice(0, -3),
          sun_close:
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
          <Box w="100%" h="88%">
            <ScrollView>
              <Pressable
                onPress={() => Keyboard.dismiss()}
                bg="#F3F3F3"
                flex={1}
                alignItems="center"
                w="100%"
                h="100%"
              >
                <Box
                  width="90%"
                  mt="10"
                  p="5"
                  bg="#e7f0df"
                  borderRadius="3"
                  shadow="1"
                >
                  <Box>
                    <Text
                      fontSize="18"
                      color="#7D9253"
                      fontWeight="bold"
                      ml="1"
                    >
                      Set operating hours.
                    </Text>
                    <Text
                      fontSize="12"
                      color="#7D9253"
                      fontWeight="500"
                      ml="1"
                      mb="2"
                    >
                      opening and closing times are in HH:MM format
                    </Text>
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
                          value={values.mon_open}
                          onChangeText={handleChange("mon_open")}
                          onBlur={handleBlur("mon_open")}
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
                          value={values.mon_close}
                          onChangeText={handleChange("mon_close")}
                          onBlur={handleBlur("mon_close")}
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
                        {errors.mon_open && touched.mon_open && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.mon_open}
                            </Text>
                          </Box>
                        )}

                        {errors.mon_close && touched.mon_close && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.mon_close}
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
                          value={values.tues_open}
                          onChangeText={handleChange("tues_open")}
                          onBlur={handleBlur("tues_open")}
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
                          value={values.tues_close}
                          onChangeText={handleChange("tues_close")}
                          onBlur={handleBlur("tues_close")}
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
                        {errors.tues_open && touched.tues_open && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.tues_open}
                            </Text>
                          </Box>
                        )}

                        {errors.tues_close && touched.tues_close && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.tues_close}
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
                          value={values.wed_open}
                          onChangeText={handleChange("wed_open")}
                          onBlur={handleBlur("wed_open")}
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
                          value={values.wed_close}
                          onChangeText={handleChange("wed_close")}
                          onBlur={handleBlur("wed_close")}
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
                        {errors.wed_open && touched.wed_open && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.wed_open}
                            </Text>
                          </Box>
                        )}

                        {errors.wed_close && touched.wed_close && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.wed_close}
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
                          value={values.thur_open}
                          onChangeText={handleChange("thur_open")}
                          onBlur={handleBlur("thur_open")}
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
                          value={values.thur_close}
                          onChangeText={handleChange("thur_close")}
                          onBlur={handleBlur("thur_close")}
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
                        {errors.thur_open && touched.thur_open && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.thur_open}
                            </Text>
                          </Box>
                        )}

                        {errors.thur_close && touched.thur_close && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.thur_close}
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
                          value={values.fri_open}
                          onChangeText={handleChange("fri_open")}
                          onBlur={handleBlur("fri_open")}
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
                          value={values.fri_close}
                          onChangeText={handleChange("fri_close")}
                          onBlur={handleBlur("fri_close")}
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
                        {errors.fri_open && touched.fri_open && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.fri_open}
                            </Text>
                          </Box>
                        )}

                        {errors.fri_close && touched.fri_close && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.fri_close}
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
                          value={values.sat_open}
                          onChangeText={handleChange("sat_open")}
                          onBlur={handleBlur("sat_open")}
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
                          value={values.sat_close}
                          onChangeText={handleChange("sat_close")}
                          onBlur={handleBlur("sat_close")}
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
                        {errors.sat_open && touched.sat_open && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.sat_open}
                            </Text>
                          </Box>
                        )}

                        {errors.sat_close && touched.sat_close && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.sat_close}
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
                  mb="75"
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
                          value={values.sun_open}
                          onChangeText={handleChange("sun_open")}
                          onBlur={handleBlur("sun_open")}
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
                          value={values.sun_close}
                          onChangeText={handleChange("sun_close")}
                          onBlur={handleBlur("sun_close")}
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
                        {errors.sun_open && touched.sun_open && (
                          <Box flex="1" alignItems="flex-start" pl="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.sun_open}
                            </Text>
                          </Box>
                        )}

                        {errors.sun_close && touched.sun_close && (
                          <Box flex="1" alignItems="flex-end" pr="3">
                            <Text maxW="150" fontSize="10" color="#FF4F4F">
                              {errors.sun_close}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
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
                  borderRadius="full"
                  onPress={() => setPosition(1)}
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

export default RegisterOperatingHour;
