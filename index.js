import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const db = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect();

app.get("/",async(req,res) => {
    try {
        const r = await db.query("SELECT * FROM book");
        r.rows.forEach(e => {
            console.log(e.date);
        });
        res.render("index.ejs", { table: r.rows });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).render("error", { 
            message: "Unable to fetch books", 
            error: error.message 
        });
    }
});

app.get("/new",(req,res) => {
    res.render("new.ejs",{text : "create",table: null});
});



app.post("/create", async (req, res) => {
    try {
      const { text, id, isbn, rating, notes } = req.body;  
      if(text == "edit"){
        if (!id || isNaN(parseInt(rating))) {
            return res.status(400).send("Invalid edit data");
        }

        await db.query("update book set ratings = $1, review = $2 where id = $3",[rating,notes,id]);
        res.redirect("/");
      }

      else{
    
        if (!isbn || isNaN(rating)) {
          return res.status(400).send("Invalid input data");
        }

        const response = await axios.get(`https://openlibrary.org/isbn/${isbn}`);
        let title = response.data.title;
        let link = title.split(" ").join("+");
        
        const response1 = await axios.get(`https://openlibrary.org/search.json?q=${link}`);
        let author = response1.data.docs[0].author_name[0];
        
        const currentDate = new Date();
        const year = currentDate.toISOString().split('T')[0];
    
        await db.query(
            "INSERT INTO book (isbn, title, review, date, ratings, author) VALUES ($1, $2, $3, $4, $5, $6)",
            [
            String(isbn), 
            String(title), 
            String(notes), 
            new Date(year), 
            Number(rating), 
            String(author)
            ]);
  
        res.redirect("/");
    }
} catch (error) {
      console.error("Error in book creation:", error);
      res.status(500).send(`Error creating book entry: ${error.message}`);
    }
});

app.post("/edit/:id",async (req,res) => {
    try{
        const id = req.params.id;
        const response = await db.query("select * from book where id = $1",[id]);
        const table = response.rows;
        console.log(table);
        res.render("new.ejs",{text: "edit" , table: table[0]});
    }
    catch(error){
        console.error("Error fetching book for edit:", error);
        res.status(500).send("Error retrieving book details");
    }
    
});

app.post("/delete/:id",async(req,res) => {
    try{
        const id = req.params.id;
        await db.query("delete from book where id = $1",[id]);


        res.redirect("/");
    }
    catch(error){
        console.error("Error deleting book:", error);
        res.status(500).send("Error deleting book");
    }
    
});

app.post("/sort",async(req,res) => {
    try{

        if(req.body.sort == "rating"){
            const table = await db.query("select * from book order by  ratings asc");
            const t = table.rows;
            t.forEach(e => {
                console.log(e);
            })
            res.render("index.ejs",{table: t});
        }
    
        else if(req.body.sort == "recency"){
            const table = await db.query("select * from book order by  date asc");
            const t = table.rows;
            res.render("index.ejs",{table: t});
        }
    
        else if(req.body.sort == "title"){
            const table = await db.query("select * from book order by title asc");
            const t = table.rows;
            res.render("index.ejs",{table: t});
        }
    }
    catch (error) {
        console.error("Error sorting books:", error);
        res.status(500).send("Error sorting books");
    }
    
});



app.listen(3000,() => {
    console.log("Server running on port 3000");
});
