$("document").ready(function() {

  
  $( function() {
    $( ".list-group" ).sortable({
      update: function( event, ui ) {

        console.log($(".list-group").sortable('toArray'));


  
   $.get("http://localhost:8080/update?newList=" + JSON.stringify($(".list-group").sortable('toArray')), function(data) {
    console.log($(".list-group-item"));
    $(".list-group-item").each(function(i){
      $(this).attr("id", i);
      });
    });
  
      }
      }
      );

  } );
  
  
  
})
