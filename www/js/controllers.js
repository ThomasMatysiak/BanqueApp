angular.module('starter.controllers', ['ui.router', 'ionic'])

.controller('LoginCtrl', function($scope, $state, $http, $timeout, UserService, SessionService) {
  $scope.data = {
    password: null,
    username: null
  };
  $scope.errorLogin = false;
  $scope.errorUnexpected = false;
  var found = false;

  $scope.login = function() {
     $http({
        method : "GET",
        url : "http://localhost:8080/api/user/" + $scope.data.username + "/" + $scope.data.password
     }).then(function mySuccess(response) {
        console.log(response);
        SessionService.set('userInfo', response.data[0]);
        $state.go('evenements');
        $scope.data = {
          password: null,
          username: null
        };
     }, function myError(response) {
        $scope.errorLogin = true;
        console.log(response);
        $timeout(function () { $scope.errorLogin = false; }, 3000);
    });
  }

  $scope.goToCreate = function() {
    $state.go('create-account');
  }
})
.controller('CreateAccountCtrl', function($scope, $state, $timeout, $http, UserService, SessionService) {
  $scope.data = {
    password: null,
    username: null,
    confirmPassword: null
  };
  $scope.errorPassword = false;
  $scope.errorUnexpected = false;
  $scope.errorUsername = false;
  $scope.errorCreate = false;

  $scope.save = function() {
    if ($scope.data.password !== $scope.data.confirmPassword) {
      $scope.errorPassword = true;
      $timeout(function () { $scope.errorPassword = false; }, 3000);
    }
    else {
      $http({
          method : "POST",
          url : "http://localhost:8080/api/user/create",
                           data : JSON.stringify({
            "username" : $scope.data.username,
            "password" : $scope.data.password
          })
       }).then(function mySuccess(response) {
          if (response.status == 226) {
            $scope.errorUsername = true;
            $timeout(function () { $scope.errorUsername = false; }, 3000);
          }
          else {
            $state.go('login');
          }
       }, function myError(response) {
           $scope.errorCreate = true;
           $timeout(function () { $scope.errorCreate = false; }, 3000);
      });
    }
  }
})
.controller('EvenementsCtrl', function($scope, $state, $http, $ionicScrollDelegate, SessionService, $ionicPopup) {
  $scope.user = SessionService.get('userInfo');
  $scope.alertPopup = null;


  $scope.loadEvent = function() {

  };

  $scope.disconnect = function() {
    $scope.alertPopup.close();
    SessionService.destroy("userInfo");
    $state.go("login");
  };

  $scope.showAlert = function() {
    $scope.alertPopup = $ionicPopup.alert({
      title: '<div class="popup-title">Utilisateur</div>',
      scope: $scope,
      template: '<ul class="list"><li class="item popup-item" ng-click="goToProfil()">Mon profil</li><li class="item popup-item" ng-click="disconnect()">Deconnexion</li></ul>'
    });
  };

  $scope.goToCreateEvent = function() {
    $state.go('create-event');
  };
})
.controller('CreateEventCtrl', function($scope, $state, $http, $ionicScrollDelegate, SessionService, $ionicPopup) {
  $scope.user = SessionService.get('userInfo');
  $scope.alertPopup = null;
  $scope.dateDebutEvent = null;
  $scope.dateFinEvent = null;
  $scope.titreEvent = null;

  $scope.disconnect = function() {
    $scope.alertPopup.close();
    SessionService.destroy("userInfo");
    $state.go("login");
  };

  $scope.showAlert = function() {
    $scope.alertPopup = $ionicPopup.alert({
      title: '<div class="popup-title">Utilisateur</div>',
      scope: $scope,
      template: '<ul class="list"><li class="item popup-item" ng-click="goToProfil()">Mon profil</li><li class="item popup-item" ng-click="disconnect()">Deconnexion</li></ul>'
    });
  };

  $scope.createEvent = function() {

  };

});
