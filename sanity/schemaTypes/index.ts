import { type SchemaTypeDefinition } from 'sanity'
import { whatWeDo } from './whatWeDo'
import { targetAudience } from './targetAudience'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [whatWeDo, targetAudience],
}
