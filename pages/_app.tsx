import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>퍼퍼리 갤러리</title>
        <meta property="og:description" content="퍼퍼리 갤러리 중 일부 이미지 저장소" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
