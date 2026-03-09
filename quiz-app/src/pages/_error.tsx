import NextErrorComponent from 'next/error';
import type { NextPageContext } from 'next';

type ErrorPageProps = {
  statusCode: number;
};

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  return <NextErrorComponent statusCode={statusCode} />;
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  if (res?.statusCode) {
    return { statusCode: res.statusCode };
  }
  if (err && typeof err === 'object' && 'statusCode' in err) {
    return { statusCode: Number((err as { statusCode?: number }).statusCode) || 500 };
  }
  return { statusCode: 404 };
};
