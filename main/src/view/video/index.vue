<script lang="ts" setup name="Video">
import { ref } from 'vue';

import VideoPlayer, { VideoType } from '@/components/VideoPlayer.vue';
import { useTheme } from '@/hooks/useTheme';

const videoPlayerRef = ref();
const videoSrc = ref<string>('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
const videoType = ref<VideoType>('video/mp4');
const volume = ref<number>(1);

const { theme } = useTheme();

const handleChangeTheme = (event: Event) => {
  if (event.target) {
    theme.value = (event.target as HTMLSelectElement).value;
  }
};
</script>

<template>
  <div class="wrapper">
    <h1>Page-A</h1>
    <form>
      <div>
        <label>主题:</label>
        <select :value="theme" @change="handleChangeTheme">
          <option value="light">明亮</option>
          <option value="dark">暗色</option>
        </select>
      </div>
      <div>
        <label>视频地址:</label>
        <input v-model="videoSrc" />
      </div>
      <div>
        <label>视频类型:</label>
        <input v-model="videoType" />
      </div>
      <div>
        <label>音量:</label>
        <input v-model="volume" type="range" max="1" min="0" step="0.01" />
      </div>
    </form>
    <VideoPlayer
      ref="videoPlayerRef"
      class="video-player"
      :src="videoSrc"
      :type="videoType"
      :tracks="[
        {
          src: '/subtitles.vtt',
          srclang: 'en',
          label: 'English',
          kind: 'captions',
        },
      ]"
      :volume="Number(volume)"
      controls
      showing-track="English"
    ></VideoPlayer>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.video-player {
  width: 500px;
  height: 500px;
}
</style>
