import { Box, ScrollView, Text, Center, Button } from "native-base";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";
import CategoryCard from "./CategoryCard";
import { Ionicons } from "@expo/vector-icons";
import AttributeCard from "./AttributeCard";

function AttributeSetting({ navigation, products }) {
  const endpoint = "/attributeCategory/shop/";
  const [attributeCategories, setAttributeCategories] = useState();

  const getAttributeCategories = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
      if (!response.ok) {
        Toast.show({
          type: "error",
          text1: "Data Fetching Error",
          text2: "http request failed",
        });
      } else {
        const data = response.data.attributeCategory;
        if (data.length == 0) {
          setAttributeCategories(null);
        } else {
          setAttributeCategories(data);
        }
      }
    });
  };

  useEffect(() => {
    getAttributeCategories();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAttributeCategories();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Center flex="1" bg="#E7E7E7">
      <ScrollView flex="1" w="100%">
        {attributeCategories &&
          attributeCategories.map((category) => {
            return (
              <AttributeCard
                key={_.uniqueId("category")}
                category={category}
                navigation={navigation}
                products={products}
              />
            );
          })}
      </ScrollView>
      <Button
        m="5"
        position="absolute"
        bottom="0"
        right="0"
        borderRadius="full"
        bg="#2b342d"
        borderWidth="2"
        borderColor="#E7F0DF"
        _pressed={{ bg: "#3C483F" }}
        onPress={() =>
          navigation.navigate("AddAttribute", { products: products })
        }
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Button>
    </Center>
  );
}

export default AttributeSetting;
