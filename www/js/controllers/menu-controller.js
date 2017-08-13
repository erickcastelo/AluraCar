angular.module('starter')
  .controller('MenuController', function($scope, $rootScope){

    $scope.usuarioLogado = $rootScope.usuario;

  });
