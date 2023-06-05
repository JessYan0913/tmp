<script lang="ts" setup name="Application">
import { ref } from 'vue';

import VideoPlayer, { VideoType } from '@/components/VideoPlayer.vue';
import { useTheme } from '@/hooks/useTheme';

const videoSrc = ref<string>('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
const videoType = ref<VideoType>('video/mp4');

const { theme } = useTheme();

const handleChangeTheme = (event: Event) => {
  if (event.target) {
    theme.value = (event.target as HTMLSelectElement).value;
  }
};
</script>

<template>
  <div>
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
    </form>
    <VideoPlayer class="video-player" :src="videoSrc" :type="videoType"></VideoPlayer>
  </div>
</template>

<style scoped lang="scss">
.video-player {
  width: 500px;
  height: 500px;
}
</style>
