import SynthInstrument from 'SynthInstrument';
import * as Tone from 'tone';
import { Emitter, Sequence } from 'tone';

type SequencerEvents = 'loop' | 'step';

type Constructor = {
  notes?: number;
  steps?: number;
};

export default class Sequencer {
  private readonly steps: number;
  private readonly instruments: SynthInstrument[];
  private sequence?: Sequence;

  constructor(
    { notes = 16, steps = 16 }: Constructor = { notes: 16, steps: 16 },
  ) {
    this.steps = steps;
    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = '1m';

    this.instruments = [
      new SynthInstrument({
        notes,
        steps,
        options: {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
        },
        filterOptions: { frequency: 1100, rolloff: -12 },
      }),
    ];

    Tone.Transport.on('loopEnd', () => this.emit('loop'));
  }

  getState() {
    return Tone.Transport.state;
  }

  start() {
    Tone.Transport.start();
    Tone.context.resume();

    if (!this.sequence) {
      this.sequence = new Tone.Sequence(
        (_, index) => this.emit('step', index),
        Array(16)
          .fill(0)
          .map((_, index) => index),
        `${this.steps}n`,
      ).start(0);
    }
  }

  stop() {
    Tone.Transport.stop();
  }

  update(grid: number[]) {
    grid.forEach((element, index) => {
      const noteIndex = Math.floor(index / this.steps);
      const step = index % this.steps;
      if (element) {
        this.instruments[0].scheduleNote(noteIndex, step);
      } else {
        this.instruments[0].unscheduleNote(noteIndex, step);
      }
    });
  }

  on!: (event: SequencerEvents, callback: (...args: any[]) => void) => this;
  emit!: (event: any, ...args: any[]) => this;
}

Emitter.mixin(Sequencer);
