import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface SpellCastEffectProps {
  spellSchool: 'abjuration' | 'conjuration' | 'divination' | 'enchantment' | 'evocation' | 'illusion' | 'necromancy' | 'transmutation';
  duration?: number;
  onComplete?: () => void;
}

const SCHOOL_COLORS: Record<string, string[]> = {
  abjuration: ['#4169E1', '#6495ED', '#00BFFF'],
  conjuration: ['#9370DB', '#8A2BE2', '#9932CC'],
  divination: ['#FFD700', '#FFA500', '#FF8C00'],
  enchantment: ['#FF69B4', '#FF1493', '#C71585'],
  evocation: ['#FF4500', '#FF6347', '#DC143C'],
  illusion: ['#DA70D6', '#EE82EE', '#DDA0DD'],
  necromancy: ['#2F4F4F', '#000000', '#696969'],
  transmutation: ['#00FA9A', '#00FF7F', '#7FFF00'],
};

const Circle: React.FC<{ delay: number; colors: string[] }> = ({ delay, colors }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSequence(
      withTiming(0, { duration: delay }),
      withTiming(1.5, { duration: 800, easing: Easing.out(Easing.ease) })
    );
    opacity.value = withSequence(
      withTiming(0, { duration: delay }),
      withTiming(0.8, { duration: 200 }),
      withTiming(0, { duration: 600, easing: Easing.in(Easing.ease) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.circle, animatedStyle]}>
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

export const SpellCastEffect: React.FC<SpellCastEffectProps> = ({
  spellSchool,
  duration = 1200,
  onComplete,
}) => {
  const rotation = useSharedValue(0);
  const colors = SCHOOL_COLORS[spellSchool];

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1
    );

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.rotatingContainer, rotationStyle]}>
        <Circle delay={0} colors={colors} />
        <Circle delay={200} colors={colors} />
        <Circle delay={400} colors={colors} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: '50%',
    top: '50%',
    marginLeft: -100,
    marginTop: -100,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  rotatingContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    opacity: 0.7,
  },
});
