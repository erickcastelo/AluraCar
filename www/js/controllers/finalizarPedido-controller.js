angular.module('starter')
  .controller('FinalizarPedidoController', function ($stateParams, $scope, $ionicPopup,
                                                     $state, CarroService, $ionicHistory,
                                                     ionicDatePicker, DatabaseValues) {
    $scope.carroFinalizado = angular.fromJson($stateParams.carro);
    $scope.pedido = {};

    $scope.abrirPopupCalendario = function(){

      var configuracoes = {
        callback : function(data){
          $scope.dataAgendamento = new Date(data);
          console.log(data);
        },
        monthsList: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        weeksList: ["D", "S", "T", "Q", "Q", "S", "S"]
      };
      ionicDatePicker.openDatePicker(configuracoes)
    };

    $scope.finalizarPedido = function () {
      var pedidoFinalizado = {
        params : {
          carro : $scope.carroFinalizado.nome,
          preco : $scope.carroFinalizado.preco,
          nome : $scope.pedido.nome,
          endereco : $scope.pedido.endereco,
          email : $scope.pedido.email
        }
      };

      CarroService.salvarPedido(pedidoFinalizado).then(function () {
        $scope.salvarDadosNoBancoDeDados('true');

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $ionicPopup.alert({
          title: 'Parabéns',
          template: 'Você acaba de comprar um carro.'
        }).then(function () {
          $state.go('app.listagem');
        })
      }, function (erro) {
        $ionicPopup.alert({
          title: 'Deu erro',
          template: 'Campos obrigatórios'
        });
        $scope.salvarDadosNoBancoDeDados('false');
      });
    };

    $scope.salvarDadosNoBancoDeDados = function(confirmado){

      DatabaseValues.setup();
      DatabaseValues.bancoDeDados.transaction(function(transacao){
        transacao.executeSql('INSERT INTO agendamentos(nome, endereco, email, dataAgendamento, modelo, preco, confirmado) VALUES (?,?,?,?,?,?,?)', [$scope.pedido.nome, $scope.pedido.endereco, $scope.pedido.email, $scope.dataAgendamento, $scope.carroFinalizado.nome, $scope.carroFinalizado.preco, confirmado])
      })
    }
  });
