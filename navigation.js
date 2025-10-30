// Navigation module - handles shuffle, filtering, keyboard controls, and item navigation
class Navigation {
    constructor() {
        this.items = [];
        this.currentIndex = 0;
        this.originalItems = [];
        this.shuffledQueue = [];
        this.currentQueueIndex = 0;
        this.autoScrollTimer = null;
        
        // Callbacks for external actions
        this.onShowItem = null;
        this.onStartImageTimer = null;
    }

    init() {
        this.setupKeyboardEvents();
    }

    loadFiles(files) {
        this.originalItems = files.sort((a, b) => a.name.localeCompare(b.name));
        this.currentIndex = 0;
        return this.originalItems;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    createShuffledQueue(filteredItems) {
        // Create a new shuffled queue from filtered items
        this.shuffledQueue = this.shuffleArray([...filteredItems]);
        this.currentQueueIndex = 0;
    }

    getNextShuffledItem() {
        // If we've reached the end of the queue, create a new shuffled queue
        if (this.currentQueueIndex >= this.shuffledQueue.length) {
            // Filter items again in case filters changed
            let filteredItems = this.originalItems.filter(item => {
                if (item.type.startsWith("image") && !this.showPictures) return false;
                if (item.type.startsWith("video") && !this.showVideos) return false;
                return true;
            });
            
            if (filteredItems.length === 0) return null;
            
            this.createShuffledQueue(filteredItems);
        }
        
        return this.shuffledQueue[this.currentQueueIndex];
    }

    applyFilters(showPictures, showVideos, shuffleEnabled) {
        const currentItem = this.items[this.currentIndex];
        
        // Filter items based on checkboxes
        let filteredItems = this.originalItems.filter(item => {
            if (item.type.startsWith("image") && !showPictures) return false;
            if (item.type.startsWith("video") && !showVideos) return false;
            return true;
        });
        
        if (shuffleEnabled) {
            // Create or recreate shuffled queue
            this.createShuffledQueue(filteredItems);
            
            // Try to find current item in the new queue and set queue index
            const currentItemIndex = this.shuffledQueue.findIndex(item => item === currentItem);
            if (currentItemIndex !== -1) {
                this.currentQueueIndex = currentItemIndex;
            } else {
                this.currentQueueIndex = 0;
            }
            
            this.items = [...this.shuffledQueue]; // Use the full shuffled queue as items
            this.currentIndex = this.currentQueueIndex;
        } else {
            // Normal mode - no shuffle
            this.items = filteredItems;
            this.shuffledQueue = []; // Clear queue when not shuffling
            this.currentQueueIndex = 0;
            
            // Find current item in filtered list or go to first item
            let newIndex = this.items.findIndex(item => item === currentItem);
            if (newIndex === -1) {
                newIndex = 0;
            }
            this.currentIndex = newIndex;
        }
        
        return {
            items: this.items,
            currentIndex: this.currentIndex,
            hasItems: this.items.length > 0
        };
    }

    getNextValidIndex(direction, shuffleEnabled, showPictures, showVideos) {
        if (this.items.length === 0) return -1;
        
        if (shuffleEnabled) {
            // In shuffle mode, move through the queue
            this.currentQueueIndex += direction;
            
            // Handle wrapping and queue regeneration
            if (this.currentQueueIndex >= this.shuffledQueue.length) {
                // Reached end of queue, create new shuffled queue
                let filteredItems = this.originalItems.filter(item => {
                    if (item.type.startsWith("image") && !showPictures) return false;
                    if (item.type.startsWith("video") && !showVideos) return false;
                    return true;
                });
                
                if (filteredItems.length === 0) return -1;
                
                this.createShuffledQueue(filteredItems);
                this.items = [...this.shuffledQueue];
                this.currentIndex = 0;
                return 0;
            } else if (this.currentQueueIndex < 0) {
                // Going backwards from start, go to end of current queue
                this.currentQueueIndex = this.shuffledQueue.length - 1;
                this.currentIndex = this.currentQueueIndex;
                return this.currentIndex;
            }
            
            this.currentIndex = this.currentQueueIndex;
            return this.currentIndex;
        } else {
            // Normal mode navigation
            let newIndex = this.currentIndex + direction;
            
            // Handle wrapping
            if (newIndex >= this.items.length) {
                newIndex = 0;
            } else if (newIndex < 0) {
                newIndex = this.items.length - 1;
            }
            
            return newIndex;
        }
    }

    startImageTimer(timerDuration, showPictures, showVideos, shuffleEnabled) {
        if (this.autoScrollTimer) {
            clearTimeout(this.autoScrollTimer);
        }
        this.autoScrollTimer = setTimeout(() => {
            const nextIndex = this.getNextValidIndex(1, shuffleEnabled, showPictures, showVideos);
            if (nextIndex !== -1 && this.onShowItem) {
                this.onShowItem(nextIndex);
            }
        }, timerDuration * 1000);
    }

    clearTimer() {
        if (this.autoScrollTimer) {
            clearTimeout(this.autoScrollTimer);
            this.autoScrollTimer = null;
        }
    }

    setupKeyboardEvents() {
        document.addEventListener("keydown", (e) => {
            // Prevent default keyboard navigation if we handle the key
            if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", " ", "F11", "Escape"].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === "ArrowDown") {
                if (this.onNavigate) {
                    this.onNavigate(1); // Move forward
                }
            } else if (e.key === "ArrowUp") {
                if (this.onNavigate) {
                    this.onNavigate(-1); // Move backward
                }
            } else if (e.key === "ArrowLeft") { // Left arrow: skip back 5 seconds
                if (this.onSeek) {
                    this.onSeek(-5);
                }
            } else if (e.key === "ArrowRight") { // Right arrow: skip forward 5 seconds
                if (this.onSeek) {
                    this.onSeek(5);
                }
            } else if (e.key === " ") { // Space toggles play/pause
                if (this.onPlayPause) {
                    this.onPlayPause();
                }
            } else if (e.key === "F11") { // F11 toggles fullscreen
                if (this.onFullscreen) {
                    this.onFullscreen();
                }
            } else if (e.key === "Escape") { // Escape exits fullscreen
                if (this.onEscapeFullscreen) {
                    this.onEscapeFullscreen();
                }
            }
        });
    }

    // Getters
    getCurrentIndex() {
        return this.currentIndex;
    }

    getCurrentItem() {
        return this.items[this.currentIndex];
    }

    getItems() {
        return this.items;
    }

    getOriginalItems() {
        return this.originalItems;
    }

    hasTimer() {
        return this.autoScrollTimer !== null;
    }

    // Setters
    setCurrentIndex(index) {
        this.currentIndex = index;
    }

    setItems(items) {
        this.items = items;
    }

    // Callback setters for external event handling  
    setOnNavigate(callback) {
        this.onNavigate = callback;
    }

    setOnSeek(callback) {
        this.onSeek = callback;
    }

    setOnPlayPause(callback) {
        this.onPlayPause = callback;
    }

    setOnFullscreen(callback) {
        this.onFullscreen = callback;
    }

    setOnEscapeFullscreen(callback) {
        this.onEscapeFullscreen = callback;
    }

    setOnShowItem(callback) {
        this.onShowItem = callback;
    }
}

// Export for use in other modules
window.Navigation = Navigation;