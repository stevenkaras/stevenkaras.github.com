{% include js/katex.min.js %}
{% include js/katex.auto-render.min.js %}

document.addEventListener("DOMContentLoaded", function() {
  renderMathInElement(document.body, {'delimiters' : [
    {left: "$$", right: "$$", display: true},
    {left: "\\[", right: "\\]", display: true},
    {left: "$", right: "$", display: false},
    {left: "\\(", right: "\\)", display: false}
  ]});
});
