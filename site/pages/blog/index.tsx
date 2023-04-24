import React, { useEffect, useState } from 'react'
import { createClient } from 'contentful'
import Link from 'next/link'
import { Layout } from '@components/common'
import { formatDate } from '@utils/formatDate'
import Image from 'next/image'

type Props = {
  data: any
  entries: any
}

export default function BlogListing({ data }: Props) {
  const [clientEntries, setClientEntries] = useState<any>([])
  const [count, setCount] = useState(0)
  useEffect(() => {
    // console.log(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID)
    const client = createClient({
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    })

    client
      .getEntries({
        content_type: 'blogPost',
        //@ts-ignore
        order: 'sys.createdAt',
        limit: 9,
        skip: count,
      })
      .then((entriesList: any) => {
        console.log(entriesList)
        const entriesFormattedDate = entriesList.items.map((item: any) => {
          return { ...item, date: formatDate(item.sys.createdAt) }
        })
        setClientEntries(entriesFormattedDate)
      })
  }, [count])
  console.log(clientEntries[1]?.fields.heroImage.fields.file.url)
  return (
    <div className="block w-full max-w-6xl m-auto px-6">
      <h1 className="text-5xl mt-7 mb-12">Store Blog</h1>
      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientEntries.map((item: any) => (
          <div
            key={item.sys.id}
            className="block bg-white text-gray-800 shadow-lg"
          >
            <img
              className="h-64 object-cover w-full"
              src={item.fields.heroImage.fields.file.url}
              alt=""
            />
            <div className="p-4">
              <h3 className="text-3xl mt-2 font-semibold ">
                {item.fields.title}
              </h3>
              <div className="mt-5 flex flex-wrap items-center">
                {item.fields.author && (
                  <img
                    className="rounded-full h-11 mr-3"
                    src={item.fields.author.fields.profilePhoto.fields.file.url}
                    alt=""
                  />
                )}
                <div className="italic">
                  <p>
                    <span className="font-bold">
                      {item.fields.author ? item.fields.author.fields.name : ''}{' '}
                    </span>
                    on
                  </p>
                  <p className="block w-full">{item.date}</p>
                </div>
              </div>
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
                py-2
                px-4
                bg-white
                text-black
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
      <div className="grid grid-cols-2 gap-3 mt-10 max-w-xs m-auto">
        <button
          className="
          py-2
          px-4
        bg-white
        text-black
          border-gray-500
          border-2
          inline-block
          py-2
          px-4
          bg-white
          text-black
          inline-block
          hover:bg-gray-900
          hover:border-gray-900
          hover:text-white
          transition
          disabled:border-gray-300
          disabled:bg-gray-300
          disabled:text-gray-500
          disabled:cursor-not-allowed"
          onClick={() => setCount(count > 0 ? count - 9 : count)}
          disabled={count === 0}
        >
          Previous
        </button>
        <button
          className="
                    py-2
                    px-4
                  bg-white
                  text-black
                    border-gray-500
                    border-2
                    inline-block
                    py-2
                    px-4
                    bg-white
                    text-black
                    inline-block
                    hover:bg-gray-900
                    hover:border-gray-900
                    hover:text-white
                    transition
                    disabled:border-gray-300
                    disabled:bg-gray-300
                    disabled:text-gray-500
                    disabled:cursor-not-allowed"
          onClick={() => setCount(count < data.total - 1 ? count + 9 : count)}
          disabled={count === data.total || count === data.total - 9}
        >
          next
        </button>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const client = createClient({
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  })

  const entriesList = await client.getEntries({
    content_type: 'blogPost',
    //@ts-ignore
    order: 'sys.createdAt',
    limit: 9,
    skip: 0,
  })
  const data = entriesList
  const entries = entriesList.items

  return {
    props: {
      data,
      entries,
    },
  }
}

BlogListing.Layout = Layout
