import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { BASE_URL } from "../api/index";
import { useNavigation } from "@react-navigation/native";
import NAVIGATION from "../navigations";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../Colors";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native";
import { Pagination } from "react-native-reanimated-carousel";
import shortNumber from "../utils/shortNum";
import { toggleLikeInvention, incrementInventionViews } from "../api/invention";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserContext from "../context/UserContext";
import { useContext } from "react";
const InventionCard = ({
  invention,
  compact,
  showInvestButton = true,
  showEditButton = true,
  refetch,
  page,
}) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get("window").width - 16; // Account for margins
  const [user, setUser] = useContext(UserContext);
  const [likedInvention, setLikedInvention] = useState(invention);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { mutate: handleLike } = useMutation({
    mutationKey: ["likeInvention"],
    mutationFn: () => toggleLikeInvention(invention._id),
    onSuccess: (data) => {
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
      console.log("Invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["inventions"] });
      queryClient.invalidateQueries({
        queryKey: ["invention", invention._id],
      });
      // Force a refetch
      queryClient.refetchQueries({
        queryKey: ["inventions"],
        exact: false,
      });
      queryClient.refetchQueries({
        queryKey: ["invention", invention._id],
        exact: false,
      });
    },
  });
  const { mutate: handleView } = useMutation({
    mutationFn: () => incrementInventionViews(invention._id),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["invention", invention._id] });
      navigation.navigate(
        page === "home"
          ? NAVIGATION.HOME.INVENTION_DETAILS
          : NAVIGATION.PROFILE.INVENTION_DETAILS,
        {
          inventionId: invention._id,
          image: images[0],
          showInvestButton: showInvestButton,
          showEditButton: showEditButton,
        }
      );
    },
  });
  if (!invention || !invention._id) {
    return null;
  }
  // useLayoutEffect(() => {
  //   console.log("InventionCard mounted");
  //   refetch();
  // }, [isLiked]);

  useEffect(() => {
    setIsLiked(invention.likes.includes(user?._id));
    setLikeCount(invention.likes.length);
  }, [invention, user?._id]);

  const images =
    invention.images?.length > 0
      ? invention.images.map((img) => `${BASE_URL}${img}`.replace(/\\/g, "/"))
      : ["https://via.placeholder.com/150"];

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  };
  const imageUrl = invention.images?.[0]
    ? `${BASE_URL}${invention.images[0]}`.replace(/\\/g, "/")
    : "https://via.placeholder.com/150";

  return (
    <TouchableOpacity
      onPress={() => {
        handleView();
      }}
    >
      <View style={[styles.card, !compact && styles.singleColumnCard]}>
        <View
          style={[
            styles.imageContainer,
            !compact && styles.singleColumnImageContainer,
          ]}
        >
          {compact ? (
            // Grid layout - simple Image component
            <Image
              source={{ uri: images[0] }}
              style={styles.gridImage}
              resizeMode="cover"
            />
          ) : (
            // Single column layout - Carousel
            <Carousel
              pagingEnabled={true}
              width={width - 24}
              height={300}
              data={images}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.singleColumnImage}
                  resizeMode="cover"
                />
              )}
              onSnapToItem={(index) => setActiveIndex(index)}
            />
          )}
        </View>
        <View style={[styles.content, !compact && styles.singleColumnContent]}>
          <View style={styles.textContainer}>
            <Text
              style={[styles.name, !compact && styles.singleColumnName]}
              numberOfLines={compact ? 1 : 2}
            >
              {invention.name}
            </Text>
            <Text
              style={[
                styles.description,
                !compact && styles.singleColumnDescription,
              ]}
              numberOfLines={compact ? 1 : 2}
            >
              {invention.description}
            </Text>
            <Text style={[styles.cost, !compact && styles.singleColumnCost]}>
              {shortNumber(invention.cost)} KWD
            </Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.timeContainer}>
              <Icon name="clock-o" size={14} color={colors.primary} />
              <Text style={styles.timeText} numberOfLines={1}>
                {getTimeAgo(invention.createdAt)}
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <TouchableOpacity onPress={handleLike} style={styles.statItem}>
                <Icon
                  name={
                    invention.likes?.includes(user?._id) ? "heart" : "heart-o"
                  }
                  size={14}
                  color="#FF4D4D"
                />
                <Text style={styles.likesCount} numberOfLines={1}>
                  {shortNumber(likeCount)}
                </Text>
              </TouchableOpacity>
              <View style={styles.statItem}>
                <Icon name="eye" size={14} color={colors.primary} />
                <Text style={styles.viewsCount} numberOfLines={1}>
                  {shortNumber(invention.views || 0)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height: 300, // Fixed height for grid view
  },
  singleColumnCard: {
    height: 450, // Fixed height for single column
    marginVertical: 12,
    marginHorizontal: 12,
  },
  imageContainer: {
    height: "66%",
    width: "100%",
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  singleColumnImageContainer: {
    height: "66%", // Takes up 2/3 of the card
  },
  image: {
    width: "100%",
    height: "100%",
  },
  singleColumnImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 8,
    height: "34%",
    justifyContent: "space-between",
  },
  singleColumnContent: {
    padding: 16,
    height: "34%",
  },
  textContainer: {
    flex: 1,
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 2,
    lineHeight: 18,
  },
  singleColumnName: {
    fontSize: 18,
    marginBottom: 6,
    lineHeight: 24,
  },
  description: {
    fontSize: 11,
    color: colors.primary,
    opacity: 0.8,
    marginBottom: 2,
    lineHeight: 16,
  },
  singleColumnDescription: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  cost: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    lineHeight: 16,
  },
  singleColumnCost: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  timeText: {
    fontSize: 11,
    color: colors.primary,
    opacity: 0.7,
    flex: 1,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  likesCount: {
    fontSize: 11,
    color: "#FF4D4D",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewsCount: {
    fontSize: 11,
    color: colors.primary,
    opacity: 0.7,
  },
});

export default InventionCard;
