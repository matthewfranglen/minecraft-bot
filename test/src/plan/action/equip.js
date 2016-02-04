/* jshint esnext: true */

import assert from 'assert';
import equip from '../../../../lib/src/plan/action/equip';
import item from '../../../../lib/src/thing/item';

describe('minecraft-bot plan action equip', function () {
  it('should call equip when the equip method is called with an item', function () {
    var called = false;
    var mockBot = {
      equip: function () {
        called = true;
      }
    };

    action.equip(mockBot, item.IRON_SHOVEL);

    assert(called, 'check equip method is called');
  });

  it('should call unequip when the equip method is called without an item', function () {
    var called = false;
    var mockBot = {
      unequip: function () {
        called = true;
      }
    };

    action.equip(mockBot);

    assert(called, 'check unequip method is called');
  });
});
