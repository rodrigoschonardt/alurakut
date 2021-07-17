import React from 'react';
import styled from 'styled-components';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AluraKutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function 
ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return(
  <ProfileRelationsBoxWrapper>
    <h2 className="smallTitle">
      {propriedades.title}({propriedades.items.length})
    </h2>
    <ul>
      {/*pessoasFavoritas.map((itemAtual) => {
        return (
          <li key={itemAtual}>
            <a href={`/users/${itemAtual}`}>
              <img src={`https://github.com/${itemAtual}.png`} />
              <span>{itemAtual}</span>
            </a>
          </li>
        )
      })*/}
    </ul>
  </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  
  const usuarioAleatorio= props.githubUser;
  const [comunidades, setComunidades]= React.useState([{
    id: '1231231231231',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
  }]);
  const pessoasFavoritas= [
    'felipe',
    'omariosouto',
    'peas',
    'joaovitor',
    'marcobrunodev',
    'leo'
  ];

  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function(){
    fetch('https://api.github.com/users/peas/followers')
    .then(function (respostaDoServidor){
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta){
      setSeguidores(respostaCompleta);
      
    })

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers:{
        'authorization': '8d92992730655f22d0ee8712dd4640',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
          }
        }`})
    })
    .then((response) => response.json())
    .then((respostaCompleta)=>{
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      
      setComunidades(comunidadesVindasDoDato);
      
      console.log(comunidadesVindasDoDato)
    })

    
  }, [])

  return (
    <>
      <AlurakutMenu/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
            <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className= "welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>
            <OrkutNostalgicIconSet/>
          </Box>
          <Box>
            <h2 className="subTitle"> O que você deseja fazer?</h2>
              <form onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();

                const dadosDoForm= new FormData(e.target);

                const comunidade = {
                  title:dadosDoForm.get('title'),
                  imageUrl:dadosDoForm.get('image'),
                  creatorSlug: usuarioAleatorio,
                  
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers:{
                    'content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async(response) =>{
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                
                })

                
              }}>
                <div>
                  <input
                    placeholder="Qual vai ser o nome da sua comunidade?"
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"
                    type="text"
                  />
                </div>
                <div>
                  <input
                    placeholder="Coloque uma URL para usarmos de capa"
                   name="image"
                   aria-label="Coloque uma URL para usarmos de capa"
                  />
                </div>
                <button>
                  Criar comunidade
                </button>
              </form>
            </Box>
        </div>
        <div className= "profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>    
          <ProfileRelationsBox title= "seguidores"items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas Favoritas({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context){
    const cookies = nookies.get(context);
    const token= cookies.USER_TOKEN;
    const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
    })
    .then((resposta) => resposta.json())

    if(!isAuthenticated) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        }
      }
    }
    const {githubUser} =  jwt.decode(token);
    console.log('token decodificado');
    return{
      props:{
        githubUser
    },
  }
}
