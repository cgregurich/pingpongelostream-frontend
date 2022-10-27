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
                sources: [
                    {
                        src: 'http://stream.atticpingpong.com:8088/dash/obs_stream.mpd',
                        type: 'application/dash+xml'
                    }
                ]
            }
        };
    }
}
</script>