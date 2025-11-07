import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

export type DamageType = 'physical' | 'fire' | 'cold' | 'lightning' | 'poison' | 'acid' | 'psychic' | 'necrotic' | 'radiant' | 'force';

interface DamageTextProps {
  amount: number;
  type: DamageType;
  isHealing?: boolean;
  isCritical?: boolean;
  onComplete?: () => void;
}

const DAMAGE_COLORS: Record<DamageType, string> = {
  physical: '#CCCCCC',
  fire: '#FF4500',
  cold: '#00BFFF',
  lightning: '#FFD700',
  poison: '#32CD32',
  acid: '#ADFF2F',
  psychic: '#DA70D6',
  necrotic: '#8B008B',
  radiant: '#FFD700',
  force: '#9370DB',
};

export const DamageText: React.FC<DamageTextProps> = ({
  amount,
  type,
  isHealing = false,
  isCritical = false,
  onComplete,
}) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Animate in
    opacity.value = withTiming(1, { duration: 100 });
    scale.value = withSequence(
      withTiming(isCritical ? 1.5 : 1.2, { duration: 200, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 100 })
    );

    // Float up
    translateY.value = withTiming(-100, { duration: 1500, easing: Easing.out(Easing.ease) });

    // Fade out
    opacity.value = withDelay(
      1000,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const color = isHealing ? '#00FF00' : DAMAGE_COLORS[type];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text
        style={[
          styles.text,
          {
            color,
            fontSize: isCritical ? 40 : 32,
            fontWeight: isCritical ? '900' : 'bold',
            textShadowColor: color,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isCritical ? 15 : 10,
          },
        ]}
      >
        {isHealing ? '+' : '-'}
        {amount}
        {isCritical && '!'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: '50%',
    top: '50%',
    marginLeft: -50,
    marginTop: -25,
    zIndex: 1000,
  },
  text: {
    fontFamily: 'System',
    letterSpacing: 2,
  },
});
