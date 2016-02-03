/* jshint esnext: true */

import assert from 'assert';
import item from '../../../lib/src/thing/item';

describe('minecraft-bot thing item', function () {
  it('should have the APPLE item', function () {
    assert(item.APPLE, 'check APPLE item is created');
  });

  it('should have the IRON_SHOVEL item', function () {
    assert(item.IRON_SHOVEL, 'check IRON_SHOVEL item is created');
  });
});
