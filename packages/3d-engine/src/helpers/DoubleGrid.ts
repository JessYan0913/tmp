import { Color, ColorRepresentation, GridHelper, Group, LineBasicMaterial } from 'three';

interface DoubleGridOptions {
  visible?: boolean;
  size?: number;
  divisions?: number;
  ticks?: number;
  color?: ColorRepresentation;
  subColor?: ColorRepresentation;
}

const defaultColor = new Color(0x888888);
const defaultSubColor = new Color(0x222222);

export class DoubleGrid extends Group {
  public visible: boolean = true;
  private size: number = 400;
  private divisions: number = 50;
  private ticks: number = 10;
  private color: Color = defaultColor;
  private subColor: Color = defaultSubColor;
  private grid: GridHelper;
  private subGrid: GridHelper;

  constructor(options?: DoubleGridOptions) {
    super();
    if (options) {
      options.visible && (this.visible = options.visible);
      options.color && (this.color = new Color(options.color));
      options.subColor && (this.subColor = new Color(options.subColor));
      options.size && (this.size = options.size);
      options.divisions && (this.divisions = options.divisions);
      options.ticks && (this.ticks = options.ticks);
    }
    this.grid = new GridHelper(this.size, this.divisions, this.color);
    let gridMaterial = this.grid.material as LineBasicMaterial;
    gridMaterial.color = this.color;
    gridMaterial.vertexColors = false;
    this.add(this.grid);

    this.subGrid = new GridHelper(this.size, this.ticks, this.subColor);
    let subGridMaterial = this.subGrid.material as LineBasicMaterial;
    subGridMaterial.color = this.subColor;
    subGridMaterial.vertexColors = false;
    this.add(this.subGrid);
  }

  public updateColors(color: ColorRepresentation, subColor: ColorRepresentation): void {
    this.color = new Color(color);
    let gridMaterial = this.grid.material as LineBasicMaterial;
    gridMaterial.color = this.color;

    this.subColor = new Color(subColor);
    let subGridMaterial = this.subGrid.material as LineBasicMaterial;
    subGridMaterial.color = this.subColor;
  }
}

export default DoubleGrid;
