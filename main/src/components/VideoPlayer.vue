<script lang="ts" setup>
import { onMounted, onUnmounted, ref, useAttrs, watchEffect } from 'vue';
import HLS from 'hls.js';

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

const props = defineProps<{
  src: string;
  type: VideoType;
  tracks?: Track[];
}>();

const attrs = useAttrs();

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

  Array.from(videoRef.value.textTracks).forEach((track) => {
    if (track.label === attrs['showing-track']) {
      track.mode = 'showing';
    }
  });
});

onMounted(() => {
  if (!videoRef.value) {
    return;
  }
  hls.value.attachMedia(videoRef.value);
});

onUnmounted(() => {
  hls.value.destroy();
});

defineExpose({
  pause: () => videoRef.value?.pause(),
  play: () => videoRef.value?.play(),
  fastSeek: (time: number) => videoRef.value?.fastSeek(time),
  canPlayType: (type: string) => videoRef.value?.canPlayType(type),
});
</script>

<template>
  <video ref="videoRef" class="video-player" preload="auto" v-bind="$attrs">
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
