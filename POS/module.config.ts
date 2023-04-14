import { Product } from './src/model/product'
import { Contact } from './src/model/contact'
import { Transaction } from './src/model/transaction'
import { TransactionItem } from './src/model/transaction-item'
import { Picture } from './src/model/picture'

module.exports = {
  name: 'Member',
  description: 'Manage Members. ',
  models: [Product, Contact, Transaction, TransactionItem, Picture]
}
