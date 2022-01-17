import $ from "jquery";
import fruits from "@/modules/data/common/fruits";
import items from "@/modules/data/common/items";
import statistics from "@/modules/data/common/statistics";
import levels from "@/modules/data/common/levels";
import elements from "@/data/common/elements";
import probability from "../functions/probability";
import randomNumber from "../functions/randomNumber";
import randArrItem from "../functions/randArrItem";
import calcRepair from "../functions/calcRepair";

const { nodes } = elements;
class Entity {
  public element: JQuery<HTMLElement>;
  public constructor() {
    const entities: FruitProps | ItemProps = randArrItem([...fruits, ...items]);
    const entity = $("<i/>");
    this.element = entity;
    // 根据难度等级概率生成实体
    if (
      entities[0].type === "fruits" &&
      probability(levels.HEALTHY_FRUITS_SPAWN_CHANCE)
    ) {
      entity.appendTo(nodes.app);
    }
    if (
      entities[0].type === "items" &&
      statistics.PLAYTIME > 10 &&
      probability(levels.ITEMS_SPAWN_CHANCE)
    ) {
      entity.appendTo(nodes.app);
    }
    // 添加实体的类名
    entity.addClass(`${entities[0].type} ${entities[0].id}`);
    // 当实体是新鲜水果(fruits)时，有概率变成腐烂水果(bad)。
    if (
      this.element.hasClass("fruits") &&
      probability(levels.BAD_FRUITS_CHANCE, 2)
    ) {
      this.element.addClass("bad");
    }
    // 添加实体数据
    entity.prop({ data: entities[0] });
  }
  static random = {
    x(entity: JQuery<HTMLElement>): number {
      return probability(40)
        ? randomNumber({
            min: 0,
            max: (nodes.app as any).width() - (entity as any).width(),
          })
        : randArrItem([-(entity as any).width(), nodes.app.width()])[0];
    },
    y(entity: JQuery<HTMLElement>): number {
      return randomNumber({
        min: 0,
        max:
          (nodes.app as any).height() -
          (entity as any).height() -
          (nodes.statusbar.element as any).height(),
      });
    },
    speed: {
      x(entity: JQuery<HTMLElement>): string {
        const { data } = entity[0] as any;
        const movingSpeed = randomNumber({
          min:
            levels.BASE_MOVE_SPEED *
            data.speed.min *
            randomNumber({
              min: 0.7,
              max: 1.4,
              fixed: 2,
            }),
          max:
            levels.BASE_MOVE_SPEED *
            data.speed.max *
            randomNumber({
              min: 0.7,
              max: 1.4,
              fixed: 2,
            }),
          fixed: 1,
        });

        if (entity.position().left < 0) {
          return "+=" + movingSpeed;
        } else if (entity.position().left >= (nodes.app as any).width()) {
          return "-=" + movingSpeed;
        } else if (entity.position().top < 0) {
          if (probability(25)) {
            // 25% 的概率X轴不会偏移
            return "+=0";
          } else {
            return (
              randArrItem(["+=", "-="])[0] +
              calcRepair({
                formula:
                  movingSpeed *
                  randomNumber({
                    min: 0.5,
                    max: 1.75,
                    fixed: 1,
                  }),
              })
            );
          }
        }
        return "";
      },
      y(entity: JQuery<HTMLElement>): string {
        const { data } = entity[0] as any;
        const movingSpeed = randomNumber({
          min: levels.BASE_MOVE_SPEED * data.speed.min,
          max: levels.BASE_MOVE_SPEED * data.speed.max,
          fixed: 1,
        });

        if (entity.position().top < 0) {
          return "+=" + movingSpeed;
        } else {
          if (probability(25)) {
            // 25% 的概率Y轴不会偏移
            return "+=0";
          } else {
            return (
              randArrItem(["+=", "-="])[0] +
              calcRepair({
                formula:
                  movingSpeed *
                  randomNumber({
                    min: 0.75,
                    max: 1.25,
                    fixed: 1,
                  }),
              })
            );
          }
        }
      },
    },
  };
  public location(x: number, y: number): void {
    this.element.css({ left: x, top: y });
    // 检测位置是否正确
    if (
      this.element.position().left >= 0 &&
      this.element.position().left < (nodes.app as any).width()
    ) {
      this.element.css({ top: -(this.element as any).height() });
    } else {
      this.element.css({
        top: randomNumber({
          min: 0,
          max:
            (nodes.app as any).height() -
            (this.element as any).height() -
            (nodes.statusbar.element as any).height(),
        }),
      });
    }
  }
  public speed(x: any, y: any): void {
    this.element.prop({ xSpeed: x, ySpeed: y });
  }
  public additionals(handler: (entity: JQuery<HTMLElement>) => void): void {
    handler && handler(this.element);
  }
}

export default Entity;