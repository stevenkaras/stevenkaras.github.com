Steven Karas's Personal Pages
{% if post != null %}
	{% if post.categories == empty %}
		| {{ post.categories | array_to_sentence_string }}
	{% endif %}
{% endif %}
 | {{ page.title }}
