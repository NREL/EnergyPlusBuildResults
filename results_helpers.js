function compare_data(a,b) {
  if (a.messagetype != b.messagetype)
  {
    if (a.messagetype.search(/err/i) != -1) return -1;
    if (b.messagetype.search(/err/i) != -1) return 1;

    if (a.messagetype.search(/warn/i) != -1) return -1;
    if (b.messagetype.search(/warn/i) != -1) return 1;
  }

  if (a.messagetype < b.messagetype)
  {
    return -1;
  } else if (a.messagetype > b.messagetype) {
    return 1;
  } else {
    if (a.filename < b.filename) {
      return -1;
    } else if (a.filename > b.filename) {
      return 1;
    } else {
      if (a.linenumber < b.linenumber) {
        return -1;
      } else if (a.linenumber > b.linenumber) {
        return 1;
      } else {
        if (a.colnumber < b.colnumber) {
          return -1;
        } else if (a.colnumber > b.colnumber) { 
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
}

function compare_performance_data(a,b) {
  if (a.test_name < b.test_name) {
    return -1;
  } else if (a.test_name > b.test_name) {
    return 1;
  } else {
    return 0;
  }
}

function compare_test_data(a,b) {
  if (a.status != b.status)
  {
    if (a.status.search(/fail/i) != -1) return -1;
    if (b.status.search(/fail/i) != -1) return 1;

    if (a.status.search(/warn/i) != -1) return -1;
    if (b.status.search(/warn/i) != -1) return 1;
  }

  if (a.status < b.status)
  {
    return -1;
  } else if (a.status > b.status) {
    return 1;
  } else {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      if (a.time < b.time) {
        return -1;
      } else if (a.time > b.time) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}


function get_label_type(stat)
{
  var labeltype="info";
  if (stat.search(/warn/i) != -1)
  {
    labeltype = "warning";
  } else if (stat.search(/err/i) != -1 || stat.search(/fail/i) != -1) {
    labeltype = "danger";
  } else if (stat.search(/pass/i) != -1) {
    labeltype = "success";
  }

  return labeltype;
}

function format_error_rows(data)
{
  if (data.length == 0) return "";

  var result = "";
  var last_message_type = "";
  ++accordian_group;
  result = " <div class='panel-group' id='accordion-"+accordian_group+"'> ";

  var count = 0;
  for (var i = 0; i < data.length; ++i) {
    var url = "https://github.com/" + repo + "/blob/" + ref + "/" + data[i].filename + "#L" + data[i].linenumber;

    var labeltype = get_label_type(data[i].messagetype);

    if (data[i].messagetype != last_message_type) {
      var messagecount = 0;
      for (var j = i; j < data.length && data[j].messagetype == data[i].messagetype; ++j) {
        ++messagecount;
      }

      if (last_message_type != "") {
        // close last block
        result += "</table></div></div></div>";
      }
      var table_id = "table-" + ++num_tables;

      result += " \
  <div class='panel panel-" + labeltype + "'> \
    <div class='panel-heading'> \
      <span class='badge pull-right'>" + messagecount + "</span> \
      <h4 class='panel-title'> \
        <a data-toggle='collapse' data-parent='#accordion-"+accordian_group+"' href='#collapse-" + accordian_group + "-" + i + "'> " +
          data[i].messagetype + " messages \
        </a> \
      </h4> \
    </div> \
    <div id='collapse-" + accordian_group + "-" + i +"' class='panel-collapse collapse'> \
      <div class='panel-body'> \
<table id='" + table_id + "' class='table table-striped'> \
<thead><tr><th></th><th>location</th><th>message</th></tr></thead>";

      last_message_type = data[i].messagetype;
      count = 0;
    }
    ++count;


    result += "<tr><td><span class='label label-" + labeltype + "'>" + data[i].messagetype + "</span></td><td><h6><a href='" + url + "'>" + data[i].filename + ":" + data[i].linenumber + ":" + data[i].colnumber + "</a></h6></td><td><code>" + data[i].message.replace(/\n/g, "<br/>") + "</code></td></tr>";
  }

  result += "</table></div></div></div></div> <script>$(function(){ $('#" + table_id  + "').tablesorter(); })<\/script>";


  return result;
}

function htmlEncode(value){
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function format_performance_rows(test)
{
  var result = "";
  var last_message_type = "";
  ++accordian_group;
  var labeltype = "info";
  var table_id = "table-" + ++num_tables;
  result = " <div class='panel-group' id='accordion-"+accordian_group+"'> ";
  result += " \
             <div class='panel panel-" + labeltype + "'> \
               <div class='panel-heading'> \
               <span class='badge pull-right'>Total Cost: " + test.totals + "</span>  \
               <h4 class='panel-title'> \
                 <a data-toggle='collapse' data-parent='#accordion-"+accordian_group+"' href='#collapse-" + accordian_group + "'> " +
                   test.test_name + " \
                 </a> \
               </h4> \
             </div> \
             <div id='collapse-" + accordian_group + "' class='panel-collapse collapse'> \
               <div class='panel-body'> \
               <table id='" + table_id + "' class='table table-striped'> \
             <thead><tr><th>function name</th><th>call count</th><th>total cost</th></tr></thead>";


  for (var i = 0; i < test.data.length; ++i) {
    result += "<tr><td>" + htmlEncode(test.data[i].function_name) + "</td><td>" + test.data[i].count + "</td><td>" + test.data[i].cost + "</td></tr>";
  }

  result += "</table></div></div></div></div> <script>$(function(){ $('#" + table_id  + "').tablesorter(); })<\/script>";


  return result;
}

function format_test_rows(data)
{
  if (data.length == 0) return "";

  var result = "";
  var last_message_type = "";
  ++accordian_group;
  result = " <div class='panel-group' id='accordion-"+accordian_group+"'> ";

  var count = 0;
  for (var i = 0; i < data.length; ++i) {
    var labeltype = get_label_type(data[i].status);

    if (data[i].status != last_message_type) {
      var messagecount = 0;
      for (var j = i; j < data.length && data[j].status == data[i].status; ++j) {
        ++messagecount;
      }

      if (last_message_type != "") {
        // close last block
        result += "</table></div></div></div>";
      }
      var table_id = "table-" + ++num_tables;

      result += " \
  <div class='panel panel-" + labeltype + "'> \
    <div class='panel-heading'> \
      <span class='badge pull-right'>" + messagecount + "</span> \
      <h4 class='panel-title'> \
        <a data-toggle='collapse' data-parent='#accordion-"+accordian_group+"' href='#collapse-" + accordian_group + "-" + i + "'> " +
          data[i].status + " \
        </a> \
      </h4> \
    </div> \
    <div id='collapse-" + accordian_group + "-" + i + "' class='panel-collapse collapse'> \
      <div class='panel-body'> \
<table id='" + table_id + "' class='table table-striped'> \
<thead><tr><th></th><th>name</th><th>time</th></tr></thead>";

      last_message_type = data[i].status;
      count = 0;
    }
    ++count;

    result += "<tr><td><span class='label label-" + labeltype + "'>" + data[i].status + "</span></td><td>" + data[i].name + "</td><td>" + data[i].time + "</td></tr>";
    if (labeltype != "success" && data[i].output) {
      result += "<tr><td></td><td colspan=2>";
      result += data[i].output.replace(/\n/g, "<br/>");
      if (data[i].parsed_errors) {
        result += format_error_rows(data[i].parsed_errors);
      }
      result += "</td></tr>";
    } 
  }

  result += "</table></div></div></div></div> <script>$(function(){ $('#" + table_id  + "').tablesorter(); })<\/script>";


  return result;
}


