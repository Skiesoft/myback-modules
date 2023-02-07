import { Model, attribute } from '@myback/sdk'
    
export class Item extends Model {
  protected static tableName: string = 'items'

  @attribute({ type: 'int', nullable: true, unique: true })
    barcode?: number

  @attribute({ type: 'int', primary: true, autoIndex: true })
    id?: number

  @attribute({ type: 'string' })
    name?: string

  @attribute({ type: 'string', nullable: true })
    category?: string

  @attribute({ type: 'string', nullable: true })
    status?: string

  @attribute({ type: 'string', nullable: true })
    create_time?: string

  @attribute({ type: 'string', nullable: true })
    manufacturer?: string

  @attribute({ type: 'string', nullable: true })
    unit?: string

  @attribute({ type: 'float', nullable: true })
    weight?: number

  @attribute({ type: 'float', nullable: true })
    length?: number

  @attribute({ type: 'float', nullable: true })
    width?: number

  @attribute({ type: 'float', nullable: true })
    height?: number

  @attribute({ type:'string', nullable: true })
    info?: string

  @attribute({ type: 'int' })
    price?: number

  @attribute({ type: 'string', nullable: true })
    remark?: string

  @attribute({ type: 'int', nullable: true })
    plan_on_ordering?: number

  @attribute({ type: 'int', nullable: true })
    ordered?: number

  @attribute({ type: 'int' })
    stock?: number
}