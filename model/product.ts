import { Model, attribute } from '@myback/sdk'

export class Product extends Model {
  protected static tableName: string = 'products'

    @attribute({ type: 'int', primary: true, autoIndex: true })
      id?: number

    @attribute({ type: 'string', nullable: true })
      serial_number?: string

    @attribute({ type: 'string', nullable: true, unique: true })
      upc?: string

    @attribute({ type: 'string' })
      name: string = ''

    @attribute({ type: 'string' })
      status: string = ''

    @attribute({ type: 'date' })
      create_time?: Date

    @attribute({ type: 'string' })
      manufacturer: string = ''

    @attribute({ type: 'string' })
      unit: string = ''

    @attribute({ type: 'float', nullable: true })
      weight?: number

    @attribute({ type: 'float', nullable: true })
      length?: number

    @attribute({ type: 'float', nullable: true })
      width?: number

    @attribute({ type: 'float', nullable: true })
      height?: number

    @attribute({ type: 'string', nullable: true })
      info?: string

    @attribute({ type: 'string', nullable: true })
      note?: string

    @attribute({ type: 'float' })
      price: number = 0

    @attribute({ type: 'int' })
      plan_on_ordering: number = 0

    @attribute({ type: 'int' })
      ordered: number = 0

    @attribute({ type: 'int' })
      stock: number = 0
}
