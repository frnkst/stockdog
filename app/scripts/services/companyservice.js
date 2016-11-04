'use strict';

angular.module('stockDogApp')
  .service('CompanyService', function CompanyService($ressource) {
    return $ressource('companies.json');
  });
