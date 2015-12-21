---
---

{% for post in site.posts %}
  {% if post.pull_request_issue_id == "" and post.repository %}
    var baseline_repository = "{{ post.repository }}"
    var baseline_results_repository = "{{ post.results_repository }}"
    {% break %}
  {% endif %}
{% endfor %}


var data = [
{% for p in site.posts %} {% capture: jsonstring %}{% for d in p %}{% if d[0] != "next" and d[0] != "previous" and d[0] != "content" and d[0] != "excerpt" %}"{{ d[0] }}":{{ d[1] | jsonify }},{% endif %}{% endfor %}{% endcapture %} { {{ jsonstring }} }, 
{% endfor %}
]


