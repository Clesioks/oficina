import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence'

const schema = mongoose.Schema({
   type: {type: String, required: true},
   date: {type: Date, required: true},
   cliente: {type: String, required: true},
   servpecas: {type: String, required: true},
   nomeCliente: {type: String, required: true},
   carroPlaca: {type: String, required: true},
   telefone: {type: String, required: true},
   descriptionPecas: {type: String, required: true},
   valorPecas: {type: Number, required: true},
   descriptionMaoObra: {type: String, required: true},
   valorDaObra: {type: String, required: true},
   amount: {type: Number, required: true},
   mecanico: {type: String, required: true},
   formapagamento: {type: String, required: true},
   userEmail: {type: String, required: true},
   userName: {type: String, required: true},
   obsSaida: {type: String},
   id: {type: Number}
})

if (!mongoose.models?.Book) {

   schema.plugin(mongooseSequence(mongoose), { inc_field: 'OSid'})
}

const transactionModel = mongoose.model('Transactions', schema)


export default transactionModel