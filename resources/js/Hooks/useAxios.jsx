import axios from "axios";
import { deleteCookie } from "cookies-next"; 
import { useEffect, useState } from "react";

const fetchCsrfToken = async () => {
  try {
    await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
};

const getCsrfTokenFromCookies = () => {
  const name = "XSRF-TOKEN=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookiesArray = decodedCookie.split(";");

  for (let cookie of cookiesArray) {
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

const getAccessToken = () => {
  const name = "access_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookiesArray = decodedCookie.split(";");

  for (let cookie of cookiesArray) {
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

const useAxios = ({
  endpoint,
  method = "GET",
  config = {},
  baseUrl = "localhost:8000",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [responseDataWithStat, setResponseDataWithStat] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const csrfToken = getCsrfTokenFromCookies();
    if (!csrfToken) {
      fetchCsrfToken();
    }
  }, []);
  
  const fetchData = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const csrfToken = getCsrfTokenFromCookies();
      const access_token = getAccessToken();

      let requestOption = {
        url: `http://${baseUrl}${endpoint}`,
        method,
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${access_token}`,
          "X-XSRF-TOKEN": csrfToken,
        },
        withCredentials: true,
      };

      if (data) {
        requestOption = {
          ...requestOption,
          data,
        };
      }

      const response = await axios(requestOption);
      const { body } = response.data;
      setResponseData(body); 
    } catch (err) {
      if (err.response) {
        const { body, result, result_code, result_message } = err.response.data;
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
        setResponseDataWithStat({ body, result, result_code, result_message });
        
      
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error message:", err.message);
      }

      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const triggerFetch = (data) => {
    fetchData(data).finally(() => {
      setFinished(true);
      setTimeout(() => {
        setFinished(false);
      }, 0);
    });
  };

  return {
    loading,
    error,
    setResponseData,
    responseDataWithStat,
    setResponseDataWithStat,
    responseData,
    triggerFetch,
    finished,
  };
};

export default useAxios;