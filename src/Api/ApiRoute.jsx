import axios from "axios";

const BASE_URL = "https://hajjbackend.sidtechno.com";
const CHAT_API_URL = "https://api.ahle.chat/api/chats";

export const fetchData = async (url, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/${url}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchData:", error.message);
    throw error;
  }
};

export const deleteAccountAPI = async (url = 'deleteMyAccount', token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error in Delete account:", error.message);
    throw error;
  }
};

export const fetchDataWithParams = async (url, params) => {
  try {
    const response = await axios.post(`${BASE_URL}/${url}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchDataWithParams:", error.message);
    return error;
  }
};

export const fetchDataWithTokenandParams = async (
  url,
  token = null,
  body = null,
  setLoading = () => {}
) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    setLoading(true);
    const response = await axios.post(`${BASE_URL}/${url}`, body, {
      headers: {
        ...headers,
        ...(body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error in fetchDataWithTokenandParams:", error.message);
    return { data: null, error };
  } finally {
    setLoading(false);
  }
};

export const fetchDataWithPut = async (url, params, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/${url}`, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchDataWithPut:", error.message);
    throw error;
  }
};

export const fetchChatData = async (url, params, accessKey = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...(accessKey && { accesskey: accessKey }), // Add access key if provided
  };

  try {
    // Dynamically handle params as a string or an object
    let finalParams;
    if (typeof params === "string") {
      finalParams = new URLSearchParams(params).toString(); // Convert string into query params
    } else {
      finalParams = params; // If already an object, use it directly
    }

    const response = await axios.get(`https://api.ahle.chat/api/chats/${url}`, {
      headers,
      ...(typeof finalParams === "string"
        ? { params: Object.fromEntries(new URLSearchParams(finalParams)) } // Convert string to object for axios params
        : { params: finalParams }), // Use params object directly
    });

    return response.data; // Return response data
  } catch (error) {
    console.error("Error in fetchChatData:", error.message);
    throw error;
  }
};
