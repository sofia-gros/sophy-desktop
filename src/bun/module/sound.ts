type SoundOptions = {
  volume?: number;
  loop?: boolean;
  delay?: number; // 🔧 追加
};

export default class SoundPlayer {
  private audios: Map<string, HTMLAudioElement> = new Map();

  preload(name: string, url: string): void {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.audios.set(name, audio);
  }

  play(name: string, options: SoundOptions = {}): void {
    const audio = this.audios.get(name);
    if (!audio) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.volume = options.volume ?? 1.0;
    audio.loop = options.loop ?? false;

    if (options.delay && options.delay > 0) {
      setTimeout(() => {
        audio.play();
      }, options.delay * 1000); // 🔧 秒→ミリ秒
    } else {
      audio.play();
    }
  }

  stop(): void {
    this.audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}
