/* ========================================
   DS-SLOT-GAM7 - Sound Manager
   ======================================== */

class SoundManager {
    constructor() {
        this.sounds = {
            spin: null,
            win: null,
            jackpot: null,
            click: null,
            bonus: null
        };
        this.isMuted = false;
        this.volume = 0.7;
        this.initSounds();
    }

    initSounds() {
        console.log('🔊 Initializing Sound Manager...');
        
        // Create audio elements for different sounds
        this.sounds.spin = this.createAudioElement('spin', 'assets/sounds/spin.mp3');
        this.sounds.win = this.createAudioElement('win', 'assets/sounds/win.mp3');
        this.sounds.jackpot = this.createAudioElement('jackpot', 'assets/sounds/jackpot.mp3');
        this.sounds.click = this.createAudioElement('click', 'assets/sounds/click.mp3');
        this.sounds.bonus = this.createAudioElement('bonus', 'assets/sounds/bonus.mp3');

        // Set volume for all sounds
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = this.volume;
        });
    }

    createAudioElement(id, src) {
        const audio = new Audio(src);
        audio.id = `sound-${id}`;
        audio.preload = 'auto';
        return audio;
    }

    play(soundType) {
        if (this.isMuted) return;

        const sound = this.sounds[soundType];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Audio play prevented:', e));
        }
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = this.volume;
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    playSpinSound() {
        console.log('🔊 Spin sound playing...');
        this.play('spin');
    }

    playWinSound() {
        console.log('🔊 Win sound playing...');
        this.play('win');
    }

    playJackpotSound() {
        console.log('🔊 Jackpot sound playing...');
        this.play('jackpot');
    }

    playClickSound() {
        this.play('click');
    }

    playBonusSound() {
        console.log('🔊 Bonus sound playing...');
        this.play('bonus');
    }
}

// Initialize Sound Manager globally
const soundManager = new SoundManager();