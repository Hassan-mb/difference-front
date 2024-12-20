import instance from "./index";

export const createOrder = async (inventionId, amount, percentage) => {
  try {
    const { data } = await instance.post(`/orders/${inventionId}`, {
      amount,
      percentage,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const getOrders = async () => {
  try {
    const { data } = await instance.get("/orders");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const { data } = await instance.get(`/orders/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const updateOrder = async (id, { status, ...order }) => {
  try {
    const { data } = await instance.put(`/orders/${id}`, { status });
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const { data } = await instance.delete(`/orders/${id}`);
    return data;
  } catch (error) {
    return error;
  }
};
