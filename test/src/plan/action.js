/* jshint esnext: true */

import assert from 'assert';
import action from '../../../lib/src/plan/action';
import item from '../../../lib/src/thing/item';

describe('minecraft-bot plan action', function () {
  it('should have the use method', function () {
    assert(action.use, 'check use method is created');
  });

  it('should have the toss method', function () {
    assert(action.toss, 'check toss method is created');
  });

  it('should call tossStack when the toss method is called', function () {
    var called = false;
    var mockBot = {
      tossStack: function () {
        called = true;
      }
    };

    action.toss(mockBot, undefined);

    assert(called, 'check toss method is called');
  });

  it('should have the equip method', function () {
    assert(action.equip, 'check equip method is created');
  });

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

  it('should have the look method', function () {
    assert(action.look, 'check look method is created');
  });

  it('should call lookAt when the look method is called', function () {
    var called = false;
    var mockBot = {
      entity: { position: { offset: function () {} } },
      lookAt: function () {
        called = true;
      }
    };

    action.look(mockBot);

    assert(called, 'check lookAt method is called');
  });

  it('should have the move method', function () {
    assert(action.move, 'check move method is created');
  });

  it('should call navigate.walk when the move method is called', function () {
    var called = false;
    var mockBot = {
      entity: { position: { offset: function () {} } },
      navigate: {
        walk: function () {
          called = true;
        }
      }
    };

    action.move(mockBot);

    assert(called, 'check navigate.walk method is called');
  });

  it('should have the dig method', function () {
    assert(action.dig, 'check dig method is created');
  });

  it('should have the say method', function () {
    assert(action.say, 'check say method is created');
  });
});
