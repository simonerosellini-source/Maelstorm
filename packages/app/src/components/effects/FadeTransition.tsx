import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

interface FadeTransitionProps {
  children: React.ReactNode;
  visible: boolean;
  duration?: number;
  type?: 'fade' | 'slideUp' | 'slideDown' | 'scale' | 'slideLeft' | 'slideRight';
  style?: ViewStyle;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  visible,
  duration = 300,
  type = 'fade',
  style,
}) => {
  const opacity = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(visible ? 0 : type === 'slideUp' ? 50 : type === 'slideDown' ? -50 : 0);
  const translateX = useSharedValue(visible ? 0 : type === 'slideLeft' ? 50 : type === 'slideRight' ? -50 : 0);
  const scale = useSharedValue(visible ? 1 : 0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });

      if (type === 'slideUp' || type === 'slideDown') {
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      }

      if (type === 'slideLeft' || type === 'slideRight') {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }

      if (type === 'scale') {
        scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      }
    } else {
      opacity.value = withTiming(0, { duration, easing: Easing.in(Easing.ease) });

      if (type === 'slideUp') {
        translateY.value = withTiming(50, { duration });
      } else if (type === 'slideDown') {
        translateY.value = withTiming(-50, { duration });
      }

      if (type === 'slideLeft') {
        translateX.value = withTiming(50, { duration });
      } else if (type === 'slideRight') {
        translateX.value = withTiming(-50, { duration });
      }

      if (type === 'scale') {
        scale.value = withTiming(0.8, { duration });
      }
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    const transform = [];

    if (type === 'slideUp' || type === 'slideDown') {
      transform.push({ translateY: translateY.value });
    }

    if (type === 'slideLeft' || type === 'slideRight') {
      transform.push({ translateX: translateX.value });
    }

    if (type === 'scale') {
      transform.push({ scale: scale.value });
    }

    return {
      opacity: opacity.value,
      transform,
    };
  });

  if (!visible && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
