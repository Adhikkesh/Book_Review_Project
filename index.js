import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const db = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "2006",
    database: "BookReview"
});

db.connect();

app.get("/",async(req,res) => {
    const r= await db.query("select * from book");
    let table = r.rows
    res.render("index.ejs",{table: table});
});

app.get("/new",(req,res) => {
    res.render("new.ejs",{text : "create"});
});

// app.post("/create",async (req,res) => {
//     let isbn = req.body.isbn;
//     let rating = parseInt(req.body.rating);
//     let notes = req.body.notes;

//     const response = await axios.get(`https://openlibrary.org/isbn/${isbn}`);
//     let title = response.data.title;
//     let link = title.split(" ").join("+");

//     const response1 = await axios.get(`https://openlibrary.org/search.json?q=${link}`);
//     let author = response1.data.docs[0].author_name[0];

//     let image = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

//     const currentDate = new Date();
//     const year = currentDate.toISOString().split('T')[0]; 
//     await db.query("insert into book (isbn,title,review,date,ratings,author) values ($1,$2,$3,$4,$5,$6)",[isbn,title,notes,year,rating,author]);

//     res.redirect("/");
// });

app.post("/create", async (req, res) => {
    try {
      const text = req.body.text;  
      if(text == "edit"){
        const id = parseInt(req.body.id);
        const rating = parseInt(req.body.rating);
        const notes = req.body.notes;

        await db.query("update book set ratings = $1, review = $2 where id = $3",[rating,notes,id]);
        res.redirect("/");
      }

      else{
        let isbn = req.body.isbn;
        let rating = parseInt(req.body.rating);
        let notes = req.body.notes;
    
        // Validate inputs
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
    
        // Add logging to help diagnose the issue
        console.log('Insertion Parameters:', {
            isbn, 
            title, 
            notes, 
            year, 
            rating, 
            author
        });
    
        // Ensure all parameters are of the correct type
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
    const id = req.params.id;
    const response = await db.query("select * from book where id = $1",[id]);
    const table = response.rows;
    console.log(table);
    res.render("new.ejs",{text: "edit" , table: table[0]});
});

app.post("/delete/:id",async(req,res) => {
    const id = req.params.id;
    await db.query("delete from book where id = $1",[id]);
    res.redirect("/");
});



app.listen(3000,() => {});