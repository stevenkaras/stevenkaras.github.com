Steven Karas's Personal Pages
{% if post %}
	{% capture post_categories_size %}{{ post.categories | size }}{% endcapture %}
	{% if post_categories_size > 0 %}
		asdf {{ post.categories | array_to_sentence_string }}
	{% endif %}
{% endif %}
 asdf {{ page.title }}
