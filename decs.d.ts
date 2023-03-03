type sharedGenConfig = {
  startColor?: "string";
};
type GoldenRatioConfig = {
  generatorType: "goldenRatio";
  startHue?: string;
  useRandom?: boolean;
  varioRatio?: number;
  value?: string;
} & sharedGenConfig;
type RandomSchemesConfig = {
  generatorType: "randomSchemes";
  thresholdAttemptLevels?: number;
  startThreshold?: number;
  attemptMultiplier?: number;
} & sharedGenConfig;
type RandomConfig = {
  generatorType: "random";
} & sharedGenConfig;
type GenConfig = RandomConfig | RandomSchemesConfig | GoldenRatioConfig;
type PrintConfig = {};
type ColorScheme = (color: string) => string[];

declare module "@phantom-factotum/colorutils" {
  export function colorGenerator(
    len: number,
    genConfig: GenConfig,
    printConfig: PrintConfig
  ): string[];
  export const colorManipulators: {
    setColorOpacity: (color: string, opacity: number) => string;
    lightenColor: (color: string, ratio?: number) => string;
    darkenColor: (color: string, ratio?: number) => string;
    alterHSVByRatio: (
      color: string,
      { h, s, v }: { h?: number; s?: number; v?: number }
    ) => string;
    RGBAToHex: (color: string) => string;
    blend: (color1: string, color2: string, blend?: number) => string;
  };
  export const colorSchemes: {
    getComplementary: ColorScheme;
    getTetradicScheme: ColorScheme;
    getTriadicScheme: ColorScheme;
    getNeutralScheme: ColorScheme;
    getAnalogousScheme: ColorScheme;
    getAllScheme: ColorScheme;
  };
  export const THRESHOLD_PRESETS: {
    unacceptable: 3;
    barelyAcceptable: 5;
    acceptable: 11;
    golden: 30;
    perfectionist: 70;
    closeOpposites: 90;
    opposite: 100;
  };
}
