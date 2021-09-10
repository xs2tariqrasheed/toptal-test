import { useState } from "react";

const useLoading = (func, initialValue = false) => {
  const [loading, setLoading] = useState(initialValue);
  return {
    func: async function () {
      setLoading(true);
      await func.apply(this, arguments);
      setLoading(false);
    },
    loading,
  };
};

export default useLoading;
