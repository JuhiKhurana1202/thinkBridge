app.controller("itemController", function($scope, $http, $state){

    $scope.item = {};
    $scope.item._id = $state.params.itemId;

    if($scope.item._id==null || $scope.item._id==undefined){
        $scope.showErrorStrip = true;
    }else{
        $scope.showErrorStrip = false;
       
        var baseUrl = 'http:localhost:3000/';
        var fetchAnItemUrl = 'products/get';
        var url = baseUrl + fetchAnItemUrl;
        console.log(url);
        $http.get('/products/get' + '?id=' + $scope.item._id).then(function(result){
            console.log('result')
            if(result.data.isError==false || result.data.isError=='false'){
                $scope.item = result.data.data;
            }
        }).catch(function(error){
            console.log(error)
        })
    }
    
    $scope.rediredtToHomePage = function(){
        $state.go('dashboard');
    }

})