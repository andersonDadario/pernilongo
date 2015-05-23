var currentLayer = function(){
    var layer = $("#content");

    if($("#gpmodal:visible").length > 0){
        var layer = $("#gpmodal > .modal-dialog > .modal-content > .modal-body");
    }

    return layer;
}