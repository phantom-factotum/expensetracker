import {
  Canvas,
  Circle,
  DataSource,
  Group,
  Image,
  ImageSVG,
  Skia,
  useImage,
  useSVG,
  useValue,
} from "@shopify/react-native-skia";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Coordinate, PositionPoint } from "../../types";
import { insetsToStyleObject } from "../helpers/styles";
import { Dot } from "../hooks/useBackgroundClip";
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
  const [allPoints, setAllPoints] = useState<Dot[]>([]);
  const path = useValue(Skia.Path.Make());
  const svg = useSVG(source);
  const img = useImage(source);
  const insets = useSafeAreaInsets();
  const safeAreaStyling = useMemo(
    () => insetsToStyleObject(insets, "padding"),
    [insets]
  );

  useEffect(() => {
    const path2 = Skia.Path.Make();
    if (!viewLayout.width || !viewLayout.height) {
      path2.lineTo(0, 600);
      path2.lineTo(600, 600);
      return;
    }
    path2.moveTo(0, 0);
    const startPoint: Coordinate = [
      startPointRatio[0] * viewLayout.width,
      startPointRatio[1] * viewLayout.height,
    ];
    const endPoint: Coordinate = [
      endPointRatio[0] * viewLayout.width,
      endPointRatio[1] * viewLayout.height,
    ];
    const deltaX = endPoint[0] - startPoint[0];
    const deltaY = endPoint[1] - startPoint[1];
    // waveSlope will be tied to start and end points
    const waveSlope = (deltaY / deltaX) * 0.95;
    let points: (Coordinate | CoordinateWithColor)[] = [];
    // match wave frequency to segments
    const freq = Math.PI * 2;
    const reflect = 1;
    // sinwave amplification
    const amp = (viewLayout.width * 0.15 * reflect) / waveSlope;
    let sinPoints: Coordinate[] = [];
    const xIncrements = deltaX / segments;
    for (let i = 0; i < segments; i++) {
      // make xValue take on a  x coordinate  between startPoint and endPoint
      const x = i * xIncrements + startPoint[0];
      const baseWave = amp * Math.sin(freq * x) + startPoint[1];
      const slopeTransform = waveSlope * x;
      const y = baseWave + slopeTransform;
      // if (x < startPoint[0] && y < startPoint[1]) continue;
      // if (x > endPoint[0]) break;
      sinPoints.push([x, y]);
    }
    // reverse list since we have move acrossed the screen clockwise
    sinPoints = sinPoints.reverse();
    // start at top left corner
    points.push([0, 0, "blue"]);
    // move to top right corner
    points.push([viewLayout.width, 0, "orange"]);
    // move down with x on the edge to startY position
    points.push([viewLayout.width, startPoint[1], "orange"]);
    // move, while on edge, from startY to first sinPoint
    points.push([viewLayout.width, sinPoints[0][1], "orange"]);
    points = points.concat(sinPoints);
    const lastPoint = sinPoints[sinPoints.length - 1];
    // if last point x position isnt zero then draw a line to 0
    if (lastPoint[0] != 0) {
      points.push([0, lastPoint[1], "orange"]);
      points.push([0, 0, "orange"]);
    }

    points.forEach((point) => path2.lineTo(point[0], point[1]));
    setAllPoints(
      points.map((pt) => ({
        cx: pt[0],
        cy: pt[1],
        color: pt[2] || "green",
      }))
    );
    path.current = path2;
  }, [viewLayout, startPointRatio, endPointRatio]);

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
            allPoints.map((circleProps, i) => (
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
