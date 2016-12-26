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
    }

	}


});