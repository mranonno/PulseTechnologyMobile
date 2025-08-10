// src/components/CustomHeader.tsx
import React from "react";
import {
  Text,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeContext } from "../theme/ThemeProvider";

interface CustomHeaderProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  height?: number;
  shadow?: boolean;
  borderBottom?: boolean;
  animatedValue?: Animated.Value;
}

const CustomHeader: React.FC<CustomHeaderProps> = React.memo(
  ({
    title,
    style,
    titleStyle,
    leftComponent,
    rightComponent,
    onPressLeft,
    onPressRight,
    height = 60,
    shadow = false,
    borderBottom = false,
    animatedValue,
  }) => {
    const { colors } = useThemeContext();
    const { top } = useSafeAreaInsets();

    const containerStyles: StyleProp<ViewStyle> = [
      styles.container,
      {
        backgroundColor: colors.tabBackground,
        height: height + top,
        paddingTop: top + 6,
        borderBottomWidth: borderBottom ? StyleSheet.hairlineWidth : 0,
        borderBottomColor: borderBottom ? colors.border : "transparent",
      },
      shadow && styles.shadow,
      style,
    ];

    const Container = animatedValue ? Animated.View : View;

    const renderTouchable = (
      component: React.ReactNode,
      onPress?: () => void
    ) => {
      if (!component) return <View style={styles.placeholder} />;
      return onPress ? (
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          {component}
        </TouchableOpacity>
      ) : (
        <View style={styles.touchable}>{component}</View>
      );
    };

    return (
      <Container style={containerStyles} accessibilityRole="header">
        <View style={styles.sideContainer}>
          {renderTouchable(leftComponent, onPressLeft)}
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, { color: colors.text }, titleStyle]}
            numberOfLines={1}
            accessibilityRole="header"
            accessibilityLabel={title}
          >
            {title}
          </Text>
        </View>

        <View style={styles.sideContainer}>
          {renderTouchable(rightComponent, onPressRight)}
        </View>
      </Container>
    );
  }
);

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sideContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    minHeight: 40,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
