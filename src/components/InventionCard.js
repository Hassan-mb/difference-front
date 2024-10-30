import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { BASE_URL } from "../api/index";
import { useNavigation } from "@react-navigation/native";
import NAVIGATION from "../navigations";
import Icon from "react-native-vector-icons/FontAwesome";

const InventionCard = ({ invention, showInvestButton = true, showEditButton = true }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(NAVIGATION.INVENTION.INVENTION_DETAILS, {
          inventionId: invention._id,
          image: `${BASE_URL}${invention.images[0]?.replace(/\\/g, "/")}`,
          showInvestButton: showInvestButton,
          showEditButton: showEditButton,
        })
      }
      key={invention._id}
    >
      <View style={styles.card}>
        <Image
          source={{
            uri: `${BASE_URL}${invention.images[0]?.replace(/\\/g, "/")}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.name}>{invention.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {invention.description}
          </Text>
          <Text style={styles.cost}>Funding needed: ${invention.cost}</Text>
          <View style={styles.icons}>
            <TouchableOpacity style={styles.likeButton}>
              <Icon name="heart" size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.thumbsUpButton}>
              <Icon name="thumbs-up" size={30} color="blue" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cost: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  icons: {
    flexDirection: "row",
    marginTop: 10,
    gap: 15,
  },
  likeButton: {
    alignItems: "center",
  },
  thumbsUpButton: {
    alignItems: "center",
  },
});

export default InventionCard;
