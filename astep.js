(function($) {
$(function() {
  $('.marker').append("<div class = 'fixed-points contenteditable' contenteditable=TRUE></div>");

  $( ".order-value-loe").click(function() {
    stories = $("#stories .story");
    done_task = []
    reorder_stories = []
    while(stories.length) {
      result = rec_find_most_val(stories, done_tasks)
      reorder_stories.push(result[0]);
      stories = stories.remove(result[0]);
      done_tasks = restult[1];
    }
  });
  var rec_find_most_val = function (stories, done_tasks) {
    vloe_max = 0;
    story_max = '';
    tasks_max = [];
    stories.each(function() {
      sid = $(this).attr("id");
      tasks = done_tasks;
      points = 0;
      $(this).find(".sub-task").each(function() {
        id = $(this).attr("task_id");
        if(tasks.indexOf(id) == -1) {
          points += 1*$(this).attr("points");
          tasks.push(id);
        }
      });
      vloe = $(this).find(".value").text()/points
      if (vloe > vloe_max) {
        vloe_max = vloe;
        story_max = $(this);
        tasks_max = tasks;
      }
    });
    return [story_max, tasks_max]
    console.log(vloe);
  }
  $( "#add-templete").click(function() {
    var options = "<option value = '1'>not</option><option value = '2'>moderately</option><option value='4'>very</option>";
    var tform = $("<div>Create a templete for the <input class='content-type'></input> Content Type, it data input is <select class='data-entry'>"+options+"</select> complicated, and the display is <select class='display'>"+options+"</select> complicated. <button value = 'add'>Add</button></div>");
    tform.find("button").click(function(e) {
      var name = $(this).parent().find(".content-type").val();
      var ic = $(this).parent().find(".data-entry").val();
      var dc = $(this).parent().find(".display").val();
      var storyEntry = addStory("input-"+name);
      storyEntry.find('.title').html("Authenticated User enters system and create new "+name+" content item.");
      var storyDisplay = addStory("display-"+name);
      storyDisplay.find('.title').html("Visitor navigates to a page of type "+name+" and sees themed content.");
      var taskDrupal = addTask("install-drupal", "Install Drupal", "3");
      var taskBuild = addTask("build-"+name, "Build out "+name+" Content Type", ic);
      var taskTheme = addTask("theme-"+name, "Theme "+name+" Content Type Page", dc);
      assign(taskBuild, taskDrupal);
      assign(taskTheme, taskDrupal);
      assign(taskTheme, taskBuild);
      assign(storyEntry, taskBuild);
      assign(storyDisplay, taskTheme);
    });
    tform.dialog();
 
  });
  var addStory = function(id, title) {
    var id = typeof id == 'undefined' ? uuid() : id;
    var newli = $("<li class = 'for-assign ui-state-default story' id ='"+id+"'><input type='checkbox' class = 'selector' /><div class = 'ui-icon ui-icon-arrowthick-2-n-s handle'></div><div class = 'title contenteditable' contenteditable=TRUE> </div><div class = 'value contenteditable' contenteditable=TRUE></div><div class = 'points' ></div><ul class = 'sub-tasks'></ul></li>");
    $("#stories").append(newli);
    if(typeof title != 'undefined') {
      newli.find(".title").html(title);
    }
    else {
      newli.find(".title").focus();
    }
    doit();
    return newli;
  }
  $( "#add-story").click(function() {
    addStory();
  });
  var addMark = function(id, title) {
    var id = typeof id == 'undefined' ? uuid() : id;
    var newli = $("<li class = 'marker ui-state-default' id ='"+id+"'><div class = 'ui-icon ui-icon-arrowthick-2-n-s handle'></div><div class = 'title contenteditable' contenteditable=TRUE></div><div class = 'value'></div> <div class = 'fixed-points contenteditable' contenteditable=TRUE></div><div class = 'points' ></div></li>");
    $("#stories").append(newli);
    if(typeof title != 'undefined') {
      newli.find(".title").html(title);
    }
    else {
      newli.find(".title").focus();
    }
    doit();
    return newli;
  }
  $( "#add-marker").click(function() {
    addMark();
  })
  $(".save").click(function(e) {
    e.preventDefault();
    var data = {}
    data.stories = [];
    data.tasks = [];
    $("#stories >li").each(function() {
      var item = {
        id: $(this).attr("id"),
        type: $(this).hasClass("story") ? 'story' : 'mark',
        title: $(this).find(".title").html(),
        value: $(this).find(".value").html(),
        deps: []
      };
      $(this).find('.sub-tasks > li').each(function() {
        item.deps.push($(this).attr("task_id"));
      });
      data.stories.push(item);
    });
    $("#tasks >li").each(function() {
      var item = {
        id: $(this).attr("id"),
        title: $(this).find(".title").html(),
        points: $(this).find(".points").html(),
        deps: []
      };
      $(this).find('.sub-tasks > li').each(function() {
        item.deps.push($(this).attr("task_id"));
      });
      data.tasks.push(item);
    });

    if(db = window.location.hash.substring(1)) {
      $.post("backend.php?db="+db, {data:data})
    }

    s = $("html").html();
    s = "<html>"+s+"</html>";
    s = s.replace(/\r\n|\r/g, "\n");
    base = document.URL.replace(/\/[^\/]*html/, "/");
    s = s.replace(/\.\//g, base);
    uri = "data:text/html;charset=utf-8,"+s;
    $(".save").attr("href", uri);
  });
  $( "#add-task").click(function() {
    addTask();
  });
  var addTask = function(id, title, points) {
    var id = typeof id == 'undefined' ? uuid() : id;
    if( $("#"+id).length == 0) {
      var newli = $("<li class = 'task assignee for-assign ui-state-default' id ='"+id+"'><input type='checkbox' class = 'selector' /><div class = 'ui-icon ui-icon-arrowthick-2-n-s handle'></div><div class = 'title contenteditable' contenteditable=TRUE> </div><div class = 'points contenteditable' contenteditable=TRUE></div><div class = 'assign'>assign</div><ul class = 'sub-tasks'></ul></li>");
      $("#tasks").append(newli);
      if(typeof title != 'undefined') {
        newli.find(".title").html(title);
      }
      else {
        newli.find(".title").focus();
      }
      if(typeof points != 'undefined') {
        newli.find(".points").html(points);
      }
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
      return newli;
    }
    else {
      return $("#"+id);
    }
  };
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
    var marker_move_rec = function(marker) {
      var fixed_points = $(marker).find(".fixed-points").text();
      var points = 0;
      var value = 0;
      var running_points = 0;
      var hit_marker = false;
      $(marker).prevAll().add().each(function() {
        if($(this).hasClass("marker")) {
          hit_marker = true
        }
        if($(this).hasClass("story")) {
          if(!hit_marker) {
            points += 1*$(this).children(".points").text();
          }
          value += 1*$(this).children(".value").text();
          running_points += 1*$(this).children(".points").text();
        }
      });
      if(fixed_points) {
        var next = points + 1*$(marker).next().children(".points").text();
        var prev = points - 1*$(marker).prev().children(".points").text();
        if((next <= fixed_points) && $(marker).next().length) {
          $(marker).next().after(marker);
          marker_move_rec(marker);
        }
        if((points > fixed_points) && $(marker).prev().length) {
          $(marker).prev().before(marker);
          marker_move_rec(marker);
        }
      }
      return [points, running_points, value]
    }
    $('.marker').each(function() {
      var points = 0;
      var running_points = 0;
      var hit_marker = false;
      var p = marker_move_rec(this);
      $(this).find(".points").text(p[0] + " of " + p[1]);
      $(this).find(".value").text(p[2]);
      /*
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
      */
    });
  };
  $('.selector-all').click(function() {
    $(this).parents(".columns").find(".selector").attr("checked", "checked");
  });
  $('.collapse-selected').click(function() {
    $(this).parents(".columns").find(".selector:checked").parents("li").find("ul.sub-tasks").addClass("collapse");
  });
  $('.expand-selected').click(function() {
    $(this).parents(".columns").find(".selector:checked").parents("li").find("ul.sub-tasks").removeClass("collapse");
  });
  $('.selector-clear').click(function() {
    $(this).parents(".columns").find(".selector").removeAttr("checked");
  });
  var getSubTask = function(id) {
    task = $("#" + id);
    subtask = $("<li class = 'sub-task'><div class = 'title'></div><ul></ul></li>");
    subtask.attr("task_id", id);
    subtask.find(".title").text(task.children(".title").text());
    subtask.attr("points", task.find(".points").text());
    subtask.click(function() {
      $(this).remove();
      reScoreAll();
    });
    return subtask;
  }
  var assign = function(assignee, item) {
    var id = $(item).attr("id");
    if(!$(assignee).find(".sub-tasks li[task_id='" + id + "']").length) {
      assignee.find(".sub-tasks").append(getSubTask(id));
    }
  }
  var doit = function() {
    $( "#tasks li").draggable({
      'revert':true, 
      'handle': '.assign',
      'helper' : 'clone',
      'scope' : 'assignment',
      'start' : function (e, ui) {
        selected = $(ui.helper).siblings().has(".selector:checked").not(ui.helper).clone();
        ui.helper.append(selected);
      },
      'end' : function (e, ui) {
      }
    });
    $("li.for-assign").droppable({
      'hoverClass' : "current-drop-area",
      'scope' : 'assignment',
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
      }
    });
  }
  doit();
  $( "#tasks" ).sortable({
    placeholder: "placeholder",
    handle: '.handle',
    'start': function (e, ui) { 
      selected = $(ui.item).siblings().has(".selector:checked");
      ui.item.append(selected);
    },
    stop : function(e,ui){
      //reScore(ui.item);
      if(ui.item.hasClass("task")) {
        ui.item.after(ui.item.find("li.task"));
      }
      reScoreAll();
      $(ui.item).parents(".columns").find(".selector").removeAttr("checked");
    }
  });
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
      $(ui.item).parents(".columns").find(".selector").removeAttr("checked");
    }
  })
  $( "#stories" ).disableSelection();

  if(db = window.location.hash.substring(1)) {
    $.getJSON("backend.php?db="+db, function(data) {
      console.log(data);
      data.tasks.forEach(function(task) {
        var li = addTask(task.id, task.title, task.points);
      });
      data.tasks.forEach(function(task) {
        if(typeof task.deps != 'undefined') {
          task.deps.forEach(function(depid) {
            var dep = $("#"+depid);
            var assignee = $("#"+task.id);
            assign(assignee, dep);
          });
        }
        
      });
      data.stories.forEach(function(story) {
        if(story.type == "story") {
          var li = addStory(story.id, story.title, story.value);
          if(typeof story.deps != 'undefined') {
            story.deps.forEach(function(depid) {
              var dep = $("#"+depid);
              assign(li, dep);
            });
          }
        }
        else {
          var li = addMark(story.id, story.title);
        }
      });
      reScoreAll();
      doit();
    });
  }
  
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
