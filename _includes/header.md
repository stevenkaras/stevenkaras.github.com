[Steven Karas's Personal Pages](/)
{% if post.categories != empty %}
	| {{ post.categories | array_to_sentence_string }}
{% endif %}
 | {{ page.title }}
