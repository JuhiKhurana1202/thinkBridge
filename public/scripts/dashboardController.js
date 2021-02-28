app.controller("dashboardController", function($rootScope, $scope, $http, Upload, $state){

    var baseUrl = 'http://localhost:3000/';
    $scope.item = {};
    $scope.item.name = null;
    $scope.item.description = null;
    $scope.item.price = 0;
    $scope.item.image = '';
    $scope.allItems = [];
    
    $scope.fetchAllItems = function(){
        $scope.allItems = [];
        var getAllItemsUrl = 'products/list';
        $http.get(baseUrl + getAllItemsUrl).then(function(result) {
            if(result.data.data.length>0){
                for(var i=0; i<result.data.data.length; i++){
                    $scope.allItems.push({
                        _id : result.data.data[i]._id,
                        name : result.data.data[i].name,
                        description : result.data.data[i].description,
                        price : result.data.data[i].price,
                        image : result.data.data[i].image
                    });
                }
                console.log('ALL ITEMS : ', result.data.data.length);
            }else{
                console.log('ERROR ', result.data.msg)    
            }
        }).catch(function(error) {
            console.log('ERROR ', error)
        })
    }

    $scope.getImageSrcUrl = function(image){
        var imgsrc = 'data:image/jpeg;base64,' + btoa(unescape(encodeURIComponent(image)));
        return imgsrc
    }

    $scope.fetchAllItems();

    $scope.addNewProduct = function(addNewItemForm){
        if(addNewItemForm.$valid){
            var addNewProductUrl = 'product/create';
            console.log('************ ', $scope.item);
            if($scope.item.image){ 
                Upload.upload({
                    url: baseUrl + addNewProductUrl,
                    data: { name: $scope.item.name,
                            description: $scope.item.description,
                            price: parseInt($scope.item.price),
                            image: $scope.item.image
                        }
                }).then(function (result) {
                    console.log('Success ' + result.config.data.image.name + 'uploaded. Response: ' + JSON.stringify(result.data));           
                    $scope.item = {};
                    addNewItemForm.$setPristine();
                    addNewItemForm.setUntouched();
                    $scope.fetchAllItems();
                }, function (result) {
                    console.log('Error status: ' + result.status);
                    alert(result.status);
                }, function (evt) {
                    console.log('********** ',evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.$ngfName);
                });
            }else{
                $http.post(baseUrl + addNewProductUrl, $scope.item).then(function(data) {
                    if(data.isError==false || data.isError=='false'){
                        console.log('ALL ITEMS : ', JSON.stringify(data));
                        $scope.item = {};
                        addNewItemForm.$setPristine();
                        addNewItemForm.setUntouched();
                        // addNewItemForm.$pristine = true;
                        // $scope.addNewItem.$dirty = false;
                        $scope.fetchAllItems();
                    }else{
                        console.log('ERROR ', JSON.stringify(data))    
                    }
                }).catch(function(error){
                    alert(error);
                })
            }            
        }
    }

    $scope.deleteItem = function(itemId){
        var deleteItemUrl = 'products/delete';
        console.log(itemId);
        $http.post(baseUrl + deleteItemUrl, {id : itemId}).then(function(result){
            // var result = JSON.parse(result);
            if(result.data.isError==false || result.data.isError=='false'){
                var indexOfItemInArray = $scope.allItems.map(function(f){return f._id}).indexOf(itemId);
        
                if(indexOfItemInArray!=-1){
                    $scope.allItems.splice(indexOfItemInArray, 1);
                }else{
                    alert('Item does not exist !');
                }
            }else{
                var message = (result.data.msg?result.data.msg : '') + ' The item does not exist in the list !'
                alert(message);
            }
        }).catch(function(error){
            alert(error);
        })

    }

    $scope.redirectToItemDescription = function(itemId){
        console.log(itemId);
        $state.go('item', {itemId : itemId});
    }
    
});

