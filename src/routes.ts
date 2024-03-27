import { Router,Request,Response } from "express";
import { produto } from "./controllers/produtos/produtos";
import { controlerOrcamento } from "./controllers/orcamento/orcamento";
import { Cliente } from "./controllers/cliente/cliente";
import { formaDePagamamento } from "./controllers/formaDePagamamento/formaDePagamamento";
import { Acerto } from "./controllers/acerto/acerto";

const router = Router();

    router.get('/',(req:Request, res:Response)=>{
      return  res.json({"ok":true});
    })

    router.post('/teste',(req:Request, res:Response)=>{
        console.log(req.body);
    })


    router.get('/produto/:produto',async(req:Request, res:Response)=>{
      //return  res.json({"ok":true});
      const obj = new produto();
      const aux = await obj.buscaProduto(req,res);
    //  console.log(aux)
     res.json(aux)
    })


      router.get('/produtos/:produto', async (req: Request, res: Response) => {
        const a = new produto();
        const aux = await a.busca(req,res );
        res.json(aux)
      });
      router.get('/setor/:produto', async(req:Request, res:Response)=>{
        const aux = req.params.produto;
        const prod = parseInt(aux);
        const acerto = new produto();
        const busca = await acerto.setorQuery(prod);
          res.json(busca);
      } )

   //   router.get('/acerto/:produto', async (req: Request, res: Response) => {
   //     const a = new produto();
   //     const aux = await a.buscaDoAcerto( req, res );
   //    res.json(aux);
   //   });

      router.post('/acerto', (req,res)=>{
        const a = new Acerto();
        a.insereAcerto(req, res, req.body);
        //console.log(req.body)
      });
  

      router.get('/cliente/:cliente', async (req,res)=>{
        const obj = new Cliente();
        const data = await obj.busca(req);
        res.json(data)
      });

      router.get('/formaDePagamamento' ,async (req:Request,res:Response)=>{
        const obj = new formaDePagamamento();
        const data = await obj.busca(req, res);
      });
    
    router.post('/cadastraOrcamento', async (req,res)=>{
      const obj = new controlerOrcamento()
     let a = await obj.cadastra(req,res);
    });
   
    export {router} 