import { Model, attribute } from '@myback/sdk'

export class Tag extends Model {
  protected static tableName: string = 'tag'

    @attribute({ type: 'string'})
      name: string = ''
}
