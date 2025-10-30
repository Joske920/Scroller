// Controls module - handles UI controls (volume, timer, shuffle, filters, fullscreen)
class Controls {
    constructor() {
        this.globalVolume = 0.1;
        this.isMuted = false;
        this.volumeBeforeMute = 0.1;
        this.autoScrollEnabled = false;
        this.timerDuration = 5;
        this.shuffleEnabled = false;
        this.showPictures = true;
        this.showVideos = true;
        this.folderLoaded = false;
        this.controlsVisible = false;
        this.mouseHideTimer = null;
        this.isFullscreen = false;
        
        // Callbacks for external actions
        this.onVolumeChange = null;
        this.onMuteToggle = null;
        this.onAutoScrollToggle = null;
        this.onShuffleToggle = null;
        this.onFilterChange = null;
        this.onFullscreenToggle = null;
        this.onStartImageTimer = null;
    }

    init() {
        this.setupMouseEvents();
        this.createFullscreenButton();
        this.setupFullscreenEvents();
    }

    createVolumeControl(mediaPlayer) {
        const volume = document.createElement("div");
        volume.className = "volume-control visible";
        const volumeIcon = document.createElement("span");
        volumeIcon.style.cursor = "pointer";
        volumeIcon.style.userSelect = "none";
        
        // Update volume icon based on mute state
        const updateVolumeIcon = () => {
            if (this.isMuted || this.globalVolume === 0) {
                volumeIcon.textContent = "🔇";
            } else if (this.globalVolume < 0.3) {
                volumeIcon.textContent = "🔈";
            } else if (this.globalVolume < 0.7) {
                volumeIcon.textContent = "🔉";
            } else {
                volumeIcon.textContent = "🔊";
            }
        };
        
        // Toggle mute/unmute on icon click
        volumeIcon.addEventListener("click", () => {
            if (this.isMuted) {
                // Unmute: restore previous volume
                this.isMuted = false;
                this.globalVolume = this.volumeBeforeMute;
                slider.value = this.globalVolume;
            } else {
                // Mute: save current volume and set to 0
                this.volumeBeforeMute = this.globalVolume;
                this.isMuted = true;
                this.globalVolume = 0;
                slider.value = 0;
            }
            
            // Apply volume change to media player
            if (mediaPlayer) {
                mediaPlayer.updateVolume(this.globalVolume);
                mediaPlayer.setMuted(this.isMuted);
            }
            
            if (this.onMuteToggle) {
                this.onMuteToggle(this.isMuted);
            }
            
            updateVolumeIcon();
        });
        
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = 0;
        slider.max = 1;
        slider.step = 0.05;
        slider.value = this.globalVolume;
        slider.addEventListener("input", () => {
            this.globalVolume = parseFloat(slider.value);
            
            // If user moves slider, unmute automatically
            if (this.globalVolume > 0 && this.isMuted) {
                this.isMuted = false;
            }
            
            // Update volume for media player
            if (mediaPlayer) {
                mediaPlayer.updateVolume(this.globalVolume);
                mediaPlayer.setMuted(this.isMuted);
            }
            
            if (this.onVolumeChange) {
                this.onVolumeChange(this.globalVolume);
            }
            
            updateVolumeIcon();
        });
        
        // Initialize icon
        updateVolumeIcon();
        
        volume.appendChild(volumeIcon);
        volume.appendChild(slider);
        
        return volume;
    }

    createTimerControls() {
        const timerControls = document.createElement("div");
        timerControls.className = "timer-controls visible";
        
        const timerLabel = document.createElement("span");
        timerLabel.textContent = "Auto-scroll: ";
        
        const timerInput = document.createElement("input");
        timerInput.type = "number";
        timerInput.min = 1;
        timerInput.max = 60;
        timerInput.value = this.timerDuration;
        timerInput.addEventListener("change", () => {
            this.timerDuration = parseInt(timerInput.value) || 5;
        });
        
        const timerUnit = document.createElement("span");
        timerUnit.textContent = "s";
        
        const toggleButton = document.createElement("button");
        toggleButton.textContent = this.autoScrollEnabled ? "ON" : "OFF";
        toggleButton.addEventListener("click", () => {
            this.autoScrollEnabled = !this.autoScrollEnabled;
            toggleButton.textContent = this.autoScrollEnabled ? "ON" : "OFF";
            
            if (this.onAutoScrollToggle) {
                this.onAutoScrollToggle(this.autoScrollEnabled);
            }
        });

        timerControls.appendChild(timerLabel);
        timerControls.appendChild(timerInput);
        timerControls.appendChild(timerUnit);
        timerControls.appendChild(toggleButton);
        
        // Shuffle controls
        const shuffleControls = this.createShuffleControls();
        timerControls.appendChild(shuffleControls);
        
        // Filter controls
        const filterControls = this.createFilterControls();
        timerControls.appendChild(filterControls);

        return timerControls;
    }

    createShuffleControls() {
        const shuffleControls = document.createElement("div");
        shuffleControls.className = "shuffle-controls";
        
        const shuffleButton = document.createElement("button");
        shuffleButton.className = "shuffle-button";
        shuffleButton.textContent = this.shuffleEnabled ? "🔀 ON" : "🔀 OFF";
        if (this.shuffleEnabled) shuffleButton.classList.add("active");
        shuffleButton.addEventListener("click", () => {
            this.shuffleEnabled = !this.shuffleEnabled;
            shuffleButton.textContent = this.shuffleEnabled ? "🔀 ON" : "🔀 OFF";
            shuffleButton.classList.toggle("active", this.shuffleEnabled);
            
            if (this.onShuffleToggle) {
                this.onShuffleToggle(this.shuffleEnabled);
            }
        });
        
        shuffleControls.appendChild(shuffleButton);
        return shuffleControls;
    }

    createFilterControls() {
        const filterControls = document.createElement("div");
        filterControls.className = "filter-controls";
        
        // Pictures checkbox
        const picturesLabel = document.createElement("label");
        const picturesCheckbox = document.createElement("input");
        picturesCheckbox.type = "checkbox";
        picturesCheckbox.checked = this.showPictures;
        picturesCheckbox.addEventListener("change", () => {
            this.showPictures = picturesCheckbox.checked;
            if (this.onFilterChange) {
                this.onFilterChange(this.showPictures, this.showVideos);
            }
        });
        picturesLabel.appendChild(picturesCheckbox);
        picturesLabel.appendChild(document.createTextNode("📷"));
        
        // Videos checkbox  
        const videosLabel = document.createElement("label");
        const videosCheckbox = document.createElement("input");
        videosCheckbox.type = "checkbox";
        videosCheckbox.checked = this.showVideos;
        videosCheckbox.addEventListener("change", () => {
            this.showVideos = videosCheckbox.checked;
            if (this.onFilterChange) {
                this.onFilterChange(this.showPictures, this.showVideos);
            }
        });
        videosLabel.appendChild(videosCheckbox);
        videosLabel.appendChild(document.createTextNode("🎥"));
        
        filterControls.appendChild(picturesLabel);
        filterControls.appendChild(videosLabel);
        
        return filterControls;
    }

    createFullscreenButton() {
        const fullscreenBtn = document.createElement('div');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = 'Enter Fullscreen (F11)';
        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        document.body.appendChild(fullscreenBtn);
        return fullscreenBtn;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            document.documentElement.requestFullscreen().then(() => {
                this.isFullscreen = true;
                this.updateFullscreenButton();
            }).catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            // Exit fullscreen
            document.exitFullscreen().then(() => {
                this.isFullscreen = false;
                this.updateFullscreenButton();
            }).catch(err => {
                console.log('Error attempting to exit fullscreen:', err);
            });
        }
        
        if (this.onFullscreenToggle) {
            this.onFullscreenToggle(this.isFullscreen);
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = this.isFullscreen ? '⛶' : '⛶';
            fullscreenBtn.title = this.isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)';
        }
    }

    setupFullscreenEvents() {
        // Listen for fullscreen changes (user can exit with browser controls)
        document.addEventListener("fullscreenchange", () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });
    }

    showControls() {
        this.controlsVisible = true;
        
        // Remove cursor hiding (cursor will be shown in UI areas, hidden over media)
        document.body.classList.remove("hide-cursor");
        
        // Always show folder picker on mouse movement
        const pickerWrapper = document.getElementById("pickerWrapper");
        if (pickerWrapper) {
            pickerWrapper.classList.remove("hidden");
        }
        
        // Show volume and timer controls
        const volumeControl = document.querySelector(".volume-control");
        const timerControls = document.querySelector(".timer-controls");
        const fullscreenBtn = document.querySelector(".fullscreen-btn");
        
        if (volumeControl) {
            volumeControl.classList.add("visible");
        }
        if (timerControls) {
            timerControls.classList.add("visible");
        }
        if (fullscreenBtn) {
            fullscreenBtn.classList.add("visible");
        }
        
        // Clear existing timer
        if (this.mouseHideTimer) {
            clearTimeout(this.mouseHideTimer);
        }
        
        // Set timer to hide controls after 3 seconds of no mouse movement
        this.mouseHideTimer = setTimeout(() => {
            this.hideControls();
        }, 3000);
    }

    hideControls() {
        if (!this.folderLoaded) return; // Keep controls visible if no folder loaded
        
        this.controlsVisible = false;
        
        // Hide cursor completely
        document.body.classList.add("hide-cursor");
        
        // Hide folder picker
        const pickerWrapper = document.getElementById("pickerWrapper");
        if (pickerWrapper) {
            pickerWrapper.classList.add("hidden");
        }
        
        // Hide volume and timer controls
        const volumeControl = document.querySelector(".volume-control");
        const timerControls = document.querySelector(".timer-controls");
        const fullscreenBtn = document.querySelector(".fullscreen-btn");
        
        if (volumeControl) {
            volumeControl.classList.remove("visible");
        }
        if (timerControls) {
            timerControls.classList.remove("visible");
        }
        if (fullscreenBtn) {
            fullscreenBtn.classList.remove("visible");
        }
    }

    setupMouseEvents() {
        // Mouse movement detection
        document.addEventListener("mousemove", () => {
            this.showControls();
        });

        // Also show controls on mouse enter for the control areas themselves
        document.addEventListener("mouseenter", (e) => {
            if (e.target.closest(".volume-control") || e.target.closest(".timer-controls")) {
                this.showControls();
            }
        });
    }

    setFolderLoaded(loaded) {
        this.folderLoaded = loaded;
        if (loaded) {
            // Initially hide controls after folder is loaded
            setTimeout(() => {
                this.hideControls();
            }, 1000); // Give user 1 second to see the controls initially
        }
    }

    // Getters for external access
    getGlobalVolume() {
        return this.globalVolume;
    }

    isMutedState() {
        return this.isMuted;
    }

    getAutoScrollEnabled() {
        return this.autoScrollEnabled;
    }

    getTimerDuration() {
        return this.timerDuration;
    }

    getShuffleEnabled() {
        return this.shuffleEnabled;
    }

    getShowPictures() {
        return this.showPictures;
    }

    getShowVideos() {
        return this.showVideos;
    }

    isControlsVisible() {
        return this.controlsVisible;
    }

    // Setters for external updates
    setAutoScrollEnabled(enabled) {
        this.autoScrollEnabled = enabled;
        const toggleButton = document.querySelector(".timer-controls button");
        if (toggleButton) {
            toggleButton.textContent = enabled ? "ON" : "OFF";
        }
    }

    updateShuffleButton() {
        const shuffleButton = document.querySelector(".shuffle-button");
        if (shuffleButton) {
            shuffleButton.textContent = this.shuffleEnabled ? "🔀 ON" : "🔀 OFF";
            shuffleButton.classList.toggle("active", this.shuffleEnabled);
        }
    }
}

// Export for use in other modules
window.Controls = Controls;