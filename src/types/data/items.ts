interface ItemsObject {
  id: string;
  type: string;
  valid: {
    min: number;
    max: number;
  };
  effect: (obj: HTMLElement | JQuery<HTMLElement>) => void;
  speed: {
    min: number;
    max: number;
  };
  description: string;
  custom?: object;
}
type Items = ItemsObject[];
