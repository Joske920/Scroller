# Scroller

A local media player that mimics TikTok/YouTube Shorts functionality for browsing through your pictures and videos. Perfect for creating a personalized short-form content experience with your own media files.

## Features

### 🎵 Media Support
- **Videos**: Full video playback with controls
- **Audio**: Audio playback with progress tracking
- **Images**: Image display with auto-scroll timer

### 🎮 Playback Controls
- **Video Controls**: Frame-by-frame navigation, 5-second skip forward/back
- **Audio/Video**: Play/pause, volume control, mute toggle, seeking
- **Progress Bars**: Visual progress tracking with click-to-seek

### 🔀 Navigation & Organization
- **Shuffle Mode**: Randomize playback order
- **Media Filters**: Toggle between pictures and videos
- **Keyboard Navigation**: Arrow keys for navigation, space for play/pause
- **Auto-scroll**: Configurable timer for automatic image progression

### 🎛️ User Interface
- **Fullscreen Support**: F11 to toggle fullscreen mode
- **Auto-hide Controls**: UI disappears during playback, returns on mouse movement
- **Drag & Drop Controls**: Moveable video control panel
- **Volume Control**: Master volume with mute functionality

## File Structure

The application is built with a modular architecture for maintainability and scalability:

```
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles
├── app.js              # Main application coordinator
├── mediaPlayer.js      # Video/audio/image display logic
├── controls.js         # UI controls (volume, timer, filters)
├── navigation.js       # Navigation, shuffle, and keyboard handling
└── README.md           # This file
```

### Module Responsibilities

- **`app.js`**: Main application class that coordinates all modules
- **`mediaPlayer.js`**: Handles media rendering, video controls, and playback
- **`controls.js`**: Manages volume, auto-scroll timer, shuffle, filters, and fullscreen
- **`navigation.js`**: Handles keyboard shortcuts, item navigation, and shuffle logic

## Usage

### Getting Started
1. Open `index.html` in a modern web browser
2. Click "📂 Pick media folder" to select a directory containing your media files
3. Use keyboard or mouse to navigate through your content

### Keyboard Shortcuts
- **↑/↓ Arrow Keys**: Navigate between media files
- **←/→ Arrow Keys**: Skip 5 seconds backward/forward (video/audio only)
- **Space**: Play/pause (video/audio only)
- **F11**: Toggle fullscreen mode
- **Escape**: Exit fullscreen mode

### Controls Overview
- **Volume Control**: Right side - volume slider with mute button
- **Timer Controls**: Left side - auto-scroll settings for images
- **Shuffle Toggle**: Randomize playback order
- **Media Filters**: Show/hide pictures (📷) and videos (🎥)
- **Fullscreen Button**: Top right corner

### Video-Specific Features
- **Frame Control**: Navigate frame-by-frame when video is paused
- **Time Display**: Current time and frame information
- **Draggable Controls**: Move the control panel by dragging the background
- **Auto-hide**: Controls appear when paused, hide after 5 seconds of inactivity

## Technical Details

### Browser Compatibility
- Requires a modern browser with support for:
  - ES6 Classes
  - File API with directory selection
  - HTML5 video/audio elements
  - CSS Grid and Flexbox

### Supported Media Formats
- **Video**: MP4, WebM, OGV, and other browser-supported formats
- **Audio**: MP3, WAV, OGG, and other browser-supported formats  
- **Images**: JPEG, PNG, GIF, WebP, and other browser-supported formats

### Development

To run locally:
```bash
# Start a simple HTTP server (required for file access)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

## Architecture Benefits

The modular design provides:
- **Separation of Concerns**: Each module has a specific responsibility
- **Maintainability**: Easy to locate and modify features
- **Extensibility**: New features can be added without affecting existing code
- **Debugging**: Issues can be traced to specific modules
- **Reusability**: Modules can be used independently or extended

## License

This project is open source. Feel free to use, modify, and distribute as needed.
