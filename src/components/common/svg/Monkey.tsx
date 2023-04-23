import * as React from "react";
import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
type Props = {
  size?: number;
  color?: string;
  style?: ViewStyle;
};
const Monkey = ({ size = 30, color = "#000000", style }: Props) => (
  <Svg
    width={size}
    height={size}
    viewBox="-10 -5 1034 1034"
    // xmlnsXlink="http://www.w3.org/1999/xlink"
    style={style}
    // {...props}
  >
    <Path
      fill={color}
      d="M495 238q-59 0 -115.5 20t-98.5 57q-46 40 -68 93q-11 24 -15 50q-29 -30 -66 -30q-29 0 -53 18t-38 49.5t-14 69t14 68.5t38 49.5t53 18.5q18 0 35 -8q-14 36 -14 73.5t16 71.5q31 73 107 120q68 42 154 54q102 14 195 -11q102 -28 166 -99q39 -42 51 -99.5t-8 -108.5 q17 7 34 7q29 0 53 -18.5t38 -49.5t14 -68.5t-14 -69t-38 -49.5t-53 -18q-37 0 -66 31q-13 -76 -64 -127q-45 -46 -109 -71q-61 -23 -129 -23h-5zM622 343q18 0 36 6q38 11 65 43q24 30 34 70.5t4 79.5q1 10 -2 23q-3 8 -9 22q-11 24 -10 34q0 16 21 26q31 30 41 74 q9 42 -3 85.5t-40 74.5q-52 55 -136 78q-71 20 -158 15q-79 -5 -142 -34q-73 -34 -107 -96q-18 -32 -21 -70.5t9 -72.5q14 -37 42 -60q16 -9 15 -24q-1 -9 -11 -29q-7 -15 -9 -23q-4 -13 -2 -23q-6 -39 4 -79.5t35 -70.5q27 -32 65 -44q15 -4 29 -5q40 -2 76 23q34 23 52 61 q16 -36 50 -59.5t72 -24.5zM416 522q-18 0 -30 15.5t-12 37.5t12 37.5t29.5 15.5t30 -15.5t12.5 -37.5t-12.5 -37.5t-29.5 -15.5zM584 522q-17 0 -29.5 15.5t-12.5 37.5t12.5 37.5t30 15.5t29.5 -15.5t12 -37.5t-12 -37.5t-30 -15.5zM721 671q-2 1 -4 1q-97 37 -217 37 t-217 -37q-3 -1 -6 -0.5t-5.5 3t-3 6t1.5 7t5 4.5q102 39 225 39t224 -39q4 -1 6 -4.5t1.5 -7.5t-3.5 -6.5t-7 -2.5z"
    />
  </Svg>
);
export default Monkey;
