import { Box, Pressable, Text } from "native-base";
import React, { useState, useEffect } from "react";
import GLOBAL from "../../global";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import { Foundation, Entypo } from "@expo/vector-icons";

function ProfileTab({ navigation }) {
  const endpoint = "/profile/";
  const [profile, setProfile] = useState();

  const getProfile = () => {
    apiClient.get(endpoint + GLOBAL.USERID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.profile;
        if (data.length == 0) {
          Toast.show({
            type: "error",
            text1: "Data Fetching Error",
            text2: "data unavailable",
          });
        }
        setProfile(data[0]);
      }
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  const censorText = (txt) => {
    let txtLength = txt.length;
    let txtCensored = "";
    for (let i = 0; i < txtLength; i++) {
      txtCensored = txtCensored + "•";
    }
    return txtCensored;
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getProfile();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Pressable
      m="4"
      py="4"
      bg="#e7f0df"
      borderRadius="3"
      shadow="1"
      display="flex"
      flexDirection="row"
      _pressed={{ bg: "#DFE8D5" }}
      onPress={() => {
        navigation.navigate("EditProfile", {
          profile: profile,
        });
      }}
    >
      <Box flex="1">
        <Box
          mx="4"
          mb="3"
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Text fontSize="20" color="#3d4f21" fontWeight="bold" mr="3">
            Profile
          </Text>
          <Foundation name="torso-business" size={24} color="#607040" />
        </Box>
        <Box ml="3" mr="1">
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            height="10"
            p="2"
            bg="#fff"
            borderRadius="3"
            mb="1"
          >
            <Box flex="1">
              <Text fontWeight="500">username</Text>
            </Box>
            <Box flex="3">
              {profile && <Text color="#747474">{profile.username}</Text>}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            height="10"
            bg="#fff"
            p="2"
            bgColor="#fff"
            borderRadius="3"
            mb="1"
          >
            <Box flex="1">
              <Text fontWeight="500">email</Text>
            </Box>
            <Box flex="3">
              {profile && <Text color="#747474">{profile.email}</Text>}
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            height="10"
            bg="#fff"
            p="2"
            bgColor="#fff"
            borderRadius="3"
            mb="1"
          >
            <Box flex="1">
              <Text fontWeight="500">password</Text>
            </Box>
            <Box flex="3">
              {profile && (
                <Text color="#747474">{censorText(profile.password)}</Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box alignItem="center" justifyContent="center">
        <Entypo name="chevron-small-right" size={20} color="#afb7c5" />
      </Box>
    </Pressable>
  );
}

export default ProfileTab;
