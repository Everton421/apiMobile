import { conn, db_publico, db_estoque, db_vendas } from "../../database/databaseConfig";
import { Request, Response, response } from "express";
export class produto {

  async busca(req: Request, res: Response) {

    const parametro = req.params.produto;
    const sql: string = `
            SELECT p.codigo, p.descricao, ps.estoque, pp.preco
            FROM ${db_publico}.cad_prod p
            JOIN ${db_estoque}.prod_setor ps ON p.codigo = ps.produto
            JOIN ${db_publico}.prod_tabprecos pp ON p.codigo = pp.produto
            WHERE p.CODIGO like ?  OR p.DESCRICAO like ?
            limit 25
            `;
    const queryParam = `%${parametro}%`;
    return new Promise(async (resolve, reject) => {
      await conn.query(sql, [queryParam, queryParam], (err: any, result: any) => {
        if (err) {
          //res.status(500).json({ error: 'Erro interno do servidor' });
          res.status(500).json(err)
        } else {
          resolve(result); //res.json(result)
        }
      })

    })
  }



  async setorQuery(codigo: number) {
    return new Promise(async (resolve, reject) => {
      const sql: string = `
        SELECT ps.setor codigoSetor, s.nome nome ,ps.produto, ps.estoque
         FROM ${db_estoque}.prod_setor ps
          JOIN ${db_estoque}.setores s
         on s.codigo = ps.setor
          WHERE produto = ${codigo}
      `;
      await conn.query(sql, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  
  async prodQuery(codigo: number,res) {
    return new Promise(async (resolve, reject) => {
      let sql = `SELECT CODIGO codigo, DESCRICAO descricao FROM ${db_publico}.cad_prod WHERE codigo = ${codigo}`;
      await conn.query(sql, (err, result) => {
        if (err) {
          //reject(err);
          res.status(500).json({ err: "erro ao atualizar" });
        } else {
          resolve(result);
        }
      });
    });
  }
   async tabelaPrecosQuery(codigo:number){
      return new Promise( async (resolve, reject)=>{
          let sql = `SELECT tabela , produto, preco from ${db_publico}.prod_tabprecos WHERE produto = ${codigo};`;
          await conn.query(sql, (err,result)=>{
            if(err){
              reject(err);
            }else{
              resolve(result);
            }
          });
      });

   }
  async unidadesQuery( codigo:number){
    return new Promise( async (reject, resolve)=>{
      let sql = ` SELECT produto, descricao, sigla, fator_qtde quantidade from ${db_publico}.unid_prod where produto= ${codigo};`
      await conn.query(sql,(err,reult)=>{
        if(err){
          reject(err);
        }else{
          resolve(err);
        }
      })
    })
  }

  async buscaProduto(req:Request,res:Response) {
       const codigo:any =  req.params.produto
    let produto: any = [];
    let setores: any = [];
    let tabelaDePreco:any=[];
    let unidades:any=[];
    try {
      produto = await this.prodQuery(codigo,res);
      setores = await this.setorQuery(codigo);
      tabelaDePreco = await this.tabelaPrecosQuery(codigo);
      unidades = await this.unidadesQuery(codigo);

    } catch (err) {
      console.log(err);
    }
  
    const aux = {
      produto,
      setores,
      tabelaDePreco,
      unidades
    };
    return aux;
  }

  async buscaDoAcerto(req: Request, res: Response) {
    const parametro = req.params.produto;
    const sql: string = `
              SELECT p.codigo, p.descricao, ps.estoque, pp.preco
              FROM ${db_publico}.cad_prod p
              JOIN ${db_estoque}.prod_setor ps ON p.codigo = ps.produto
              JOIN ${db_publico}.prod_tabprecos pp ON p.codigo = pp.produto
              WHERE p.CODIGO = ?;
              `;
    const queryParam = `${parametro}`;
    return new Promise(async (resolve, reject) => {
      await conn.query(sql, [queryParam], (err: any, result: any) => {
        if (err) {
          //res.status(500).json({ error: 'Erro interno do servidor' });
          res.status(500).json(err)
        } else {
          resolve(result); //res.json(result)
        }
      })
    })
  }

  async insereAcerto(req: Request, res: Response, json: any) {
    const { setor, codigo, estoque, novoSaldo } = json;

    async function queryProd() {
      let sql2 = `SELECT codigo from ${db_publico}.cad_prod where codigo=${codigo};`;
      return new Promise(async (resolve, reject) => {
        await conn.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    try {
      let result = await queryProd(); // Await the result of queryProd
      if (result && result.length > 0) { // Check if result is not empty
        const sql = `UPDATE ${db_estoque}.prod_setor 
                                     SET 
                                     setor = 1,
                                     estoque = ${novoSaldo}
                                     WHERE
                                     produto = ${codigo};`;

        await conn.query(sql, (err: any, result: any) => {
          if (err) {
            res.status(500).json({ err: "erro ao atualizar" });
          } else {
            res.status(200).json({ "ok": `produto ${codigo} atualizado` });
          }
        });
      } else {
        console.log("produto não cadastrado");
        res.status(400).json({ err: "produto não encontrado" });
      }
    } catch (error) {
      console.log("erro ao buscar produto:", error);
      res.status(500).json({ err: "erro ao buscar produto" });
    }
  }



  async buscaCompleta(req: Request, res: Response) {
    let sql = `select * from ${db_publico}.cad_prod;`;
    conn.query(sql, (err, response) => {
      if (err) {
        throw err;
      } else {
        return res.json(response);
      }
    })
  }




}
/*
 
 
router.get('/produto/:produto', (req: Request, res: Response) => {
//  res.header('Access-Control-Allow-Origin', '*'); 
//  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//  res.header('Access-Control-Allow-Headers', 'Content-Type');

const parametro = req.params.produto;
    const sql = `
    SELECT p.codigo, p.descricao, ps.estoque, pp.preco
    FROM ${publico}.cad_prod p
    JOIN ${estoque}.prod_setor ps ON p.codigo = ps.produto
    JOIN ${publico}.prod_tabprecos pp ON p.codigo = pp.produto
    WHERE p.CODIGO LIKE ? OR p.descricao LIKE ?
    LIMIT 10
    `;
 
const queryParam = `%${parametro}%`;
con.query(sql, [queryParam, queryParam], (err: any, result: any) => {
  if (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
    return;
  }
//  console.log(result);
  res.json(result)
});
});
 
*/
