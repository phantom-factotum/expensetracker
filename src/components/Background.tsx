import {
  Canvas,
  Circle,
  DataSource,
  Group,
  Image,
  ImageSVG,
  useImage,
  useSVG,
} from "@shopify/react-native-skia";
import { ReactNode, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PositionPoint } from "../../types";
import { insetsToStyleObject } from "../helpers/styles";
import useBackgroundClip from "../hooks/useBackgroundClip";
import useLayout from "../hooks/useLayout";
type CoordinateWithColor = [number, number, string];
type Props = {
  source?: DataSource;
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
  style: ViewStyle;
  isSVG: boolean;
  startPointRatio: PositionPoint;
  endPointRatio: PositionPoint;
  segments?: number;
  invertClip?: boolean;
  showSegmentPoints?: boolean;
};

export default function Background({
  source = require("../../assets/polkadots.svg"),
  isSVG,
  contentContainerStyle,
  children,
  style,
  startPointRatio = [0, 0.5],
  endPointRatio = [1, 1],
  segments = 100,
  invertClip,
  showSegmentPoints,
}: Props) {
  const [viewLayout, onLayout] = useLayout({});
  const svg = useSVG(source);
  const img = useImage(source);
  const insets = useSafeAreaInsets();
  const safeAreaStyling = useMemo(
    () => insetsToStyleObject(insets, "padding"),
    [insets]
  );
  const { path, points } = useBackgroundClip(
    { startPointRatio, endPointRatio, segments },
    viewLayout
  );
  // react components cant be used inside Canvas so we will position the children
  // absolutely on top of the Canvas
  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      <Canvas style={[style, { zIndex: 1 }]}>
        <Group clip={path} invertClip={invertClip}>
          {isSVG && svg && (
            <ImageSVG
              svg={svg}
              width={viewLayout.width}
              height={viewLayout.height}
              x={0}
              y={0}
            />
          )}
          {!isSVG && img && (
            <Image
              image={img}
              width={viewLayout.width}
              height={viewLayout.height}
              x={0}
              y={0}
              fit="cover"
            />
          )}
        </Group>
        <Group>
          {showSegmentPoints &&
            points.map((circleProps, i) => (
              <Circle
                key={i}
                {...circleProps}
                origin={{ x: circleProps.cx, y: circleProps.cy }}
                r={5}
              />
            ))}
        </Group>
      </Canvas>
      <View
        style={[
          styles.content,
          safeAreaStyling,
          viewLayout,
          { top: 0, bottom: 0, left: 0, margin: 5 },
        ]}
      >
        <View
          style={[contentContainerStyle, { zIndex: 40000, top: 0, left: 0 }]}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // zIndex: 2,
  },
  content: {
    flex: 1,
    position: "absolute",
    zIndex: 500,
  },
});
