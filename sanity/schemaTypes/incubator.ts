import { defineField, defineType } from 'sanity'

export const incubator = defineType({
  name: 'incubator',
  title: 'Incubator Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name of the incubator or partner (e.g. "BioLabs")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      description: 'The logo image for this incubator/partner',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
