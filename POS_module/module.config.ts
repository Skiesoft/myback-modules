import { Item } from './src/model/item'
import { Member } from './src/model/member'
import { Deal } from './src/model/deal'

module.exports = {
  name: 'POS',
  description: 'POS',
  models: [Item, Member, Deal]
}
