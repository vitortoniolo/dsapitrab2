const mysql = require('mysql');
let instance = null;

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'biblioteca2',
    port: '3306'
});

connection.connect((err) => {
    if (err) {
        console.log(err.message)
    }
});

class DbService {
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try{
            const response = await new Promise((resolve, reject) =>{
                const query = "select * from livros";

                connection.query(query, (err, results) =>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            console.log(response)
            return response
        } 
        catch(error){
            console.log(error);
        }
    }


    async insertNewLivro(titulo, autor){
        try {
            const insertId = await new Promise((resolve, reject) =>{
                const query = "insert into livros (titulo, autor) values (?, ?)";

                connection.query(query, [titulo, autor], (err, result) =>{
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id : insertId,
                titulo : titulo,
                autor : autor
            };
        } catch (error){
            console.log(error)
        }
    }

    async deleteRowByID(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM livros WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    async updateTituloByID(id, titulo) {
        try {
            id = parseInt(id, 10);
    
            // Debugging: Log the received ID and SQL query
            console.log("Received ID:", id);
            const query = "UPDATE livros SET titulo = ? WHERE id = ?";
            console.log("SQL Query:", query);
            
    
            const response = await new Promise((resolve, reject) => {
                connection.query(query, [titulo, id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        if (result && result.affectedRows !== undefined) {
                            resolve(result.affectedRows);
                        } else {
                            reject(new Error("Unexpected result from the query."));
                        }
                    }
                });
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    
}

module.exports = DbService;