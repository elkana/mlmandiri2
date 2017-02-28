/* global MLSearchController */
(function () {
  'use strict';

  angular.module('app.search')
    .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$location', 'MLSearchFactory'];

  // inherit from MLSearchController
  var superCtrl = MLSearchController.prototype;
  SearchCtrl.prototype = Object.create(superCtrl);

  function SearchCtrl($scope, $location, searchFactory) {
    var ctrl = this;
	
	var mlSearch = searchFactory.newContext();

    superCtrl.constructor.call(ctrl, $scope, $location, mlSearch);

    ctrl.init();

	ctrl.updateSearchResults = function updateSearchResults(data) {
		superCtrl.updateSearchResults.apply(ctrl, arguments);
		ctrl.updateCloud(data);
		return ctrl;
	};

  ctrl.words = [];

  ctrl.updateCloud = function(data) {
    if (data && data.facets && data.facets.CustomerClass) {
      ctrl.words = [];
      var activeFacets = [];

      // find all selected facet values..
      angular.forEach(mlSearch.getActiveFacets(), function(facet, key) {
        angular.forEach(facet.values, function(value, index) {
          activeFacets.push((value.value+'').toLowerCase());
        });
      });

      angular.forEach(data.facets.CustomerClass.facetValues, function(value, index) {
        var q = (ctrl.qtext || '').toLowerCase();
        var val = value.name.toLowerCase();

        // suppress search terms, and selected facet values from the D3 cloud..
        if (q.indexOf(val) < 0 && activeFacets.indexOf(val) < 0) {
          ctrl.words.push({name: value.name, score: value.count});
        }
      });
    }
  };

  ctrl.noRotate = function(word) {
    return 0;
  };

  ctrl.cloudEvents = {
    'dblclick': function(tag) {
      // stop propagation
      d3.event.stopPropagation();

      // undo default behavior of browsers to select at dblclick
      var body = document.getElementsByTagName('body')[0];
      window.getSelection().collapse(body,0);

      // custom behavior, for instance search on dblclick
      ctrl.search((ctrl.qtext ? ctrl.qtext + ' ' : '') + tag.text.toLowerCase());
    }
  };

  
  }

}());
