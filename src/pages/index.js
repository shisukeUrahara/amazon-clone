import Head from "next/head";
import Header from "../components/Header/Header";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Amazon Clone</title>
      </Head>

      {/* header */}
      <Header />
    </div>
  );
}
