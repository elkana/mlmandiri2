/* global vkbeautify */
(function () {

  'use strict';

  angular.module('app.detail')
    .controller('DetailCtrl', DetailCtrl);

  DetailCtrl.$inject = ['doc', '$stateParams', 'MLRest', 'ngToast',
                        '$state', '$scope', 'x2js'];

  // TODO: inject vkbeautify
  function DetailCtrl(doc, $stateParams, MLRest, toast, $state, $scope, x2js) {
    var ctrl = this;

    var uri = $stateParams.uri;

    var contentType = doc.headers('content-type');

    /* jscs: disable */
    if (contentType.lastIndexOf('application/json', 0) === 0) {
      /*jshint camelcase: false */
      ctrl.xml = vkbeautify.xml(x2js.json2xml_str(
          { xml: doc.data }
      ));
      ctrl.json = doc.data;
      ctrl.type = 'json';
    } else if (contentType.lastIndexOf('application/xml', 0) === 0) {
      ctrl.xml = vkbeautify.xml(doc.data);
      /*jshint camelcase: false */
      ctrl.json = x2js.xml_str2json(doc.data).xml;
      ctrl.type = 'xml';
      /* jscs: enable */
    } else if (contentType.lastIndexOf('text/plain', 0) === 0) {
      ctrl.xml = doc.data;
      ctrl.json = {'Document' : doc.data};
      ctrl.type = 'text';
    } else if (contentType.lastIndexOf('application', 0) === 0 ) {
      ctrl.xml = 'Binary object';
      ctrl.json = {'Document type' : 'Binary object'};
      ctrl.type = 'binary';
    } else {
      ctrl.xml = 'Error occured determining document type.';
      ctrl.json = {'Error' : 'Error occured determining document type.'};
    }
	
	Highcharts.chart('mychart', {
					title: {
                        text: 'Transactions data'
                    },
				    xAxis: {
				        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
				            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				    },

				    series: [{
				        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
				    }]
				});

    function deleteDocument() {
      MLRest.deleteDocument(uri).then(function(response) {
        // TODO: not reached with code coverage yet!

        // create a toast with settings:
        toast.create({
          className: 'warning',
          content: 'Deleted ' + uri,
          dismissOnTimeout: true,
          timeout: 2000,
          onDismiss: function () {
            //redirect to search page
            $state.go('root.search');
          }
        });
      }, function(response) {
        toast.danger(response.data);
      });
    }

    angular.extend(ctrl, {
      doc : doc.data,
      uri : uri,
      delete: deleteDocument
    });
  }
}());
