import Link from 'next/link';

export default class PrefixedLink extends React.Component {
  render() {
    const { href, as = href, ...props } = this.props;
    const { prefix = '' } = this.context;
    return <Link href={href} as={`${prefix}${as}`} {...props} />;
  }
}

export class PathPrefix extends React.Component {
  getChildContext() {
    return { prefix: this.props.prefix || '' };
  }

  render() {
    return this.props.children;
  }
}
