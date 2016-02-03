/* jshint esnext: true */

import assert from 'assert';
import block from '../../../lib/src/thing/block';

describe('minecraft-bot thing block', function () {
  it('should have the STONE block', function () {
    assert(block.STONE, 'check STONE block is created');
  });
});
