import * as migration_20261008_073844_initial from './20261008_073844_initial';

export const migrations = [
  {
    up: migration_20261008_073844_initial.up,
    down: migration_20261008_073844_initial.down,
    name: '20261008_073844_initial'
  },
];
