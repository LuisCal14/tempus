const { Router } = require('express');
const express = require('express');
const con = require ('../config/bd.config');
const bcrypt = require('bcrypt');

router.post('/',(req,res) =>{
console.log(req.body);
    const {Username, Psswd} = req.body;

    if (!Username || !Psswd){
        res.status(400).send({auth: false, err: 'Credenciales incompletas'});
        return;
    }

    con.query(`Select * from users where username = '${Username}'`, async (err,rows) =>) {\
    if(err){
        res.status(500).send({err:err});
        return;
    }
    if (rows.length === 0){
        res.status(400).send({auth: false, err: 'Usuario no encontrado'});
        return;
    }
    const result = await bcrypt.compare(password, rows[0].psswd);

    if(!result){
        res.status(401).send({auth: false,err:'Credenciales invalidas'});
        return;
    }

    rows[0].psswd = null;
    const payload = {
        id: rows[0].id
    }
    console.log(payload)
}

})