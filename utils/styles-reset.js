import { injectGlobal } from 'styled-components';

injectGlobal`
* {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
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
`;
