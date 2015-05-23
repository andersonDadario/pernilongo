var Routes = function(options){
    var root = this;
    var vars = { 'path': '', 'data': '' };
    $.extend(vars, options);

    var routes = {
        '^$' : function(params) {
            // Default Route
            SampleController.index(params);
        }
    }

    this.render = function(path){
        if(!path){ var path = vars['path']; }
        var match = false;

        $.each(routes, function(key, value){
            var pattern = new RegExp(key);
            if(path.search(pattern) == 0){
                var matches = pattern.exec(path);
                value({
                    'regex' : matches,
                    'data' : vars['data']
                });
                match = true;
                return false;
            }
        });

        return match;
    }
}

// Public Routes
Routes.isPublic = function(path){
    var public_route = false;
    var public_routes = [
        /* Example:
        '^#/login$',
        '^#/login/create$',
        '^#/account/new$',
        '^#/account/create$',
        '^#/account/forgot$',
        '^#/account/forgot/create$'
        */
    ];

    $.each(public_routes, function(index, value){
        var pattern = new RegExp(value);
        if(path.search(pattern) == 0){
            public_route = true;
            return false;
        }
    });

    return public_route;
}

// Forward
var forwardTo = function(hash, data){
    render(hash, data);
}

// Redirect
var redirectTo = function(hash, data){
    window.location.hash = hash;
}

// Render page after hash
var render = function (uri, data) {
    var routes = new Routes({
        'path' : uri,
        'data' : data
    });
    if(!routes.render()){
        var error_message = "Page not found."
        MessageHelper.ErrorMessage.create(error_message);
    }
}

// Whenever the Hash Change, we render again
$(window).on('hashchange', function(){
    render(window.location.hash, null);
});