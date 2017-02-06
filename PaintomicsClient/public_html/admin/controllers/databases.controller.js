/*
* (C) Copyright 2014 The Genomics of Gene Expression Lab, CIPF
* (http://bioinfo.cipf.es/aconesawp) and others.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the GNU Lesser General Public License
* (LGPL) version 3 which accompanies this distribution, and is available at
* http://www.gnu.org/licenses/lgpl.html
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*
* Contributors:
*     Rafael Hernandez de Diego
*     rhernandez@cipf.es
*     Ana Conesa Cegarra
*     aconesa@cipf.es
*
* THIS FILE CONTAINS THE FOLLOWING MODULE DECLARATION
* - DatabaseListController
* -
*
*/
(function(){
	var app = angular.module('admin.controllers.database-list', [
		'ui.bootstrap',
		'common.dialogs',
		'chart.js',
		'databases.databases.database-list'
	]);

	app.controller('DatabaseListController', function($rootScope, $scope, $http, $dialogs, $state, $interval, APP_EVENTS, DatabaseList) {
		//--------------------------------------------------------------------
		// CONTROLLER FUNCTIONS
		//--------------------------------------------------------------------
		this.retrieveDatabasesListData = function(force, callback_caller, callback_function){
			$scope.isLoading = true;

			if(DatabaseList.getOld() > 1 || force){ //Max age for data 5min.
				$http($rootScope.getHttpRequestConfig("GET", "databases", {})).
				then(
					function successCallback(response){
						$scope.isLoading = false;
						$scope.databases = DatabaseList.setDatabases(response.data).getDatabases();

						if(callback_function !== undefined){
							callback_caller[callback_function]();
						}
					},
					function errorCallback(response){
						$scope.isLoading = false;

						debugger;
						var message = "Failed while retrieving the databases list.";
						$dialogs.showErrorDialog(message, {
							logMessage : message + " at DatabaseListController:retrieveDatabasesListData."
						});
						console.error(response.data);
					}
				);
			}else{
				$scope.databases = DatabaseList.getDatabases();
				$scope.isLoading = false;
			}
		};

		this.retrieveAvailableDatabases = function(){
			$scope.isLoading = true;

			$http($rootScope.getHttpRequestConfig("GET", "databases", {
				extra: "available"
			})).
			then(
				function successCallback(response){
					$scope.isLoading = false;
					$scope.databases = DatabaseList.updateDatabases(response.data.availableApps, true).getDatabases();
					$scope.categories = DatabaseList.updateCategories().getCategories();
				},
				function errorCallback(response){
					$scope.isLoading = false;

					debugger;
					var message = "Failed while checking the available databases.";
					$dialogs.showErrorDialog(message, {
						logMessage : message + " at DatabaseListController:checkAvailableDatabases."
					});
					console.error(response.data);
				}
			);
		};

		/**
		* This function defines the behaviour for the "filterWorkflows" function.
		* Given a item (database) and a set of filters, the function evaluates if
		* the current item contains the set of filters within the different attributes
		* of the model.
		*
		* @returns {Boolean} true if the model passes all the filters.
		*/
		$scope.filterDatabases = function(propertyName) {
			$scope.foundDatabases = $scope.foundDatabases || {};
			$scope.foundDatabases[propertyName] = 0;
			return function( item ) {
				var filterAux, item_categories;
				var valid = ($scope.searchFor !== undefined) && ($scope.searchFor.length > $scope.minSearchLength) && (item[propertyName].toLowerCase().indexOf( $scope.searchFor.toLowerCase()) !== -1);
				if(valid){$scope.foundDatabases[propertyName]++;}
				return valid;
			};
		};

		//--------------------------------------------------------------------
		// EVENT HANDLERS
		//--------------------------------------------------------------------
		/**
		* This function applies the filters when the user clicks on "Search"
		*/
		this.applySearchHandler = function() {
			var filters = arrayUnique($scope.filters.concat($scope.searchFor.split(" ")));
			$scope.filters = WorkflowList.setFilters(filters).getFilters();
		};

		this.launchDatabaseHandler = function(database){
			$rootScope.$broadcast(APP_EVENTS.launchDatabase, database);
		};

		//--------------------------------------------------------------------
		// INITIALIZATION
		//--------------------------------------------------------------------
		var me = this;
		$scope.databases = DatabaseList.getDatabases();
		$scope.minSearchLength = 2;
		$scope.categories =  DatabaseList.getCategories();
		$scope.filters =  DatabaseList.getFilters();
		$scope.filteredDatabases = $scope.databases.length;

		if($state.current.name === "control-panel"){
			this.retrieveDatabasesListData(true, this, "checkAvailableUpdates");
			this.retrieveSystemInfo();
			while($scope.interval.length > 0){
				$interval.cancel($scope.interval[0]);
				$scope.interval.shift();
			}
			$scope.interval.push($interval(this.retrieveSystemInfo, 1000));

			$scope.cpu_load = [0, 100];
			$scope.cpu_options = {
				animation: {duration: 500},
				tooltip:{enabled:false},
				title: {display: true,text: 'CPU usage (%)'},
				maintainAspectRatio:false
			};
			$scope.mem_load = [0, 100];
			$scope.mem_options = {
				animation: {duration: 500},
				title: {display: true,text: 'Mem usage (%)'},
				tooltip:{enabled:false},
				maintainAspectRatio:false
			};
			$scope.swap_load = [0, 100];
			$scope.swap_options = {
				animation: {duration: 500},
				tooltip:{enabled:false},
				title: {display: true,text: 'Swap usage (%)'},
				maintainAspectRatio:false
			};
		} else{
			this.retrieveDatabasesListData(true, this, "retrieveAvailableApplications");
		}

	});

	app.controller('DatabaseController', function($rootScope, $scope, $http, $dialogs, APP_EVENTS, DatabaseList) {
		//--------------------------------------------------------------------
		// CONTROLLER FUNCTIONS
		//--------------------------------------------------------------------
		this.checkDatabaseStatus = function(database){
			delete database.status;
			delete database.status_msg;
			$scope.current_action = "Checking status";

			$http($rootScope.getHttpRequestConfig("GET", "database-status", {
				extra: database.database
			})).then(
				function successCallback(response){
					database.status = response.data.status;
					database.status_msg = response.data.status_msg;
				},
				function errorCallback(response){
					$scope.isLoading = false;

					debugger;
					var message = "Failed while retrieving the database status.";
					$dialogs.showErrorDialog(message, {
						logMessage : message + " at DatabaseController:checkDatabaseStatus."
					});
					console.error(response.data);
				}
			);
		};

		//--------------------------------------------------------------------
		// EVENT HANDLERS
		//--------------------------------------------------------------------

		this.stopDatabaseHandler = function(database){
			delete database.status;
			delete database.status_msg;
			$scope.current_action = "Stopping database";

			$http($rootScope.getHttpRequestConfig("GET", "database-stop", {
				extra: database.database
			})).then(
				function successCallback(response){
					me.checkDatabaseStatus(database);
				},
				function errorCallback(response){
					$scope.isLoading = false;

					debugger;
					var message = "Failed while stopping the database.";
					$dialogs.showErrorDialog(message, {
						logMessage : message + " at DatabaseController:stopDatabase."
					});
					console.error(response.data);
				}
			);
		};

		this.startDatabaseHandler = function(database){
			delete database.status;
			delete database.status_msg;
			$scope.current_action = "Starting database";

			$http($rootScope.getHttpRequestConfig("GET", "database-start", {
				extra: database.database
			})).then(
				function successCallback(response){
					me.checkDatabaseStatus(database);
				},
				function errorCallback(response){
					$scope.isLoading = false;

					debugger;
					var message = "Failed while starting the database.";
					$dialogs.showErrorDialog(message, {
						logMessage : message + " at DatabaseController:startDatabase."
					});
					console.error(response.data);
				}
			);
		};

		this.restartDatabaseHandler = function(database){
			delete database.status;
			delete database.status_msg;
			$scope.current_action = "Restarting database";

			$http($rootScope.getHttpRequestConfig("GET", "database-restart", {
				extra: database.database
			})).then(
				function successCallback(response){
					me.checkDatabaseStatus(database);
				},
				function errorCallback(response){
					$scope.isLoading = false;

					debugger;
					var message = "Failed while restarting the database.";
					$dialogs.showErrorDialog(message, {
						logMessage : message + " at DatabaseController:restartDatabase."
					});
					console.error(response.data);
				}
			);
		};



		//--------------------------------------------------------------------
		// INITIALIZATION
		//--------------------------------------------------------------------
		var me = this;

		if($scope.database.enabled && $scope.database.status === undefined){
			this.checkDatabaseStatus($scope.database);
		}
	});
})();
