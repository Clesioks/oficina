import express from "express";
const router = express();
import Transactiom from "../models/Transaction.js";
import moment from "moment";
// moment().format();

router.post("/add-transaction", async (req, res) => {
  try {
    const newtransaction = new Transactiom(req.body);
    await newtransaction.save();
    res.send("Transação registrada com sucesso");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/edit-transaction", async (req, res) => {
  try {
    await Transactiom.findOneAndUpdate(
      { _id: req.body.transactionId },
      req.body.payload
    );
    res.send("Ordem de serviço editada com sucesso");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/delete-transaction", async (req, res) => {
  try {
    await Transactiom.findOneAndDelete({ _id: req.body.transactionId });
    res.send("Ordem de excluída com sucesso");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/get-all-transactions", async (req, res) => {
  const { frequency, selectedRange, type } = req.body;
  try {
    const sort = { OSid: -1 };

    const transactions = await Transactiom.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(req.body.frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: req.body.selectedRange[0],
              $lte: req.body.selectedRange[1].substr(0, 10) + "T23:59:59.000Z",
            },
          }),
      userid: req.body.userid,
      ...(type !== "Todos" && { type }),
    }).sort(sort);
    res.send(transactions);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/get-all-print-id", async (req, res) => {
  try {
    const order = await Transactiom.findById({ _id: req.body.transactionId });
    res.status(200).json({
      _id: req.body.transactionId,
      amount: order.amount,
      reference: order.reference,
      OSid: order.OSid,
      date: order.date,
      nomeCliente: order.nomeCliente,
      cliente: order.cliente,
      carro: order.carro,
      placa: order.placa,
      telefone: order.telefone,
      descriptionPecas: order.descriptionPecas,
      mecanico: order.mecanico,
      servpecas: order.servpecas,
      descriptionMaoObra: order.descriptionMaoObra,
      valorDaObra: order.valorDaObra,
      valorPecas: order.valorPecas,
      formapagamento: order.formapagamento,
      obsSaida: order.obsSaida,
      userName: order.userName,
      obsPedido: order.obsPedido,
      mcSistema: order.mcSistema,
    });
  } catch (error) {
    res.status(500).json(error);
  }

  // const order = await Transactiom.findById(req.order._id)

  // if (order) {
  //     res.status(200).json({
  //         _id: order._id,
  //         amount: order.amount,
  //         description: order.description
  //     })
  // } else {
  //     res.status(404)
  //     throw new Error ('Ordem não encontrada')
  // }
});

export default router;
