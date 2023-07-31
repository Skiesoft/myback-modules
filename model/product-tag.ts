import { Model, attribute } from '@myback/sdk'
import { Product } from './product'
import { Tag } from './tag'

export class ProductTag extends Model {
  protected static tableName: string = 'product_tag'
    @attribute({ type: 'relation' })
      product?: Product
    
    @attribute({ type: 'relation' })
      tag?: Tag
}
