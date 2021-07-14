import React from 'react';
import styled from 'styled-components';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
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

export default function Home() {
  
  const usuarioAleatorio= 'rodrigoschonardt';
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
                  id: new Date().toISOString(),
                  titulo:dadosDoForm.get('title'),
                  image:dadosDoForm.get('image'),
                  
                }

                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
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
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.image} />
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
