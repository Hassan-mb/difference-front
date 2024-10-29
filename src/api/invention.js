import instance from "./index"; // Ensure this path is correct

export const createInvention = async (inventionData) => {
  inventionData.inventors = ["67189c8629a471689f676f07", "6718bc3311abf0128e187d16"];
  try {
    const formData = new FormData();
    for (let key in inventionData) {
      if (key !== "images") formData.append(key, inventionData[key]);
      // if (key === "inventors") formData.append(key, JSON.stringify(inventionData[key]));
    }
    // Append each image file individually
    inventionData.images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        type: "image/jpeg", // Adjust this if you need to support other image types
        name: `image${index}.jpg`,
      });
    });
    const { data } = await instance.post("/inventions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const getInventions = async (userId) => {
  try {
    const { data } = await instance.get(`/inventions/user/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching inventions:", error);
    throw error;
  }
};
export const getInvention = async (inventionId) => {
  try {
    const { data } = await instance.get(`/inventions/${inventionId}`);
    return data;
  } catch (error) {
    console.error("Error fetching invention:", error);
    throw error;
  }
};

export const getAllInventions = async () => {
  try {
    const { data } = await instance.get("/inventions");
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateInvention = async (inventionId, inventionData) => {
  try {
    console.log(inventionData);
    const formData = new FormData();
    for (let key in inventionData) {
      if (key !== "images") formData.append(key, inventionData[key]);
    }
    // Append each image file individually
    if (inventionData.images.length > 0) {
      inventionData.images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          type: "image/jpeg", // Adjust this if you need to support other image types
          name: `image${index}.jpg`,
        });
      });
    }
    // Check if there are images to determine the content type
    const headers = inventionData.images?.length > 0 ? { "Content-Type": "multipart/form-data" } : {};
   

  
    const { data } = await instance.put(`/inventions/${inventionId}`, formData, headers);
    return data;
  } catch (error) {
    throw error;
  }
};

export const toggleLikeInvention = async (inventionId) => {
  try {
    const { data } = await instance.put(`/inventions/${inventionId}/like`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const toggleInterestedInvention = async (inventionId) => {
  try {
    const { data } = await instance.put(`/inventions/${inventionId}/interested`);
    return data;
  } catch (error) {
    throw error;
  }
};
