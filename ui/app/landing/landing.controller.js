(function () {
  'use strict';

  angular.module('app.landing')
    .controller('LandingCtrl', LandingCtrl);

  LandingCtrl.$inject = ['$scope', 'userService', 'MLSearchFactory'];

  function LandingCtrl($scope, userService, searchFactory) {

    var ctrl = this;

    angular.extend(ctrl, {
      customerClass: top10Chart('Customer Class', 'pie', 'Customer-Class', 'Customer CLass', 50),
	  products: top10Chart('Product Type', 'bar', 'Products', 'Product Type', 50),
	  city: top10Chart('Cities', 'pie', 'Kota', 'City', 50),
      age: top10Chart('Age', 'bar', 'Umur', 'Age', 50),
      region: top10Chart('Region', 'bar', 'Wilayah', 'Region', 50),
      combined: top10Chartv2('Customer Class vs Products', 'column', 'Customer-Class', 'Customer Class','Products', 'Product Type')
    });

    $scope.$watch(userService.currentUser, function(user) {
      if (user && user.authenticated) {
        if (!ctrl.mlSearch) {
          ctrl.mlSearch = searchFactory.newContext();
        }
        ctrl.mlSearch.search(); // trigger showing of charts
      } else {
        ctrl.mlSearch = null; // hide charts
      }
    });

  }

  function top10Chart(title, type, xFacet, xLabel, limit) {
    return {
      options: {
        chart: {
          type: type,
          zoomType: 'xy'
        },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          },
          shared: true,
          crosshairs: true,
          headerFormat: '<b>{series.name}</b><br>',
          pointFormatter: /* istanbul ignore next Unreachable */ function() {
            return (this.xCategory || this.x) + ': <b>' + (this.yCategory || this.y) + '</b><br>';
          }
        },
        legend: {
          enabled: false
        }
      },
      title: {
        text: title
      },

      xAxis: {
        title: {
          text: xLabel
        },
        labels: (type !== 'bar' ? {
          rotation: -45
        } : {})
      },
      // constraint name for x axis
      //xAxisMLConstraint: xFacet,
      // optional constraint name for categorizing x axis values
      xAxisCategoriesMLConstraint: xFacet,

      // grouping results
      //seriesNameMLConstraint: yFacet,
      //dataPointNameMLConstraint: yFacet,

      yAxis: {
        title: {
          text: 'Frequency'
        }
      },
      // constraint name for y axis ($frequency is special value for value/tuple frequency)
      yAxisMLConstraint: '$frequency',

      // zAxis: {
      //   title: {
      //     text: null
      //   }
      // },
      //zAxisMLConstraint: '$frequency',
      // limit of returned results

      size: {
        height: 250
      },
      resultLimit: limit || /* istanbul ignore next Unreachable */ 10,
      credits: {
        enabled: true
      }
    };
  }

  function top10Chartv2(title, type, xFacet, xLabel, yFacet, yLabel, limit) {
    return {
      options: {
        chart: {
          type: type,
          zoomType: 'xy'
        },
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          },
          shared: false,
          split: true,
          crosshairs: true,
          headerFormat: '<b>{series.name}</b><br>',
          pointFormatter: /* istanbul ignore next Unreachable */ function() {
            return (this.xCategory || this.x) + ': <b>' + (this.yCategory || this.y) + '</b><br>';
          }
        },
        legend: {
          enabled: true
        }
      },
      title: {
        text: title
      },

      xAxis: {
        title: {
          text: xLabel
        },
        labels: (type !== 'bar' ? {
          rotation: -45
        } : /* istanbul ignore next Unreachable */ {})
      },
      // constraint name for x axis
      // xAxisMLConstraint: xFacet,
      // optional constraint name for categorizing x axis values
      xAxisCategoriesMLConstraint: xFacet,

      // grouping results
      seriesNameMLConstraint: yFacet,
      //dataPointNameMLConstraint: yFacet,

      yAxis: {
        title: {
          text: 'Frequency'
        }
      },
      // constraint name for y axis ($frequency is special value for value/tuple frequency)
      yAxisMLConstraint: '$frequency',

      // zAxis: {
      //   title: {
      //     text: null
      //   }
      // },
      //zAxisMLConstraint: '$frequency',

      size: {
        height: 250
      },
      resultLimit: 0,
      credits: {
        enabled: true
      }
    };
  }
}());
