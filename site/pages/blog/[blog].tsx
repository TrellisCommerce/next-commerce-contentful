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

// docs for types
//https://github.com/contentful/rich-text/blob/master/packages/rich-text-types/src/blocks.ts
const Bold = ({ children }: any) => <p className="font-bold">{children}</p>

const Text = ({ children }: any) => (
  <p className="text-gray-800 mb-3">{children}</p>
)

const OrderedList = ({ children }: any) => (
  <ol className="text-gray-800 list-decimal">{children}</ol>
)

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: any) => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => <Text>{children}</Text>,
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <OrderedList>{children}</OrderedList>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const asset = node.data.target
      if (asset.fields.file.contentType.includes('image')) {
        return (
          <img src={asset.fields.file.url} alt={asset.fields.description} />
        )
      }
      return null
    },
  },
  renderText: (text: any) => text.replace('!', '?'),
}

export default function blog({ data, relatedEntries }: Props) {
  console.log(data)
  return (
    <div className="block w-full">
      <img
        className=" h-[500px] object-cover object-bottom w-full"
        src={data[0].fields.heroImage.fields.file.url}
        alt={data[0].fields.heroImage.fields.description}
      />
      <div className="block w-full max-w-3xl m-auto mb-36 px-6">
        <h1 className="text-4xl mt-12 mb-6 font-semibold">
          {data[0].fields.title}
        </h1>

        <div className="flex flex-wrap items-center my-8">
          {data[0].fields.author && (
            <img
              className="rounded-full h-11 mr-3"
              src={data[0].fields.author.fields.profilePhoto.fields.file.url}
              alt=""
            />
          )}
          <div className="italic">
            <p>
              <span className="font-bold">
                {data[0].fields.author ? data[0].fields.author.fields.name : ''}{' '}
              </span>
              on
            </p>
            <p className="block w-full">{data[0].date}</p>
          </div>
        </div>

        {documentToReactComponents(data[0].fields.body, options)}
      </div>
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
                src={item.fields.heroImage.fields.file.url}
                alt={data[0].fields.heroImage.fields.description}
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
    content_type: 'blogPost',
    limit: 1,
    'fields.slug': context.params.blog,
  })

  const entriesFormattedDate = entries.items.map((item: any) => {
    return { ...item, date: formatDate(item.sys.createdAt) }
  })

  const relatedEntries = await client.getEntries({
    content_type: 'blogPost',
    limit: 3,
    'fields.slug[ne]': context.params.blog,
  })

  const data = entriesFormattedDate

  return {
    props: {
      data,
      relatedEntries,
    },
  }
}

blog.Layout = Layout
