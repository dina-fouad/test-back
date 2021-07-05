'use strict';

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const server = express()
require('dotenv').config();
server.use(cors());
const PORT = process.env.PORT;
server.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/digimon', {useNewUrlParser: true, useUnifiedTopology: true});



const digimonShema = new mongoose.Schema({
    name: String,
    level :String,
    img :String
  });

  const digimonModel = mongoose.model('digimon', digimonShema);

server.get('/digimon' , digimonHandler);
server.post('/addtofavorite', addToFav);
server.get('/getFavDigimon', getFavDigimon);
server.delete('/deleteFav', deletFav);
server.put('/updateFav', updateHandler);

function digimonHandler (req , res){
    const url = `https://digimon-api.vercel.app/api/digimon`;
    axios.get(url).then(result =>{
        res.send(result.data)
    })
}

function addToFav (req , res){
    const { name , img , level}= req.body ;
    const newDigimon = new digimonModel({
        name : name , 
        img : img ,
        level : level
    })
    newDigimon.save();
}


function getFavDigimon (req,res){
    digimonModel.find({} , (err,data)=>{
        res.send(data);
    })
}

function deletFav(req,res){
    const id = req.query.id;
    digimonModel.deleteOne({_id:id},(err,data)=>{
        digimonModel.find({},(err,data) =>{
            res.send(data);
        })
    })
}

function updateHandler (req , res){
    const {name , img , level , id} = req.body;
    digimonModel.find({_id:id},(err,data)=>{
        data[0].name = name;
        data[0].level = level;
        data[0].img = img;
        data[0].save()
        .then(()=>{
            digimonModel.find({},(err,data) =>{
                res.send(data);
            })
        })
        
    })
}


server.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))