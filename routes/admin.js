var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');
var authUser = require('../middlewares/authUser');

app.post('/removeOfferonCards', adminHandler.removeOfferonCards);

app.post('/editOfferonCards', adminHandler.editOfferonCards);
app.get('/countryListData', authUser.authUser, adminHandler.countryListData);
app.post('/cityListData', adminHandler.cityListData);

app.post('/login', adminHandler.login);
app.get('/adminProfile', authUser.authUser, adminHandler.adminProfile);
app.post('/addNewUser', authUser.authUser, adminHandler.addNewUser);
app.post('/sendBrolix', authUser.authUser, adminHandler.sendBrolix);
app.get('/countrys', authUser.authUser, adminHandler.countrys);
app.get('/getAllStates/:name/:code', authUser.authUser, adminHandler.getAllStates);
app.get('/viewProfile/:id', authUser.authUser, adminHandler.viewProfile);
app.put('/editUserProfile/:id', authUser.authUser, adminHandler.editUserProfile);
app.get('/totalPages', authUser.authUser, adminHandler.totalPages);
app.get('/viewPage/:id', authUser.authUser, adminHandler.viewPage);


/*----------------------Manage Users------------------------*/

app.get('/showAllUser', authUser.authUser, adminHandler.showAllUser);
app.get('/showAllPersonalUser', authUser.authUser, adminHandler.showAllPersonalUser);
app.get('/showAllBusinessUser', authUser.authUser, adminHandler.showAllBusinessUser);
app.get('/winners', authUser.authUser, adminHandler.winners);
app.get('/couponWinners', authUser.authUser, adminHandler.couponWinners);
app.get('/cashWinners', authUser.authUser, adminHandler.cashWinners);
app.get('/showAllBlockUser', authUser.authUser, adminHandler.showAllBlockUser);
app.get('/blockUser/:userId', authUser.authUser, adminHandler.blockUser);

/*--------------------------Manage Cards--------------------------*/


app.get('/totalSoldUpgradeCard', adminHandler.totalSoldUpgradeCard);
app.get('/totalSoldLuckCard', authUser.authUser, adminHandler.totalSoldLuckCard);
app.get('/totalIncomeInBrolixFromLuckCard', authUser.authUser, adminHandler.totalIncomeInBrolixFromLuckCard);
app.get('/totalIncomeInCashFromUpgradeCard', authUser.authUser, adminHandler.totalIncomeInCashFromUpgradeCard);
app.get('/usedLuckCard', authUser.authUser, adminHandler.usedLuckCard);
app.get('/unUsedLuckCard', authUser.authUser, adminHandler.unUsedLuckCard);
app.get('/usedUpgradeCard', authUser.authUser, adminHandler.usedUpgradeCard);
app.get('/unUsedUpgradeCard', authUser.authUser, adminHandler.unUsedUpgradeCard);

/*-------------------------Manage ADS---------------------*/

app.post('/showOfferCountOnCards', adminHandler.showOfferCountOnCards);

app.post('/getOfferList', adminHandler.getOfferList);
app.get('/totalAds', authUser.authUser, adminHandler.totalAds);
app.get('/totalActiveAds', authUser.authUser, adminHandler.totalActiveAds);
app.get('/totalExpiredAds', authUser.authUser, adminHandler.totalExpiredAds);
app.get('/videoAds', authUser.authUser, adminHandler.videoAds);
app.get('/slideshowAds', authUser.authUser, adminHandler.slideshowAds);
app.get('/showAllBlockedPage', authUser.authUser, adminHandler.showAllBlockedPage);
app.get('/removePage/:id', authUser.authUser, adminHandler.removePage);
app.get('/showAllRemovedPage', authUser.authUser, adminHandler.showAllRemovedPage);
app.get('/sendcardAndcoupan/:id', authUser.authUser, adminHandler.sendcardAndcoupan);
app.get('/findAllCities', authUser.authUser, adminHandler.findAllCities);
app.get('/unPublishedPage', authUser.authUser, adminHandler.unPublishedPage);
app.post('/createCards', authUser.authUser, adminHandler.createCards);
app.get('/viewCards/:type', authUser.authUser, adminHandler.viewCards);
app.post('/editCards', authUser.authUser, adminHandler.editCards);
app.get('/showCardDetails/:id', authUser.authUser, adminHandler.showCardDetails);
app.get('/removeCard/:id', authUser.authUser, adminHandler.removeCard);
app.post('/createOfferOnCard', authUser.authUser, adminHandler.createOfferOnCard);
app.post('/createPage', authUser.authUser, adminHandler.createPage);
app.post('/showOfferOnCards', adminHandler.showOfferOnCards);
app.get('/showUserPage/:id', authUser.authUser, adminHandler.showUserPage);
app.get('/adsOnPage/:id', authUser.authUser, adminHandler.adsOnPage);
app.get('/winnersOnPage/:id', authUser.authUser, adminHandler.winnersOnPage);
app.get('/pageAdminsDetail/:id', authUser.authUser, adminHandler.pageAdminsDetail);
app.get('/showReportOnAd/:id', authUser.authUser, adminHandler.showReportOnAd);
app.get('/ownerDetails/:id', authUser.authUser, adminHandler.ownerDetails);
app.get('/PagesAdmins', authUser.authUser, adminHandler.PagesAdmins);
app.post('/luckCardUsedAd', authUser.authUser, adminHandler.luckCardUsedAd);
app.post('/upgradeCardUsedAd', authUser.authUser, adminHandler.upgradeCardUsedAd);
app.get('/paymentHistoryUpgradeCard/:id', authUser.authUser, adminHandler.paymentHistoryUpgradeCard);
app.get('/paymentHistoryLuckCard/:id', authUser.authUser, adminHandler.paymentHistoryLuckCard);
app.get('/userInfo/:id', authUser.authUser, adminHandler.userInfo);
app.get('/totalBrolixGift', authUser.authUser, adminHandler.totalBrolixGift);
app.get('/totalCouponGifts', adminHandler.totalCouponGifts);
app.get('/cashGift', authUser.authUser, adminHandler.cashGift);
app.get('/showReportedAd', authUser.authUser, adminHandler.showReportedAd);
app.get('/adUpgradedByDollor', authUser.authUser, adminHandler.adUpgradedByDollor);
app.get('/adUpgradedByBrolix', authUser.authUser, adminHandler.adUpgradedByBrolix);
app.get('/soldCoupon', authUser.authUser, adminHandler.soldCoupon);
app.get('/totalCashGifts', authUser.authUser, adminHandler.totalCashGifts);
app.get('/totalHiddenGifts', authUser.authUser, adminHandler.totalHiddenGifts);
app.get('/totalExchangedCoupon', authUser.authUser, adminHandler.totalExchangedCoupon);
app.get('/totalSentCoupon', adminHandler.totalSentCoupon);
app.get('/totalSentCash', authUser.authUser, adminHandler.totalSentCash);
app.get('/pageInfo/:id', authUser.authUser, adminHandler.pageInfo);
app.get('/topFiftyBalances', authUser.authUser, adminHandler.topFiftyBalances);
app.get('/topFiftyUpgradeCardBuyers', authUser.authUser, adminHandler.topFiftyUpgradeCardBuyers);
app.get('/totalBrolixPrice', authUser.authUser, adminHandler.totalBrolixPrice);
app.get('/totalCashPrice', authUser.authUser, adminHandler.totalCashPrice);
app.get('/adInfo/:id', authUser.authUser, adminHandler.adInfo);
app.get('/topFiftyLuckCardBuyers', authUser.authUser, adminHandler.topFiftyLuckCardBuyers);
app.get('/topFiftyAds', authUser.authUser, adminHandler.topFiftyAds);
app.get('/unblockUser/:userId', authUser.authUser, adminHandler.unblockUser);
app.post('/addNewCoupon', authUser.authUser, adminHandler.addNewCoupon);
app.get('/viewCoupon/:id', authUser.authUser, adminHandler.viewCoupon);
app.put('/editCoupon/:id', authUser.authUser, adminHandler.editCoupon);
app.post('/removeCoupon', authUser.authUser, adminHandler.removeCoupon);
app.get('/showListOFCoupon', adminHandler.showListOFCoupon);

app.get('/showListOFCouponWithoutPagination', authUser.authUser, adminHandler.showListOFCouponWithoutPagination);
app.get('/showPageName', authUser.authUser, adminHandler.showPageName);
app.post('/createSystemUser', authUser.authUser, adminHandler.createSystemUser);
app.post('/checkPermission', authUser.authUser, adminHandler.checkPermission);
app.post('/adsfilter', adminHandler.adsfilter);
app.post('/luckUpgradeCardfilter', authUser.authUser, adminHandler.luckUpgradeCardfilter);
app.post('/giftsFilter', adminHandler.giftsFilter);
app.post('/brolixPaymentFilter', authUser.authUser, adminHandler.brolixPaymentFilter);
app.post('/dollorPaymentFilter', authUser.authUser, adminHandler.dollorPaymentFilter);
app.get('/listOfAds', authUser.authUser, adminHandler.listOfAds);
app.get('/listOfAllAds', authUser.authUser, adminHandler.listOfAllAds);
app.get('/allCountriesfind', authUser.authUser, adminHandler.allCountriesfind);
app.post('/allstatefind', authUser.authUser, adminHandler.allstatefind);
app.post('/sendCashBrolix', authUser.authUser, adminHandler.sendCashBrolix);
app.post('/messageBroadcast', authUser.authUser, adminHandler.messageBroadcast);
app.post('/uploadImage', authUser.authUser, adminHandler.uploadImage);
app.post('/zipcodFunction', authUser.authUser, adminHandler.zipcodFunction);
app.get('/topFiftyCashProviders', authUser.authUser, adminHandler.topFiftyCashProviders);
app.get('/topFiftyCouponProviders', authUser.authUser, adminHandler.topFiftyCouponProviders);
app.get('/adsWithLinks', authUser.authUser, adminHandler.adsWithLinks);
app.put('/postCouponToStore/:id', authUser.authUser, adminHandler.postCouponToStore);
app.get('/listOfSystemAdmin', authUser.authUser, adminHandler.listOfSystemAdmin);
app.get('/removeSystemAdmin/:id', authUser.authUser, adminHandler.removeSystemAdmin);
app.put('/editSystemAdmin/:id', authUser.authUser, adminHandler.editSystemAdmin);
app.get('/notificationToAdmin', authUser.authUser, adminHandler.notificationToAdmin);
app.post('/userfilter', adminHandler.userfilter);
app.post('/pagefilter', authUser.authUser, adminHandler.pagefilter);
app.get('/adAdminUserList', authUser.authUser, adminHandler.adAdminUserList);
app.put('/editPage/:id', authUser.authUser, adminHandler.editPage);
app.get('/removeAds/:id', authUser.authUser, adminHandler.removeAds);
app.put('/editAdminProfile/:id', authUser.authUser, adminHandler.editAdminProfile);
app.post('/sendCouponTOUSers', authUser.authUser, adminHandler.sendCouponTOUSers);
app.get('/blockPage/:id', authUser.authUser, adminHandler.blockPage);
app.get('/unBlockPage/:id', authUser.authUser, adminHandler.unBlockPage);
app.post('/uploads', authUser.authUser, adminHandler.uploads);
app.post('/sendLuckCardTOUsers', authUser.authUser, adminHandler.sendLuckCardTOUsers);
app.post('/sendUpgradeCardTOUsers', authUser.authUser, adminHandler.sendUpgradeCardTOUsers);
app.post('/paymentHistory', authUser.authUser, adminHandler.paymentHistory);
app.get('/liveUser', authUser.authUser, adminHandler.liveUser);
app.get('/showUserAllPages/:id', authUser.authUser, adminHandler.showUserAllPages);
app.get('/listOfCategory', authUser.authUser, adminHandler.listOfCategory);
app.post('/subCategoryData', authUser.authUser, adminHandler.subCategoryData);
app.get('/adsDetail/:id', authUser.authUser, adminHandler.adsDetail);
app.get('/showAllReports', authUser.authUser, adminHandler.showAllReports);
app.get('/upgradeCardViewersList', authUser.authUser, adminHandler.upgradeCardViewersList);
app.get('/luckCardViewersList', authUser.authUser, adminHandler.luckCardViewersList);

module.exports = app;
