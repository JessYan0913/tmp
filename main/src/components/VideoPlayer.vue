<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import HLS from 'hls.js';

export type PlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

const props = withDefaults(
  defineProps<{
    src: string;
    type: string;
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

watch(
  () => ({
    src: props.src,
    videoRef: videoRef.value,
  }),
  ({ src, videoRef }) => {
    if (!videoRef) {
      return;
    }
    if (videoRef?.canPlayType(props.type)) {
      videoRef.src = src;
    } else if (HLS.isSupported()) {
      hls.value.loadSource(src);
    }
  }
);

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
    <p>你的浏览器不支持 HTML5 视频。可点击<a :href="src">此链接</a>观看</p>
  </video>
</template>

<style lang="scss" scoped>
.video-player {
  width: 100%;
  background-color: rgba(32, 32, 32, 0.842);
}
</style>
