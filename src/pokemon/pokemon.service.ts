import { Injectable } from '@nestjs/common'
import { 
  BadRequestException, 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common/exceptions'
import { InjectModel } from '@nestjs/mongoose/dist'
import { isValidObjectId, Model } from 'mongoose'

import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { Pokemon } from './entities/pokemon.entity'

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model< Pokemon >
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {

      const pokemon = await this.pokemonModel.create( createPokemonDto )
  
      return pokemon

    } catch( error ) {
      this.handleException( error )
    }

  }

  findAll() {
    return this.pokemonModel.find()
  }

  async findOne(term: string) {
    
    let pokemon: Pokemon

    if ( !isNaN( +term ) ) {
      pokemon = await this.pokemonModel.findOne({ no: term })
      return
    }

    if ( isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term )
      return
    }

    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim })
      return 
    }

    if ( !pokemon ) throw new NotFoundException(
      `Pokemon con id, name or no ${ term } no existe!`
    )

    return pokemon

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne( term )

    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()

    try {

      await pokemon.updateOne( updatePokemonDto )

      return { ...pokemon.toJSON(), ...updatePokemonDto }

    } catch( error ) {
      this.handleException( error )
    }

  }

  async remove(id: string) {

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })

    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon con id '${ id }' no se encontró.`) 

    return 
    
  }

  private handleException( error: any ) {
    
    if ( error.code === 11000 ) {
      throw new BadRequestException(
        `Pokemon existe en db ${JSON.stringify( error.keyValue )}`
      )
    }
  
    throw new InternalServerErrorException(
      'No se pudo crear el pokemoon, vea el log'
    )
    
  }

}
