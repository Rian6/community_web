import { GET, SET } from "./conection"

export const getAllProdutos = async () => {

    let produtos = await GET("produtos")
    if (produtos !== null && produtos !== 'undefined' && produtos !== []) {
        return produtos
    } else {
        return []
    }
}

export const saveProduto = async (produto) => {
    console.log(produto)
    let produtoTemp = await SET("produto/salvar", produto)

    return produtoTemp
}

export const filtrarProdutoPorNome = async (produto) => {
    console.log(produto)
    let produtosTemp = await SET("produto/filtrarPorNome", produto)

    return produtosTemp
}

export const removeProduto = async (produto) => {
    console.log(produto)
    let produtoTemp = await SET("produto/remover", produto)

    return produtoTemp
}
