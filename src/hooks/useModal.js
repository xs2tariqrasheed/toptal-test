import { useState, useCallback, useMemo } from "react";
import { Modal as _Modal } from "antd";

function useModal() {
  const [visible, _setVisible] = useState(false);
  const setVisible = useCallback(
    (value) => _setVisible((prevState) => value),
    []
  );
  return {
    visible,
    setVisible,
    Modal: useMemo(
      (modalProps) => (
        <_Modal
          {...modalProps}
          visible={modalProps.visible || visible}
          onCancel={() => {
            setVisible(false);
          }}
        >
          {modalProps.children}
        </_Modal>
      ),
      []
    ),
  };
}

export default useModal;
