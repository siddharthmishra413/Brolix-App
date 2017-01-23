app.service('adminServices',function(){
this.userDetail="null"; 
this.eventDetail="null";  

});

app.service('userService',function($http){

	return{
	  signup: function(data) {
      return $http.post('/signup', data);
    },
    login: function(data) {
      return $http.post('/admin/login', data);
    },
    adminProfile: function() {
      return $http.get('/admin/adminProfile');
    },
    addUser: function(data) {
      return $http.post('/admin/addNewUser', data);
    },
    totalUser: function() {
      return $http.get('/admin/showAllUser');
    },
    showAllPersonalUser: function() {
      return $http.get('/admin/showAllPersonalUser');
    },
    showAllBusinessUser: function() {
      return $http.get('/admin/showAllBusinessUser');
    },
    totalWinners: function() {
      return $http.get('/admin/winners');
    },
    countrys: function() {
      return $http.get('/admin/countrys');
    },
    userProfile: function(id) {
      return $http.get('/admin/userProfile/'+id);
    },
    editUserProfile: function(id, data) {
      return $http.put('/admin/editUserProfile/'+id, data);
    },
    totalPages: function() {
      return $http.get('/admin/totalPages');
    },
    viewPage: function(id) {
      return $http.get('/admin/viewPage/'+id);
    }

	}


});