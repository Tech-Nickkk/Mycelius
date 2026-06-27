import { defineField, defineType } from 'sanity'

export const whatWeDo = defineType({
  name: 'whatWeDo',
  title: 'What We Do Item',
  type: 'document',
  fields: [
    defineField({
      name: 'titleLine1',
      title: 'Title Line 1',
      type: 'string',
      description: 'The first word/line of the title (e.g. "Custom")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleLine2',
      title: 'Title Line 2',
      type: 'string',
      description: 'The second word/line of the title (e.g. "Installations")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Slide Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'titleLine1',
      subtitle: 'titleLine2',
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: `${title} ${subtitle}`,
        media: media,
      }
    }
  }
})
