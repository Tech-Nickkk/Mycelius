import { defineField, defineType } from 'sanity'

export const limitedEditionSettings = defineType({
  name: 'limitedEditionSettings',
  title: 'Limited Edition Drop Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'launchDate',
      title: 'Target Launch Date & Time',
      type: 'datetime',
      description: 'The target date and time when the next limited edition drop goes live.',
    }),
    defineField({
      name: 'timerTitle',
      title: 'Countdown Badge / Title',
      type: 'string',
      description: 'Label displayed above the countdown numbers (e.g. "NEXT DROP RELEASES IN")',
      initialValue: 'NEXT DROP RELEASES IN',
    }),
    defineField({
      name: 'showTimer',
      title: 'Show Countdown Timer',
      type: 'boolean',
      description: 'Toggle on/off to display or hide the countdown timer section.',
      initialValue: true,
    }),
    defineField({
      name: 'expiredMessage',
      title: 'Post-Launch Live Message',
      type: 'string',
      description: 'Message shown once the countdown reaches zero or when drop is live.',
      initialValue: 'LIMITED DROP IS LIVE NOW',
    }),
  ],
})
