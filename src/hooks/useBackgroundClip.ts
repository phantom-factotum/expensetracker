import { Skia, useValue } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { LayoutRectangle } from "react-native";
import { Coordinate, PositionPoint } from "../../types";

type ClipConfig = {
  startPointRatio: PositionPoint;
  endPointRatio: PositionPoint;
  segments: number;
};
export type Dot = {
  cx: number;
  cy: number;
  color: string;
};

export default function useBackgroundClip(
  clipConfig: ClipConfig,
  layout: LayoutRectangle
) {
  const [points, setPoints] = useState<Dot[]>([]);
  const path = useValue(Skia.Path.Make());
  const { width, height } = layout;

  useEffect(() => {
    if (isNaN(width) || isNaN(height)) {
      return;
    }
    path.current = Skia.Path.Make();
    path.current.moveTo(0, 0);
    const startPoint: Coordinate = [
      clipConfig.startPointRatio[0] * width,
      clipConfig.startPointRatio[1] * height,
    ];
    const endPoint: Coordinate = [
      clipConfig.endPointRatio[0] * width,
      clipConfig.endPointRatio[1] * height,
    ];
    const deltaX = endPoint[0] - startPoint[0];
    const deltaY = endPoint[1] - startPoint[1];

    // waveSlope will be tied to start and end points
    const waveSlope = (deltaY / deltaX) * 0.95;
    let points: Coordinate[] = [];
    // match wave frequency to segments
    const freq = Math.PI * 2;
    const reflect = 1;
    // sinwave amplification
    const amp = (width * 0.15 * reflect) / waveSlope;
    let sinPoints: Coordinate[] = [];
    const xIncrements = deltaX / clipConfig.segments;
    for (let i = 0; i < clipConfig.segments; i++) {
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
    points.push([0, 0]);
    // move to top right corner
    points.push([width, 0]);
    // move down with x on the edge to startY position
    points.push([width, startPoint[1]]);
    // move, while on edge, from startY to first sinPoint
    points.push([width, sinPoints[0][1]]);
    // add sinPoints
    points = points.concat(sinPoints);
    // if last sinPoint x position isnt zero then draw a line to 0
    // from last sinPoint y
    const lastPoint = sinPoints[sinPoints.length - 1];
    if (lastPoint[0] != 0) {
      points.push([0, lastPoint[1]]);
      points.push([0, 0]);
    }
    // add points to path
    points.forEach((point) => path.current.lineTo(point[0], point[1]));
    setPoints(
      points.map((pt) => ({
        cx: pt[0],
        cy: pt[1],
        color: "green",
      }))
    );
  }, [
    layout,
    clipConfig.segments,
    clipConfig.startPointRatio,
    clipConfig.endPointRatio,
  ]);

  return {
    path: path.current,
    points,
  };
}
