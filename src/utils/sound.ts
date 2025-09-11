let pageTurnAudio: HTMLAudioElement | null = null;
let audioInitialized = false;
let audioEnabled = true;

// Audio data - Base64 encoded MP3 of page turn sound
const AUDIO_DATA = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAASAAAJhwBJSUlJSUlJSUlJbW1tbW1tbW1tbW2JiYmJiYmJiYmJicXFxcXFxcXFxcXF4uLi4uLi4uLi4uLi//////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAZtAAAAAAAACYflGyTKAAAAAAD/+9DEAAAInINXtBGAJQ9Qaq8CMBEATUDSmZiCm3y4EdKfhjHxj6GQA1H0xHgcuL/5c5znOc9CHA4sQEJw/8uIGH4H4Pj4+X8vbggIPggAAAAABAMAYDAcD/KAgIHw/D4IAAAAAIBAIKqqqqqgJ36jzGTTqbMx+lVTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxKGAKhoLXbmMAAVDQOs3MYAAAAANIAAAAAA';

// Create audio element for page turning sound
export function initPageTurnSound(): void {
  if (typeof window === 'undefined' || audioInitialized) return;

  try {
    pageTurnAudio = new Audio(AUDIO_DATA);
    pageTurnAudio.volume = 0.2;
    pageTurnAudio.preload = 'auto';

    // Attempt to load the audio
    pageTurnAudio.load();

    // Force a user interaction to enable audio
    const unlockAudio = () => {
      if (!pageTurnAudio) return;

      // Try to play a silent bit of audio to unlock audio playback
      pageTurnAudio.play()
        .then(() => {
          console.log('Audio unlocked successfully');
          pageTurnAudio?.pause();
          pageTurnAudio?.currentTime && (pageTurnAudio.currentTime = 0);
          audioEnabled = true;
        })
        .catch(err => {
          console.log('Audio not yet enabled:', err);
          audioEnabled = false;
        });

      // Clean up event listener after first interaction
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchend', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };

    // Add multiple event listeners to catch any user interaction
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchend', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    audioInitialized = true;
  } catch (error) {
    console.error('Failed to initialize audio:', error);
    audioEnabled = false;
  }
}

// Play page turn sound
export function playPageTurnSound(): void {
  if (!audioEnabled || !pageTurnAudio) return;

  try {
    // Create a new audio instance for each play to avoid issues with rapid page turns
    const sound = pageTurnAudio.cloneNode() as HTMLAudioElement;
    sound.volume = 0.2;
    sound.currentTime = 0;

    // Use a Promise to handle play failures gracefully
    const playPromise = sound.play();

    if (playPromise !== undefined) {
      playPromise
        .catch(error => {
          console.log('Sound play error:', error);
          // If auto-play is prevented, try to re-enable audio on next user interaction
          audioEnabled = false;
          initPageTurnSound();
        });
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

// Check if audio is enabled
export function isAudioEnabled(): boolean {
  return audioEnabled;
}
