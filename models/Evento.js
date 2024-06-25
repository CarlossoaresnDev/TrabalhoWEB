const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventoSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
  presenca: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
});

eventoSchema.index({ nome: 1 });

module.exports = mongoose.model("evento", eventoSchema);
