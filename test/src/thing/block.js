/* jshint esnext: true */

import assert from 'assert';
import block from '../../../lib/src/thing/block';

describe('minecraft-bot thing block', function () {
  it('should have the STONE block', function () {
    assert(block.constant.STONE, 'check STONE block is created');
  });
});
