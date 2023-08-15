import { Model, attribute } from '@myback/sdk'
import { Contact } from './contact'

export class Transaction extends Model {
  protected static tableName: string = 'transaction'

    @attribute({ type: 'int', primary: true, autoIndex: true })
      id?: number

    @attribute({ type: 'datetime' })
      time?: Date

    @attribute({ type: 'relation', nullable: true })
      contact?: Contact

    @attribute({ type: 'int' })
      total_price?: number

    @attribute({ type: 'int' })
      internet_marketing: number = 0
}
