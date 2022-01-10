import $ from "jquery";
import { randomNumber, probability, showDetails } from "../../libs/index";
import { player, verify } from "../index";

const items = [
  {
    id: "clock",
    type: "items",
    // 有效概率
    valid: {
      min: 21,
      max: 66,
    },
    effect(obj) {
      const before = player.countdown;
      const { id } = this;

      if (probability(85)) {
        player.countdown += randomNumber({
          min: 5.4,
          max: 11.2,
          fixed: 1,
        });
      } else {
        player.countdown -= randomNumber({
          min: 4.1,
          max: 9.6,
          fixed: 1,
        });
      }

      showDetails({
        id,
        pos: {
          x: obj.position().left,
          y: obj.position().top,
        },
        before,
        after: player.countdown,
        fixed: 1,
      });
    },
    speed: {
      min: 1.25,
      max: 1.85,
    },
    descriptions:
      "增加小量游戏时间。有85%的概率增加5.4-11.2秒游戏时间；有15%的概率减少4.1-9.6秒游戏时间。",
  },
  {
    id: "magnet",
    type: "items",
    valid: {
      min: 11,
      max: 49,
    },
    custom: {
      timer: null,
    },
    effect() {
      function attract(obj) {
        if (!(obj.prop("disX") && obj.prop("disY"))) {
          obj.prop({
            disX: obj.prop("xSpeed"),
            disY: obj.prop("ySpeed"),
          });
        }
        obj
          .prop({
            xSpeed: "+=0",
            ySpeed: "+=0",
          })
          .animate(
            {
              left:
                $("#fruit-basket").position().left +
                $("#fruit-basket").width() / 2 -
                obj.width() / 2,
              top:
                $("#fruit-basket").position().top +
                $("#fruit-basket").height() / 2 -
                obj.height() / 2,
            },
            400,
            "swing"
          );
      }

      const getChance = probability(75);

      $(".fruits").each(function () {
        if (getChance) {
          if (!$(this).hasClass("bad")) attract($(this));
        } else {
          attract($(this));
        }
      });
      // 防止短时间内多次拾取该道具引发的问题，每次拾取道具后，
      // 先清除原先的定时器，再开启一个新的定时器。
      clearTimeout(this.custom.timer);
      this.custom.timer = setTimeout(() => {
        $(".fruits").each(function () {
          if ($(this).prop("disX") && $(this).prop("disX")) {
            $(this).prop({
              xSpeed: $(this).prop("disX"),
              ySpeed: $(this).prop("disY"),
            });
          }
        });
        // 900毫秒的由来：500毫秒的等待时间 + 400毫秒实体从自身位置移动到玩家位置所需的时间
      }, 900);
    },
    speed: {
      min: 1.5,
      max: 2.28,
    },
    descriptions:
      "吸引所有新鲜水果至玩家的位置，有25%的概率额外吸引腐烂水果。如果吸引的水果正在移动中，玩家的位置发生变化，则将移动到上次移动的地点。水果在吸引后将停留0.5秒。",
  },
  {
    id: "cake",
    type: "items",
    valid: {
      min: 7,
      max: 81,
    },
    custom: {
      timer: null,
      attrs: {
        width: $("#fruit-basket").width(),
        height: $("#fruit-basket").height(),
      },
    },
    effect() {
      const _this = this;
      const width = this.custom.attrs.width;
      const height = this.custom.attrs.height;

      function change(size) {
        const changeWidth = Math.floor(width * size);
        const changeHeight = Math.floor(height * size);

        verify.PLAYER_EDIT_ARGUMENTS.custom.attrs.width = changeWidth;
        verify.PLAYER_EDIT_ARGUMENTS.custom.attrs.height = changeHeight;

        $("#fruit-basket").animate(
          {
            width: changeWidth,
            height: changeHeight,
          },
          250,
          function () {
            const player = $(this);

            clearTimeout(_this.custom.timer);

            _this.custom.timer = setTimeout(() => {
              if (
                player.position().top + height >
                $("#app").height() - $("#player-status").height()
              ) {
                player.css({ top: player.position().top - height });
              }

              if (player.position().left + width > $("#app").width()) {
                player.css({ left: player.position().left - width });
              }

              player.animate(
                {
                  width,
                  height,
                },
                250,
                () => {
                  verify.PLAYER_EDIT_ARGUMENTS.custom.attrs.width = width;
                  verify.PLAYER_EDIT_ARGUMENTS.custom.attrs.height = height;
                }
              );
            }, 10000);
          }
        );
      }

      if (probability(55)) {
        change(
          randomNumber({
            min: 1.5,
            max: 5.1,
            fixed: 2,
          })
        );
      } else {
        change(
          randomNumber({
            min: 0.1,
            max: 0.5,
            fixed: 2,
          })
        );
      }
    },
    speed: {
      min: 1.5,
      max: 2.5,
    },
    descriptions:
      "真·随地大小变。有55%的概率将玩家变大，有45%的概率变小。该效果持续10秒。重复拾取将覆盖上一次的效果。",
  },
  {
    id: "book",
    type: "items",
    valid: {
      min: 41,
      max: 70,
    },
    effect() {
      const getChance = probability(65);

      $(".fruits").each(function () {
        if (getChance) {
          if ($(this).hasClass("bad")) {
            $(this).removeClass("bad");
          }
        } else {
          if (!$(this).hasClass("bad")) {
            $(this).addClass("bad");
          }
        }
      });
    },
    speed: {
      min: 1.15,
      max: 2.5,
    },
    descriptions:
      "将游戏区域内的水果反转。有65%的概率将所有腐烂水果转换为新鲜水果，有35%的概率相反。",
  },
  {
    id: "hourglass",
    type: "items",
    valid: {
      min: 13,
      max: 44,
    },
    effect(obj) {
      const before = player.countdown;
      const { type, id } = this;
      const minTime = 1.5;

      if (probability(5)) {
        player.countdown += minTime + player.countdown * 0.5;
      } else if (probability(10)) {
        player.countdown += minTime + player.countdown * 0.3;
      } else {
        player.countdown += minTime + player.countdown * 0.1;
      }

      showDetails({
        id,
        pos: {
          x: obj.position().left,
          y: obj.position().top,
        },
        before,
        after: player.countdown,
        fixed: 1,
      });
    },
    speed: {
      min: 1.21,
      max: 2.6,
    },
    descriptions:
      "增加大量游戏时间。有5%的概率获得当前50%的游戏时间。有10%的概率获得当前30%的游戏时间。有85%的概率获得当前10%的游戏时间。",
  },
];

export default items;