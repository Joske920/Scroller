// Main application script - coordinates all modules
class ShortsPlayer {
    constructor() {
        this.mediaPlayer = new MediaPlayer();
        this.controls = new Controls();
        this.navigation = new Navigation();
        
        this.container = null;
        this.picker = null;
        this.currentMedia = null;
        
        this.init();
    }

    init() {
        this.container = document.getElementById("container");
        this.picker = document.getElementById("folderPicker");
        
        // Initialize modules
        this.mediaPlayer.init(this.container);
        this.controls.init();
        this.navigation.init();
        
        // Set up inter-module callbacks
        this.setupCallbacks();
        
        // Set up file picker
        this.setupFilePicker();
    }

    setupCallbacks() {
        // Controls callbacks
        this.controls.onVolumeChange = (volume) => {
            this.mediaPlayer.updateVolume(volume);
        };
        
        this.controls.onMuteToggle = (muted) => {
            this.mediaPlayer.setMuted(muted);
        };
        
        this.controls.onAutoScrollToggle = (enabled) => {
            if (!enabled && this.navigation.hasTimer()) {
                this.navigation.clearTimer();
            } else if (enabled && this.getCurrentItem()?.type.startsWith("image")) {
                this.startImageTimer();
            }
        };
        
        this.controls.onShuffleToggle = (enabled) => {
            this.applyFilters();
        };
        
        this.controls.onFilterChange = (showPictures, showVideos) => {
            this.applyFilters();
        };
        
        this.controls.onFullscreenToggle = (isFullscreen) => {
            // Fullscreen state is already handled in controls
        };

        // Navigation callbacks
        this.navigation.setOnNavigate((direction) => {
            const nextIndex = this.navigation.getNextValidIndex(
                direction, 
                this.controls.getShuffleEnabled(),
                this.controls.getShowPictures(),
                this.controls.getShowVideos()
            );
            if (nextIndex !== -1) {
                this.showItem(nextIndex);
            }
        });
        
        this.navigation.setOnSeek((seconds) => {
            const currentMedia = this.mediaPlayer.getCurrentMedia();
            if (currentMedia && (currentMedia.tagName === "VIDEO" || currentMedia.tagName === "AUDIO")) {
                if (seconds < 0) {
                    currentMedia.currentTime = Math.max(0, currentMedia.currentTime + seconds);
                } else {
                    currentMedia.currentTime = Math.min(currentMedia.duration, currentMedia.currentTime + seconds);
                }
            }
        });
        
        this.navigation.setOnPlayPause(() => {
            const currentMedia = this.mediaPlayer.getCurrentMedia();
            if (currentMedia && (currentMedia.tagName === "VIDEO" || currentMedia.tagName === "AUDIO")) {
                if (currentMedia.paused) {
                    currentMedia.play();
                } else {
                    currentMedia.pause();
                }
            }
        });
        
        this.navigation.setOnFullscreen(() => {
            this.controls.toggleFullscreen();
        });
        
        this.navigation.setOnEscapeFullscreen(() => {
            if (this.controls.isFullscreen) {
                this.controls.toggleFullscreen();
            }
        });
        
        this.navigation.setOnShowItem((index) => {
            this.showItem(index);
        });
    }

    setupFilePicker() {
        this.picker.addEventListener("change", () => {
            const files = Array.from(this.picker.files);
            this.navigation.loadFiles(files);
            this.controls.setFolderLoaded(true);
            
            // Apply filters and shuffle
            this.applyFilters();
        });
    }

    showItem(index) {
        const items = this.navigation.getItems();
        if (index < 0 || index >= items.length) return;

        this.navigation.setCurrentIndex(index);
        const file = items[index];
        
        // Create media element
        const item = this.mediaPlayer.showItem(file);
        
        // Create controls
        const volumeControl = this.controls.createVolumeControl(this.mediaPlayer);
        const timerControls = this.controls.createTimerControls();
        
        this.container.appendChild(volumeControl);
        this.container.appendChild(timerControls);

        // Clear any existing timer
        this.navigation.clearTimer();

        // Start auto-scroll timer for images or add media end listeners
        if (file.type.startsWith("image") && this.controls.getAutoScrollEnabled()) {
            this.startImageTimer();
        } else if (file.type.startsWith("video") || file.type.startsWith("audio")) {
            const currentMedia = this.mediaPlayer.getCurrentMedia();
            if (currentMedia) {
                currentMedia.addEventListener("ended", () => {
                    const nextIndex = this.navigation.getNextValidIndex(
                        1,
                        this.controls.getShuffleEnabled(),
                        this.controls.getShowPictures(),
                        this.controls.getShowVideos()
                    );
                    if (nextIndex !== -1) {
                        this.showItem(nextIndex);
                    }
                });
            }
        }
    }

    startImageTimer() {
        this.navigation.startImageTimer(
            this.controls.getTimerDuration(),
            this.controls.getShowPictures(),
            this.controls.getShowVideos(),
            this.controls.getShuffleEnabled()
        );
    }

    applyFilters() {
        const result = this.navigation.applyFilters(
            this.controls.getShowPictures(),
            this.controls.getShowVideos(),
            this.controls.getShuffleEnabled()
        );
        
        // Show new current item if we have any items left
        if (result.hasItems) {
            this.showItem(result.currentIndex);
        } else {
            this.showNoItemsMessage();
        }
    }

    showNoItemsMessage() {
        this.container.innerHTML = "";
        
        const noItemsMessage = document.createElement("div");
        noItemsMessage.style.display = "flex";
        noItemsMessage.style.alignItems = "center";
        noItemsMessage.style.justifyContent = "center";
        noItemsMessage.style.height = "100vh";
        noItemsMessage.style.fontSize = "24px";
        noItemsMessage.style.color = "white";
        noItemsMessage.textContent = "No items match the current filter";
        
        // Create empty controls to maintain UI structure
        const volumeControl = this.controls.createVolumeControl(null);
        const timerControls = this.controls.createTimerControls();
        
        this.container.appendChild(noItemsMessage);
        this.container.appendChild(volumeControl);
        this.container.appendChild(timerControls);
    }

    getCurrentItem() {
        return this.navigation.getCurrentItem();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const app = new ShortsPlayer();
});