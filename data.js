---
---

{% for post in site.posts %}
  {% if post.pull_request_issue_id == "" and post.repository %}
    var baseline_repository = "{{ post.repository }}"
    var baseline_results_repository = "{{ post.results_repository }}"
    {% break %}
  {% endif %}
{% endfor %}

{% assign bad_keys = "ext,slug,title,permalink,path,relative_path,output,next,previous,content,excerpt" | split: "," %}



var data = [
{% for p in site.posts %} {% capture: jsonstring %}{% for d in p %}{% unless bad_keys contains d %}"{{ d }}":{{ p[d] | jsonify }},{% endunless %}{% endfor %}{% endcapture %} { {{ jsonstring }} }, 
{% endfor %}
]

