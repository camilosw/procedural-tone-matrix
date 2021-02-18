import * as Tone from 'tone';
import { FilterOptions } from 'tone';
import { RecursivePartial } from 'tone/build/esm/core/util/Interface';

type Constructor = {
  notes: number;
  steps: number;
  options: RecursivePartial<Tone.SynthOptions>;
  filterOptions: Partial<FilterOptions>;
};

export default class SynthInstrument {
  private readonly notes: number;
  private readonly scale: string[];
  private readonly noteDuration: number;
  private readonly noteOffset: number;
  private readonly players: Tone.Player[];
  private currentPlayer: number;
  private readonly polyphony: number[];
  private readonly scheduledNotes: Record<string, number>;

  constructor({ notes, steps, options, filterOptions }: Constructor) {
    this.notes = notes;
    const pentatonic = ['B#', 'D', 'F', 'G', 'A'];
    const octave = 3;
    const octaveOffset = 4;
    this.scale = Array(notes)
      .fill(0)
      .map(
        (_, index) =>
          pentatonic[index % pentatonic.length] +
          (octave + Math.floor((index + octaveOffset) / pentatonic.length)),
      )
      .reverse();

    this.noteDuration = Tone.Time('1m').toSeconds() / steps;
    this.noteOffset = this.noteDuration * 6;
    const numVoices = 4;

    this.players = [];
    this.currentPlayer = 0;

    this.polyphony = Array(steps).fill(0);
    this.scheduledNotes = {};

    Tone.Offline(() => {
      const filter = new Tone.Filter(filterOptions).toDestination();
      const synth = new Tone.Synth(options).connect(filter);

      this.scale.forEach((value, index) =>
        synth.triggerAttackRelease(
          value,
          this.noteDuration,
          this.noteOffset * index,
        ),
      );
    }, this.noteOffset * notes).then((buffer) => {
      for (let i = 0; i < notes * numVoices; i++) {
        Tone.setContext(Tone.context);
        const player = new Tone.Player(buffer);
        Tone.connect(player, Tone.Destination);
        this.players.push(player);
      }
    });
  }

  scheduleNote(noteIndex: number, step: number) {
    if (this.scheduledNotes[`${noteIndex}-${step}`]) return;

    const playId = Tone.Transport.schedule((time) => {
      const highVolume = -10;
      const lowVolume = -20;
      const volume =
        ((this.notes - this.polyphony[step]) / this.notes) *
          (highVolume - lowVolume) +
        lowVolume;

      try {
        this.players[this.currentPlayer].volume.setValueAtTime(volume, time);
        this.players[this.currentPlayer].start(
          time,
          noteIndex * this.noteOffset,
          this.noteOffset,
        );
        this.currentPlayer = ++this.currentPlayer % this.players.length;
      } catch (e) {
        console.log(e);
      }
    }, step * this.noteDuration);
    this.scheduledNotes[`${noteIndex}-${step}`] = playId;
    this.polyphony[step]++;
  }

  unscheduleNote(noteIndex: number, step: number) {
    const playId = this.scheduledNotes[`${noteIndex}-${step}`];
    if (playId) {
      this.polyphony[step]--;
      Tone.Transport.clear(playId);
      delete this.scheduledNotes[`${noteIndex}-${step}`];
    }
  }
}
