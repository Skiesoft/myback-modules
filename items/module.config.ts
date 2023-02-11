import { Member } from './src/model/member'
import { Product } from './src/model/product'
import { OrderItem } from './src/model/orderitem'
import { Order } from './src/model/order'

module.exports = {
  name: 'Simple Todo List',
  description: 'Example module of a simple todo list.',
  models: [Member, Product, OrderItem, Order]
}
