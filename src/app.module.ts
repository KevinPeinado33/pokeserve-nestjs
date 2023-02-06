import { join } from 'path'
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'

import { PokemonModule } from './pokemon/pokemon.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    MongooseModule.forRoot('mongodb://uytkidn5c8pincjkcbz9:Q321Ukd8jJaI147sK2bx@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bp90t1xz4r6kdg3?replicaSet=rs0'),
    
    PokemonModule
  ]
})
export class AppModule {}
