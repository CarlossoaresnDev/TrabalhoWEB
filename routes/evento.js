const express = require("express");
const router = express.Router();
const path = require("path");
const Evento = require("../models/Evento");
const Atividade = require("../models/Atividades");

router.delete("/:id", async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    res.status(200).json({ message: "Evento deletado com sucesso" });
  } catch (err) {
    console.log("Erro ao deletar evento:", err);
    res.status(500).json({ message: "Erro ao deletar evento" });
  }
});

router.get("/:id/editar/dados", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    res.json(evento);
  } catch (err) {
    console.log("Erro ao buscar evento:", err);
    res.status(500).json({ message: "Erro ao buscar evento" });
  }
});

router.post("/:id/editar", async (req, res) => {
  const { nomeEvento, dataEvento, descEvento } = req.body;

  try {
    const evento = await Evento.findByIdAndUpdate(
      req.params.id,
      {
        nome: nomeEvento,
        data: dataEvento,
        descricao: descEvento,
      },
      { new: true }
    );

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    res.status(200).json(evento);
  } catch (err) {
    console.log("Erro ao atualizar evento:", err);
    res.status(500).json({ message: "Erro ao atualizar evento" });
  }
});

router.get("/:id/editar", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }
    res.render("editEvent", { evento });
  } catch (err) {
    console.log("Erro ao buscar evento:", err);
    res.status(500).json({ message: "Erro ao buscar evento" });
  }
});

router.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "criar-evento.html"));
});

router.post("/nova", async (req, res) => {
  const { nomeEvento, dataEvento, descEvento } = req.body;
  try {
    const novoEvento = new Evento({
      nome: nomeEvento,
      data: dataEvento,
      descricao: descEvento,
    });

    await novoEvento.save();
    console.log("Evento criado com sucesso");
    res.status(201).json({ message: "Evento criado com sucesso" });
  } catch (err) {
    console.log("Erro ao salvar evento:", err);
    res.status(500).json({ message: "Erro ao salvar evento" });
  }
});
router.post("/participar", async (req, res) => {
  const { eventoId } = req.body;
  const usuarioId = req.session.userId; // Assumindo que o ID do usuário esteja na sessão

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    if (!Array.isArray(evento.participantes)) {
      evento.participantes = [];
    }

    // Verifica se o usuário já está na lista de participantes
    if (!evento.participantes.includes(usuarioId)) {
      evento.participantes.push(usuarioId);
      await evento.save();
    }

    res.json({ message: "Participação confirmada" });
  } catch (err) {
    console.error("Erro ao participar do evento:", err);
    res.status(500).json({ message: "Erro ao participar do evento" });
  }
});

router.get("/listar", async (req, res) => {
  try {
    const eventos = await Evento.find({});
    const eventosComContagem = eventos.map((evento) => ({
      ...evento._doc,
      numeroDeParticipantes: evento.participantes.length,
    }));
    res.json(eventosComContagem);
  } catch (err) {
    console.log("Erro ao listar eventos:", err);
    res.status(500).json({ message: "Erro ao listar eventos" });
  }
});

router.get("/atividades", async (req, res) => {
  try {
    const atividades = await Atividade.find({})
      .populate("categoria")
      .sort({ criadoEm: "desc" });

    const atividadesPorCategoria = {};
    atividades.forEach((atividade) => {
      const nomeCategoria = atividade.categoria.nome;
      if (!atividadesPorCategoria[nomeCategoria]) {
        atividadesPorCategoria[nomeCategoria] = [];
      }
      atividadesPorCategoria[nomeCategoria].push(atividade);
    });

    res.render("atividades", { atividadesPorCategoria });
  } catch (err) {
    console.log("Erro ao buscar atividades:", err);
    res.status(500).json({ message: "Erro ao buscar atividades" });
  }
});

router.get("/atividades/add", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "addatividade.html"));
});

router.post("/atividades/nova", async (req, res) => {
  const { titulo, descricao, conteudo, categoria } = req.body;
  try {
    const novaAtividade = new Atividade({
      titulo,
      descricao,
      conteudo,
      categoria,
    });

    await novaAtividade.save();
    console.log("Atividade criada com sucesso");
    res.status(201).json({ message: "Atividade criada com sucesso" });
  } catch (err) {
    console.log("Erro ao salvar atividade:", err);
    res.status(500).json({ message: "Erro ao salvar atividade" });
  }
});

router.get("/atividades/:id/editar", async (req, res) => {
  try {
    const atividade = await Atividade.findById(req.params.id);
    if (!atividade) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }
    res.render("editAtividade", { atividade });
  } catch (err) {
    console.log("Erro ao buscar atividade:", err);
    res.status(500).json({ message: "Erro ao buscar atividade" });
  }
});

router.post("/atividades/:id/editar", async (req, res) => {
  const { titulo, descricao, conteudo, categoria } = req.body;
  try {
    const atividade = await Atividade.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        descricao,
        conteudo,
        categoria,
      },
      { new: true }
    );

    if (!atividade) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }
    res.status(200).json(atividade);
  } catch (err) {
    console.log("Erro ao atualizar atividade:", err);
    res.status(500).json({ message: "Erro ao atualizar atividade" });
  }
});

router.delete("/atividades/:id", async (req, res) => {
  try {
    const atividade = await Atividade.findByIdAndDelete(req.params.id);
    if (!atividade) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }
    res.status(200).json({ message: "Atividade deletada com sucesso" });
  } catch (err) {
    console.log("Erro ao deletar atividade:", err);
    res.status(500).json({ message: "Erro ao deletar atividade" });
  }
});

router.get("/api/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find({});
    res.json(eventos);
  } catch (err) {
    console.log("Erro ao listar eventos:", err);
    res.status(500).json({ message: "Erro ao listar eventos" });
  }
});

router.get("/organizador/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find({}).populate("participantes");
    const eventosComInscritos = eventos.map((evento) => ({
      nome: evento.nome,
      data: evento.data,
      descricao: evento.descricao,
      inscritos: evento.participantes.length,
    }));
    res.json(eventosComInscritos);
  } catch (err) {
    console.log("Erro ao listar eventos:", err);
    res.status(500).json({ message: "Erro ao listar eventos" });
  }
});
router.post("/:id/marcar-presenca", async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado" });
    }

    if (!Array.isArray(evento.presenca)) {
      evento.presenca = [];
    }

    // Verifica se o participante já está marcado como presente
    if (evento.presenca.includes(usuarioId)) {
      return res
        .status(400)
        .json({
          message: "Usuário já está marcado como presente neste evento",
        });
    }

    evento.presenca.push(usuarioId);
    await evento.save();

    res.json({ message: "Presença marcada com sucesso" });
  } catch (err) {
    console.error("Erro ao marcar presença:", err);
    res.status(500).json({ message: "Erro ao marcar presença" });
  }
});
router.get("/:id/participantes", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id)
      .populate("participantes")
      .populate("presenca");
    res.json(evento);
  } catch (err) {
    console.log("Erro ao listar participantes:", err);
    res.status(500).json({ message: "Erro ao listar participantes" });
  }
});

router.get("/:id/quantidade-presentes", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).populate("presenca");
    const quantidadePresentes = evento.presenca.length;
    res.json({ quantidadePresentes });
  } catch (err) {
    console.log("Erro ao buscar quantidade de presentes:", err);
    res.status(500).json({ message: "Erro ao buscar quantidade de presentes" });
  }
});

module.exports = router;
