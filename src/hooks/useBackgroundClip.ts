import { Skia, SkRect, useValue } from "@shopify/react-native-skia";
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
  const [midPoints, setMidPoints] = useState<Dot[]>([]);
  const [deltas, setDeltas] = useState<Coordinate>([0, 0]);
  const path = useValue(Skia.Path.Make());
  const { width, height } = layout;

  useEffect(() => {
    if (isNaN(width) || isNaN(height)) {
      return;
    }
    path.current = Skia.Path.Make();
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

    const newPoints: Coordinate[] = [];
    const middlePoints: Dot[] = [];
    for (let i = 0; i < clipConfig.segments; i++) {
      const x = startPoint[0] + (deltaX * i) / (clipConfig.segments - 1);
      let y = startPoint[1] + (deltaY * i) / (clipConfig.segments - 1);
      const point1: Coordinate = [x, y];
      const lastIndex = i - 1;
      if (lastIndex >= 0) {
        const [lastX, lastY] = newPoints[i - 1];
        const yOffset =
          (deltaY / clipConfig.segments) * (lastIndex % 2 == 0 ? -1 : 1) * 0;
        const midX = (lastX + x) / 2;
        let midY = (lastY + y) / 2 + yOffset;
        const midPoint: Coordinate = [midX, midY];
        newPoints.push(midPoint);
        middlePoints.push({
          cx: midX,
          cy: midY,
          color: "orange",
        });
      }
      newPoints.push(point1);
    }

    const dots = newPoints.map(([cx, cy]) => ({
      cx,
      cy,
      color: "purple",
    }));

    const { min, max } = dots.reduce(
      (prev, curr) => {
        if (curr.cy < prev.min.cy) {
          prev.min = curr;
        }
        if (curr.cy > prev.max.cy) {
          prev.max = curr;
        }
        return prev;
      },
      { min: dots[0] || { cx: 0, cy: 0 }, max: dots[0] || { cx: 0, cy: 0 } }
    );
    path.current.moveTo(0, 0);
    path.current.lineTo(width, 0);
    path.current.lineTo(width, min.cy);
    // path.current.lineTo(0, min.cy);
    // path.current.lineTo(0, startPoint[1]);
    setMidPoints(middlePoints);
    setPoints(dots);
    setDeltas([deltaX, deltaY]);
    // middlePoints = middlePoints.reverse;
    dots.reverse().forEach((point, i) => {
      const { cx, cy } = point;
      const point2 = dots[i - 1] || {
        cx: cx + deltaX,
        cy: cy + deltaY,
      };

      const rect: SkRect = {
        x: point2.cx || cx,
        y: point2.cy || cy,
        width: deltaX,
        height: deltaY,
      };
      path.current.arcToOval(
        rect,
        i == 0 ? -90 : 180,
        i == 0 ? 90 : -90,
        false
      );
      // const [controlPt1, controlPt2] = generateControlPoints(
      //   point,
      //   deltaX,
      //   deltaY,
      //   clipConfig.segments
      // );
      // path.current.cubicTo(...controlPt1, ...controlPt2, cx, cy);
      // if (middlePoints[i]) {
      //   const { cx: midX, cy: midY } = middlePoints[i];
      //   const [midCtrlPt1, midCtrlPt2] = generateControlPoints(
      //     middlePoints[i],
      //     deltaX,
      //     deltaY,
      //     clipConfig.segments
      //   );
      //   path.current.cubicTo(midX, midY, ...midCtrlPt2, ...midCtrlPt1);
      //   // path.current.lineTo(midX, midY);
      // }
    });
    const { x, y } = path.current.getLastPt();
    if (startPoint[0] > 0) {
      path.current.lineTo(0, y);
      path.current.lineTo(0, 0);
    }
    //  else{
    //   path.current.lineTo()
    //  }
  }, [
    layout,
    clipConfig.segments,
    clipConfig.startPointRatio,
    clipConfig.endPointRatio,
  ]);

  return {
    path: path.current,
    points,
    middlePoints: midPoints,
    deltas,
  };
}

const generateControlPoints = (
  point: Dot,
  deltaX: number,
  deltaY: number,
  segments: number,
  distBetweenPoints?: number
): [Coordinate, Coordinate] => {
  if (!distBetweenPoints) distBetweenPoints = 2;
  const slope = 3.5;
  const point1: Coordinate = [
    (point.cx - distBetweenPoints) * slope,
    (point.cy - distBetweenPoints) * slope,
  ];
  const point2: Coordinate = [
    (point.cx + distBetweenPoints) * -(1 / slope),
    (point.cy + distBetweenPoints) * -(1 / slope),
  ];

  return [point1, point2];
};
