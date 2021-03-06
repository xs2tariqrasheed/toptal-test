import { useState } from "react";

const useLoading = (func, initialValue = false, remainTrue = false) => {
  const [loading, setLoading] = useState(initialValue);
  return {
    func: async function () {
      setLoading(true);
      try {
        await func.apply(this, arguments);
        if (!remainTrue) setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    loading,
  };
};

export default useLoading;
