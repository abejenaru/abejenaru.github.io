
var visualizationSpec = {
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",

  "width": 1400,
  "height": 650,
  "padding": 2,
  "autosize": "fit",

  "data": [
    {
      "name": "raw-data",
      "url": "data/activity.csv",
      "format": {"type":"csv", "parse": {"Date": "date", "LightlyActiveMinutes": "number", "FairlyActiveMinutes": "number", "VeryActiveMinutes": "number"}}
    },
    {
      "name": "table",
      "source": "raw-data",
      "transform": [
        {"type": "fold", "fields": ["LightlyActiveMinutes","FairlyActiveMinutes","VeryActiveMinutes"]}
      ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "time",
      "range": "width",
      "round": true,
      "domain": {"data": "table", "field": "Date"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "table", "field": "value"}
    },
    {
      "name": "color",
      "type": "ordinal",
      "range": "category",
      "domain": {"data": "table", "field": "key"}
    }
  ],

  "axes": [
    {
      "orient": "bottom", "scale": "x", "format": "%b %d, %Y", "tickCount": 60, "grid": true,
      "encode": {
      	"interactive": true,
        "labels": {
          "enter": {
            "angle": {"value": 45},
            "dx": {"value": 30}
          }
        }
      }
    },
    {"orient": "left", "scale": "y", "grid": true}
  ],

  "legends": [{
  	"interactive": true,
  	"orient": "top-left",
    "fill": "color"
  }],

  "marks": [
    {
      "type": "group",
      "from": {
        "facet": {
          "name": "series",
          "data": "table",
          "groupby": "key"
        }
      },
      "marks": [
        {
          "type": "line",
          "from": {"data": "series"},
          "encode": {
            "enter": {
              "interpolate": {"value": "monotone"},
              "x": {"scale": "x", "field": "Date"},
              "y": {"scale": "y", "field": "value"},
              "y2": {"scale": "y", "value": 0},
              "stroke": {"scale": "color", "field": "key"},
              "strokeWidth": {"value": 2}
            },
            "update": {
              "strokeWidth": {"value": 2}
            },
            "hover": {
              "strokeWidth": {"value": 4}
            }
          }
        }
      ]
    }
  ]
};
