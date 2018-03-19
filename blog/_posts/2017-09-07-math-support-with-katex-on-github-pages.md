---
title: Math support with KaTeX on Github Pages
layout: post
math: true
---
As I advance in my graduate studies, I'm reading more and more material covering heavy maths. I want to write and share some of my thoughts that would require the use of complex formulas, and needed a solution for embedding them in my posts. After looking for solutions, I settled on [$\KaTeX$][katex] because it was the most lightweight solution and runs faster than others.

[katex]: https://khan.github.io/KaTeX/

# My Requirements

I host on Github pages, and they don't allow plugins, so I can't use things like [jekyll-katex][jekyll-katex], which do the rendering server side.

[jekyll-katex]: https://github.com/linjer/jekyll-katex

I'm not expecting to do anything fancy, so basic LaTeX support should suffice.

Layout stability is really important. Pages that jump around because they don't specify sizes for async elements can become unreadable, in particular on high latency connections.

Convenience. I despise boilerplate, and enjoy markdown precisely because it's so free-form, and maps quite well back to email conventions that have existed for decades. Embedding formulas already has a semi-standard syntax, so there's no need to reinvent the wheel here.

*[LaTeX]: KaTeX doesn't support the \LaTeX symbol

# MathJax

Kramdown comes with baked in support for MathJax, and uses it by default. It will detect most math environments and convert them to script tags with type `math/tex`. As such, we need to disable the math engine, otherwise it will convert our easily parsed math delimiters into something more complex without a graceful fallback for someone who's disabled javascript (I know you're out there, and I'd like to have my content readable by everyone, thankyouverymuch!)

I would have used MathJax, but for the speed and layout stability issue. MathJax is almost unreadable on mobile, especially high-latency mobile like most of the world has.

# Server side rendering with pdflatex

This approach would have me change my entire blog to statically build and just upload the artifact to github. I might go this way in the future. In the meantime, I'm happy changing as little as possible in my flow (pow dev/test + github pages production).

# Getting the setup working

It was mostly straightforward. I started by vendoring in the fonts, css, and js. 

## Auto rendering and delimiters

There's a contributed addon for $\KaTeX$ that automatically recognizes formulas and renders them. However, all the examples of how to integrate it used JQuery, which I don't have for my blog, and don't want to.

Some quick searching gave me a [snippet][auto-render] that worked with native JS.

[auto-render]: https://github.com/stevenkaras/stevenkaras.github.com/tree/master/_includes/js/katex.js

The defaults for the auto rendering lack the semi-standard `$` for inline formulas, so I added it.

## Selective support

Not all posts will have maths. In fact, very few likely will. As such, I'd like to limit the impact on my other posts, and keep them just as lean as they were before adding $\KaTeX$ support.

Ideally, detection would be automatic, but it would mean detecting paired delimiters, which I get the distinct feeling would be a massive pain. So I just added a flag to the front matter and only inject the code for rendering katex in those cases. At the moment, I opted to inject all the sources into the HTML, but I'll likely add it as a secondary JS file that will be cached. In any case, the entire setup is fairly lean, and the minified JS only takes a few hundred KB (not great, but still within reason).

# Testing it out

Display formulas work using `$$`:

$$
\frac{
  \KaTeX = \textbf{Fun!}
}{
  \text{Hello}, W^or_ld
}
$$

This is a second display format formula:

$$
x = \frac{- b \pm \sqrt{b^2 - 4ac}}{2a}
$$

They even work with other delimiters, although the `\[` delimiter needs to be double escaped as `\\[` because it goes through jekyll and kramdown:

\\[
-\frac{\hbar^2}{2m}\nabla^{2}\psi+V\psi=E\psi
\\]

As do inline ones, such as $e=\lim_{n \to \infty}\left(1 + \frac{1}{n}\right)^n$. But that's only half the fun. The best part is they're readable as text if JS is disabled (progressive enhancement). Go ahead, give it a try!

Examples are also possible, by embedding inside preformatted text as below or in code block such as this: `$1 + 2$`.

<pre>
This is preformatted text, and formulas like $1 + 2$ should not be rendered.
</pre>
