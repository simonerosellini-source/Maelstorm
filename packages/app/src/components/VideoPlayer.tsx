import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';

interface VideoPlayerProps {
  source: { uri: string } | number;
  style?: any;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

export default function VideoPlayer({
  source,
  style,
  autoPlay = false,
  loop = false,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [volume, setVolume] = useState(1.0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (autoPlay) {
      videoRef.current?.playAsync();
    }
  }, [autoPlay]);

  const togglePlayPause = async () => {
    if (status.isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    await videoRef.current?.setVolumeAsync(value);
  };

  const toggleMute = async () => {
    const newVolume = volume === 0 ? 1.0 : 0;
    setVolume(newVolume);
    await videoRef.current?.setVolumeAsync(newVolume);
  };

  const handleSeek = async (value: number) => {
    if (status.durationMillis) {
      await videoRef.current?.setPositionAsync(value * status.durationMillis);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = status.durationMillis
    ? status.positionMillis / status.durationMillis
    : 0;

  return (
    <View style={[styles.container, style]}>
      {/* Video Player */}
      <Video
        ref={videoRef}
        source={source}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={loop}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        volume={volume}
      />

      {/* Controls Overlay */}
      {showControls && (
        <View style={styles.controlsOverlay}>
          {/* Top Controls - Volume */}
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.volumeButton}
              onPress={() => setShowVolumeSlider(!showVolumeSlider)}
            >
              <Text style={styles.controlIcon}>
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </Text>
            </TouchableOpacity>

            {/* Volume Slider */}
            {showVolumeSlider && (
              <View style={styles.volumeSliderContainer}>
                <Slider
                  style={styles.volumeSlider}
                  minimumValue={0}
                  maximumValue={1}
                  value={volume}
                  onValueChange={handleVolumeChange}
                  minimumTrackTintColor="#9d4edd"
                  maximumTrackTintColor="#94a1b2"
                  thumbTintColor="#9d4edd"
                />
                <Text style={styles.volumeText}>{Math.round(volume * 100)}%</Text>
              </View>
            )}
          </View>

          {/* Center Play/Pause Button */}
          <TouchableOpacity style={styles.centerControl} onPress={togglePlayPause}>
            <View style={styles.playPauseButton}>
              <Text style={styles.playPauseIcon}>
                {status.isPlaying ? '⏸' : '▶'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Bottom Controls - Progress Bar */}
          <View style={styles.bottomControls}>
            {/* Time Display */}
            <Text style={styles.timeText}>
              {status.positionMillis ? formatTime(status.positionMillis) : '0:00'} /{' '}
              {status.durationMillis ? formatTime(status.durationMillis) : '0:00'}
            </Text>

            {/* Progress Bar */}
            <Slider
              style={styles.progressSlider}
              minimumValue={0}
              maximumValue={1}
              value={progress}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#9d4edd"
              maximumTrackTintColor="#94a1b2"
              thumbTintColor="#9d4edd"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  volumeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
  },
  controlIcon: {
    fontSize: 24,
  },
  volumeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 12,
    flex: 1,
    maxWidth: 200,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
  volumeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 12,
    minWidth: 40,
  },
  centerControl: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(157, 78, 221, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playPauseIcon: {
    fontSize: 36,
    color: '#fff',
  },
  bottomControls: {
    padding: 16,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
});
