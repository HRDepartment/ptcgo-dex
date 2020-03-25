import { PTCGOSeries, ExpansionSeriesReadable, ExpansionSeries } from './defs';
import { Expansion } from './expansion';

export class Series {
  readonly seriesId: number;
  constructor(seriesIdCode: number | string) {
    if (typeof seriesIdCode === 'number') {
      this.seriesId = seriesIdCode;
    } else if (typeof seriesIdCode === 'string') {
      this.seriesId = (ExpansionSeries as any)[seriesIdCode] || 0;
    } else {
      throw new TypeError('new Series(series): series is not a number or string');
    }
  }

  static all() {
    return PTCGOSeries.map(seriesId => new Series(seriesId));
  }

  isValid() {
    return PTCGOSeries.includes(this.seriesId);
  }

  expansions() {
    return Expansion.definitions
      .filter(def => def.series === this.seriesId)
      .map(def => new Expansion(def));
  }

  initialExpansion() {
    return new Expansion({ seriesId: this.seriesId, expansionId: 1 });
  }

  code() {
    return ExpansionSeries[this.seriesId] || '';
  }

  valueOf() {
    return this.code();
  }

  toString() {
    return this.code();
  }

  toJSON() {
    return this.code();
  }

  name() {
    return ExpansionSeriesReadable[this.seriesId];
  }
}
