class HlsManager {
    static initAll() {
        document.querySelectorAll("video[data-hls]").forEach((video) => {
            const hlsUrl = video.getAttribute("data-hls");
            new HlsPlayer(video, hlsUrl);
        });
    }
}

class HlsPlayer {
    constructor(video, hlsUrl) {
        this.video = video;
        this.hlsUrl = hlsUrl;
        this.hls = null;
        this.init();
    }

    init() {
        if (Hls.isSupported()) {
            this.hls = new Hls();
            this.hls.loadSource(this.hlsUrl);
            this.hls.attachMedia(this.video);
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.video.play().catch(e => console.error("自动播放失败:", e));
            });
        } else if (this.video.canPlayType("application/vnd.apple.mpegurl")) {
            this.video.src = this.hlsUrl;
            this.video.addEventListener("loadedmetadata", () => {
                this.video.play().catch(e => console.error("自动播放失败:", e));
            });
        }
    }

    destroy() {
        if (this.hls) {
            this.hls.destroy();
        }
    }
}

// 自动初始化
document.addEventListener("DOMContentLoaded", HlsManager.initAll);