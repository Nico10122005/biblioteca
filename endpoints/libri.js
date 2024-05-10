function endpoint(app, connpool) {

    app.post("/api/libri", (req, res) => {
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
            codice: req.body.codice,
            genere: req.body.genere,
            titolo: req.body.titolo,
        }

        var sql = 'INSERT INTO libro (codice,genere, titolo) VALUES (?,?,?)'
        var params = [data.codice, data.genere, data.titolo]
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

    })



    app.get("/api/libri", (req, res, next) => {
        var sql = "select * from libro"
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


    app.get("/api/libri/:id", (req, res) => {
        var sql = "select * from libro where libro.codice = ?"
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


    app.put("/api/libri/:id", (req, res) => {
        var data = {
            codice: req.body.codice,
            genere: req.body.genere,
            titolo: req.body.titolo,
        }
        connpool.execute(
            `UPDATE libro set 
                codice = COALESCE(?,codice),
               genere = COALESCE(?,genere), 
               titolo = COALESCE(?,titolo) 
               WHERE libro.codice = ?`,
            [data.codice, data.genere, data.titolo, req.params.id],
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



    app.delete("/api/libri/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM libro WHERE libro.codice = ?',
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