'use strict';

import powerbi from 'powerbi-visuals-api';
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import PrimitiveValue = powerbi.PrimitiveValue;

export let data: Vdata;

interface Vdata {
  values: PrimitiveValue[];
  column: string;
  table: string;
}

export function transformData(options: VisualUpdateOptions) {
  let dataView = options.dataViews;

  //default values
  data = {
    values: [],
    column: '',
    table: '',
  };

  if (
    !dataView ||
    !dataView[0] ||
    !dataView[0].categorical ||
    !dataView[0].categorical.categories ||
    !dataView[0].categorical.categories[0] ||
    !dataView[0].categorical.categories[0].values ||
    !dataView[0].categorical.categories[0].source
  ) {
    return;
  }

  let cat = dataView[0].categorical.categories[0];
  let dotIndex = cat.source.queryName.indexOf('.');

  data.column = cat.source.queryName.slice(dotIndex + 1);
  data.table = cat.source.queryName.slice(0, dotIndex);
  data.values = cat.values;
}
