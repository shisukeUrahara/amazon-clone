import Head from "next/head";
import Banner from "../components/Banner/Banner";
import Header from "../components/Header/Header";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Amazon Clone</title>
      </Head>

      {/* header */}
      <Header />

      <main className="max-w-screen-2xl mx-auto">
        {/* Banner */}
        <Banner />

        {/* Product feed */}
      </main>
    </div>
  );
}
