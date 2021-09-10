import { useState } from "react";

const useLoading = (func, initialValue = false) => {
  const [loading, setLoading] = useState(initialValue);
  return {
    func: async (params) => {
      setLoading(true);
      await func(params);
      setLoading(false);
    },
    loading,
  };
};

export default useLoading;
