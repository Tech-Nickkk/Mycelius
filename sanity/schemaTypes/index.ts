import { type SchemaTypeDefinition } from 'sanity'
import { whatWeDo } from './whatWeDo'
import { targetAudience } from './targetAudience'
import { limitedEdition } from './limitedEdition'
import { incubator } from './incubator'
import { limitedEditionSettings } from './limitedEditionSettings'
import { galleryItem } from './galleryItem'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [whatWeDo, targetAudience, limitedEdition, incubator, limitedEditionSettings, galleryItem],
}

