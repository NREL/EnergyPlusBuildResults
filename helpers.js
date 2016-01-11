
function get_baseline(commit)
{
  // baseline_repository
  //

  var baseline_branch = function(){
    if (commit.branch_name == "develop") {
      return "master";
    } else if (commit.branch_name == "master") {
      return null;
    } else {
      return "develop";
    }
  }();

  if (baseline_branch == null) {
    return null;
  }

  if (commit.branch_name == null) {
    return null;
  }

  var filtered_data = data.filter(function(o) { return o.branch_name != null && o.branch_name == baseline_branch && o.device_id == commit.device_id && o.pending == false});

  return (filtered_data.length == 0)?null:filtered_data[0];
}
