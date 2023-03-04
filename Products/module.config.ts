import { Member } from './src/model/member'
import { Order } from './src/model/order'
import { OrderItem } from './src/model/orderItem'
import { Product } from './src/model/product'

module.exports = {
  name: 'Product',
  description: 'Example module of a simple todo list.',
  models: [Member, Order, OrderItem, Product]
}
