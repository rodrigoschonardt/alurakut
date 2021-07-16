import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response){
    if(request.method === 'POST'){
        const TOKEN= '296cd4509cad21e0ab9917e139329e';
    
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "967806",
            ...request.body,
            //title: "comunidade",
            //imageUrl: "https://github.com/omariosouto.png",
            //creatorSlug:"omariosouto",
        }) 
    
        response.json({
        registroCriado: registroCriado,
        })
        return;
    }
    response.status(404).json({
        message: 'ainda nao temos nada no get'
    })
    
    
}