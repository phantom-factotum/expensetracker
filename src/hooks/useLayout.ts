/*https://stackoverflow.com/questions/56738500/react-native-onlayout-with-react-hooks*/
import { useCallback, useState } from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";

export default function useLayout(
  initialVal?: Partial<LayoutRectangle>
): [LayoutRectangle, (l: LayoutChangeEvent) => void] {
  const [size, setSize] = useState((initialVal || {}) as LayoutRectangle);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout;
    setSize(layout);
  }, []);
  return [size, onLayout];
}
