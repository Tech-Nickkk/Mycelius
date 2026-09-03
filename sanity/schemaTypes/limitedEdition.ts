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
      description: 'The name of the limited edition product (e.g. "Mayu Lamp" or "Growing...")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isUpcoming',
      title: 'Is Upcoming / Still Cultivating?',
      type: 'boolean',
      description: 'Enable if this item is in cultivation, upcoming, or not ready for purchase yet.',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Price (INR)',
      type: 'number',
      description: 'Optional. Price in Indian Rupees (e.g. 25000 for ₹25,000). Leave blank if upcoming or not decided.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'totalStock',
      title: 'Total Quantity Produced',
      type: 'number',
      description: 'Optional. Initial total number of pieces made for this edition (e.g. 5). Leave blank if upcoming or not decided.',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'availableStock',
      title: 'Available Stock Remaining',
      type: 'number',
      description: 'Current stock available for purchase. The status badge will automatically show this quantity (e.g. "5 Left") or "Sold Out" if 0.',
      validation: (Rule) => Rule.min(0),
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
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short description of the cultivated piece.',
    }),
  ],
})
