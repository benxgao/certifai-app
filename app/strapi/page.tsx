/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
import Head from 'next/head';
import Image from 'next/image';
import { getPageData } from '../utils/strapi';

export default async function Home({}: any) {
  const pageData = await getPageData('home'); // removed slug argument

  console.log('pageData', pageData);

  if (!pageData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>{pageData.title}</title>
        <meta name='description' content={pageData.description} />
      </Head>

      <main>
        <h1>{pageData.title}</h1>
        {pageData.image && (
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pageData.image.data.attributes.url}`}
            alt={pageData.image.data.attributes.alternativeText}
            width={500}
            height={300}
          />
        )}
      </main>
    </div>
  );
}
