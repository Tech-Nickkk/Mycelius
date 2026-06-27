import { defineField, defineType } from 'sanity'

export const targetAudience = defineType({
  name: 'targetAudience',
  title: 'Who We Work With Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The audience type (e.g. "Interior Designers")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Card Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
