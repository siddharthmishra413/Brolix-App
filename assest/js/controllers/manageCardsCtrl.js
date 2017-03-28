app.controller('manageCardsCtrl', function($scope, $window, userService, $state, toastr) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.myForm = {};
    var upgrade_card = {};
    var luck_card = {};



    $scope.total_user_message = function (modal) {

        $scope.modalId = modal;
        $("#sendMessageModelAllUser").modal('show');
    }

    /*Send Message and close all modal*/

    $scope.send_massage = function(){
         var array =[];
         var data = {};
         console.log(" $scope.modalId", $scope.modalId)
         switch ($scope.modalId)
            {
                case 'SoldUpgradeCard': 
                    for (var i = 0; i < $scope.totalSoldUpgradeCard.length; i++) {
                        array.push($scope.totalSoldUpgradeCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    console.log("data",data)
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'totalincomeUpgrade': 
                    for (var i = 0; i < $scope.totalSoldUpgradeCard.length; i++) {
                        array.push($scope.totalSoldUpgradeCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Personal User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'usedUpgradeCard': 
                    for (var i = 0; i < $scope.usedUpgradeCard.length; i++) {
                        array.push($scope.usedUpgradeCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Business User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'unUsedUpgradeCard': 
                    for (var i = 0; i < $scope.unUsedUpgradeCard.length; i++) {
                        array.push($scope.unUsedUpgradeCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Live User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'SoldULuckCard': 
                    for (var i = 0; i < $scope.totalSoldLuckCard.length; i++) {
                        array.push($scope.totalSoldLuckCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Winners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'totalincomeLuck': 
                    for (var i = 0; i < $scope.totalSoldLuckCard.length; i++) {
                        array.push($scope.totalSoldLuckCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All CashWinners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'usedLuckCard': 
                    for (var i = 0; i < $scope.usedLuckCard.length; i++) {
                        array.push($scope.usedLuckCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    console.log("90-----------------------",data)
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All CouponWinners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'unUsedLuckCard': 
                    for (var i = 0; i < $scope.unUsedLuckCard.length; i++) {
                        array.push($scope.unUsedLuckCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Blocked User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default: 
                toastr.error("Something Wents to wrong");
            }

    }


    $scope.export = function(){
        html2canvas(document.getElementById('manageCardTable'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("ManageCard Table.pdf");
            }
        });
    }


    upgrade_card = {
            cardType:'upgrade_card'
        }

    luck_card = {
        cardType:'luck_card'
    }


    userService.showOfferOnCards(upgrade_card).success(function(res){
        if(res.responseCode == 200){
            var resultUpgradeCardDiscount = res.data.filter(function( obj ) {
              return obj.offer.offerType == 'discount';
            });
            $scope.resultUpgradeCardDiscount = resultUpgradeCardDiscount;            
            var resultUpgradeCardBuyGet = res.data.filter(function( obj ) {
              return obj.offer.offerType == 'buyGet';
            });
            $scope.resultUpgradeCardBuyGet=resultUpgradeCardBuyGet;
            $scope.totalOfferUpgradeCardCount=resultUpgradeCardDiscount.length+resultUpgradeCardBuyGet.length;

        }
        else{
            toastr.error(res.responseMessage);
        }

    })

    userService.showOfferOnCards(luck_card).success(function(res){
        if(res.responseCode == 200){
            var resultLuckCardDiscount = res.data.filter(function( obj ) {
              return obj.offer.offerType == 'discount';
            });
            $scope.resultLuckCardDiscount = resultLuckCardDiscount;            
            var resultLuckCardBuyGet = res.data.filter(function( obj ) {
              return obj.offer.offerType == 'buyGet';
            });
            $scope.resultLuckCardBuyGet=resultLuckCardBuyGet;
            $scope.totalOfferLuckCardCount=resultLuckCardDiscount.length+resultLuckCardBuyGet.length;
        }
        else{
            toastr.error(res.responseMessage);
        }

    })
   
    
    //*******************Total Winners****************
    // userService.totalWinners().success(function(res) {
    //     $scope.totalWinners = res.result;
    // })
    // $scope.showOffer = function(type){
    //     var data = {};
    //     data = {
    //         cardType:type
    //     }
    //     console.log("datatatatat",data)
    //     userService.showOfferOnCards(data).success(function(res){
    //     if(res.responseCode == 200){
    //         $scope.totalOffer = res.data;
    //         if(type=="upgrade_card"){
    //          $scope.table1 = true;
    //          $scope.table2 = false; 
    //         }else{
    //           $scope.table2 = true;
    //           $scope.table1 = false;  
    //         }
    //     }
    //     else{
    //         toastr.error(res.responseMessage);
    //     }

    // })

    // }
   
    //*******************Total Sold UpgradeCard****************
    userService.totalSoldUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalSoldUpgradeCard = res.result;
            //console.log("totalSoldUpgradeCardtotalSoldUpgradeCard",JSON.stringify($scope.totalSoldUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })
   
   userService.totalIncomeInCashFromUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalIncomeInCashFromUpgradeCard = res.result;
            $scope.totalIncomeFromUpgradeCard = res.totalIncome;
            $scope.totalcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify(res));
           //console.log("totalIncome",JSON.stringify($scope.totalIncomeInCashFromUpgradeCard));
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncomeInCashFromUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

   userService.usedUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.usedUpgradeCard = res.result;
            // $scope.totalIncome = res.totalIncome;
            $scope.usedUpgradeCardcount = res.count;
           //console.log("usedUpgradeCard",JSON.stringify($scope.usedUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    userService.unUsedUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.unUsedUpgradeCard = res.result;
            // $scope.totalIncome = res.totalIncome;
             $scope.unUsedUpgradeCardcount = res.count;
           //console.log("unUsedUpgradeCard",JSON.stringify($scope.unUsedUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    //*******************Total Sold LuckCard****************

    userService.totalSoldLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalSoldLuckCard = res.result;
            // $scope.totalIncome = res.totalIncome;
             $scope.totalSoldLuckCardcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    userService.totalIncomeInBrolixFromLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalIncomeInBrolixFromLuckCard = res.result;
             $scope.totalIncomeLuck = res.totalIncome;
             $scope.totalIncomeInBrolixFromLuckCardcount = res.count;

        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    userService.usedLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.usedLuckCard = res.result;
            $scope.usedLuckCardcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncome));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    userService.unUsedLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.unUsedLuckCard = res.result;
            $scope.unUsedLuckCardcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncome));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    /*Country State Cities*/

    var currentCities=[];
    $scope.currentCountry= '';

// This is a demo API key that can only be used for a short period of time, and will be unavailable soon. You should rather request your API key (free)  from http://battuta.medunes.net/
var BATTUTA_KEY="00000000000000000000000000000000"
    // Populate country select box from battuta API
  url="http://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
    $.getJSON(url,function(countries)
    {
      $scope.countryList = countries;
      //console.log("$scope.countryList",JSON.stringify($scope.countryList))
      //$('#country').material_select();
      //loop through countries..
      $.each(countries,function(key,country)
      {
          $("<option></option>")
                  .attr("value",country.code)
                  .append(country.name)
                        .appendTo($("#country"));

      });
      // trigger "change" to fire the #state section update process
    //   $("#country").material_select('update');
    //   $("#country").trigger("change");


    });

    $("#country").on("change",function()
    {

      countryCode=$("#country").val();
      $scope.currentCountry = countryCode;
      // Populate country select box from battuta API
      url="http://battuta.medunes.net/api/region/"
      +countryCode
      +"/all/?key="+BATTUTA_KEY+"&callback=?";
      $.getJSON(url,function(regions)
      {
        //console.log('regions:   '+JSON.stringify(regions))
        $scope.stateList = regions;
        //console.log("$scope.stateList",$scope.stateList)
        // $("#region option").remove();
        //loop through regions..
        // $.each(regions,function(key,region)
        // {
        //     $("<option></option>")
        //             .attr("value",region.region)
        //             .append(region.region)
        //                   .appendTo($("#region"));
        // });
        // trigger "change" to fire the #state section update process
        // $("#region").material_select('update');
        // $("#region").trigger("change");

      });

    });
    $("#region").on("change",function()
    {

      // Populate country select box from battuta API

      //countryCode=$("#country").val();
    region=$("#region").val();
    // alert($scope.currentCountry+'\n'+region)
      url="http://battuta.medunes.net/api/city/"
      +$scope.currentCountry
      +"/search/?region="
      +region
      +"&key="
      +BATTUTA_KEY
      +"&callback=?";

      $.getJSON(url,function(cities)

      {
          //console.log('cities:   '+JSON.stringify(cities))
        currentCities=cities;
        //console.log("cities",cities)
          var i=0;
          $("#city option").remove();

        //loop through regions..
        $.each(cities,function(key,city)
        {
            $("<option></option>")
                    .attr("value",i++)
                    .append(city.city)
                    .appendTo($("#city"));
        });
        // trigger "change" to fire the #state section update process
        // $("#city").material_select('update');
        // $("#city").trigger("change");

      });

    });
    $("#city").on("change",function()
    {
      currentIndex=$("#city").val();
      currentCity=currentCities[currentIndex];
      city=currentCity.city;
      region=currentCity.region;
      country=currentCity.country;
      // $scope.city=currentCity.city;
      // $scope.region=currentCity.region;
      // $scope.country=currentCity.country;

      //console.log("lat,long",city,region,country)

    });
})
