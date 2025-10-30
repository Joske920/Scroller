const container = document.getElementById("container");
const picker = document.getElementById("folderPicker");
const pickerWrapper = document.getElementById("pickerWrapper");
let items = [];
let currentIndex = 0;
let currentMedia = null;
let globalVolume = 0.1; // start volume at 10%
let autoScrollEnabled = false;
let autoScrollTimer = null;
let timerDuration = 5; // default 5 seconds
let folderLoaded = false;
let mouseHideTimer = null;
let controlsVisible = false;
let shuffleEnabled = false;
let originalItems = []; // Keep track of original order
let isMuted = false;
let volumeBeforeMute = 0.1;
let showPictures = true;
let showVideos = true;
let videoControlsTimer = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let shuffledQueue = []; // Queue of items in shuffled order
let currentQueueIndex = 0; // Current position in the shuffled queue
let isFullscreen = false;

function showItem(index) {
    if (index < 0 || index >= items.length) return;

    container.innerHTML = ""; // clear
    currentIndex = index;
    const file = items[index];
    const item = document.createElement("div");
    item.className = "item";

    let progressBar, progressWrapper;

    if (file.type.startsWith("video")) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.controls = false;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = false;
    video.volume = globalVolume;

    // toggle pause/play on click
    video.addEventListener("click", () => {
        if (video.paused) video.play(); else video.pause();
    });

    // progress bar
    progressWrapper = document.createElement("div");
    progressWrapper.className = "progress";
    progressBar = document.createElement("div");
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

    // Video control buttons (shown when paused)
    const videoControls = document.createElement("div");
    videoControls.className = "video-controls";
    
    // Back 5 seconds
    const back5sBtn = document.createElement("div");
    back5sBtn.className = "video-control-btn large";
    back5sBtn.innerHTML = "⏪";
    back5sBtn.title = "Back 5 seconds";
    back5sBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - 5);
    });
    
    // Back 10 frames (assuming 30fps = ~0.33s)
    const back10framesBtn = document.createElement("div");
    back10framesBtn.className = "video-control-btn";
    back10framesBtn.innerHTML = "⏮";
    back10framesBtn.title = "Back 10 frames";
    back10framesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - (10 / 30));
    });
    
    // Back 1 frame
    const back1frameBtn = document.createElement("div");
    back1frameBtn.className = "video-control-btn";
    back1frameBtn.innerHTML = "⏴";
    back1frameBtn.title = "Back 1 frame";
    back1frameBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.currentTime = Math.max(0, video.currentTime - (1 / 30));
    });
    
    // Forward 1 frame
    const forward1frameBtn = document.createElement("div");
    forward1frameBtn.className = "video-control-btn";
    forward1frameBtn.innerHTML = "⏵";
    forward1frameBtn.title = "Forward 1 frame";
    forward1frameBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.currentTime = Math.min(video.duration, video.currentTime + (1 / 30));
    });
    
    // Forward 10 frames
    const forward10framesBtn = document.createElement("div");
    forward10framesBtn.className = "video-control-btn";
    forward10framesBtn.innerHTML = "⏭";
    forward10framesBtn.title = "Forward 10 frames";
    forward10framesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.currentTime = Math.min(video.duration, video.currentTime + (10 / 30));
    });
    
    // Forward 5 seconds
    const forward5sBtn = document.createElement("div");
    forward5sBtn.className = "video-control-btn large";
    forward5sBtn.innerHTML = "⏩";
    forward5sBtn.title = "Forward 5 seconds";
    forward5sBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
    });
    
    // Video info display (timestamp and frame)
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
    
    // Function to format time as MM:SS or HH:MM:SS
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "00:00";
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    };
    
    // Function to update video info display
    const updateVideoInfo = () => {
        const currentTime = video.currentTime || 0;
        const duration = video.duration || 0;
        const fps = 30; // Assume 30 fps, could be made dynamic if needed
        
        const currentFrame = Math.floor(currentTime * fps);
        const totalFrames = Math.floor(duration * fps);
        
        timestampDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        frameDisplay.textContent = `Frame: ${currentFrame} / ${totalFrames}`;
    };
    
    // Update info on timeupdate
    video.addEventListener("timeupdate", updateVideoInfo);
    video.addEventListener("loadedmetadata", updateVideoInfo);
    video.addEventListener("seeked", updateVideoInfo);

    videoControls.appendChild(back5sBtn);
    videoControls.appendChild(back10framesBtn);
    videoControls.appendChild(back1frameBtn);
    videoControls.appendChild(forward1frameBtn);
    videoControls.appendChild(forward10framesBtn);
    videoControls.appendChild(forward5sBtn);
    videoControls.appendChild(videoInfo);
    
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
        if (videoControlsTimer) {
            clearTimeout(videoControlsTimer);
        }
        
        // Set timer to hide controls after 5 seconds if video is still paused
        videoControlsTimer = setTimeout(() => {
            if (video.paused) {
                videoControls.classList.remove("visible");
            }
        }, 5000);
    };
    
    const hideVideoControls = () => {
        videoControls.classList.remove("visible");
        if (videoControlsTimer) {
            clearTimeout(videoControlsTimer);
            videoControlsTimer = null;
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
    
    // Reset timer on mouse movement over video controls
    videoControls.addEventListener("mouseenter", resetControlsTimer);
    videoControls.addEventListener("mousemove", resetControlsTimer);
    
    // Add mouse movement listener to the video element and item container
    video.addEventListener("mousemove", showControlsOnMouseMove);
    item.addEventListener("mousemove", showControlsOnMouseMove);
    
    // Reset timer when any control button is clicked
    [back5sBtn, back10framesBtn, back1frameBtn, forward1frameBtn, forward10framesBtn, forward5sBtn].forEach(btn => {
        btn.addEventListener("click", (e) => {
            // The original click handler is already added above, this just resets timer
            resetControlsTimer();
        });
    });
    
    // Make video controls draggable
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
    
    video.addEventListener("play", toggleVideoControls);
    video.addEventListener("pause", toggleVideoControls);
    
    // Initial state check
    setTimeout(toggleVideoControls, 100);

    item.appendChild(video);
    item.appendChild(progressWrapper);
    item.appendChild(videoControls);
    currentMedia = video;

    } else if (file.type.startsWith("audio")) {
    const title = document.createElement("div");
    title.textContent = file.name;
    title.style.marginBottom = "10px";

    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(file);
    audio.controls = false;
    audio.autoplay = true;
    audio.volume = globalVolume;

    // toggle pause/play on click (title)
    title.addEventListener("click", () => {
        if (audio.paused) audio.play(); else audio.pause();
    });

    // progress bar
    progressWrapper = document.createElement("div");
    progressWrapper.className = "progress";
    progressBar = document.createElement("div");
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
    currentMedia = audio;

    } else if (file.type.startsWith("image")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    item.appendChild(img);
    currentMedia = null;
    }

    // volume control (shared across all media)
    const volume = document.createElement("div");
    volume.className = "volume-control visible";
    const volumeIcon = document.createElement("span");
    volumeIcon.style.cursor = "pointer";
    volumeIcon.style.userSelect = "none";
    
    // Update volume icon based on mute state
    function updateVolumeIcon() {
        if (isMuted || globalVolume === 0) {
            volumeIcon.textContent = "🔇";
        } else if (globalVolume < 0.3) {
            volumeIcon.textContent = "🔈";
        } else if (globalVolume < 0.7) {
            volumeIcon.textContent = "🔉";
        } else {
            volumeIcon.textContent = "🔊";
        }
    }
    
    // Toggle mute/unmute on icon click
    volumeIcon.addEventListener("click", () => {
        if (isMuted) {
            // Unmute: restore previous volume
            isMuted = false;
            globalVolume = volumeBeforeMute;
            slider.value = globalVolume;
        } else {
            // Mute: save current volume and set to 0
            volumeBeforeMute = globalVolume;
            isMuted = true;
            globalVolume = 0;
            slider.value = 0;
        }
        
        // Apply volume change to current media
        if (currentMedia && (currentMedia.tagName === "VIDEO" || currentMedia.tagName === "AUDIO")) {
            currentMedia.volume = globalVolume;
        }
        
        updateVolumeIcon();
    });
    
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.05;
    slider.value = globalVolume;
    slider.addEventListener("input", () => {
        globalVolume = parseFloat(slider.value);
        
        // If user moves slider, unmute automatically
        if (globalVolume > 0 && isMuted) {
            isMuted = false;
        }
        
        // Update volume for current media
        if (currentMedia && (currentMedia.tagName === "VIDEO" || currentMedia.tagName === "AUDIO")) {
            currentMedia.volume = globalVolume;
        }
        
        updateVolumeIcon();
    });
    
    // Initialize icon
    updateVolumeIcon();
    
    volume.appendChild(volumeIcon);
    volume.appendChild(slider);

    // timer controls (for images)
    const timerControls = document.createElement("div");
    timerControls.className = "timer-controls visible";
    
    const timerLabel = document.createElement("span");
    timerLabel.textContent = "Auto-scroll: ";
    
    const timerInput = document.createElement("input");
    timerInput.type = "number";
    timerInput.min = 1;
    timerInput.max = 60;
    timerInput.value = timerDuration;
    timerInput.addEventListener("change", () => {
        timerDuration = parseInt(timerInput.value) || 5;
    });
    
    const timerUnit = document.createElement("span");
    timerUnit.textContent = "s";
    
    const toggleButton = document.createElement("button");
    toggleButton.textContent = autoScrollEnabled ? "ON" : "OFF";
    toggleButton.addEventListener("click", () => {
        autoScrollEnabled = !autoScrollEnabled;
        toggleButton.textContent = autoScrollEnabled ? "ON" : "OFF";
        if (!autoScrollEnabled && autoScrollTimer) {
            clearTimeout(autoScrollTimer);
            autoScrollTimer = null;
        } else if (autoScrollEnabled && file.type.startsWith("image")) {
            startImageTimer();
        }
    });

    timerControls.appendChild(timerLabel);
    timerControls.appendChild(timerInput);
    timerControls.appendChild(timerUnit);
    timerControls.appendChild(toggleButton);
    
    // Shuffle controls
    const shuffleControls = document.createElement("div");
    shuffleControls.className = "shuffle-controls";
    
    const shuffleButton = document.createElement("button");
    shuffleButton.className = "shuffle-button";
    shuffleButton.textContent = shuffleEnabled ? "🔀 ON" : "🔀 OFF";
    if (shuffleEnabled) shuffleButton.classList.add("active");
    shuffleButton.addEventListener("click", toggleShuffle);
    
    shuffleControls.appendChild(shuffleButton);
    timerControls.appendChild(shuffleControls);
    
    // Filter controls
    const filterControls = document.createElement("div");
    filterControls.className = "filter-controls";
    
    // Pictures checkbox
    const picturesLabel = document.createElement("label");
    const picturesCheckbox = document.createElement("input");
    picturesCheckbox.type = "checkbox";
    picturesCheckbox.checked = showPictures;
    picturesCheckbox.addEventListener("change", () => {
        showPictures = picturesCheckbox.checked;
        applyFilters();
    });
    picturesLabel.appendChild(picturesCheckbox);
    picturesLabel.appendChild(document.createTextNode("📷"));
    
    // Videos checkbox  
    const videosLabel = document.createElement("label");
    const videosCheckbox = document.createElement("input");
    videosCheckbox.type = "checkbox";
    videosCheckbox.checked = showVideos;
    videosCheckbox.addEventListener("change", () => {
        showVideos = videosCheckbox.checked;
        applyFilters();
    });
    videosLabel.appendChild(videosCheckbox);
    videosLabel.appendChild(document.createTextNode("🎥"));
    
    filterControls.appendChild(picturesLabel);
    filterControls.appendChild(videosLabel);
    timerControls.appendChild(filterControls);

    container.appendChild(item);
    container.appendChild(volume);
    container.appendChild(timerControls);

    // Clear any existing timer
    if (autoScrollTimer) {
        clearTimeout(autoScrollTimer);
        autoScrollTimer = null;
    }

    // Start auto-scroll timer for images or add video end listener
    if (file.type.startsWith("image") && autoScrollEnabled) {
        startImageTimer();
    } else if (file.type.startsWith("video")) {
        currentMedia.addEventListener("ended", () => {
            const nextIndex = getNextValidIndex(1);
            if (nextIndex !== -1) showItem(nextIndex);
        });
    } else if (file.type.startsWith("audio")) {
        currentMedia.addEventListener("ended", () => {
            const nextIndex = getNextValidIndex(1);
            if (nextIndex !== -1) showItem(nextIndex);
        });
    }
}

function startImageTimer() {
    if (autoScrollTimer) {
        clearTimeout(autoScrollTimer);
    }
    autoScrollTimer = setTimeout(() => {
        const nextIndex = getNextValidIndex(1);
        if (nextIndex !== -1) showItem(nextIndex);
    }, timerDuration * 1000);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function toggleShuffle() {
    shuffleEnabled = !shuffleEnabled;
    
    // Apply filters which will also handle shuffle
    applyFilters();
    
    // Update shuffle button appearance
    const shuffleButton = document.querySelector(".shuffle-button");
    if (shuffleButton) {
        shuffleButton.textContent = shuffleEnabled ? "🔀 ON" : "🔀 OFF";
        shuffleButton.classList.toggle("active", shuffleEnabled);
    }
}

function createShuffledQueue(filteredItems) {
    // Create a new shuffled queue from filtered items
    shuffledQueue = shuffleArray([...filteredItems]);
    currentQueueIndex = 0;
}

function getNextShuffledItem() {
    // If we've reached the end of the queue, create a new shuffled queue
    if (currentQueueIndex >= shuffledQueue.length) {
        // Filter items again in case filters changed
        let filteredItems = originalItems.filter(item => {
            if (item.type.startsWith("image") && !showPictures) return false;
            if (item.type.startsWith("video") && !showVideos) return false;
            return true;
        });
        
        if (filteredItems.length === 0) return null;
        
        createShuffledQueue(filteredItems);
    }
    
    return shuffledQueue[currentQueueIndex];
}

function applyFilters() {
    const currentItem = items[currentIndex];
    
    // Filter items based on checkboxes
    let filteredItems = originalItems.filter(item => {
        if (item.type.startsWith("image") && !showPictures) return false;
        if (item.type.startsWith("video") && !showVideos) return false;
        return true;
    });
    
    if (shuffleEnabled) {
        // Create or recreate shuffled queue
        createShuffledQueue(filteredItems);
        
        // Try to find current item in the new queue and set queue index
        const currentItemIndex = shuffledQueue.findIndex(item => item === currentItem);
        if (currentItemIndex !== -1) {
            currentQueueIndex = currentItemIndex;
        } else {
            currentQueueIndex = 0;
        }
        
        items = [...shuffledQueue]; // Use the full shuffled queue as items
        currentIndex = currentQueueIndex;
    } else {
        // Normal mode - no shuffle
        items = filteredItems;
        shuffledQueue = []; // Clear queue when not shuffling
        currentQueueIndex = 0;
        
        // Find current item in filtered list or go to first item
        let newIndex = items.findIndex(item => item === currentItem);
        if (newIndex === -1) {
            newIndex = 0;
        }
        currentIndex = newIndex;
    }
    
    // Show new current item if we have any items left
    if (items.length > 0) {
        showItem(currentIndex);
    } else {
        // No items match the filter - show message but keep controls
        container.innerHTML = "";
        
        const noItemsMessage = document.createElement("div");
        noItemsMessage.style.display = "flex";
        noItemsMessage.style.alignItems = "center";
        noItemsMessage.style.justifyContent = "center";
        noItemsMessage.style.height = "100vh";
        noItemsMessage.style.fontSize = "24px";
        noItemsMessage.style.color = "white";
        noItemsMessage.textContent = "No items match the current filter";
        
        // Create empty controls to maintain UI structure
        const volume = document.createElement("div");
        volume.className = "volume-control visible";
        const volumeIcon = document.createElement("span");
        volumeIcon.style.cursor = "pointer";
        volumeIcon.style.userSelect = "none";
        volumeIcon.textContent = isMuted || globalVolume === 0 ? "🔇" : 
                                globalVolume < 0.3 ? "🔈" : 
                                globalVolume < 0.7 ? "🔉" : "🔊";
        
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = 0;
        slider.max = 1;
        slider.step = 0.05;
        slider.value = globalVolume;
        // Add basic volume functionality even when no media
        slider.addEventListener("input", () => {
            globalVolume = parseFloat(slider.value);
            if (globalVolume > 0 && isMuted) {
                isMuted = false;
            }
            volumeIcon.textContent = isMuted || globalVolume === 0 ? "🔇" : 
                                    globalVolume < 0.3 ? "🔈" : 
                                    globalVolume < 0.7 ? "🔉" : "🔊";
        });
        
        volume.appendChild(volumeIcon);
        volume.appendChild(slider);
        
        // Recreate timer controls with working checkboxes
        const timerControls = document.createElement("div");
        timerControls.className = "timer-controls visible";
        
        const timerLabel = document.createElement("span");
        timerLabel.textContent = "Auto-scroll: ";
        
        const timerInput = document.createElement("input");
        timerInput.type = "number";
        timerInput.min = 1;
        timerInput.max = 60;
        timerInput.value = timerDuration;
        timerInput.addEventListener("change", () => {
            timerDuration = parseInt(timerInput.value) || 5;
        });
        
        const timerUnit = document.createElement("span");
        timerUnit.textContent = "s";
        
        const toggleButton = document.createElement("button");
        toggleButton.textContent = autoScrollEnabled ? "ON" : "OFF";
        toggleButton.addEventListener("click", () => {
            autoScrollEnabled = !autoScrollEnabled;
            toggleButton.textContent = autoScrollEnabled ? "ON" : "OFF";
        });
        
        // Shuffle controls
        const shuffleControls = document.createElement("div");
        shuffleControls.className = "shuffle-controls";
        
        const shuffleButton = document.createElement("button");
        shuffleButton.className = "shuffle-button";
        shuffleButton.textContent = shuffleEnabled ? "🔀 ON" : "🔀 OFF";
        if (shuffleEnabled) shuffleButton.classList.add("active");
        shuffleButton.addEventListener("click", () => {
            shuffleEnabled = !shuffleEnabled;
            shuffleButton.textContent = shuffleEnabled ? "🔀 ON" : "🔀 OFF";
            shuffleButton.classList.toggle("active", shuffleEnabled);
            applyFilters(); // Reapply filters when shuffle changes
        });
        
        // Filter controls with working checkboxes
        const filterControls = document.createElement("div");
        filterControls.className = "filter-controls";
        
        const picturesLabel = document.createElement("label");
        const picturesCheckbox = document.createElement("input");
        picturesCheckbox.type = "checkbox";
        picturesCheckbox.checked = showPictures;
        picturesCheckbox.addEventListener("change", () => {
            showPictures = picturesCheckbox.checked;
            applyFilters();  // This will try to show content again
        });
        picturesLabel.appendChild(picturesCheckbox);
        picturesLabel.appendChild(document.createTextNode("📷"));
        
        const videosLabel = document.createElement("label");
        const videosCheckbox = document.createElement("input");
        videosCheckbox.type = "checkbox";
        videosCheckbox.checked = showVideos;
        videosCheckbox.addEventListener("change", () => {
            showVideos = videosCheckbox.checked;
            applyFilters();  // This will try to show content again
        });
        videosLabel.appendChild(videosCheckbox);
        videosLabel.appendChild(document.createTextNode("🎥"));
        
        timerControls.appendChild(timerLabel);
        timerControls.appendChild(timerInput);
        timerControls.appendChild(timerUnit);
        timerControls.appendChild(toggleButton);
        
        shuffleControls.appendChild(shuffleButton);
        timerControls.appendChild(shuffleControls);
        
        filterControls.appendChild(picturesLabel);
        filterControls.appendChild(videosLabel);
        timerControls.appendChild(filterControls);
        
        container.appendChild(noItemsMessage);
        container.appendChild(volume);
        container.appendChild(timerControls);
    }
}

function getNextValidIndex(direction) {
    if (items.length === 0) return -1;
    
    if (shuffleEnabled) {
        // In shuffle mode, move through the queue
        currentQueueIndex += direction;
        
        // Handle wrapping and queue regeneration
        if (currentQueueIndex >= shuffledQueue.length) {
            // Reached end of queue, create new shuffled queue
            let filteredItems = originalItems.filter(item => {
                if (item.type.startsWith("image") && !showPictures) return false;
                if (item.type.startsWith("video") && !showVideos) return false;
                return true;
            });
            
            if (filteredItems.length === 0) return -1;
            
            createShuffledQueue(filteredItems);
            items = [...shuffledQueue];
            currentIndex = 0;
            return 0;
        } else if (currentQueueIndex < 0) {
            // Going backwards from start, go to end of current queue
            currentQueueIndex = shuffledQueue.length - 1;
            currentIndex = currentQueueIndex;
            return currentIndex;
        }
        
        currentIndex = currentQueueIndex;
        return currentIndex;
    } else {
        // Normal mode navigation
        let newIndex = currentIndex + direction;
        
        // Handle wrapping
        if (newIndex >= items.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = items.length - 1;
        }
        
        return newIndex;
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen().then(() => {
            isFullscreen = true;
            updateFullscreenButton();
        }).catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        // Exit fullscreen
        document.exitFullscreen().then(() => {
            isFullscreen = false;
            updateFullscreenButton();
        }).catch(err => {
            console.log('Error attempting to exit fullscreen:', err);
        });
    }
}

function updateFullscreenButton() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.innerHTML = isFullscreen ? '⛶' : '⛶';
        fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)';
    }
}

function createFullscreenButton() {
    const fullscreenBtn = document.createElement('div');
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.title = 'Enter Fullscreen (F11)';
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    document.body.appendChild(fullscreenBtn);
    return fullscreenBtn;
}



function showControls() {
    controlsVisible = true;
    
    // Remove cursor hiding (cursor will be shown in UI areas, hidden over media)
    document.body.classList.remove("hide-cursor");
    
    // Always show folder picker on mouse movement
    pickerWrapper.classList.remove("hidden");
    
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
    if (mouseHideTimer) {
        clearTimeout(mouseHideTimer);
    }
    
    // Set timer to hide controls after 3 seconds of no mouse movement
    mouseHideTimer = setTimeout(() => {
        hideControls();
    }, 3000);
}

function hideControls() {
    if (!folderLoaded) return; // Keep controls visible if no folder loaded
    
    controlsVisible = false;
    
    // Hide cursor completely
    document.body.classList.add("hide-cursor");
    
    // Hide folder picker
    pickerWrapper.classList.add("hidden");
    
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

// Mouse movement detection
document.addEventListener("mousemove", () => {
    showControls();
});

// Also show controls on mouse enter for the control areas themselves
document.addEventListener("mouseenter", (e) => {
    if (e.target.closest(".volume-control") || e.target.closest(".timer-controls")) {
        showControls();
    }
});

picker.addEventListener("change", () => {
    const files = Array.from(picker.files);
    originalItems = files.sort((a, b) => a.name.localeCompare(b.name));
    
    currentIndex = 0;
    folderLoaded = true;
    
    // Apply filters and shuffle
    applyFilters();
    
    // Initially hide controls after folder is loaded
    setTimeout(() => {
        hideControls();
    }, 1000); // Give user 1 second to see the controls initially
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
        const nextIndex = getNextValidIndex(1);
        if (nextIndex !== -1) showItem(nextIndex);
    } else if (e.key === "ArrowUp") {
        const prevIndex = getNextValidIndex(-1);
        if (prevIndex !== -1) showItem(prevIndex);
    } else if (e.key === "ArrowLeft") { // Left arrow: skip back 5 seconds
        if (currentMedia && (currentMedia.tagName === "VIDEO" || currentMedia.tagName === "AUDIO")) {
            e.preventDefault();
            currentMedia.currentTime = Math.max(0, currentMedia.currentTime - 5);
        }
    } else if (e.key === "ArrowRight") { // Right arrow: skip forward 5 seconds
        if (currentMedia && (currentMedia.tagName === "VIDEO" || currentMedia.tagName === "AUDIO")) {
            e.preventDefault();
            currentMedia.currentTime = Math.min(currentMedia.duration, currentMedia.currentTime + 5);
        }
    } else if (e.key === " ") { // Space toggles play/pause
        if (currentMedia && (currentMedia.tagName === "VIDEO" || currentMedia.tagName === "AUDIO")) {
            e.preventDefault();
            if (currentMedia.paused) currentMedia.play(); else currentMedia.pause();
        }
    } else if (e.key === "F11") { // F11 toggles fullscreen
        e.preventDefault();
        toggleFullscreen();
    } else if (e.key === "Escape" && isFullscreen) { // Escape exits fullscreen
        e.preventDefault();
        toggleFullscreen();
    }
});

// Listen for fullscreen changes (user can exit with browser controls)
document.addEventListener("fullscreenchange", () => {
    isFullscreen = !!document.fullscreenElement;
    updateFullscreenButton();
});

// Create buttons on page load
document.addEventListener("DOMContentLoaded", () => {
    createFullscreenButton();
});