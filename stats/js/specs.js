
var visSpec = {
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
    },
    {
      "name": "table2",
      "source": "table",
      "transform": [
        {"type": "stack", "field": "value", "groupby": ["Date"], "sort": {"field": "key"}}
      ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "time",
      "range": "width",
      "round": true,
      "domain": {"data": "table2", "field": "Date"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "table2", "field": "y1"}
    },
    {
      "name": "color",
      "type": "ordinal",
      "range": "category",
      "domain": {"data": "table2", "field": "key"}
    }
  ],

  "axes": [
    {
      "orient": "bottom", "scale": "x", "format": "%b %d, %Y", "grid": true, "zindex": 1,
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
      "type": "rect",
      "from": {"data": "table2"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "Date"},
          "width": {"scale": "x", "band": 1, "offset": 5},
          "y": {"scale": "y", "field": "y0"},
          "y2": {"scale": "y", "field": "y1"},
          "fill": {"scale": "color", "field": "key"}
        },
        "update": {
          "fillOpacity": {"value": 1}
        },
        "hover": {
          "fillOpacity": {"value": 0.5}
        }
      }
    }
  ]
};
