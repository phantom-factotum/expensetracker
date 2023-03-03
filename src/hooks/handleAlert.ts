import { useAtom } from "jotai";
import { useCallback } from "react";
import { alertAtom, ButtonObject } from "../atoms";

export const useAlert = () => {
  const [, setAlert] = useAtom(alertAtom);
  const closeAlert = useCallback(
    () =>
      setAlert((prev) => {
        return { ...prev, visible: false };
      }),
    []
  );
  const showAlert = useCallback(
    (
      title: string,
      message: string,
      buttons: ButtonObject[],
      hideCloseButton?: boolean
    ) => {
      buttons = buttons || [];
      if (buttons.length == 0) {
        buttons = [{ title: "Ok", onPress: closeAlert }];
      }
      if (!hideCloseButton)
        buttons.push({ title: "Cancel", onPress: closeAlert });
      setAlert({ title, message, buttons, visible: true });
    },
    []
  );
  return { showAlert, closeAlert };
};
