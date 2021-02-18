import SynthInstrument from 'SynthInstrument';
import * as Tone from 'tone';
import { Emitter } from 'tone';

type SequencerEvents = 'loop' | 'step';

type Constructor = {
  notes?: number;
  steps?: number;
};

export default class Sequencer {
  private readonly notes: number;
  private readonly steps: number;
  private readonly instruments: SynthInstrument[];

  constructor(
    { notes = 16, steps = 16 }: Constructor = { notes: 16, steps: 16 },
  ) {
    this.notes = notes;
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

  start() {
    new Tone.Loop((time) => {
      const loopStart = Tone.Transport.loopStart as number;
      const loopEnd = Tone.Transport.loopEnd as number;
      const loopTime = loopEnd - loopStart;
      const step = Math.floor(((time % loopTime) / loopTime) * this.steps);
      this.emit('step', step);
    }, `${this.steps}n`).start(0);

    Tone.Transport.start();
    Tone.context.resume();
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

  on!: (event: SequencerEvents, callback: (...args: unknown[]) => void) => this;
  emit!: (event: unknown, ...args: unknown[]) => this;
}

Emitter.mixin(Sequencer);
