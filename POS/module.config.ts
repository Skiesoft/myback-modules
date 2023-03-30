import { Order } from './src/model/order'
import { Product } from './src/model/product'
import { Member } from './src/model/member'
import { OrderItem } from './src/model/orderItem'
import { Picture } from './src/model/picture'

module.exports = {
  name: 'Member',
  description: 'Manage Members. ',
  models: [Order, Product, Member, OrderItem, Picture]
}
