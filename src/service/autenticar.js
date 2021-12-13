import { GET, SET } from "./conection"

export const autenticar = async (usuario) => {

    let usr = await SET("usuario/logar", usuario)

    return usr
}

export const salvarUsuario = async (usuario) => {

    let usr = await SET("usuario/salvar", usuario)

    return usr
}

