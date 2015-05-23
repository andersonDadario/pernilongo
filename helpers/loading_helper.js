var LoadingHelper = function(){ }

LoadingHelper.doesLoadingExist = function(label){
    return ($(".loading[data-label='"+label+"']").length > 0);
}

LoadingHelper.create = function(label){
    var display = '';
    if($(".loading").length > 0) display = '; display:none';

    var style = 'style="background-color: #FFF; border:1px dotted orange' + display + '"';
    var loading = '<div class="alert loading" data-label="'+label+'" '+style+'>';
    // loading += '<img src="images/spin.gif" alt="Loading..." /> ';
    loading += 'Loading...';
    loading += '</div>';

    currentLayer().prepend(loading);
}

LoadingHelper.remove = function(label){
    var loading_selector = ".loading[data-label='"+label+"']";
    var fadeOutSpeed = "fast";
    if($(".loading").length > 1) fadeOutSpeed = 0;

    $(loading_selector).fadeOut(fadeOutSpeed, function(){
      $(this).remove();
      $(".loading:hidden:first").show();
    });
}