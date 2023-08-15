import { Model, attribute } from '@myback/sdk'

export class Tag extends Model {
  protected static tableName: string = 'tag'

    @attribute({ type: 'int', primary: true, autoIndex: true})
      id?: number

    @attribute({ type: 'string'})
      name: string = ''
}
