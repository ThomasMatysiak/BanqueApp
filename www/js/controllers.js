angular.module('starter.controllers', ['ui.router', 'ionic'])

.controller('LoginCtrl', function($scope, $state, $http, $timeout, UserService, SessionService, $ionicHistory) {
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
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
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
.controller('EvenementsCtrl', function($scope, $state, $http, $ionicScrollDelegate, SessionService, $ionicPopup, $ionicHistory) {
  $scope.user = SessionService.get('userInfo');
  $scope.alertPopup = null;
  $scope.events = null;

  $scope.loadEvent = function() {
      $http({
          method : "GET",
          url : "http://localhost:8080/api/event/" + $scope.user.id,
      }).then(function mySuccess(response) {
          $scope.events = response.data
          console.log(response.data);
      }, function myError(response) {
      });
  };

  $scope.disconnect = function() {
    $scope.alertPopup.close();
    SessionService.destroy("userInfo");
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
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
    $state.go('create-event', null, {reload: true});
  };

  $scope.goToDetail = function(id) {
    $state.go('event-details', {idEvent : id});
  };

  $scope.$on('$ionicView.enter', function() {
      $scope.loadEvent();
  });

})
.controller('CreateEventCtrl', function($scope, $state, $http, $ionicScrollDelegate, SessionService, $ionicPopup, $timeout, $ionicHistory) {
  $scope.user = SessionService.get('userInfo');
  $scope.errorCreate = false;
  $scope.alertPopup = null;
  $scope.data = {
    titreEvent: null,
    dateDebutEvent: null,
    dateFinEvent: null
  };

  $scope.disconnect = function() {
    $scope.alertPopup.close();
    SessionService.destroy("userInfo");
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $state.go("login");
  };

  $scope.showAlert = function() {
    $scope.alertPopup = $ionicPopup.alert({
      title: '<div class="popup-title">Utilisateur</div>',
      scope: $scope,
      template: '<ul class="list"><li class="item popup-item" ng-click="goToProfil()">Mon profil</li><li class="item popup-item" ng-click="disconnect()">Deconnexion</li></ul>'
    });
  };

  function convertToDate(str) {
    var date = new Date(str);
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    return (dd>9 ? '' : '0') + dd + "/" + (mm>9 ? '' : '0') + mm + "/" + date.getFullYear()
  }
  $scope.createEvent = function() {
    $http({
        method : "POST",
        url : "http://localhost:8080/api/event/create",
        data : JSON.stringify({
          "idCreateur" : $scope.user.id,
          "title" : $scope.data.titreEvent,
          "dateDebut" : convertToDate($scope.data.dateDebutEvent),
          "dateFin" : convertToDate($scope.data.dateFinEvent)
        })
    }).then(function mySuccess(response) {
        $scope.data.titreEvent = null;
        $scope.data.dateDebutEvent = null;
        $scope.data.dateFinEvent = null;
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('evenements');

    }, function myError(response) {
        $scope.errorCreate = true;
        $timeout(function () { $scope.errorCreate = false; }, 3000);
    });
  };

})
.controller('EventDetailsCtrl', function($scope, $state, $stateParams, $http, $ionicScrollDelegate, SessionService, $ionicPopup, $ionicHistory) {
  $scope.user = SessionService.get('userInfo');
  $scope.alertPopup = null;
  $scope.eventDetails = null;
  $scope.depenses = null;

  $scope.disconnect = function() {
    $scope.alertPopup.close();
    SessionService.destroy("userInfo");
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $state.go("login");
  };

  $scope.showAlert = function() {
    $scope.alertPopup = $ionicPopup.alert({
      title: '<div class="popup-title">Utilisateur</div>',
      scope: $scope,
      template: '<ul class="list"><li class="item popup-item" ng-click="goToProfil()">Mon profil</li><li class="item popup-item" ng-click="disconnect()">Deconnexion</li></ul>'
    });
  };

  $scope.loadEventDetails = function() {
    $http({
        method : "GET",
        url : "http://localhost:8080/api/event/" + $stateParams.idEvent + "/details",
    }).then(
        function mySuccess(response) {
            $scope.event = response.data[0];
        }, function myError(response) {
        }
    );
  };

  $scope.loadDepenses = function() {
    $http({
          method : "GET",
          url : "http://localhost:8080/api/event/" + $stateParams.idEvent + "/depenses",
    }).then(
        function mySuccess(response) {
            $scope.depenses = response.data;
            console.log(response.data);
        }, function myError(response) {
        }
    );
  }

  $scope.$on('$ionicView.enter', function() {
      $scope.loadEventDetails();
      $scope.loadDepenses();
  });

});
