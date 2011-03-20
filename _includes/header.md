<a href="/">Steven Karas's Personal Pages</a>
{% if post.categories != null %}
	{% if post.categories != empty %}
		| {{ post.categories | array_to_sentence_string }}
	{% endif %}
{% endif %}
 | {{ page.title }}
