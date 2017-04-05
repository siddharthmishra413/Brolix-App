var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');



app.post('/login', adminHandler.login);
app.get('/adminProfile', adminHandler.adminProfile);
app.post('/addNewUser', adminHandler.addNewUser);
app.post('/sendBrolix', adminHandler.sendBrolix);
app.get('/countrys', adminHandler.countrys);
app.get('/getAllStates/:name/:code', adminHandler.getAllStates);
app.get('/viewProfile/:id', adminHandler.viewProfile);
app.put('/editUserProfile/:id', adminHandler.editUserProfile);
app.get('/totalPages', adminHandler.totalPages);
app.get('/viewPage/:id', adminHandler.viewPage);


/*----------------------Manage Users------------------------*/

app.get('/showAllUser', adminHandler.showAllUser);
app.get('/showAllPersonalUser', adminHandler.showAllPersonalUser);
app.get('/showAllBusinessUser', adminHandler.showAllBusinessUser);
app.get('/winners', adminHandler.winners);
app.get('/couponWinners', adminHandler.couponWinners);
app.get('/cashWinners', adminHandler.cashWinners);
app.get('/showAllBlockUser', adminHandler.showAllBlockUser);
app.get('/blockUser/:userId', adminHandler.blockUser);

/*--------------------------Manage Cards--------------------------*/


app.get('/totalSoldUpgradeCard', adminHandler.totalSoldUpgradeCard);
app.get('/totalSoldLuckCard', adminHandler.totalSoldLuckCard);
app.get('/totalIncomeInBrolixFromLuckCard', adminHandler.totalIncomeInBrolixFromLuckCard);
app.get('/totalIncomeInCashFromUpgradeCard', adminHandler.totalIncomeInCashFromUpgradeCard);
app.get('/usedLuckCard', adminHandler.usedLuckCard);
app.get('/unUsedLuckCard', adminHandler.unUsedLuckCard);
app.get('/usedUpgradeCard', adminHandler.usedUpgradeCard);
app.get('/unUsedUpgradeCard', adminHandler.unUsedUpgradeCard);

/*-------------------------Manage ADS---------------------*/

app.get('/totalAds', adminHandler.totalAds);
app.get('/totalActiveAds', adminHandler.totalActiveAds);
app.get('/totalExpiredAds', adminHandler.totalExpiredAds);
app.get('/videoAds', adminHandler.videoAds);
app.get('/slideshowAds', adminHandler.slideshowAds);
app.get('/totalPages/:pageNumber', adminHandler.totalPages);
app.post('/blockPage', adminHandler.blockPage);
app.get('/showAllBlockedPage', adminHandler.showAllBlockedPage);
app.get('/removePage/:id', adminHandler.removePage);
app.get('/showAllRemovedPage', adminHandler.showAllRemovedPage);
app.get('/sendcardAndcoupan/:id', adminHandler.sendcardAndcoupan);
app.get('/findAllCities', adminHandler.findAllCities);
app.get('/unPublishedPage', adminHandler.unPublishedPage);
app.post('/createCards', adminHandler.createCards);
app.get('/viewCards/:type', adminHandler.viewCards);
app.post('/editCards', adminHandler.editCards);
app.get('/showCardDetails/:id', adminHandler.showCardDetails);
app.get('/removeCard/:id', adminHandler.removeCard);
app.post('/createOfferOnCard', adminHandler.createOfferOnCard);
app.post('/createPage', adminHandler.createPage);
app.post('/showOfferOnCards', adminHandler.showOfferOnCards);
app.get('/showUserPage/:id', adminHandler.showUserPage);
app.get('/adsOnPage/:id', adminHandler.adsOnPage);
app.get('/winnersOnPage/:id', adminHandler.winnersOnPage);
app.get('/pageAdminsDetail/:id', adminHandler.pageAdminsDetail);
app.get('/showReportOnAd/:id', adminHandler.showReportOnAd);
app.get('/ownerDetails/:id', adminHandler.ownerDetails);
app.get('/PagesAdmins', adminHandler.PagesAdmins);
app.post('/luckCardUsedAd', adminHandler.luckCardUsedAd);
app.post('/upgradeCardUsedAd', adminHandler.upgradeCardUsedAd);
app.get('/paymentHistoryUpgradeCard/:id', adminHandler.paymentHistoryUpgradeCard);
app.get('/paymentHistoryLuckCard/:id', adminHandler.paymentHistoryLuckCard);
app.get('/userInfo/:id', adminHandler.userInfo);
app.get('/totalBrolixGift', adminHandler.totalBrolixGift);
app.get('/totalCouponGifts', adminHandler.totalCouponGifts);
app.get('/cashGift', adminHandler.cashGift);
app.get('/showReportedAd', adminHandler.showReportedAd);
app.get('/adUpgradedByDollor', adminHandler.adUpgradedByDollor);
app.get('/adUpgradedByBrolix', adminHandler.adUpgradedByBrolix);
app.get('/soldCoupon', adminHandler.soldCoupon);
app.get('/totalCashGifts', adminHandler.totalCashGifts);
app.get('/totalHiddenGifts', adminHandler.totalHiddenGifts);
app.get('/totalExchangedCoupon', adminHandler.totalExchangedCoupon);
app.get('/totalSentCoupon', adminHandler.totalSentCoupon);
app.get('/totalSentCash', adminHandler.totalSentCash);
app.get('/pageInfo/:id', adminHandler.pageInfo);
app.get('/topFiftyBalances', adminHandler.topFiftyBalances);
app.get('/topFiftyUpgradeCardBuyers', adminHandler.topFiftyUpgradeCardBuyers);
app.get('/totalBrolixPrice', adminHandler.totalBrolixPrice);
app.get('/totalCashPrice', adminHandler.totalCashPrice);
app.get('/adInfo/:id', adminHandler.adInfo);
app.get('/topFiftyLuckCardBuyers', adminHandler.topFiftyLuckCardBuyers);
app.get('/topFiftyAds', adminHandler.topFiftyAds);
app.get('/unblockUser/:userId', adminHandler.unblockUser);
app.post('/addNewCoupon', adminHandler.addNewCoupon);
app.get('/viewCoupon/:id', adminHandler.viewCoupon);
app.put('/editCoupon/:id', adminHandler.editCoupon);
app.post('/removeCoupon', adminHandler.removeCoupon);
app.get('/showListOFCoupon', adminHandler.showListOFCoupon);
app.get('/showPageName', adminHandler.showPageName);
app.post('/createSystemUser', adminHandler.createSystemUser);
app.post('/checkPermission', adminHandler.checkPermission);

app.post('/adsfilter', adminHandler.adsfilter);
app.post('/luckUpgradeCardfilter', adminHandler.luckUpgradeCardfilter);
app.post('/giftsFilter', adminHandler.giftsFilter);
app.post('/brolixPaymentFilter', adminHandler.brolixPaymentFilter);
app.post('/dollorPaymentFilter', adminHandler.dollorPaymentFilter);


app.post('/listOfAds', adminHandler.listOfAds);
app.get('/listOfAllAds', adminHandler.listOfAllAds);
app.get('/allCountriesfind', adminHandler.allCountriesfind);
app.post('/allstatefind', adminHandler.allstatefind);
app.post('/sendCashBrolix', adminHandler.sendCashBrolix);
app.post('/messageBroadcast', adminHandler.messageBroadcast);
app.post('/uploadImage', adminHandler.uploadImage);
app.post('/zipcodFunction', adminHandler.zipcodFunction);
app.get('/topFiftyCashProviders', adminHandler.topFiftyCashProviders);
app.get('/topFiftyCouponProviders', adminHandler.topFiftyCouponProviders);
app.get('/adsWithLinks', adminHandler.adsWithLinks);
app.put('/postCouponToStore/:id', adminHandler.postCouponToStore);
app.get('/listOfSystemAdmin', adminHandler.listOfSystemAdmin);
app.get('/removeSystemAdmin/:id', adminHandler.removeSystemAdmin);
app.put('/editSystemAdmin/:id', adminHandler.editSystemAdmin);
app.get('/notificationToAdmin', adminHandler.notificationToAdmin);
app.post('/userfilter', adminHandler.userfilter);
app.post('/pagefilter', adminHandler.pagefilter);
app.get('/adAdminUserList', adminHandler.adAdminUserList);
app.put('/editPage/:id', adminHandler.editPage);
app.post('/systemAdminLogin', adminHandler.systemAdminLogin);
app.get('/removeAds/:id', adminHandler.removeAds);
app.put('/editAdminProfile/:id', adminHandler.editAdminProfile);
app.post('/sendCouponTOUSers', adminHandler.sendCouponTOUSers);
app.get('/blockPage/:id', adminHandler.removeSystemAdmin);
app.get('/unBlockPage/:id', adminHandler.removeSystemAdmin);
app.post('/uploads', adminHandler.uploads);
app.post('/sendLuckCardTOUsers', adminHandler.sendLuckCardTOUsers);
app.post('/sendUpgradeCardTOUsers', adminHandler.sendUpgradeCardTOUsers);


module.exports = app;
