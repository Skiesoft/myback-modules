import { Deal } from './src/model/deal'
import { Item } from './src/model/item'
import { Member } from './src/model/member'

module.exports = {
  name: 'Simple Todo List',
  description: 'Example module of a simple todo list.',
  models: [Deal, Item, Member]
}
