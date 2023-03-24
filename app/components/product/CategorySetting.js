import { Box, ScrollView, Text, Center, Button } from "native-base";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import apiClient from "../../api/client";
import Toast from "react-native-toast-message";
import GLOBAL from "../../global";
import CategoryCard from "./CategoryCard";
import { Ionicons } from "@expo/vector-icons";

function CategorySetting({ navigation, products }) {
  const endpoint = "/productCategory/shop/";
  const [categories, setCategories] = useState();

  const getCategories = () => {
    apiClient.get(endpoint + GLOBAL.SHOPID).then((response) => {
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

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCategories();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Center flex="1" bg="#E7E7E7">
      <ScrollView flex="1" w="100%">
        {categories &&
          categories.map((category) => {
            return (
              <CategoryCard
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
          navigation.navigate("AddCategory", { products: products })
        }
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Button>
    </Center>
  );
}

export default CategorySetting;
