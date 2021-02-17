import SynthInstrument from 'SynthInstrument';
import * as Tone from 'tone';

export default class Sequencer {
  private readonly instruments: SynthInstrument[];

  constructor() {
    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = '1m';

    this.instruments = [
      new SynthInstrument({
        options: {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
        },
        filterOptions: { frequency: 1100, rolloff: -12 },
      }),
    ];
  }

  start() {
    this.instruments[0].scheduleNote(0, 0);
    this.instruments[0].scheduleNote(1, 4);
    this.instruments[0].scheduleNote(2, 8);
    this.instruments[0].scheduleNote(3, 12);
    this.instruments[0].scheduleNote(4, 12);

    setTimeout(() => this.instruments[0].unscheduleNote(4, 12), 10000);

    Tone.Transport.start();
    Tone.context.resume();
  }

  stop() {
    Tone.Transport.stop();
  }
}
