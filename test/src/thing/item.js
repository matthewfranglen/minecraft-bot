/* jshint esnext: true */

import assert from 'assert';
import item from '../../../lib/src/thing/item';

describe('minecraft-bot thing item', function () {
  it('should have the APPLE item', function () {
    assert(item.constant.APPLE, 'check APPLE item is created');
  });

  it('should have the IRON_SHOVEL item', function () {
    assert(item.constant.IRON_SHOVEL, 'check IRON_SHOVEL item is created');
  });
});
