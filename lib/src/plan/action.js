/* jshint esnext: true */

// An action is a single indivisible action performed by the bot.

import use from './action/use';
import toss from './action/toss';
import equip from './action/equip';
import look from './action/look';
import move from './action/move';
import dig from './action/dig';
import say from './action/say';

export default {
  use: use,
  toss: toss,
  equip: equip,
  look: look,
  move: move,
  dig: dig,
  say: say
};
