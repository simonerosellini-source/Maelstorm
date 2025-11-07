import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import VideoPlayer from '../../components/VideoPlayer';

/**
 * Demo screen showing VideoPlayer usage
 *
 * Features:
 * - Play/Pause controls
 * - Volume slider with percentage display
 * - Progress bar with seek functionality
 * - Time display (current / total)
 * - Support for transparent background (PNG videos with alpha)
 */
export default function VideoPlayerDemo() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Video Player Demo</Text>
        <Text style={styles.subtitle}>
          Complete video player with volume controls
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sample Video</Text>
        <Text style={styles.description}>
          Replace the URI below with your video URL or use a local file
        </Text>

        <VideoPlayer
          source={{
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          autoPlay={false}
          loop={true}
          showControls={true}
          style={styles.videoPlayer}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>🎮 Play/Pause with center button</Text>
          <Text style={styles.featureItem}>🔊 Volume control with slider</Text>
          <Text style={styles.featureItem}>📊 Volume percentage display</Text>
          <Text style={styles.featureItem}>⏱️ Time display (current / total)</Text>
          <Text style={styles.featureItem}>📍 Seek with progress bar</Text>
          <Text style={styles.featureItem}>🔁 Loop support</Text>
          <Text style={styles.featureItem}>🎨 Transparent background support (for PNG videos)</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usage Example</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            {`<VideoPlayer
  source={{ uri: 'video.mp4' }}
  autoPlay={false}
  loop={true}
  showControls={true}
/>`}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Props</Text>
        <View style={styles.propsList}>
          <Text style={styles.propItem}>
            <Text style={styles.propName}>source</Text>: Video source (URI or local)
          </Text>
          <Text style={styles.propItem}>
            <Text style={styles.propName}>autoPlay</Text>: Start playing automatically (default: false)
          </Text>
          <Text style={styles.propItem}>
            <Text style={styles.propName}>loop</Text>: Loop video (default: false)
          </Text>
          <Text style={styles.propItem}>
            <Text style={styles.propName}>showControls</Text>: Show player controls (default: true)
          </Text>
          <Text style={styles.propItem}>
            <Text style={styles.propName}>style</Text>: Custom styling
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9d4edd',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a1b2',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#94a1b2',
    marginBottom: 16,
    lineHeight: 20,
  },
  videoPlayer: {
    marginVertical: 16,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 16,
    color: '#94a1b2',
    paddingVertical: 4,
    lineHeight: 24,
  },
  codeBlock: {
    backgroundColor: '#0f3460',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9d4edd',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
  },
  propsList: {
    gap: 12,
  },
  propItem: {
    fontSize: 14,
    color: '#94a1b2',
    lineHeight: 20,
  },
  propName: {
    fontWeight: 'bold',
    color: '#9d4edd',
    fontFamily: 'monospace',
  },
});
