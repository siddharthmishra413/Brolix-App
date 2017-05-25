var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');
var authUser = require('../middlewares/authUser');

app.post('/removeOfferonCards',adminHandler.removeOfferonCards);

app.post('/editOfferonCards',adminHandler.editOfferonCards);

app.get('/showCardDetails',adminHandler.showCardDetails);
app.get('/countryListData', authUser.authUser, adminHandler.countryListData);
app.post('/cityListData',adminHandler.cityListData);

app.post('/login', adminHandler.login);
app.get('/adminProfile', authUser.authUser,adminHandler.adminProfile);
app.post('/addNewUser', authUser.authUser,adminHandler.addNewUser);
app.post('/sendBrolix', authUser.authUser,adminHandler.sendBrolix);
app.get('/countrys', authUser.authUser,adminHandler.countrys);
app.get('/getAllStates/:name/:code', authUser.authUser,adminHandler.getAllStates);
app.get('/viewProfile/:id', authUser.authUser,adminHandler.viewProfile);
app.put('/editUserProfile/:id', authUser.authUser,adminHandler.editUserProfile);
app.get('/totalPages/:pageNumber', authUser.authUser,adminHandler.totalPages);
app.get('/viewPage/:id', authUser.authUser,adminHandler.viewPage);


/*----------------------Manage Users------------------------*/


app.get('/showAllUser/:pageNumber', authUser.authUser,adminHandler.showAllUser);
app.get('/showAllPersonalUser/:pageNumber', authUser.authUser,adminHandler.showAllPersonalUser);
app.get('/showAllBusinessUser/:pageNumber', authUser.authUser,adminHandler.showAllBusinessUser);
app.get('/winners', authUser.authUser,adminHandler.winners);
app.get('/couponWinners/:pageNumber', authUser.authUser,adminHandler.couponWinners);
app.get('/cashWinners/:pageNumber', authUser.authUser,adminHandler.cashWinners);
app.get('/showAllBlockUser/:pageNumber', authUser.authUser,adminHandler.showAllBlockUser);
app.get('/blockUser/:userId', authUser.authUser,adminHandler.blockUser);

/*--------------------------Manage Cards--------------------------*/


app.get('/totalSoldUpgradeCard/:pageNumber', authUser.authUser,adminHandler.totalSoldUpgradeCard);
app.get('/totalSoldLuckCard/:pageNumber', authUser.authUser,adminHandler.totalSoldLuckCard);
app.get('/totalIncomeInBrolixFromLuckCard/:pageNumber', authUser.authUser,adminHandler.totalIncomeInBrolixFromLuckCard);
app.get('/totalIncomeInCashFromUpgradeCard/:pageNumber', authUser.authUser,adminHandler.totalIncomeInCashFromUpgradeCard);
app.get('/usedLuckCard/:pageNumber', authUser.authUser,adminHandler.usedLuckCard);
app.get('/unUsedLuckCard/:pageNumber', authUser.authUser,adminHandler.unUsedLuckCard);
app.get('/usedUpgradeCard/:pageNumber', authUser.authUser,adminHandler.usedUpgradeCard);
app.get('/unUsedUpgradeCard/:pageNumber', authUser.authUser,adminHandler.unUsedUpgradeCard);

/*-------------------------Manage ADS---------------------*/

app.post('/showOfferCountOnCards', adminHandler.showOfferCountOnCards);

app.post('/getOfferList', adminHandler.getOfferList);
app.get('/totalAds/:pageNumber', authUser.authUser,adminHandler.totalAds);
app.get('/totalActiveAds/:pageNumber', authUser.authUser,adminHandler.totalActiveAds);
app.get('/totalExpiredAds/:pageNumber', authUser.authUser,adminHandler.totalExpiredAds);
app.get('/videoAds/:pageNumber', authUser.authUser,adminHandler.videoAds);
app.get('/slideshowAds/:pageNumber', authUser.authUser,adminHandler.slideshowAds);
app.get('/showAllBlockedPage/:pageNumber', authUser.authUser,adminHandler.showAllBlockedPage);
app.get('/removePage/:id', authUser.authUser,adminHandler.removePage);
app.get('/showAllRemovedPage/:pageNumber', authUser.authUser,adminHandler.showAllRemovedPage);
app.get('/sendcardAndcoupan/:id', authUser.authUser,adminHandler.sendcardAndcoupan);
app.get('/findAllCities', authUser.authUser,adminHandler.findAllCities);
app.get('/unPublishedPage/:pageNumber', authUser.authUser,adminHandler.unPublishedPage);
app.post('/createCards', authUser.authUser,adminHandler.createCards);
app.get('/viewCards/:type', authUser.authUser,adminHandler.viewCards);
app.post('/editCards', authUser.authUser,adminHandler.editCards);
app.get('/showCardDetails/:id', authUser.authUser,adminHandler.showCardDetails);
app.get('/removeCard/:id', authUser.authUser,adminHandler.removeCard);
app.post('/createOfferOnCard', authUser.authUser,adminHandler.createOfferOnCard);
app.post('/createPage', authUser.authUser,adminHandler.createPage);
app.post('/showOfferOnCards/:pageNumber', adminHandler.showOfferOnCards);
app.get('/showUserPage/:id', authUser.authUser,adminHandler.showUserPage);
app.get('/adsOnPage/:id', authUser.authUser,adminHandler.adsOnPage);
app.get('/winnersOnPage/:id', authUser.authUser,adminHandler.winnersOnPage);
app.get('/pageAdminsDetail/:id', authUser.authUser,adminHandler.pageAdminsDetail);
app.get('/showReportOnAd/:id', authUser.authUser,adminHandler.showReportOnAd);
app.get('/ownerDetails/:id', authUser.authUser,adminHandler.ownerDetails);
app.get('/PagesAdmins', authUser.authUser,adminHandler.PagesAdmins);
app.post('/luckCardUsedAd', authUser.authUser,adminHandler.luckCardUsedAd);
app.post('/upgradeCardUsedAd', authUser.authUser,adminHandler.upgradeCardUsedAd);
app.get('/paymentHistoryUpgradeCard/:id', authUser.authUser,adminHandler.paymentHistoryUpgradeCard);
app.get('/paymentHistoryLuckCard/:id', authUser.authUser,adminHandler.paymentHistoryLuckCard);
app.get('/userInfo/:id', authUser.authUser,adminHandler.userInfo);
app.get('/totalBrolixGift', authUser.authUser,adminHandler.totalBrolixGift);
app.get('/totalCouponGifts/:pageNumber', authUser.authUser,adminHandler.totalCouponGifts);
app.get('/cashGift/:pageNumber', authUser.authUser,adminHandler.cashGift);
app.get('/showReportedAd/:pageNumber', authUser.authUser,adminHandler.showReportedAd);
app.get('/adUpgradedByDollor/:pageNumber', authUser.authUser,adminHandler.adUpgradedByDollor);
app.get('/adUpgradedByBrolix/:pageNumber', authUser.authUser,adminHandler.adUpgradedByBrolix);
app.get('/soldCoupon/:pageNumber', authUser.authUser,adminHandler.soldCoupon);
app.get('/totalCashGifts/:pageNumber', authUser.authUser,adminHandler.totalCashGifts);
app.get('/totalHiddenGifts/:pageNumber', authUser.authUser,adminHandler.totalHiddenGifts);
app.get('/totalExchangedCoupon/:pageNumber', authUser.authUser,adminHandler.totalExchangedCoupon);
app.get('/totalSentCoupon/:pageNumber', authUser.authUser,adminHandler.totalSentCoupon);
app.get('/totalSentCash/:pageNumber', authUser.authUser,adminHandler.totalSentCash);
app.get('/pageInfo/:id', authUser.authUser,adminHandler.pageInfo);
app.get('/topFiftyBalances', authUser.authUser,adminHandler.topFiftyBalances);
app.get('/topFiftyUpgradeCardBuyers/:pageNumber', authUser.authUser,adminHandler.topFiftyUpgradeCardBuyers);
app.get('/totalBrolixPrice', authUser.authUser,adminHandler.totalBrolixPrice);
app.get('/totalCashPrice', authUser.authUser,adminHandler.totalCashPrice);
app.get('/adInfo/:id', authUser.authUser,adminHandler.adInfo);
app.get('/topFiftyLuckCardBuyers/:pageNumber', authUser.authUser,adminHandler.topFiftyLuckCardBuyers);
app.get('/topFiftyAds', authUser.authUser,adminHandler.topFiftyAds);
app.get('/unblockUser/:userId', authUser.authUser,adminHandler.unblockUser);
app.post('/addNewCoupon', authUser.authUser,adminHandler.addNewCoupon);
app.get('/viewCoupon/:id', authUser.authUser,adminHandler.viewCoupon);
app.put('/editCoupon/:id', authUser.authUser,adminHandler.editCoupon);
app.post('/removeCoupon', authUser.authUser,adminHandler.removeCoupon);
app.get('/showListOFCoupon/:pageNumber', adminHandler.showListOFCoupon);

app.get('/showListOFCouponWithoutPagination', authUser.authUser,adminHandler.showListOFCouponWithoutPagination);
app.get('/showPageName', authUser.authUser,adminHandler.showPageName);
app.post('/createSystemUser', authUser.authUser,adminHandler.createSystemUser);
app.post('/checkPermission', authUser.authUser,adminHandler.checkPermission);
app.post('/adsfilter/:pageNumber', authUser.authUser,adminHandler.adsfilter);
app.post('/luckUpgradeCardfilter/:pageNumber', authUser.authUser,adminHandler.luckUpgradeCardfilter);
app.post('/giftsFilter/:pageNumber', authUser.authUser,adminHandler.giftsFilter);
app.post('/brolixPaymentFilter/:pageNumber', authUser.authUser,adminHandler.brolixPaymentFilter);
app.post('/dollorPaymentFilter/:pageNumber', authUser.authUser,adminHandler.dollorPaymentFilter);
app.get('/listOfAds', authUser.authUser,adminHandler.listOfAds);
app.get('/listOfAllAds', authUser.authUser,adminHandler.listOfAllAds);
app.get('/allCountriesfind', authUser.authUser,adminHandler.allCountriesfind);
app.post('/allstatefind', authUser.authUser,adminHandler.allstatefind);
app.post('/sendCashBrolix', authUser.authUser,adminHandler.sendCashBrolix);
app.post('/messageBroadcast', authUser.authUser,adminHandler.messageBroadcast);
app.post('/uploadImage', authUser.authUser,adminHandler.uploadImage);
app.post('/zipcodFunction', authUser.authUser,adminHandler.zipcodFunction);
app.get('/topFiftyCashProviders', authUser.authUser,adminHandler.topFiftyCashProviders);
app.get('/topFiftyCouponProviders', authUser.authUser,adminHandler.topFiftyCouponProviders);
app.get('/adsWithLinks/:pageNumber', authUser.authUser,adminHandler.adsWithLinks);
app.put('/postCouponToStore/:id', authUser.authUser,adminHandler.postCouponToStore);
app.get('/listOfSystemAdmin/:pageNumber', authUser.authUser,adminHandler.listOfSystemAdmin);
app.get('/removeSystemAdmin/:id', authUser.authUser,adminHandler.removeSystemAdmin);
app.put('/editSystemAdmin/:id', authUser.authUser,adminHandler.editSystemAdmin);
app.get('/notificationToAdmin', authUser.authUser,authUser.authUser,adminHandler.notificationToAdmin);
app.post('/userfilter/:pageNumber', authUser.authUser,authUser.authUser,adminHandler.userfilter);
app.post('/pagefilter/:pageNumber', authUser.authUser,authUser.authUser,adminHandler.pagefilter);
app.get('/adAdminUserList', authUser.authUser,authUser.authUser,adminHandler.adAdminUserList);
app.put('/editPage/:id', authUser.authUser,authUser.authUser,adminHandler.editPage);
app.get('/removeAds/:id', authUser.authUser,authUser.authUser,adminHandler.removeAds);
app.put('/editAdminProfile/:id', authUser.authUser,adminHandler.editAdminProfile);
app.post('/sendCouponTOUSers', authUser.authUser,adminHandler.sendCouponTOUSers);
app.get('/blockPage/:id', authUser.authUser,adminHandler.blockPage);
app.get('/unBlockPage/:id', authUser.authUser,adminHandler.unBlockPage);
app.post('/uploads', authUser.authUser,adminHandler.uploads);
app.post('/sendLuckCardTOUsers', authUser.authUser,adminHandler.sendLuckCardTOUsers);
app.post('/sendUpgradeCardTOUsers', authUser.authUser,adminHandler.sendUpgradeCardTOUsers);
app.post('/paymentHistory', authUser.authUser,adminHandler.paymentHistory);
app.get('/liveUser/:pageNumber', authUser.authUser,adminHandler.liveUser);
app.get('/showUserAllPages/:id', authUser.authUser,adminHandler.showUserAllPages);
app.get('/listOfCategory', authUser.authUser,adminHandler.listOfCategory);
app.post('/subCategoryData', authUser.authUser,adminHandler.subCategoryData);
app.get('/adsDetail/:id', authUser.authUser,adminHandler.adsDetail);


module.exports = app;
