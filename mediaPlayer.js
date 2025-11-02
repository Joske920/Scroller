// MediaPlayer module - handles video, audio, and image display
class MediaPlayer {
    constructor() {
        this.container = null;
        this.currentMedia = null;
        this.globalVolume = 0.1;
        this.isMuted = false;
        this.volumeBeforeMute = 0.1;
        this.videoControlsTimer = null;
    }

    init(container) {
        this.container = container;
    }

    showItem(file) {
        if (!this.container) return;

        this.container.innerHTML = ""; // clear
        const item = document.createElement("div");
        item.className = "item";

        let progressBar, progressWrapper;

        if (file.type.startsWith("video")) {
            this.createVideoElement(file, item);
        } else if (file.type.startsWith("audio")) {
            this.createAudioElement(file, item);
        } else if (file.type.startsWith("image")) {
            this.createImageElement(file, item);
        }

        this.container.appendChild(item);
        return item;
    }

    createVideoElement(file, item) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.controls = false;
        video.playsInline = true;
        video.autoplay = true;
        video.loop = false;
        video.volume = this.globalVolume;
        
        // Ensure video is visible
        video.style.display = "block";
        video.style.visibility = "visible";
        video.style.opacity = "1";
        video.style.position = "relative";
        video.style.zIndex = "1";

        // toggle pause/play on click
        video.addEventListener("click", () => {
            if (video.paused) video.play(); else video.pause();
        });

        // progress bar
        const progressWrapper = document.createElement("div");
        progressWrapper.className = "progress";
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        progressWrapper.appendChild(progressBar);

        video.addEventListener("timeupdate", () => {
            if (video.duration) {
                progressBar.style.width = (video.currentTime / video.duration) * 100 + "%";
            }
        });

        progressWrapper.addEventListener("click", (e) => {
            const rect = progressWrapper.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        });

        // Video control buttons
        const videoControls = this.createVideoControls(video);

        item.appendChild(video);
        item.appendChild(progressWrapper);
        item.appendChild(videoControls);
        this.currentMedia = video;

        return video;
    }

    createAudioElement(file, item) {
        const title = document.createElement("div");
        title.textContent = file.name;
        title.style.marginBottom = "10px";

        const audio = document.createElement("audio");
        audio.src = URL.createObjectURL(file);
        audio.controls = false;
        audio.autoplay = true;
        audio.volume = this.globalVolume;

        // toggle pause/play on click (title)
        title.addEventListener("click", () => {
            if (audio.paused) audio.play(); else audio.pause();
        });

        // progress bar
        const progressWrapper = document.createElement("div");
        progressWrapper.className = "progress";
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        progressWrapper.appendChild(progressBar);

        audio.addEventListener("timeupdate", () => {
            if (audio.duration) {
                progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
            }
        });

        progressWrapper.addEventListener("click", (e) => {
            const rect = progressWrapper.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
        });

        item.appendChild(title);
        item.appendChild(audio);
        item.appendChild(progressWrapper);
        this.currentMedia = audio;

        return audio;
    }

    createImageElement(file, item) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        item.appendChild(img);
        this.currentMedia = null;
        return img;
    }

    createVideoControls(video) {
        const videoControls = document.createElement("div");
        videoControls.className = "video-controls";
        
        // Back 5 seconds
        const back5sBtn = this.createControlButton("⏪", "Back 5 seconds", (e) => {
            e.stopPropagation();
            video.currentTime = Math.max(0, video.currentTime - 5);
        }, true);
        
        // Back 10 frames (assuming 30fps = ~0.33s)
        const back10framesBtn = this.createControlButton("⏮", "Back 10 frames", (e) => {
            e.stopPropagation();
            video.currentTime = Math.max(0, video.currentTime - (10 / 30));
        });
        
        // Back 1 frame
        const back1frameBtn = this.createControlButton("⏴", "Back 1 frame", (e) => {
            e.stopPropagation();
            video.currentTime = Math.max(0, video.currentTime - (1 / 30));
        });
        
        // Forward 1 frame
        const forward1frameBtn = this.createControlButton("⏵", "Forward 1 frame", (e) => {
            e.stopPropagation();
            video.currentTime = Math.min(video.duration, video.currentTime + (1 / 30));
        });
        
        // Forward 10 frames
        const forward10framesBtn = this.createControlButton("⏭", "Forward 10 frames", (e) => {
            e.stopPropagation();
            video.currentTime = Math.min(video.duration, video.currentTime + (10 / 30));
        });
        
        // Forward 5 seconds
        const forward5sBtn = this.createControlButton("⏩", "Forward 5 seconds", (e) => {
            e.stopPropagation();
            video.currentTime = Math.min(video.duration, video.currentTime + 5);
        }, true);
        
        // Video info display (timestamp and frame)
        const videoInfo = this.createVideoInfo(video);

        videoControls.appendChild(back5sBtn);
        videoControls.appendChild(back10framesBtn);
        videoControls.appendChild(back1frameBtn);
        videoControls.appendChild(forward1frameBtn);
        videoControls.appendChild(forward10framesBtn);
        videoControls.appendChild(forward5sBtn);
        videoControls.appendChild(videoInfo);
        
        this.setupVideoControlsInteractions(video, videoControls, [back5sBtn, back10framesBtn, back1frameBtn, forward1frameBtn, forward10framesBtn, forward5sBtn]);
        
        return videoControls;
    }

    createControlButton(text, title, clickHandler, isLarge = false) {
        const btn = document.createElement("div");
        btn.className = isLarge ? "video-control-btn large" : "video-control-btn";
        btn.innerHTML = text;
        btn.title = title;
        btn.addEventListener("click", clickHandler);
        return btn;
    }

    createVideoInfo(video) {
        const videoInfo = document.createElement("div");
        videoInfo.className = "video-info";
        
        const timestampDisplay = document.createElement("div");
        timestampDisplay.className = "timestamp";
        timestampDisplay.textContent = "00:00 / 00:00";
        
        const frameDisplay = document.createElement("div");
        frameDisplay.className = "frame-info";
        frameDisplay.textContent = "Frame: 0 / 0";
        
        videoInfo.appendChild(timestampDisplay);
        videoInfo.appendChild(frameDisplay);
        
        // Function to update video info display
        const updateVideoInfo = () => {
            const currentTime = video.currentTime || 0;
            const duration = video.duration || 0;
            const fps = 30; // Assume 30 fps, could be made dynamic if needed
            
            const currentFrame = Math.floor(currentTime * fps);
            const totalFrames = Math.floor(duration * fps);
            
            timestampDisplay.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
            frameDisplay.textContent = `Frame: ${currentFrame} / ${totalFrames}`;
        };
        
        // Update info on timeupdate
        video.addEventListener("timeupdate", updateVideoInfo);
        video.addEventListener("loadedmetadata", updateVideoInfo);
        video.addEventListener("seeked", updateVideoInfo);

        return videoInfo;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    setupVideoControlsInteractions(video, videoControls, controlButtons) {
        // Show/hide controls based on play/pause state
        const showVideoControls = () => {
            videoControls.classList.add("visible");
            
            // Reset to center if this is the first time showing or if not previously positioned
            if (!videoControls.style.left && !videoControls.style.top) {
                videoControls.style.left = "50%";
                videoControls.style.top = "50%";
                videoControls.style.transform = "translate(-50%, -50%)";
            }
            
            // Clear existing timer
            if (this.videoControlsTimer) {
                clearTimeout(this.videoControlsTimer);
            }
            
            // Set timer to hide controls after 5 seconds if video is still paused
            this.videoControlsTimer = setTimeout(() => {
                if (video.paused) {
                    videoControls.classList.remove("visible");
                }
            }, 5000);
        };
        
        const hideVideoControls = () => {
            videoControls.classList.remove("visible");
            if (this.videoControlsTimer) {
                clearTimeout(this.videoControlsTimer);
                this.videoControlsTimer = null;
            }
        };
        
        const toggleVideoControls = () => {
            if (video.paused) {
                showVideoControls();
            } else {
                hideVideoControls();
            }
        };
        
        // Add mouse/interaction detection to reset the timer
        const resetControlsTimer = () => {
            if (video.paused && videoControls.classList.contains("visible")) {
                showVideoControls(); // This will reset the 5-second timer
            }
        };
        
        // Show controls on mouse movement when video is paused (even if controls are hidden)
        const showControlsOnMouseMove = () => {
            if (video.paused) {
                showVideoControls(); // This will show controls and start the 5-second timer
            }
        };
        
        // Event listeners
        videoControls.addEventListener("mouseenter", resetControlsTimer);
        videoControls.addEventListener("mousemove", resetControlsTimer);
        video.addEventListener("mousemove", showControlsOnMouseMove);
        video.parentElement.addEventListener("mousemove", showControlsOnMouseMove);
        
        // Reset timer when any control button is clicked
        controlButtons.forEach(btn => {
            btn.addEventListener("click", resetControlsTimer);
        });
        
        // Make video controls draggable
        this.setupVideoControlsDragging(videoControls, resetControlsTimer);
        
        video.addEventListener("play", toggleVideoControls);
        video.addEventListener("pause", toggleVideoControls);
        
        // Initial state check
        setTimeout(toggleVideoControls, 100);
    }

    setupVideoControlsDragging(videoControls, resetControlsTimer) {
        let isDraggingControls = false;
        let dragStartX, dragStartY, controlsStartX, controlsStartY;
        
        videoControls.addEventListener("mousedown", (e) => {
            // Only start drag if clicking on the background (not on buttons)
            if (e.target === videoControls) {
                isDraggingControls = true;
                videoControls.classList.add("dragging");
                
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                const rect = videoControls.getBoundingClientRect();
                controlsStartX = rect.left;
                controlsStartY = rect.top;
                
                e.preventDefault();
                resetControlsTimer(); // Reset timer when starting drag
            }
        });
        
        document.addEventListener("mousemove", (e) => {
            if (isDraggingControls) {
                const deltaX = e.clientX - dragStartX;
                const deltaY = e.clientY - dragStartY;
                
                const newX = controlsStartX + deltaX;
                const newY = controlsStartY + deltaY;
                
                // Keep controls within viewport bounds
                const controlsRect = videoControls.getBoundingClientRect();
                const maxX = window.innerWidth - controlsRect.width;
                const maxY = window.innerHeight - controlsRect.height;
                
                const boundedX = Math.max(0, Math.min(maxX, newX));
                const boundedY = Math.max(0, Math.min(maxY, newY));
                
                videoControls.style.left = boundedX + "px";
                videoControls.style.top = boundedY + "px";
                videoControls.style.transform = "none";
            }
        });
        
        document.addEventListener("mouseup", () => {
            if (isDraggingControls) {
                isDraggingControls = false;
                videoControls.classList.remove("dragging");
                resetControlsTimer(); // Reset timer when ending drag
            }
        });
    }

    updateVolume(volume) {
        this.globalVolume = volume;
        if (this.currentMedia && (this.currentMedia.tagName === "VIDEO" || this.currentMedia.tagName === "AUDIO")) {
            this.currentMedia.volume = volume;
        }
    }

    setMuted(muted) {
        this.isMuted = muted;
        if (muted) {
            this.volumeBeforeMute = this.globalVolume;
            this.globalVolume = 0;
        } else {
            this.globalVolume = this.volumeBeforeMute;
        }
        this.updateVolume(this.globalVolume);
    }

    getCurrentMedia() {
        return this.currentMedia;
    }

    getGlobalVolume() {
        return this.globalVolume;
    }

    isMutedState() {
        return this.isMuted;
    }

    getVolumeBeforeMute() {
        return this.volumeBeforeMute;
    }
}

// Export for use in other modules
window.MediaPlayer = MediaPlayer;