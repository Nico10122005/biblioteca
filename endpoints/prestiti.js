function endpoint(app, connpool) {

    app.post("/api/prestiti", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.description) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        */
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            dataInizio: req.body.dataInizio,
            dataFinePrevista: req.body.dataFinePrevista,
            dataFineEffettiva: req.body.dataFineEffettiva,
            codice: req.body.codice,
            idUtente: req.body.idUtente,
        }

        var sql = 'INSERT INTO prestito (idPrestito,dataInizio,dataFinePrevista,dataFineEffettiva,codice,idUtente) VALUES (?,?,?,?,?,?)'
        var params = [data.idPrestito, data.dataInizio, data.dataFinePrevista,data.dataFineEffettiva,data.codice,data.idUtente]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    });


    app.get("/api/prestiti", (req, res, next) => {
        var sql = "select * from prestito"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });


    app.get("/api/prestiti/:id", (req, res) => {
        var sql = "select * from prestito where prestito.idPrestito = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows[0]
            })
          });
    });


    app.put("/api/prestiti/:id", (req, res) => {
        var data = {
            dataInizio: req.body.dataInizio,
            dataFinePrevista: req.body.dataFinePrevista,
            dataFineEffettiva: req.body.dataFineEffettiva,
            codice: req.body.codice,
            idUtente: req.body.idUtente,
        }
        connpool.execute(
            `UPDATE prestito set 
                dataInizio= COALESCE(?,dataInizio),
               dataFinePrevista= COALESCE(?,dataFinePrevista), 
               dataFineEffettiva = COALESCE(?,dataFineEffettiva),
               codice= COALESCE(?,codice),
               idUtente= COALESCE(?,idUtente),
               WHERE prestito.idPrestito = ?`,
            [data.dataInizio, data.dataFinePrevista, data.dataFineEffettiva,data.codice,data.idUtente, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
        });
    })



    app.delete("/api/prestiti/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM prestito WHERE prestito.idPrestito = ?',
            [req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message":"deleted", changes: result.affectedRows})
        });
    })


}





module.exports = endpoint;