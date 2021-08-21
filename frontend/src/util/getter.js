import { useState, useEffect } from 'react';
import axios from 'axios';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Getter = (url) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        setError(false);
        const response = await axios(url);
        if (!ignore) setData(response.data);
        await sleep(1); // REMOVE THIS
      } catch (err) {
        console.log(err)
        setError(true);
      }
      setLoading(false);
    };
    fetchProduct();
    return (() => { ignore = true; });
  }, [url]);

  return { data, loading, error };
};

export default Getter;
