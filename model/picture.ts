import { Model, attribute } from '@myback/sdk'
import { Product } from './product'

export class Picture extends Model {
  protected static tableName: string = 'picture'

    @attribute({ type: 'relation' })
      product_id?: Product

    @attribute({ type: 'string' })
      file_name?: string

    @attribute({ type: 'string' })
      url?:string
}
