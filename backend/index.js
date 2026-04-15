
// import  express from "express";
// import { MongoClient ,ObjectId} from "mongodb";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// const dbName="orphanage"
// const url="mongodb://localhost:27017"
// const client=new MongoClient(url)
// const app = express();
// app.use(express.json());

// app.use(cors({
//   origin: "http://localhost:5173", // React port
//   credentials: true
// }));

// app.use(express.urlencoded({extended:true})) //data form se insert karne ke liye ye middleware important hai
// app.use(cookieParser());
// app.use("/uploads", express.static("uploads"));
// client.connect().then((connection)=>{
//    const db = connection.db(dbName);
//    app.post("/register",async(req,resp)=>{
//       const collection=db.collection("login")
//       const data = {
//          name: req.body.name,
//          email: req.body.email,
//          password: req.body.password, 
//       };
//       const login=await collection.insertOne(data);
//       if(login){
//          resp.send({
//             message:"Data Inserted",
//             success:true
//          })

//       }else{
//          resp.send({
//             message:"Data not Inserted ,try after sometime",
//             success:false
//          })
//       }
//    }) 

//    app.post("/login", async (req, resp) => {
//         const collection = db.collection("login");
//         const { email, password } = req.body;
//         const user = await collection.findOne({ email, password });
//          if (user) {
//              resp.cookie("user", user.email, {
//                httpOnly: true,
//                maxAge: 60 * 60 * 1000 
//             });
//             resp.send({
//             success: true,
//             message: "Login Successful",
//             user: user
//             });
//          } else {
//             resp.send({
//             success: false,
//             message: "Invalid Email or Password"
//             });
//          }
//    });
//    app.get("/logout", (req, res) => {
//       res.clearCookie("user");   // user cookie remove
//       res.json({ success: true, message: "Logged out successfully" });
//    });

//   app.get("/check-login", (req, res) => {
//       if (!req.cookies.user) {
//          return res.status(401).json({ loggedIn: false });
//       }
//       res.status(200).json({ loggedIn: true });
//    });

//    const storage = multer.diskStorage({
//       destination: function (req, file, cb) {
//          cb(null, "uploads/");   // folder name
//       },
//       filename: function (req, file, cb) {
//          cb(null, Date.now() + "-" + file.originalname);
//       }
//       });
//       const upload = multer({ storage: storage });

//    app.post("/orphanage",upload.single("photo"), async(req,resp)=>{
//       const user = req.cookies.user;
//       const collection=db.collection("addorphanage");
//       const urgentNeeds = JSON.parse(req.body.urgentNeeds);
//       const data = {
//          name: req.body.name,
//          email: req.body.email,
//          phone: req.body.phone,
//          location: req.body.location,
//          children: req.body.children,
//          fyear: req.body.fyear,
//          address: req.body.address,
//          des: req.body.des,
//          history: req.body.history,
//          photo: req.file.filename,
//          urgentNeeds: urgentNeeds,
//          user: user,
//       };
//       const news=await collection.insertOne(data);
//       if(news){
//          resp.send({
//             email:user,
//             message:"Orphanage Data Inserted",
//             success:true
//          })
//       }else{
//          resp.send({
//             message:"Orphanage Data not Inserted ,try after sometime",
//             success:false
//          })
//       }
//    }) 
//     //Display Orphanage Data
//     app.get("/orph",async(req,resp)=>{
//       const user = req.cookies.user;
//       const collection=db.collection("addorphanage")
//       const orphanage=await collection.find({ user }).toArray();
//       resp.send(orphanage)
//    })


//    //Delete Orphanage
//    app.delete("/orphdelete/:id",async(req,resp)=>{
//       const collection =db.collection("addorphanage")
//       const filter = { _id: new ObjectId(req.params.id) };
//       const news = await collection.findOne(filter);
//       if (news.photo) {
//          const imgPath = path.join(process.cwd(), "uploads", news.photo);
//             //  console.log("Deleting image:", imgPath);
//          if (fs.existsSync(imgPath)) {
//             fs.unlinkSync(imgPath);   // delete image file
//          }
//       }
//       const result = await collection.deleteOne(filter);
//       if(result){
//          resp.send({
//             message:"Orphanage Data Deleted",
//             success:true
//          })
//       }else{
//          resp.send({
//             message:"Orphanage Data not Deleted ,try after sometime",
//             success:false
//          })
//       }
//    })

//    //orph ->Edit ke liye Data Fetch karna 
//    app.get("/orphedit/:id",async(req,resp)=>{
//       const id =req.params.id;
//       const collection =db.collection("addorphanage")
//       const result = await collection.findOne({_id: new ObjectId(req.params.id)})
//       resp.send({
//          message:"data fetched",
//          success:true,
//          result:result
//       })
//    })

//     //orph-> Update 
//    app.put("/orphupdate/:id",upload.single("photo"),async(req,resp)=>{
//       const collection =db.collection("addorphanage")
//       const filter={_id:new ObjectId(req.params.id)};
//        // Old student data
//       const oldNews = await collection.findOne(filter);
//       const urgentNeeds = JSON.parse(req.body.urgentNeeds);
//       const updateData = {
//          name: req.body.name,
//          email: req.body.email,
//          phone: req.body.phone,
//          location: req.body.location,
//          children: req.body.children,
//          fyear: req.body.fyear,
//          address: req.body.address,
//          des: req.body.des,
//          history: req.body.history,
//         //  photo: req.file.filename,
//          urgentNeeds: urgentNeeds
//       };
//       if (req.file) {
//          updateData.photo = req.file.filename;
//          // Delete old image from uploads folder
//          if (oldNews && oldNews.photo) {
//             const oldPath = path.join(process.cwd(), "uploads", oldNews.photo);
//             console.log("Deleting:", oldPath);
//             if (fs.existsSync(oldPath)) {
//                fs.unlinkSync(oldPath);
//                console.log("Old image deleted");
//             }
//          }
//       }
//       const result = await collection.updateOne(filter, { $set: updateData });
//       if(result){
//          resp.send({
//             message:"data updated",
//             success:true,
//             result : req.body
//          })
//       }
//       else{
//         resp.send({
//             message:"data not updated",
//             success:false,
//             result:null
//          })
//       }
//    })

//    //Main site Contact
//    app.post("/adlogin", async (req, resp) => {
//         const collection = db.collection("login");
//         const { email, password } = req.body;
//         const user = await collection.findOne({ email, password });
//          if (user) {
//              resp.cookie("adlogin", user.email, {
//                httpOnly: true,
//                maxAge: 60 * 60 * 1000 
//             });
//             resp.send({
//             success: true,
//             message: "Login Successful",
//             user: user
//             });
//          } else {
//             resp.send({
//             success: false,
//             message: "Invalid Email or Password"
//             });
//          }
//    });
//    app.get("/logoutmain", (req, res) => {
//       res.clearCookie("adlogin");   // user cookie remove
//       res.json({ success: true, message: "Logged out successfully" });
//    });

//    app.get("/check-adlogin", (req, res) => {
//       if (!req.cookies.adlogin) {
//          return res.status(401).json({ loggedIn: false });
//       }
//       res.status(200).json({ loggedIn: true });
//    });
//    app.post("/contact", async(req,resp)=>{
//       const collection=db.collection("contact");
//       const data = {
//          name: req.body.name,
//          last: req.body.last,
//          email: req.body.email,
//          message: req.body.message,
//          createdAt: new Date(),
//          updatedAt: new Date()
//       };
//       const news=await collection.insertOne(data);
//       if(news){
//          resp.send({
//             message:"Data Inserted",
//             success:true
//          })
//       }else{
//          resp.send({
//             message:"Data not Inserted ,try after sometime",
//             success:false
//          })
//       }
//    });

//    //Search 
//       app.get("/search", async (req, res) => {
//          const query = (req.query.q || "").trim();
//          await client.connect();
//          const db = client.db(dbName);
//          const collection = db.collection("addorphanage");
//          const results = await collection.find({
//             $or: [
//             { name: { $regex: query, $options: "i" } },
//             { location: { $regex: query, $options: "i" } }
//             ]
//          }).project({
//             name: 1,
//             email: 1,
//             location: 1,
//             des: 1,
//             address:1,
//             photo: 1,
//             urgentNeeds: 1,
//             children: 1
//          }).toArray();
//          res.json(results);
//       });

//       //Orphanage View
//       app.get("/orphanage/:id", async (req, resp) => {
//          const collection = db.collection("addorphanage");
//          const news = await collection.findOne({ _id: new ObjectId(req.params.id) });
//          resp.send(news);
//       });


//       app.post("/donate", async(req,resp)=>{
//          const userEmail = req.cookies.adlogin; 
//          const collection=db.collection("donate");
//          const data = {
//             orphanageId: req.body.orphanageId,
//             quantity: req.body.quantity,
//             name: req.body.name,
//             quan: req.body.quan,
//             donationtype:req.body.selectedType,
//             userEmail,
//             createdAt: new Date(),
//             updatedAt: new Date()
//          };
//          const news=await collection.insertOne(data);
//          if(news){
//             resp.send({
//                message:"Data Inserted",
//                success:true
//             })
//          }else{
//             resp.send({
//                message:"Data not Inserted ,try after sometime",
//                success:false
//             })
//          }
//       });

//       // app.get("/donatedata",async(req,resp)=>{
//       //    // const user = req.cookies.user;
//       //    const collection=db.collection("donate")
//       //    const orphanage=await collection.find().toArray();
//       //    resp.send(orphanage)
//       // })
//       app.get("/donatedata", async (req, resp) => {
//          const collection = db.collection("donate");
//          const result = await collection.aggregate([
//             {
//                $group: {
//                _id: "$donationtype",   // category field
//                total: { $sum: { $toInt: "$quan" } }  // string ko number me convert
//                }
//             }
//          ]).toArray();
//          resp.send(result);
//       });

//       app.get("/recent-donations", async (req, res) => {
//          const collection = db.collection("donate");
//          const result = await collection.find({}).sort({ createdAt: -1 })  // newest first
//          .limit(6)               // only 10 latest
//          .toArray();
//          res.send(result);
//       });

//       //Donate Data
//       app.get("/donations/:id", async (req, res) => {
//          try {
//             const collection = db.collection("donate");

//             const orphanageId = req.params.id;

//             const result = await collection
//                .find({ orphanageId: orphanageId }) // string match
//                .sort({ createdAt: -1 }) // latest first
//                .toArray();

//             res.send(result);
//          } catch (err) {
//             console.log(err);
//             res.status(500).send({ error: "Server Error" });
//          }
//       });


//       //Admin Superuser ke liye login
//       app.post("/admin", async (req, resp) => {
//         const collection = db.collection("admin");
//         const { email, password } = req.body;
//         const user = await collection.findOne({ email, password });

//         if (user) {
//              resp.cookie("admin", user.email, {
//                httpOnly: true,
//                maxAge: 60 * 60*1000 
//             });
//             resp.send({
//             success: true,
//             message: "Login Successful",
//             user: user
//             });
//         } else {
//             resp.send({
//             success: false,
//             message: "Invalid Email or Password"
//             });
//          }
//       });
//        app.get("/check-admin", (req, res) => {
//          if (!req.cookies.admin) {
//             return res.status(401).json({ loggedIn: false });
//          }
//          res.status(200).json({ loggedIn: true });
//       });
//       app.get("/logoutadmin", (req, res) => {
//          res.clearCookie("admin");   // user cookie remove
//          res.json({ success: true, message: "Logged out successfully" });
//       });
//       //All Orphanage
//       app.get("/all-orphanage", async (req, resp) => {
//          const collection = db.collection("addorphanage");
//          const data = await collection.find().toArray();
//          resp.send(data);
//       });

//       //Display Contact Details
//       app.get("/all-contact", async (req, resp) => {
//          const collection = db.collection("contact");
//          const data = await collection.find().toArray();
//          resp.send(data);
//       });
// })
// app.listen(3200);

import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

// 🔥 MongoDB Atlas URL (change this)
const url = "mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/orphanage";
const client = new MongoClient(url);
const dbName = "orphanage";

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
   origin: "https://lokesh-project.vercel.app", // 👈 tera frontend
   credentials: true
}));

// multer (Vercel friendly)
const upload = multer({ storage: multer.memoryStorage() });

// DB Connect
await client.connect();
const db = client.db(dbName);

// ================= AUTH =================

// Register
app.post("/register", async (req, res) => {
   const result = await db.collection("login").insertOne(req.body);

   res.send({
      success: !!result,
      message: result ? "Data Inserted" : "Error"
   });
});

// Login
app.post("/login", async (req, res) => {
   const { email, password } = req.body;

   const user = await db.collection("login").findOne({ email, password });

   if (user) {
      res.cookie("user", user.email, { httpOnly: true });

      res.send({
         success: true,
         user
      });
   } else {
      res.send({
         success: false,
         message: "Invalid credentials"
      });
   }
});

// Logout
app.get("/logout", (req, res) => {
   res.clearCookie("user");
   res.send({ success: true });
});

// ================= ORPHANAGE =================

// Add orphanage
app.post("/orphanage", upload.single("photo"), async (req, res) => {
   const urgentNeeds = JSON.parse(req.body.urgentNeeds || "[]");

   const data = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      children: req.body.children,
      fyear: req.body.fyear,
      address: req.body.address,
      des: req.body.des,
      history: req.body.history,
      urgentNeeds,
      photo: req.file ? req.file.originalname : null,
      createdAt: new Date()
   };

   const result = await db.collection("addorphanage").insertOne(data);

   res.send({ success: !!result });
});

// Get all orphanage
app.get("/orph", async (req, res) => {
   const data = await db.collection("addorphanage").find().toArray();
   res.send(data);
});

// Get single orphanage
app.get("/orphanage/:id", async (req, res) => {
   const data = await db.collection("addorphanage")
      .findOne({ _id: new ObjectId(req.params.id) });

   res.send(data);
});

// Delete orphanage
app.delete("/orphdelete/:id", async (req, res) => {
   const result = await db.collection("addorphanage")
      .deleteOne({ _id: new ObjectId(req.params.id) });

   res.send({ success: !!result });
});

// Update orphanage
app.put("/orphupdate/:id", upload.single("photo"), async (req, res) => {
   const urgentNeeds = JSON.parse(req.body.urgentNeeds || "[]");

   const updateData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      children: req.body.children,
      fyear: req.body.fyear,
      address: req.body.address,
      des: req.body.des,
      history: req.body.history,
      urgentNeeds
   };

   if (req.file) {
      updateData.photo = req.file.originalname;
   }

   const result = await db.collection("addorphanage").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
   );

   res.send({ success: !!result });
});

// ================= SEARCH =================

app.get("/search", async (req, res) => {
   const q = req.query.q || "";

   const result = await db.collection("addorphanage").find({
      $or: [
         { name: { $regex: q, $options: "i" } },
         { location: { $regex: q, $options: "i" } }
      ]
   }).toArray();

   res.send(result);
});

// ================= CONTACT =================

app.post("/contact", async (req, res) => {
   const data = {
      ...req.body,
      createdAt: new Date()
   };

   const result = await db.collection("contact").insertOne(data);

   res.send({ success: !!result });
});

// ================= DONATION =================

app.post("/donate", async (req, res) => {
   const data = {
      ...req.body,
      createdAt: new Date()
   };

   const result = await db.collection("donate").insertOne(data);

   res.send({ success: !!result });
});

app.get("/donatedata", async (req, res) => {
   const result = await db.collection("donate").aggregate([
      {
         $group: {
            _id: "$donationtype",
            total: { $sum: { $toInt: "$quan" } }
         }
      }
   ]).toArray();

   res.send(result);
});

// ================= EXPORT =================
export default app;