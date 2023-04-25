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
  console.log(data)
  return <div className="block w-full"></div>
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

  const relatedEntries = await client.getEntries({
    content_type: 'blogPost',
    limit: 3,
    'fields.slug[ne]': context.params.blog,
  })

  const data = entries.items

  return {
    props: {
      data,
      relatedEntries,
    },
  }
}

blog.Layout = Layout
