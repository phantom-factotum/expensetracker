interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
type InsetBehavior = "padding" | "margin" | "position";
type PaddingStyle = {
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
};
type MarginStyle = {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
};

type ReturnType = Insets | PaddingStyle | MarginStyle;

export function insetsToStyleObject(insets: Insets, behavior: InsetBehavior) {
  if (behavior == "position") return insets;
  else if (behavior == "padding") {
    return Object.keys(insets).reduce<PaddingStyle>((prev, curr) => {
      const insetKey = curr as unknown as keyof Insets;
      const styleKey = (behavior +
        insetKey[0].toUpperCase() +
        insetKey.substring(1)) as unknown as keyof PaddingStyle;
      prev[styleKey] = insets[insetKey];
      return prev;
    }, {} as PaddingStyle);
  } else {
    return Object.keys(insets).reduce<MarginStyle>((prev, curr) => {
      const insetKey = curr as unknown as keyof Insets;
      const styleKey = (behavior +
        insetKey[0].toUpperCase() +
        insetKey.substring(1)) as unknown as keyof MarginStyle;
      prev[styleKey] = insets[insetKey];
      return prev;
    }, {} as MarginStyle);
  }
}
