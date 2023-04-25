import { BLOCKS, MARKS } from '@contentful/rich-text-types'

const Bold = ({ children }: any) => <p className="font-bold">{children}</p>

const Text = ({ children }: any) => (
  <p className="text-gray-800 mb-3">{children}</p>
)

const OrderedList = ({ children }: any) => (
  <ol className="text-gray-800 list-decimal">{children}</ol>
)

export const renderOptions = {
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
          <img
            className="rte-image object-cover"
            src={asset.fields.file.url}
            alt={asset.fields.description}
          />
        )
      }
      return null
    },
  },
  renderText: (text: any) => text.replace('!', '?'),
}
