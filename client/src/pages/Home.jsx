import { useEffect, useRef, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import "../resources/transactions.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import AddEditTransaction from "../components/AddEditTransaction";
import SaidaCaixa from "../components/SaidaCaixa";
import Spinner from "../components/Spinner";
import axios from "axios";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Table,
  message,
} from "antd";
import moment from "moment";
import Analictys from "../components/Analictys";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import Modal from "antd/es/modal/Modal";
const { RangePicker } = DatePicker;

dayjs().format();

const Home = () => {
  const [showModalCotation, setShowModalCotation] = useState(false);
  const [showAddEditTransactionModal, setShowAddEditTransactionModal] =
    useState(false);
  const [showValorSaida, setShowValorSaida] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("Todos");
  const [selectedRange, setSelectedRange] = useState([]);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [selectedItemFromPrint, setSelectedItemFromPrint] = useState([]);
  const [viewType, setViewType] = useState("table");
  const printRef = useRef();
  const [valorOrcamento, setValorOrcamento] = useState(0);

  moment.locale("pt-br");

  const getTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("sheymoney-udemy-user"));
      setLoading(true);
      const response = await axios.post(
        "/api/transactions/get-all-transactions",
        {
          user: user._id,
          frequency,
          userEmail: user.email,
          ...(frequency === "custom" && { selectedRange }),
          type,
        }
      );
      setTransactionsData(response.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Alguma coisa deu errado");
    }
  };

  const deleteTransaction = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/transactions/delete-transaction", {
        transactionId: record._id,
      });
      message.success("Transação deletada com sucesso");
      getTransactions();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Alguma coisa deu errado");
    }
  };

  const buscaOneId = async (record) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/transactions/get-all-print-id", {
        transactionId: record._id,
        amount: record.amount,
        reference: record.reference,
        OSid: record.OSid,
        date: record.date,
      });
      setSelectedItemFromPrint(response.data);
      message.success("Order aberta com sucesso");
      getTransactions();
      setLoading(false);
      console.log(selectedItemFromPrint);
    } catch (error) {
      setLoading(false);
      message.error("Alguma coisa deu errado");
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@page { size: auto; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; padding: 80px !important; } }",
    documentTitle: "Ordem de Serviço",
  });

  useEffect(() => {
    getTransactions();
  }, [frequency, selectedRange, type, selectedItemFromPrint]);

  const columns = [
    {
      title: "Data",
      dataIndex: "date",
      render: (record) => (
        <span>{moment(record).utc().format("DD-MM-YYYY")}</span>
      ),
    },
    {
      title: "OS",
      dataIndex: "OSid",
    },
    {
      title: "Nome",
      dataIndex: "nomeCliente",
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
    },
    {
      title: "Carro",
      dataIndex: "carro",
    },
    {
      title: "Peças",
      dataIndex: "valorPecas",
    },
    {
      title: "Mão de obra",
      dataIndex: "valorDaObra",
    },
    {
      title: "Total",
      dataIndex: "amount",
    },
    {
      title: "Mecânico",
      dataIndex: "mecanico",
    },
    {
      title: "Mecânico 2",
      dataIndex: "mecanico2",
    },
    {
      title: "MC Sistema",
      dataIndex: "mcSistema",
    },
    {
      title: "Ações",
      dataIndex: "actions",
      render: (text, record) => {
        const usuario = JSON.parse(
          localStorage.getItem("sheymoney-udemy-user")
        );
        const nome = usuario.name;
        return (
          <div>
            <EditOutlined
              className="mx-2"
              onClick={() => {
                setSelectedItemForEdit(record);
                setShowAddEditTransactionModal(true);
              }}
            />
            {nome === "Clesio Kornalewski da Silva" && (
              <DeleteOutlined
                style={{ color: "red" }}
                className="mx-2"
                onClick={() => deleteTransaction(record)}
              />
            )}
            <FolderOpenOutlined
              className="mx-2"
              onClick={() => {
                buscaOneId(record);
              }}
            />
          </div>
        );
      },
    },
  ];

  const currencyBRL = (valor) => {
    const formattedValue = valor?.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formattedValue;
  };

  const valor10x = (valorOrcamento * 4) / 100;
  const orc10x = valor10x + valorOrcamento;

  return (
    <>
      <DefaultLayout>
        {loading && <Spinner />}
        <div className="filter d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <div className="d-flex flex-column">
              <h6>Selecione o Período</h6>
              <Select
                value={frequency}
                onChange={(value) => setFrequency(value)}
              >
                <Select.Option value="7">Últimos 7 dias</Select.Option>
                <Select.Option value="30">Últimos 30 dias</Select.Option>
                <Select.Option value="365">Último Ano</Select.Option>
                <Select.Option value="custom">Escolha o período</Select.Option>
              </Select>
            </div>
            {/* **************************** */}
            <div className="d-flex flex-column mx-5">
              <h6>Selecione o tipo</h6>
              <Select value={type} onChange={(value) => setType(value)}>
                <Select.Option value="Todos">Todos</Select.Option>
                <Select.Option value="entrada">Entrada</Select.Option>
                <Select.Option value="saida">Saída</Select.Option>
              </Select>

              {frequency === "custom" && (
                <div className="mt-2">
                  <RangePicker
                    format={"DD-MM-YYYY"}
                    value={selectedRange}
                    onChange={(values) => setSelectedRange(values)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="d-flex">
            <div className="mx-2 my-2">Saída:</div>
            <button className="primary" onClick={() => setShowValorSaida(true)}>
              Caixa
            </button>
            {/* <div className="mx-2 my-2" style={{ color: "red" }}>
              Cotação:
            </div>
            <button
              className="primary"
              onClick={() => setShowModalCotation(true)}
            >
              Calcular
            </button> */}
            <div>
              <div className="view-switch mx-5">
                <UnorderedListOutlined
                  className={` mx-3 ${
                    viewType === "table" ? "active-icon" : "inactive-icon"
                  }`}
                  onClick={() => setViewType("table")}
                  size={30}
                />
                <AreaChartOutlined
                  className={`${
                    viewType === "analytics" ? "active-icon" : "inactive-icon"
                  }`}
                  onClick={() => setViewType("analytics")}
                  size={30}
                />
              </div>
            </div>
            <div className="mx-2 my-2">Ordem de Serviço:</div>
            <button
              className="primary"
              onClick={() => setShowAddEditTransactionModal(true)}
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* ################################################################################################################################# */}
        <Modal
          title="Orçamento"
          open={showModalCotation}
          footer={[
            <Button
              key="back"
              type="primary"
              onClick={() => setShowModalCotation(false)}
            >
              OK
            </Button>,
          ]}
          onCancel={() => setShowModalCotation(false)}
        >
          <Form>
            <Form.Item label="Valor da peça">
              <InputNumber onChange={(value) => setValorOrcamento(value)} />
            </Form.Item>
          </Form>
          <div className="d-flex justify-content">
            Valor em 6x: {currencyBRL(orc10x)}
          </div>
          <div className="d-flex justify-content">
            Valor com desconto PIX: {currencyBRL(valorOrcamento)}
          </div>
        </Modal>

        <div className="table-analitics">
          {viewType === "table" ? (
            <div className="table">
              <Table
                columns={columns}
                dataSource={transactionsData}
                rowKey={() => Math.random()}
              />
            </div>
          ) : (
            <Analictys transactions={transactionsData} />
          )}
        </div>
        {/* ################################################################################################################### */}
        <div ref={printRef} className="PrintSection">
          {/* <div className="marcador align-items-center">
            <img src={logo} width="140" height="75" alt="logo" />
          </div> */}
          <h3 className="text-center">Auto Peças Balczarek </h3>
          <h6 className="text-center">
            Rua Cândido Godói, 620 - Centro - Dom Feliciano/RS - Tel:
            51-99619-9747
          </h6>
          <br></br>
          <br></br>
          <div className="d-flex justify-content-between">
            <h5>Ordem de serviço: {selectedItemFromPrint.OSid} </h5>

            <h5>
              <div>Mecânico: {selectedItemFromPrint.mecanico}</div>
            </h5>

            <h5>
              {" "}
              Data:{" "}
              {moment(selectedItemFromPrint.date).utc().format("DD-MM-YYYY")}
            </h5>
          </div>
          <br></br>
          <div>Nome: {selectedItemFromPrint.nomeCliente}</div>
          <div>Telefone: {selectedItemFromPrint.telefone}</div>
          <div>Carro: {selectedItemFromPrint.carro}</div>
          <div>Placa: {selectedItemFromPrint.placa}</div>
          <hr />
          <h6>Colaborador(a): {selectedItemFromPrint.userName}</h6>
          <div>Serviço e/ou Peças: {selectedItemFromPrint.servpecas}</div>
          <div>
            Descrição das peças: {selectedItemFromPrint.descriptionPecas}
          </div>
          <div className="negrito">
            Valor das peças: R${selectedItemFromPrint.valorPecas}
          </div>
          <hr />
          <div>
            Descrição da mão de obra: {selectedItemFromPrint.descriptionMaoObra}
          </div>
          <div className="negrito">
            Valor da mão de obra: R${selectedItemFromPrint.valorDaObra}
          </div>
          <hr />
          <div>Observação: {selectedItemFromPrint.obsPedido}</div>
          <div>
            <div className="negrito">
              {/* Valot total em 5x:{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
                {currencyBRL(totalem10x)}
              </span> */}
              <br></br>
              Valor total:{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
                {currencyBRL(selectedItemFromPrint.amount)}
              </span>
            </div>
          </div>
          <br></br>
          <div>Forma de pagamento: {selectedItemFromPrint.formapagamento}</div>
          <br></br>
          <div>Autorizo a Oficina Balzarek a efetuar o serviço.</div>
          <div>
            <br></br>
            -------------------------<br></br>
            {selectedItemFromPrint.nomeCliente},<br></br>
          </div>

          <br></br>
          {selectedItemFromPrint.reference}
        </div>

        <div className="mt-5">
          <button onClick={handlePrint}>Imprimir</button>
        </div>

        {showAddEditTransactionModal && (
          <AddEditTransaction
            showAddEditTransactionModal={showAddEditTransactionModal}
            setShowAddEditTransactionModal={setShowAddEditTransactionModal}
            selectedItemForEdit={selectedItemForEdit}
            getTransactions={getTransactions}
            setSelectedItemForEdit={setSelectedItemForEdit}
          />
        )}

        {showValorSaida && (
          <SaidaCaixa
            showValorSaida={showValorSaida}
            setShowValorSaida={setShowValorSaida}
            getTransactions={getTransactions}
          />
        )}

        <br></br>
        <hr />
      </DefaultLayout>
    </>
  );
};

export default Home;
