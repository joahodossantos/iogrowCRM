/**
 * Created by Ghiboub khalid on 9/29/15.
 */

app.controller('SynchronisationEditCtrl', ['$scope', 'Auth', 'User', 'Map',
    function ($scope, Auth, User, Map) {
        $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Synchronisation").addClass("active");
    }]);