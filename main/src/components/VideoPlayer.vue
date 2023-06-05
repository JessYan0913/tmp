<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import HLS from 'hls.js';

export type PlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export type VideoType =
  | 'video/mp4'
  | 'video/webm'
  | 'video/ogg'
  | 'application/x-mpegURL'
  | 'application/dash+xml'
  | 'video/x-msvideo'
  | 'video/quicktime'
  | 'video/x-ms-wmv';

export interface Track {
  label: string;
  src: string;
  srclang: string;
  kind: TextTrackKind;
}

const props = withDefaults(
  defineProps<{
    src: string;
    type: VideoType;
    tracks?: Track[];
    showingTrack?: string;
    autoplay?: boolean;
    loop?: boolean;
    poster?: string;
    controls?: boolean;
    muted?: boolean;
    playbackRate?: PlaybackRate;
  }>(),
  {
    autoplay: false,
    loop: false,
    poster: '',
    controls: true,
    muted: false,
    playbackRate: 1,
  }
);

const emits = defineEmits<{
  (event: 'loaded', videoRef?: HTMLVideoElement): void;
  (event: 'ended', videoRef?: HTMLVideoElement): void;
  (event: 'paused', videoRef?: HTMLVideoElement): void;
  (event: 'play', videoRef?: HTMLVideoElement): void;
  (event: 'seeking', videoRef?: HTMLVideoElement): void;
  (event: 'seeked', videoRef?: HTMLVideoElement): void;
  (event: 'error', error: MediaError | undefined | null, videoRef?: HTMLVideoElement): void;
}>();

const videoRef = ref<HTMLVideoElement>();

const hls = ref<HLS>(new HLS());

watchEffect(() => {
  if (!videoRef.value) {
    return;
  }
  if (videoRef.value.canPlayType(props.type)) {
    videoRef.value.src = props.src;
  } else if (HLS.isSupported()) {
    hls.value.loadSource(props.src);
  }
});

onMounted(() => {
  if (!videoRef.value) {
    return;
  }
  videoRef.value.autoplay = props.autoplay;
  videoRef.value.preload = 'auto';
  videoRef.value.controls = props.controls;
  videoRef.value.poster = props.poster;
  videoRef.value.muted = props.muted;
  videoRef.value.playbackRate = props.playbackRate;

  Array.from(videoRef.value.textTracks).forEach((track) => {
    if (track.label === props.showingTrack) {
      track.mode = 'showing';
    }
  });

  hls.value.attachMedia(videoRef.value);

  videoRef.value.addEventListener('loadeddata', handleVideoLoaded);
  videoRef.value.addEventListener('ended', handleVideoEnded);
  videoRef.value.addEventListener('pause', handleVideoPause);
  videoRef.value.addEventListener('play', handleVideoPlay);
  videoRef.value.addEventListener('seeking', handleVideoSeeking);
  videoRef.value.addEventListener('seeked', handleVideoSeeked);
  videoRef.value.addEventListener('error', handleVideoError);
});

onUnmounted(() => {
  hls.value.destroy();
  videoRef.value?.removeEventListener('loadeddata', handleVideoLoaded);
  videoRef.value?.removeEventListener('ended', handleVideoEnded);
  videoRef.value?.removeEventListener('pause', handleVideoPause);
  videoRef.value?.removeEventListener('play', handleVideoPlay);
  videoRef.value?.removeEventListener('seeking', handleVideoSeeking);
  videoRef.value?.removeEventListener('seeked', handleVideoSeeked);
  videoRef.value?.removeEventListener('error', handleVideoError);
});

function handleVideoLoaded() {
  emits('loaded', videoRef.value);
}

function handleVideoEnded() {
  emits('ended', videoRef.value);
}

function handleVideoPause() {
  emits('paused', videoRef.value);
}

function handleVideoPlay() {
  emits('play', videoRef.value);
}

function handleVideoSeeking() {
  emits('seeking', videoRef.value);
}

function handleVideoSeeked() {
  emits('seeked', videoRef.value);
}

function handleVideoError() {
  emits('error', videoRef.value?.error, videoRef.value);
}

defineExpose({
  pause: () => videoRef.value?.pause(),
  play: () => videoRef.value?.play(),
  fastSeek: (time: number) => videoRef.value?.fastSeek(time),
  canPlayType: (type: string) => videoRef.value?.canPlayType(type),
});
</script>

<template>
  <video ref="videoRef" class="video-player">
    <track
      v-for="({ src, kind, srclang, label }, index) in tracks"
      :key="index"
      :src="src"
      :kind="kind"
      :srclang="srclang"
      :label="label"
    />
    <p>你的浏览器不支持 HTML5 视频。可点击<a :href="src">此链接</a>观看</p>
  </video>
</template>

<style lang="scss" scoped>
.video-player {
  width: 100%;
  background-color: rgba(32, 32, 32, 0.842);
  &::cue {
    background: none;
    color: rgb(0, 255, 162);
    text-shadow: 0 1px #000, 1px 0 #000, -1px 0 #000, 0 -1px #000;
    font-size: medium;
  }
}
</style>
