import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import InventionCard from "./InventionCard";

const InventionList = ({ inventions, numColumns = 1, showInvestButton = true, showEditButton = true }) => {
  if (inventions?.length === 0 || !inventions) {
    return <Text>No inventions found.</Text>;
  }

  const validInventions = inventions.filter((invention) => invention != null);

  return (
    <FlatList
      data={validInventions}
      renderItem={({ item }) => (
        <View style={[styles.cardWrapper, { width: `${100 / numColumns}%` }]}>
          <InventionCard invention={item} compact={numColumns === 2} />
        </View>
      )}
      keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  cardWrapper: {
    padding: 6, // Reduced padding for tighter grid
  },
  noInventions: {
    color: "#ffffff", // Changed to white for better visibility on blue background
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default InventionList;
