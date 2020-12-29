
import '@souche/blue-windy';
import { Redis } from 'ioredis';
import { EggLoggers, EggLogger } from 'egg-logger';

interface AppLoggers extends EggLoggers {
  [key: string]: EggLogger;
}

interface Clients<V> {
  get(key: string): V;
}

declare module 'egg' {
  interface Application {
    redis: Clients<Redis>;
    loggers: AppLoggers;
  }
}
