Steven Karas's Personal Pages
{% if post.categories != null %}
	NotNULL
	{% if post.categories == empty %}
		| {{ post.categories | array_to_sentence_string }}
	{% endif %}
{% else %}
	{{ post.categories }}
{% endif %}
 | {{ page.title }}
