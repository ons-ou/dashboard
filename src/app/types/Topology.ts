export class Geometry {
  type: string = "";
  geometries: any[] = []
}

export class Topology {
  type: string = "";
  bbox: number[] = [];
  transform: { scale: number[], translate: number[] } | null = null;
  objects: {
    counties: Geometry,
    states: Geometry,
    nation: Geometry
  } | null = null;
  arcs: number[][] = [];
}