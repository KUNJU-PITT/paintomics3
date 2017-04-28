(function(){var app=angular.module("users.users.user-list",[]);app.factory("UserList",["$rootScope",function($rootScope){var users=[];var availableSpace=0;var filters=[];var old=new Date(0);return{getUsers:function(){return users},setUsers:function(userList){users=this.adaptUsersInformation(userList);old=new Date;return this},setAvailableSpace:function(_availableSpace){availableSpace=_availableSpace},updateUsers:function(newUsers,soft){return this},getUser:function(user_id){for(var i in users){if(users[i].id===user_id){return users[i]}}return null},addUser:function(user){users.push(this.adaptUserInformation(user));return this},deleteUser:function(user_id){for(var i in users){if(users[i].id===user_id){users.splice(i,1);return users}}return null},adaptUsersInformation:function(users){for(var i in users){this.adaptUserInformation(users[i])}return users},adaptUserInformation:function(user){return user},getFilters:function(){return filters},setFilters:function(_filters){filters=_filters;return this},removeFilter:function(_filter){var pos=filters.indexOf(_filter);if(pos!==-1){filters.splice(pos,1)}return this},getOld:function(){return(new Date-old)/12e4}}}])})();