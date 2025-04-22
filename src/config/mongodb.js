/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

// khoi tao mot doi tuong mongoClientInstance de connect toi mongodb
const mongoClientInstance = new MongoClient( env.MONGODB_URI, {
  serverApi:{
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // goi ket noi toi mongodb alats voi URI da khai bao trong than cua mongodbClientInstance
  await mongoClientInstance.connect()
  // ket noi thanh cong lay database theo ten va gan vao bien trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db( env.DATABASE_NAME )
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first')
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () =>{
  await mongoClientInstance.close()
}