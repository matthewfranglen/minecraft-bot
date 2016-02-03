/* jshint esnext: true */

import assert from 'assert';
import entity from '../../../lib/src/thing/entity';

describe('minecraft-bot thing entity', function () {
  it('should have the MUSHROOM_COW entity', function () {
    assert(entity.MUSHROOM_COW, 'check MUSHROOM_COW entity is created');
  });
});
