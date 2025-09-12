// Audio system state
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let audioInitialized = false;
let audioEnabled = false;
let audioLoaded = false;
let userInteracted = false;
let notificationShown = false;

// Use both an external file (more reliable) and a base64 fallback
const AUDIO_URL = (process.env.NODE_ENV === 'production' ? '/kali-o-kobita' : '') + '/sounds/page-turn.mp3'; // Add this file to your public directory
const AUDIO_DATA = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAASAAAJhwBJSUlJSUlJSUlJbW1tbW1tbW1tbW2JiYmJiYmJiYmJicXFxcXFxcXFxcXF4uLi4uLi4uLi4uLi//////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAZtAAAAAAAACYflGyTKAAAAAAD/+9DEAAAInINXtBGAJQ9Qaq8CMBEATUDSmZiCm3y4EdKfhjHxj6GQA1H0xHgcuL/5c5znOc9CHA4sQEJw/8uIGH4H4Pj4+X8vbggIPggAAAAABAMAYDAcD/KAgIHw/D4IAAAAAIBAIKqqqqqgJ36jzGTTqbMx+lVTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxKGAKhoLXbmMAAVDQOs3MYAAAAANIAAAAAA';

// Debug logging with timestamps
function debugLog(message: string, ...args: any[]): void {
  const timestamp = new Date().toISOString().substr(11, 12);
  console.log(`[${timestamp}] ${message}`, ...args);
}

// Create and initialize the Web Audio API context
function createAudioContext(): void {
  if (typeof window === 'undefined') return;

  try {
    // Create audio context with fallbacks for different browsers
    const AudioContextClass = window.AudioContext || 
                             (window as any).webkitAudioContext || 
                             (window as any).mozAudioContext;

    if (!AudioContextClass) {
      debugLog('Web Audio API not supported in this browser');
      return;
    }

    audioContext = new AudioContextClass();
    debugLog('Audio context created:', audioContext.state);

    // Attempt to resume the context immediately
    if (audioContext.state === 'suspended') {
      audioContext.resume()
        .then(() => debugLog('Audio context resumed on init'))
        .catch(err => debugLog('Failed to resume audio context:', err));
    }
  } catch (error) {
    console.error('Failed to create audio context:', error);
  }
}

// Load audio file via fetch and decode
async function loadAudioFile(): Promise<void> {
  if (!audioContext || audioLoaded) return;

  try {
    debugLog('Attempting to load audio file...');

    // Try the external file first
    try {
      const response = await fetch(AUDIO_URL);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioLoaded = true;
        debugLog('Audio file loaded successfully');
        return;
      }
    } catch (e) {
      debugLog('Failed to load external audio file, trying base64 fallback');
    }

    // Fallback to base64 data
    const base64Data = AUDIO_DATA.split(',')[1];
    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
    audioLoaded = true;
    debugLog('Audio loaded from base64 data');
  } catch (error) {
    console.error('Failed to load audio:', error);
    audioLoaded = false;
  }
}

// Handle user interaction to unlock audio
function handleUserInteraction(): void {
  if (!audioContext || userInteracted) return;

  debugLog('User interaction detected');
  userInteracted = true;

  // Resume audio context
  if (audioContext.state === 'suspended') {
    audioContext.resume()
      .then(() => {
        debugLog('Audio context resumed after user interaction');
        audioEnabled = true;
        // Attempt to load audio if not already loaded
        if (!audioLoaded) {
          loadAudioFile();
        }
      })
      .catch(error => {
        debugLog('Failed to resume audio context:', error);
        audioEnabled = false;
      });
  } else {
    audioEnabled = true;
    debugLog('Audio context already active');
  }

  // Remove event listeners
  document.removeEventListener('click', handleUserInteraction);
  document.removeEventListener('touchstart', handleUserInteraction);
  document.removeEventListener('keydown', handleUserInteraction);
}

// Initialize the audio system
export function initPageTurnSound(): void {
  if (typeof window === 'undefined' || audioInitialized) return;

  debugLog('Initializing page turn sound system');

  // Create audio context
  createAudioContext();

  if (!audioContext) {
    debugLog('Failed to create audio context');
    return;
  }

  // Load audio file
  loadAudioFile();

  // Setup user interaction listeners to unlock audio
  document.addEventListener('click', handleUserInteraction, { once: true });
  document.addEventListener('touchstart', handleUserInteraction, { once: true });
  document.addEventListener('keydown', handleUserInteraction, { once: true });

  audioInitialized = true;
  debugLog('Audio initialization complete');

  // Display a notification to the user that they need to interact
  showAudioRequiresInteractionNotification();
}

// Play the page turn sound
export async function playPageTurnSound(): Promise<void> {
  debugLog('Attempting to play page turn sound');

  if (!audioContext) {
    debugLog('No audio context available');
    initPageTurnSound();
    return;
  }

  if (audioContext.state === 'suspended') {
    debugLog('Audio context suspended, attempting to resume');
    try {
      await audioContext.resume();
      debugLog('Audio context resumed');
    } catch (error) {
      debugLog('Failed to resume audio context:', error);
      showAudioRequiresInteractionNotification();
      return;
    }
  }

  if (!audioBuffer) {
    debugLog('Audio buffer not loaded yet');
    if (!audioLoaded) {
      try {
        await loadAudioFile();
      } catch (error) {
        debugLog('Failed to load audio on demand:', error);
        return;
      }
    }

    if (!audioBuffer) {
      debugLog('Still no audio buffer available');
      return;
    }
  }

  try {
    debugLog('Creating audio source');
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create a gain node to control volume
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // Set volume to 50%

    // Connect nodes: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Add event listeners to track playback state
    source.onended = () => debugLog('Sound playback ended');

    // Start playback
    debugLog('Starting sound playback');
    source.start(0);

    // Log success
    debugLog('Sound playback started successfully');
    return Promise.resolve();
  } catch (error) {
    debugLog('Error playing sound:', error);
    return Promise.reject(error);
  }
}

// Check if audio is enabled
export function isAudioEnabled(): boolean {
  return audioEnabled && audioContext !== null && audioContext.state === 'running';
}

// Show notification that audio requires user interaction
function showAudioRequiresInteractionNotification(): void {
  if (notificationShown || userInteracted) return;

  debugLog('Showing audio interaction notification');

  // Show console warning
  console.warn('⚠️ Page turn sound requires user interaction. Click, tap, or press a key anywhere on the page to enable audio.');

  // You could show a visual notification to the user here
  // For example:
  if (typeof document !== 'undefined') {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.fontSize = '14px';
    notification.textContent = '🔊 Click anywhere to enable page turn sound';

    // Add a close button
    const closeButton = document.createElement('span');
    closeButton.textContent = '✕';
    closeButton.style.marginLeft = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = (e) => {
      e.stopPropagation();
      document.body.removeChild(notification);
    };
    notification.appendChild(closeButton);

    // Make the entire notification clickable to enable audio
    notification.addEventListener('click', () => {
      handleUserInteraction();
      try {
        document.body.removeChild(notification);
      } catch (e) {
        // Notification might already be removed
      }
    });

    // Add to document
    document.body.appendChild(notification);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      try {
        document.body.removeChild(notification);
      } catch (e) {
        // Notification might already be removed
      }
    }, 8000);
  }

  notificationShown = true;
}

// Export additional utility functions
export function debugAudioState(): void {
  debugLog('Audio System State:');
  debugLog('- Context:', audioContext ? audioContext.state : 'null');
  debugLog('- Buffer loaded:', audioLoaded);
  debugLog('- System initialized:', audioInitialized);
  debugLog('- Audio enabled:', audioEnabled);
  debugLog('- User interacted:', userInteracted);
}
