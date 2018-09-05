export default `
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700');
* {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
html, body, #__next {
  height: 100%;
}
a[disabled], button[disabled] {
    cursor: default;
    cursor: not-allowed;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
  font-family: 'Roboto', sans-serif;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
*, *:after, *:before {
  box-sizing: border-box;
}

&:focus {
  outline: #3b99fc auto 5px;
  outline-offset: -2px;
}

input,
textarea {
  font-size: 14px;
  -webkit-appearance: none;
}

@media (max-width: 500px) {
  input,
  textarea {
    font-size: 16px;
  }
}
`;
