import { ImageSourcePropType } from "react-native";

declare module '*.png' {
  const value: ImageSourcePropType | string;
  export default value;
}
