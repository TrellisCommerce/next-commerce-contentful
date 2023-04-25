import React from 'react'
import { createClient } from 'contentful'
//@ts-ignore
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Layout } from '@components/common'
import Link from 'next/link'
import { formatDate } from '@utils/formatDate'

type Props = {
  data: any
  relatedEntries: any
}

export default function blog({ data, relatedEntries }: Props) {
  const author = data[0].fields
  console.log(author)
  console.log(relatedEntries)
  return (
    <div className="block w-full">
      <div>{author.name}</div>
      <div>{author.jobTitle}</div>
      <div>{author.profilePhoto.fields.file.url}</div>
      {/* <div>{author.bio.content}</div> */}

      <section className="block w-full max-w-6xl m-auto">
        <h2 className="text-3xl mt-20 mb-6">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedEntries.items.map((item: any) => (
            <div
              key={item.sys.id}
              className="block bg-white text-gray-800 shadow-lg"
            >
              <img
                className="h-64 object-cover w-full"
                src={item.fields.heroImage?.fields.file.url}
                alt={data[0].fields.heroImage?.fields.description}
              />
              <div className="p-4">
                <h3 className="text-3xl mt-2 font-semibold ">
                  {item.fields.title}
                </h3>
                <Link
                  className="
                mt-4
                py-2
                px-4
              bg-white
              text-black
                border-gray-500
                border-2
                inline-block
                hover:bg-gray-900
                hover:border-gray-900
                hover:text-white
                transition"
                  href={`/blog/${item.fields.slug}`}
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
  })

  const entries = await client.getEntries({
    content_type: 'author',
    limit: 1,
    'fields.slug': context.params.author,
  })

  const authorEntryId = entries.items[0].sys.id

  const relatedEntries = await client.getEntries({
    content_type: 'blogPost',
    limit: 3,
    'fields.author.sys.id': authorEntryId,
  })

  console.log(relatedEntries)

  const data = entries.items

  return {
    props: {
      data,
      relatedEntries,
    },
  }
}

blog.Layout = Layout
