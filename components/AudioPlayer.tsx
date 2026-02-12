import { View, Text, Pressable } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

type AudioPlayerProps = {
  uri: string;
  onPlaybackPositionChange?: (position: number) => void;
};

export default function AudioPlayer({
  uri,
  onPlaybackPositionChange,
}: AudioPlayerProps) {
  const player = useAudioPlayer({ uri }, 100);
  const status = useAudioPlayerStatus(player);

  const [playbackBarWidth, setPlaybackBarWidth] = useState(0);

  const progress = status.currentTime / status.duration; // 0 - 1

  useEffect(() => {
    onPlaybackPositionChange?.(status.currentTime);
  }, [status.currentTime]);

  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0);
    }
  }, [status.didJustFinish]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
      }}
    >
      {status.playing ? (
        <FontAwesome
          onPress={() => player.pause()}
          name='pause'
          size={24}
          color='royalblue'
        />
      ) : (
        <FontAwesome
          onPress={() => player.play()}
          name='play'
          size={24}
          color='royalblue'
        />
      )}

      <Pressable
        onLayout={(e) => {
          setPlaybackBarWidth(e.nativeEvent.layout.width);
        }}
        onPress={(e) => {
          player.seekTo(
            (e.nativeEvent.locationX / playbackBarWidth) * player.duration
          );
        }}
        style={{
          height: 10,
          backgroundColor: 'gainsboro',
          flex: 1,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            height: 10,
            backgroundColor: 'royalblue',
            width: `${progress * 100}%`,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            width: 15,
            height: 15,
            backgroundColor: 'royalblue',
            borderWidth: 2,
            borderColor: 'white',
            borderRadius: 15,
            position: 'absolute',
            transform: [{ translateX: -7.5 }, { translateY: -2.5 }],
            left: `${progress * 100}%`,
          }}
        />
      </Pressable>
    </View>
  );
}