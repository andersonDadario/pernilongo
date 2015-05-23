var SampleController = function(){}

SampleController.new = function(params){
    HttpHelper.loadPage({
        'viewUrl' : 'sample/new.html'
    });
}