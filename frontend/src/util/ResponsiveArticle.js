import React from 'react';
import ContentLoader from 'react-content-loader';

const ResponsiveArticle = () => (
  <ContentLoader viewBox="0 0 100% 850" height={850} width="100%">
    <rect x="0" y="0" rx="10" ry="10" width="25%" height="175" />
    <rect x="26%" y="0" rx="10" ry="10" width="25%" height="175" />
    <rect x="52%" y="0" rx="10" ry="10" width="25%" height="175" />
    <rect x="78%" y="0" rx="10" ry="10" width="25%" height="175" />

    <rect x="0" y="250" rx="10" ry="10" width="100%" height="450" />
  </ContentLoader>
);

export default ResponsiveArticle;
