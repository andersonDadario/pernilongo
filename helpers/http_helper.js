var HttpHelper = function(){}

HttpHelper.loadPage = function(extended_options){
  var options = {
    'url' : false,
    'apiUrl' : false,
    'viewUrl' : false,
    'context' : false,
    'method' : 'GET',
    'headers' : {},
    'data' : '',
    'modal' : {
      'enabled' : false,
      'title' : 'Dialog',
      'hide_close' : false,
      'params' : { 'show' : true }
    },
    'replace_element' : '#content',
    'statusCode' : {},
    'successFunction' : function(data, textStatus, jqXHR){
      if(options['context']){
        var template = Handlebars.compile(data);
        var data = template(options['context']);
      }

      // Is Modal?
      if(options['modal']['enabled']){
        if(options['modal']['hide_close']){
          $("#gpmodal > .modal-dialog > .modal-content > .modal-header > button").hide();
        } else {
          $("#gpmodal > .modal-dialog > .modal-content > .modal-header > button").show();
        }

        $("#gpmodal > .modal-dialog > .modal-content > .modal-body").html(data);
        $("#gpmodal > .modal-dialog > .modal-content > .modal-header > h3").html(options['modal']['title']);
        $('#gpmodal').modal(options['modal']['params']);
      } else {
        $(options['replace_element']).html(data);
      }
    },
    'errorFunction' : function(jqXHR, textStatus, errorThrown){
      if(jqXHR.status != "401"){
        MessageHelper.ErrorMessage.create(
          "Error while loading <i>" + path + "</i>"
        );
      }
    },
    'errorFunctionEpilogue' : function(jqXHR, textStatus, errorThrown){
      if(jqXHR.status == "401"){
        defaultPersistence.store('after_login', extended_options);
        forwardTo('#/login');
      }
    },
    'callback' : function(){},
    'skip_loading' : false,
    'skip_remove_loading' : false
  }
  $.extend(options, extended_options)

  // Add CSRF Protection
  if($.inArray(options['method'].toUpperCase(), ['POST','PUT','DELETE']) != -1){
    var nonce = Math.random().toString();
    $.cookie('X-CSRF-Token', nonce);

    if(options['data'] == ''){
      options['data'] = 'csrf_token=' + nonce;
    } else {
      options['data'] = options['data'] + '&csrf_token=' + nonce;
    }
  }

  // Patching URL
  if(options['url'])          var path = options['url'];
  else if(options['apiUrl'])  var path = conf['apiUrl'] + options['apiUrl'];
  else if(options['viewUrl']) var path = conf['viewUrl'] + options['viewUrl'];

  // Create Loading
  if(!options['skip_loading']){
    LoadingHelper.create(path);
  } else if (LoadingHelper.doesLoadingExist(path)){
    // Is request in progress? if yes, return
    return false;
  }
  
  // Ajax Request
  $.ajax({
    method: options['method'].toUpperCase(),
    url: path,
    data: options['data'],
    headers: options['headers'],
    xhrFields: {
      withCredentials: true
    },
    statusCode: options['statusCode'],
    success: options['successFunction'],
    error: function(jqXHR, textStatus, errorThrown){
      options['errorFunction'](jqXHR, textStatus, errorThrown);
      options['errorFunctionEpilogue'](jqXHR, textStatus, errorThrown);
    },
    complete: function(jqXHR, textStatus){
      if(!options['skip_remove_loading']){
        LoadingHelper.remove(path);
      }
      
      options['callback']();
      epilogueCallback(options['apiUrl']);
    }
  });
}

HttpHelper.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}