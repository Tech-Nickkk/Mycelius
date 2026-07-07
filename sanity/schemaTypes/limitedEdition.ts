import { defineField, defineType } from 'sanity'

export const limitedEdition = defineType({
  name: 'limitedEdition',
  title: 'Limited Edition Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      description: 'The name of the limited edition product (e.g. "Mayu Lamp")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status Badge',
      type: 'string',
      description: 'The current status (e.g. "5 Left", "Sold Out")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
