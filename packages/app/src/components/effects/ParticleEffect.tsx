import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

export type ParticleType = 'fire' | 'ice' | 'lightning' | 'heal' | 'damage' | 'magic';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

interface ParticleEffectProps {
  type: ParticleType;
  count?: number;
  duration?: number;
  onComplete?: () => void;
}

const PARTICLE_CONFIGS: Record<ParticleType, { colors: string[]; speed: number; spread: number }> = {
  fire: {
    colors: ['#FF4500', '#FF6347', '#FFA500', '#FFD700'],
    speed: 2,
    spread: 50,
  },
  ice: {
    colors: ['#00BFFF', '#4169E1', '#87CEEB', '#B0E0E6'],
    speed: 1.5,
    spread: 40,
  },
  lightning: {
    colors: ['#FFFF00', '#FFD700', '#FFF44F', '#FFFFFF'],
    speed: 3,
    spread: 60,
  },
  heal: {
    colors: ['#32CD32', '#00FF00', '#7FFF00', '#ADFF2F'],
    speed: 1,
    spread: 30,
  },
  damage: {
    colors: ['#DC143C', '#FF0000', '#8B0000', '#B22222'],
    speed: 2.5,
    spread: 45,
  },
  magic: {
    colors: ['#9370DB', '#BA55D3', '#DA70D6', '#EE82EE'],
    speed: 1.8,
    spread: 55,
  },
};

const ParticleItem: React.FC<{ particle: Particle; duration: number }> = ({ particle, duration }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateX.value = withTiming(particle.vx * 100, { duration, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(particle.vy * 100, { duration, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0, { duration, easing: Easing.linear });
    scale.value = withSequence(
      withTiming(1.5, { duration: duration / 2, easing: Easing.out(Easing.ease) }),
      withTiming(0.5, { duration: duration / 2, easing: Easing.in(Easing.ease) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          borderRadius: particle.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  type,
  count = 20,
  duration = 1000,
  onComplete,
}) => {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const config = PARTICLE_CONFIGS[type];

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = config.speed * (0.5 + Math.random() * 0.5);
      const size = 6 + Math.random() * 8;

      return {
        id: `particle-${i}`,
        x: 150 - size / 2,
        y: 150 - size / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        opacity: 0.8 + Math.random() * 0.2,
      };
    });

    setParticles(newParticles);

    // Call onComplete after duration
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [type, count, duration]);

  return (
    <View style={styles.container}>
      {particles.map((particle) => (
        <ParticleItem key={particle.id} particle={particle} duration={duration} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 300,
    height: 300,
    left: '50%',
    top: '50%',
    marginLeft: -150,
    marginTop: -150,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
  },
});
