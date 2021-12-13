import { GET, SET } from "./conection"

export const getAllPessoas = async () => {

    let pessoas = await GET("pessoas")
    if (pessoas !== null && pessoas !== 'undefined' && pessoas !== []) {
        return pessoas
    } else {
        return []
    }
}

export const savePessoa = async (pessoa) => {

    let pessoaTemp = await SET("pessoa/salvar", pessoa)

    return pessoaTemp
}

export const filtrarPessoaPorNome = async (pessoa) => {

    let pessoaTemp = await SET("pessoa/filtrarPorNome", pessoa)

    console.log(pessoaTemp)
    return pessoaTemp
}

export const removePessoa = async (pessoa) => {

    let pessoaTemp = await SET("pessoa/remover", pessoa)

    return pessoaTemp
}
