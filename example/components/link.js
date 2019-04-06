import NextJsLink from 'next/link';

//const assetPrefix = process.env.ASSET_PREFIX;
const backendURL = process.env.BACKEND_URL || '';

const Link = ({ href, ...rest }) => (
  <NextJsLink href={href} as={`${backendURL}${href}`} {...rest} />
);

export default Link;
