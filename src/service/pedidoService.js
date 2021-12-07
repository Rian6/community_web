import { GET, SET, SET_SEM_FORMATAR_JSON } from "./conection"

export const getAllPedidos = async () => {

    let pedidos = await GET("pedidos")
    if (pedidos !== null && pedidos !== 'undefined' && pedidos !== []) {
        return pedidos
    } else {
        return []
    }
}

export const gerarRelatorioPedido = async (pedido, produtos) => {
    let pedidoCompleto = JSON.stringify(pedido) + "|" + JSON.stringify(produtos)
    let pdf = await SET_SEM_FORMATAR_JSON("pedido/relatorio", pedidoCompleto)
    return pdf
}

export const salvarPedido = async (pedido, produtos) => {
    let pedidoCompleto = JSON.stringify(pedido) + "|" + JSON.stringify(produtos)
    await SET_SEM_FORMATAR_JSON("pedido/salvar", pedidoCompleto)
}

export const removePedido = async (pedido) => {
    console.log(pedido)
    let pedidoTemp = await SET("pedido/remover", pedido)

    return pedidoTemp
}
