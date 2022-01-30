'use strict';

import 'core-js/stable';
import './../style/visual.less';
import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from './settings';
import { data, transformData } from './data';

import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

export class Visual implements IVisual {
  private target: HTMLElement;
  private container: HTMLElement;
  private settings: VisualSettings;
  private slider;

  constructor(options: VisualConstructorOptions) {
    console.log('Visual constructor', options);
    this.target = options.element;
    if (document) {
      this.container = document.createElement('div');
      this.container.className = 'slicer-container';
      this.target.appendChild(this.container);

      this.slider = document.createElement('div');
      this.slider.className = 'slider';
      noUiSlider.create(this.slider, {
        start: 0,
        connect: [true, false],
        orientation: 'vertical',
        range: {
          min: 0,
          max: 100,
        },
        step: 1,
      });
      this.container.appendChild(this.slider);

      let sliderValue = document.createElement('div');
      sliderValue.id = 'slider-value';
      this.target.appendChild(sliderValue);
    }
  }

  public update(options: VisualUpdateOptions) {
    var sliderValues = [document.getElementById('slider-value')];

    this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
    console.log('Visual update', options);

    transformData(options);

    console.log('Visual data', data.values.length);

    this.slider.noUiSlider.updateOptions({ range: { min: 0, max: data.values.length / 20 } });

    this.slider.noUiSlider.on('update', function (values, handle) {
      sliderValues[handle].innerHTML = values[handle];
    });

    console.log('Visual data', data);
  }

  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
  }
}
