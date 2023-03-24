import { Text, Box, Center, ScrollView, Button, Input } from "native-base";
import React, { useState, useEffect } from "react";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ProductCard from "./ProductCard";
import _ from "lodash";

function ProductList({ products, navigation }) {
  const [query, setQuery] = useState();

  const handleChange = (value) => {
    setQuery(value);
  };

  const searchFilter = (value) => {
    let filtered = products;
    if (value)
      filtered = products.filter((p) =>
        p.product_name.toLowerCase().includes(value.toLowerCase())
      );
    return filtered;
  };

  const getInputIcon = () => {
    if (query) {
      return "close";
    } else {
      return "search";
    }
  };

  return (
    <Center flex="1" bg="#DCDCDC" justifyContent="center" alignItems="center">
      <Center
        flexDirection="row"
        w="100%"
        bg="#2b342d"
        h="11%"
        shadow="353535"
        py="1"
        mb="2"
      >
        <Input
          pl="5"
          value={query}
          onChangeText={(value) => handleChange(value)}
          _focus={{ bg: "#F9FAFD", borderColor: "#fff" }}
          placeholderTextColor="grey"
          bg="#FFF"
          color="grey"
          fontWeight="500"
          borderWidth="1"
          borderColor="#747474"
          mx="3"
          h="70%"
          placeholder="search"
          flex="4"
          rightElement={
            <Button
              onPress={() => setQuery(null)}
              bg="transparent"
              _pressed={{ bg: "#F5F5F5" }}
              w="15%"
            >
              <Ionicons name={getInputIcon()} size={18} color="grey" />
            </Button>
          }
        />
      </Center>
      {!searchFilter(query) && !query && (
        <Center flex="1">
          <MaterialCommunityIcons name="tag-remove" size={20} color="#747474" />
          <Text mt="1" color="#747474">
            no products available
          </Text>
        </Center>
      )}
      {searchFilter(query) && searchFilter(query).length == 0 && query && (
        <Center flex="1">
          <MaterialCommunityIcons name="tag-off" size={20} color="#747474" />
          <Text mt="1" color="#747474">
            no result
          </Text>
        </Center>
      )}
      {searchFilter(query) && (
        <ScrollView w="100%">
          {searchFilter(query).map((product) => {
            return (
              <ProductCard
                key={_.uniqueId("pcard")}
                product={product}
                navigation={navigation}
              />
            );
          })}
        </ScrollView>
      )}
      <Button
        m="2"
        position="absolute"
        bottom="0"
        right="0"
        borderRadius="full"
        bg="#2b342d"
        borderWidth="2"
        borderColor="#E7F0DF"
        _pressed={{ bg: "#3C483F" }}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Ionicons name="add" size={25} color="#fff" />
      </Button>
    </Center>
  );
}

export default ProductList;
