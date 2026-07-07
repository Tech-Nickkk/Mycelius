import { type SchemaTypeDefinition } from 'sanity'
import { whatWeDo } from './whatWeDo'
import { targetAudience } from './targetAudience'
import { limitedEdition } from './limitedEdition'
import { incubator } from './incubator'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [whatWeDo, targetAudience, limitedEdition, incubator],
}
