# Sistema de Gestão de Propriedades Imobiliárias

Este projeto é um backend para gerenciar propriedades imobiliárias, incluindo autenticação de usuários, cadastro de imóveis, construtoras, e filtragem de propriedades. O sistema facilita o CRUD completo para propriedades e empresas, sendo ideal para imobiliárias que precisam gerenciar seus anúncios e usuários de forma centralizada.

## Principais Desafios 
Maior desafio foi instalar o NEXT15 e pesquisar as mudanças e melhorias, também foi um desafio trabalhar com imagens, eu tive mais desafios com o backend quando fui fazer testes com JEST E SUPERTEST, eu nunca trabalhei com essas ferramentas e foi um desafio, após assistir vídeos dos meus cursos na rocketseat + YouTube + alura, consegui trabalhar bem os testes mas foi um aprendizado incrível

Outro desafio foi trabalhar com TypeORM, pois ultimamente eu tenho escolhido o PrismaORM, trabalhar com type não foi difícil, me tirou umas horas de sono para relembrar tudo. Tive que ler a documentação do TypeORM e ver algumas aulas. 

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Rotas da API](#rotas-da-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

Este projeto é uma API RESTful que fornece funcionalidades para gerenciar propriedades imobiliárias. O objetivo é fornecer uma solução eficiente para cadastrar e manipular informações sobre imóveis, incluindo criação, atualização, remoção e visualização. O sistema também permite a autenticação de usuários e o gerenciamento de construtoras. A aplicação utiliza autenticação JWT para proteger rotas sensíveis, garantindo que apenas usuários autenticados possam realizar determinadas operações.
Foram implementados testes automatizados com Jest e Supertest para garantir a qualidade e a confiabilidade das funcionalidades principais da API.

## Tecnologias Utilizadas

- Node.js
- Express
- TypeORM
- Zod (validação de dados)
- Multer (upload de arquivos)
- JWT (autenticação)
- PostgreSQL
- Helmet e CORS (segurança)

## Instalação

Explique como configurar o projeto localmente. Inclua comandos passo a passo:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git

# Navegue até o diretório do projeto
cd seu-repositorio

# Instale as dependências
npm install
```

## Uso

Explique como executar o projeto e qualquer configuração adicional necessária.

```bash
# Execute o projeto em ambiente de desenvolvimento
npm run dev
```

Adicione instruções adicionais se houver etapas específicas, como configuração de variáveis de ambiente.

Certifique-se de criar um arquivo `.env` com as seguintes variáveis de ambiente:

```
PORT=3333
DATABASE_URL=seu_banco_de_dados
JWT_SECRET=sua_chave_secreta
```

## Rotas da API

### Middlewere

- Rotas de POST, PUT e DELETE tem um middlewere para verificar se a requisição é de um usuário autenticado!


### Autenticação

- `POST /signup` - Cadastro de novo usuário.
- `POST /signin` - Login de usuário.

### Propriedades

- `GET /properties` - Filtrar propriedades.
- `GET /properties/:id` - Obter detalhes de uma propriedade específica.
- `POST /properties` - Criar uma nova propriedade (requer autenticação via JWT).
- `PUT /properties/:id` - Atualizar uma propriedade existente (requer autenticação via JWT).
- `DELETE /properties/:id` - Remover uma propriedade (requer autenticação via JWT).

### Construtoras

- `GET /company` - Listar todas as construtoras.
- `POST /company` - Adicionar uma nova construtora (requer autenticação via JWT).

### Ping

- `GET /ping` - Rota de teste para verificar se o servidor está funcionando corretamente.

## Contribuição

Se o projeto for open source e você aceitar contribuições, adicione diretrizes sobre como contribuir:

1. Faça um fork do projeto.
2. Crie uma nova branch: `git checkout -b minha-feature`
3. Faça suas alterações e commit: `git commit -m 'Minha nova feature'`
4. Envie para o seu fork: `git push origin minha-feature`
5. Abra um Pull Request.

## Licença

MIT License

---

