

(function($) {
$(function() {

  $( "#add-story").click(function() {
    id = uuid();
    console.log(id);
    newli = $("<li class = 'for-assign ui-state-default' id ='"+id+"'><input type='checkbox' class = 'selector' /><div class = 'ui-icon ui-icon-arrowthick-2-n-s handle'></div><div class = 'title contenteditable' contenteditable=TRUE> </div><div class = 'points contenteditable' contenteditable=TRUE></div><ul class = 'sub-tasks'></div></li>");
    $("#stories").append(newli);
    newli.find(".title").focus();
    doit();
  });
  $( "#add-task").click(function() {
    id = uuid();
    console.log(id);
    newli = $("<li class = 'assignee for-assign ui-state-default' id ='"+id+"'><div class = 'ui-icon ui-icon-arrowthick-2-n-s handle'></div><div class = 'title contenteditable' contenteditable=TRUE> </div><div class = 'points contenteditable' contenteditable=TRUE></div><div class = 'assign'>assign</div></li>");
    $("#tasks").append(newli);
    newli.find(".title").focus();
    newli.find(".title").blur(function(e) {
      task = $(this).parent();
      id = task.attr("id");
      console.log("gi");
      $("[task_id='"+id+"']").text($(this).text());
    });
    doit();
  });
  var reScore = function(story) {
    $(story).find(".sub-tasks > li").each(function() {
      //update my active status
      id = $(this).attr("task_id");

      if(!$(story).prevAll().find("[task_id='"+id+"']").length) {
        $(this).addClass("active");
      }
      else {
        $(this).removeClass("active");
      }
      //remove active for stories after me
      $(story).nextAll().find("[task_id='"+id+"']").each(function() {
        $(this).removeClass("active");
      });
    });
  }
  var doit = function() {
    $( "#tasks li").draggable({'revert':true, handle:'.assign'});
    $("li.for-assign").droppable({
      drop: function(e, ui) {
        if(ui.draggable.hasClass('assignee')) {
          id = ui.draggable.attr("id");
          subtask = $("<li task_id = '"+id+"' class = 'sub-task'>" + ui.draggable.find(".title").text() + "</li>");
          $(this).find(".sub-tasks").append(subtask);

          /*//set as active if noone earlier has it
          if(!$(this).prevAll().find("[task_id='"+id+"']").length) {
            subtask.addClass("active");
          }
          //remove from active for items after me
          $(this).nextAll().find("[task_id='"+id+"']").each(function() {
            $(this).removeClass("active");
          });
          */
          reScore($(this));
        }
        console.log(ui);
      }
    });
  }
  doit();
  /*
  $( "#tasks" ).sortable({
    placeholder: "placeholder",
    handle: '.handle',
  });
  */
  $( "#stories" ).sortable({
    placeholder: "placeholder",
    handle: '.handle',
    //helper: "clone",
    'change'  : function (e, ui) {
      p = $(".placeholder");
      items = $('#stories li')
      pi = $('#stories li').index(p);
      ui.item.find(".dep").each(function() {
        did = $(this).text();
        dep = $("[id='" + $(this).text() + "']");
        di = $('#stories li').index(dep);
        console.log(pi +" "+di);
        if (di > pi) {
          console.log("move");
          p.before(dep);
        }
        placed = 0;
        for(i=di;i<=pi; i++) {
          $(items.get(i)).find(".dep").each(function() {
            if($(this).text() == did ) {
              placed = 1;
              items.get(i).before(dep);
            }
          });
        }
        if(placed == 0) {
          p.before(dep);
        }

      });

    },
    'start': function (e, ui) { 
      $("#stories li").each(function() {
        ui.item.find(".dep").each(function() {
          //$("[id='" + $(this).text() + "']").appendTo(ui.item);

          console.log($(this).text());
        });
      });
      console.log(ui);
    },
    stop : function(e,ui){
      reScore(ui.item);
    }
  })
  $( "#stories" ).disableSelection();
});
})(jQuery);

var uuid = function() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01

    return s.join("");
}
