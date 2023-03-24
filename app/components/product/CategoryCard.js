import { Box, Pressable, Image, Text, Center } from "native-base";
import React, { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";

function CategoryCard({ category, navigation, products }) {
  const getStatusColor = () => {
    if (category.availability == 0) {
      return "#FF0000";
    }
    if (category.availability == 1) {
      return "#00EB16";
    }
  };

  return (
    <Pressable
      height="60"
      m="3"
      bg="#FFF"
      borderRadius="4"
      shadow="1"
      display="flex"
      flexDirection="row"
      _pressed={{ bg: "#EEEEEE" }}
      onPress={() =>
        navigation.navigate("CategoryEdit", {
          category: category,
          products: products,
        })
      }
    >
      <Box flex="1" my="2" mx="0">
        <Box flex="1" w="100%" flexDirection="row" alignItems="center">
          <Box
            justifyContent="center"
            bg="#FFF"
            flex="2"
            ml="2"
            h="100%"
            pl="5"
          >
            <Text fontSize="16" fontWeight="500" color="#3D4F21">
              {category.p_category_name}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box alignItem="center" justifyContent="center" bg={getStatusColor()}>
        <Entypo name="chevron-small-right" size={5} color="transparent" />
      </Box>
    </Pressable>
  );
}

export default CategoryCard;
