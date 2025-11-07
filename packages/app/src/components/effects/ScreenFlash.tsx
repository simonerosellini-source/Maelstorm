import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface ScreenFlashProps {
  color?: string;
  duration?: number;
  intensity?: number;
  onComplete?: () => void;
}

export const ScreenFlash: React.FC<ScreenFlashProps> = ({
  color = '#FFFFFF',
  duration = 300,
  intensity = 0.5,
  onComplete,
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(intensity, { duration: duration / 4, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: (duration * 3) / 4, easing: Easing.in(Easing.ease) }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.flash, { backgroundColor: color }, animatedStyle]} />;
};

const styles = StyleSheet.create({
  flash: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    pointerEvents: 'none',
  },
});
