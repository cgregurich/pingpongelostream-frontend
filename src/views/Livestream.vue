<template>
    <div id="wrap">
        <div>
            <div class="flex justify-center mt-3 player-container">
                <video-player
                    :options="videoOptions"
                ></video-player>
            </div>
        </div>
    </div>
</template>
<script>
import VideoPlayer from '../components/VideoPlayer.vue';

export default {
    name: 'Livestream',
    components: {
        VideoPlayer
    },
    data() {
        return {
            videoOptions: {
                responsive: true,
                autoplay: true,
                controls: true,
                preload: 'auto',
                class: 'vjs-16-9 video-js vjs-default-skin vjs-big-play-centered',
                width: 'auto',
                height: 'auto',
                sources: [
                    {
                        src: import.meta.env.VITE_BACKEND_ENV == 'prod'
                            ? 'https://stream.atticpingpong.com/stream/hls/obs_stream.m3u8'
                            : 'http://stream.atticpingpong.com:8088/hls/obs_stream.m3u8'
                        /*src: import.meta.env.VITE_BACKEND_ENV == 'prod'
                            ? 'https://stream.atticpingpong.com/stream/dash/obs_stream.mpd'
                            : 'http://stream.atticpingpong.com:8088/dash/obs_stream.mpd',
                        type: 'application/dash+xml'*/
                    }
                ]
            }
        };
    }
}
</script>
