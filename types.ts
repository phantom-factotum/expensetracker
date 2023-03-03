import { getTheme } from "./src/helpers/Theme";

export type Coordinate = [number, number];
export type Theme = ReturnType<typeof getTheme>;
export type Position = number;
export type PositionPoint = [Position, Position];
