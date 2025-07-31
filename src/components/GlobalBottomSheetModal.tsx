import React, { forwardRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useThemeContext } from '../theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  containerStyle?: StyleProp<ViewStyle>;
};

const GlobalBottomSheetModal = forwardRef<BottomSheetModal, Props>(
  ({ children, snapPoints = ['50%'], containerStyle }, ref) => {
    const { colors } = useThemeContext();

    return (
<BottomSheetModal
  ref={ref}
  index={0}
  snapPoints={snapPoints}
  enablePanDownToClose
  backgroundStyle={{ backgroundColor: colors.card }}
  handleIndicatorStyle={{ backgroundColor: colors.mutedText,width: 50 }}
 animationConfigs={{
  damping: 30,              // ↓ Lower = less resistance = faster
  mass: 1,
  stiffness: 250,           // ↑ Higher = snappier/faster
  overshootClamping: true,  // Prevents bounce
  restDisplacementThreshold: 0.5,
  restSpeedThreshold: 0.5,
}}
  backdropComponent={({ animatedIndex, animatedPosition }) => (
    <BottomSheetBackdrop
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      pressBehavior="close"
    />
  )}
>
        <BottomSheetView style={[styles.contentContainer, containerStyle]}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default GlobalBottomSheetModal;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});