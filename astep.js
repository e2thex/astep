

(function($) {
$(function() {

  $( "#add-story").click(function() {
    id = uuid();
    console.log(id);
    newli = $("<li class = 'for-assign ui-state-default story' id ='"+id+"'><input type='checkbox' class = 'selector' /><div class = 'ui-icon ui-icon-arrowthick-2-n-s handle'></div><div class = 'title contenteditable' contenteditable=TRUE> </div><div class = 'points' ></div><ul class = 'sub-tasks'></ul></li>");
    $("#stories").append(newli);
    newli.find(".title").focus();
    doit();
  });
  $( "#add-marker").click(function() {
    id = uuid();
    console.log(id);
    newli = $("<li class = 'marker ui-state-default' id ='"+id+"'><div class = 'ui-icon ui-icon-arrowthick-2-n-s handle'></div><div class = 'title contenteditable' contenteditable=TRUE></div><div class = 'points' ></div></li>");
    $("#stories").append(newli);
    newli.find(".title").focus();
    doit();
  })
  $(".save").click(function(e) {
    e.preventDefault();
    s = $("html").html();
    s = "<html>"+s+"</html>";
    s = s.replace(/\r\n|\r/g, "\n");
    uri = "data:text/html;charset=utf-8,"+s;
    $(".save").attr("href", uri);
  });
  $( "#add-task").click(function() {
    id = uuid();
    console.log(id);
    newli = $("<li class = 'task assignee for-assign ui-state-default' id ='"+id+"'><input type='checkbox' class = 'selector' /><div class = 'ui-icon ui-icon-arrowthick-2-n-s handle'></div><div class = 'title contenteditable' contenteditable=TRUE> </div><div class = 'points contenteditable' contenteditable=TRUE></div><div class = 'assign'>assign</div><ul class = 'sub-tasks'></ul></li>");
    $("#tasks").append(newli);
    newli.find(".title").focus();
    newli.find(".title").blur(function(e) {
      task = $(this).parent();
      id = task.attr("id");
      $("[task_id='"+id+"']").children(".title").text($(this).text());
    });
    newli.find(".points").blur(function(e) {
      task = $(this).parent();
      id = task.attr("id");
      $("[task_id='"+id+"']").attr("points", $(this).text());
      reScoreAll();
    });
    doit();
  });
  var recSubTask = function(subTask) {
    id = $(subTask).attr("task_id");
    task = $("#" + id);
    //copy the deps from the task
    $(subTask).children("ul").html(task.find(".sub-tasks").html());
    //run on new children
    $(subTask).find(".sub-task").each(function() {
      recSubTask(this);
    });
  }
  var reScoreAll = function () {
    stories = $("#stories li.story");
    //load dep tasks
    stories.find(".sub-tasks > li").each(function() {
      recSubTask(this);
      $(this).children("ul").html(task.find("sub-tasks").html()); 
    });
    //start with all active and then take it away
    stories.find(".sub-task").addClass("active");
    stories.each(function() {
      story = $(this);
      points = 0;
      tasks = [];
      $(this).find(".sub-task.active").each(function() {
        id = $(this).attr("task_id");
        if(tasks.indexOf(id) == -1) {
          points += 1*$(this).attr("points");
          tasks.push(id);
        }

        $(story).nextAll().find("[task_id='"+id+"']").each(function() {
          $(this).removeClass("active");
        });
      });
      $(this).find(".points").text(points);
    });
    $('.marker').each(function() {
      points = 0;
      running_points = 0;
      hit_marker = false;
      $(this).prevAll().each(function() {
        hit_marker = hit_marker || $(this).hasClass("marker");
        if($(this).hasClass("story")) {
          running_points += 1*$(this).children(".points").text();
          if(!hit_marker) {
            points += 1*$(this).children(".points").text();
          }

        }
      })
      $(this).find(".points").text(points + " of " + running_points);
    });
  };
  $('.selector-all').click(function() {
    $(this).parents(".col").find(".selector").attr("checked", "checked");
  });
  $('.selector-clear').click(function() {
    $(this).parents(".col").find(".selector").removeAttr("checked");
  });
  var getSubTask = function(id) {
    task = $("#" + id);
    subtask = $("<li class = 'sub-task'><div class = 'title'></div><ul></ul></li>");
    subtask.attr("task_id", id);
    subtask.find(".title").text(task.children(".title").text());
    subtask.attr("points", task.find(".points").text());
    subtask.click(function() {
      $(this).remove();
      reScore();
    });
    return subtask;
  }
  var doit = function() {
    $( "#tasks li").draggable({
      'revert':true, 
      'handle': '.assign',
      'helper' : 'clone',
      'start' : function (e, ui) {
        selected = $(ui.helper).siblings().has(".selector:checked").not(ui.helper).clone();
        ui.helper.append(selected);
      },
      'end' : function (e, ui) {
       console.log(ui); 
      }
    });
    $("li.for-assign").droppable({
      'hoverClass' : "current-drop-area",
      drop: function(e, ui) {
        droppable = $(this);
        if(ui.draggable.hasClass('assignee')) {
          items = ui.helper.find(".assignee").add(ui.draggable);
          items.each(function() {
            id = $(this).attr("id");
            if(!droppable.find(".sub-tasks li[task_id='" + id + "']").length) {
              droppable.find(".sub-tasks").append(getSubTask(id));
            }
          });
          reScoreAll();
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
    },
    'start': function (e, ui) { 
      selected = $(ui.item).siblings().has(".selector:checked");
      ui.item.append(selected);

    },
    stop : function(e,ui){
      //reScore(ui.item);
      if(ui.item.hasClass("story")) {
        ui.item.after(ui.item.find("li.story"));
      }
      reScoreAll();
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
