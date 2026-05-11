const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5q2pzru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ===========================================
// DB
// ===========================================

const db = client.db(process.env.DB_USER);

// ===========================================
// Mongo Connect
// ===========================================

async function run() {
  try {
    await client.connect();

    console.log("MongoDB Connected");

    // ===========================================
    // Routes
    // ===========================================
    // test route
    app.get("/test", (req, res) => {
      res.send("Server Running test");
    });

    app.get("/", (req, res) => {
      res.send("Server Running");
    });
    app.post("/hero-section-banner", async (req, res) => {
      const bannerData = req.body;
      const result = await db
        .collection("heroSectionBanner")
        .insertOne(bannerData);
      res.send(result);
    });

    app.get("/hero-section-banner", async (req, res) => {
      const banners = await db
        .collection("heroSectionBanner")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(banners);
    });
    app.delete("/hero-section-banner/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("heroSectionBanner")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/hero-section-banner/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("heroSectionBanner")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    // featured items
    app.post("/featured-items", async (req, res) => {
      const itemData = req.body;
      const result = await db.collection("featuredItems").insertOne(itemData);
      res.send(result);
    });

    app.get("/featured-items", async (req, res) => {
      const items = await db
        .collection("featuredItems")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(items);
    });
    app.delete("/featured-items/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("featuredItems")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/featured-items/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("featuredItems")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    // ?-------------------Admin - Homepage Management-------------------->
    // !-------------------Admin - Product Management-------------------->
    app.post("/products", async (req, res) => {
      const productData = req.body;
      const productData1 = {
        ...productData,
        createdAt: new Date(),
        totalSell: 0,
        rating: 0,
      };
      const result = await db.collection("products").insertOne(productData1);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const products = await db
        .collection("products")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(products);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("products")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("products")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    // !-------------------Admin - Product Management-------------------->
    // ?-------------------Admin - Category Management-------------------->
    app.post("/categories", async (req, res) => {
      const categoryData = req.body;
      const result = await db.collection("categories").insertOne(categoryData);
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const categories = await db
        .collection("categories")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(categories);
    });
    app.delete("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("categories")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const { _id, ...updatedData } = req.body;
      try {
        const result = await db
          .collection("categories")
          .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "Category not found" });
        }
        res.send(result);
      } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send({ error: "Failed to update category" });
      }
    });
    // ?-------------------Admin - Category Management-------------------->
    // !-------------------Admin - User Management-------------------->
    app.post("/users", async (req, res) => {
      const userData = req.body;
      const tuki = {
        name: userData.name,
        date: userData.date,
      };
      if (userData.reference) {
        const qq = userData.reference;
        console.log(qq);
        const query = { reference: qq };
        const updateData = {
          $push: { myReferralUser: tuki },
        };
        console.log(updateData);
        const updating = await db
          .collection("users")
          .updateOne(query, updateData);
        console.log("data updated", updating);
      }
      const result = await db.collection("users").insertOne(userData);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const users = await db
        .collection("users")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(users);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("users")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      console.log(updatedData);
      let finalData = null;
      if (updatedData.role === "user") {
        finalData = { ...updatedData, role: updatedData.role, isAdmin: false };
      }
      if (updatedData.role !== "user") {
        finalData = { ...updatedData, role: updatedData.role, isAdmin: true };
      }
      const result = await db
        .collection("users")
        .updateOne({ _id: new ObjectId(id) }, { $set: finalData });
      res.send(result);
    });

    app.patch("/update-profile-photo/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body.formData;
      const query = { _id: new ObjectId(id) };
      const { _id, ...rest } = data;
      const updateData = { $set: { ...rest } };
      const result = await db.collection("users").updateOne(query, updateData);
      res.send(result);
    });
    // !-------------------Admin - User Management-------------------->
    // ?-------------------Admin - Order Management-------------------->
    app.post("/orders", async (req, res) => {
      try {
        const orderData = req.body;
        const { name: productName, size, quantity } = orderData.items[0];

        // প্রোডাক্ট খুঁজে বের করা
        const product = await db
          .collection("products")
          .findOne({ name: productName });

        if (!product) {
          return res.status(404).send({ message: "Product not found" });
        }

        // sizes অ্যারে আপডেট করা
        const updatedSizes = product.sizes.map((item) => {
          if (item.size === size) {
            // stock থেকে quantity বাদ দিচ্ছে
            return {
              ...item,
              stock: Math.max(item.stock - quantity, 0), // negative stock না হয়
            };
          }
          return item;
        });

        // totalSell এবং sizes একসাথে আপডেট করা
        const updateData = {
          $set: { sizes: updatedSizes },
          $inc: { totalSell: quantity },
        };

        await db
          .collection("products")
          .updateOne({ name: productName }, updateData);

        // অর্ডার ডাটাবেজে সংরক্ষণ করা
        const result = await db.collection("orders").insertOne(orderData);

        res.send({
          success: true,
          message: "Order placed successfully",
          orderId: result.insertedId,
        });
      } catch (error) {
        console.error("Order Error:", error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    app.get("/orders", async (req, res) => {
      const orders = await db
        .collection("orders")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(orders);
    });
    app.get("/orders/:orderId", async (req, res) => {
      const orderId = req.params.orderId;
      const order = await db
        .collection("orders")
        .findOne({ _id: new ObjectId(orderId) });
      if (!order) {
        return res.status(404).send({ error: "Order not found" });
      }
      res.send(order);
    });
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("orders")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("orders")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    // ?-------------------Admin - user Management-------------------->
    // app.post("/users", async (req, res) => {
    //   try {
    //     const userData = req.body;

    //     const result = await db.collection("users").insertOne(userData);
    //     res.send(result);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Server Error" });
    //   }
    // });

    // app.get("/users", async (req, res) => {
    //   const users = await db.collection("users").find().sort({ _id: -1 }).toArray();
    //   res.send(users);
    // });
    // app.delete("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const result = await db
    //     .collection("users")
    //     .deleteOne({ _id: new ObjectId(id) });
    //   res.send(result);
    // });
    // app.patch("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updatedData = req.body;
    //   const result = await db
    //     .collection("users")
    //     .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
    //   res.send(result);
    // });
    // load user by email--->
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await db.collection("users").findOne({ email });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      res.send(user);
    });
    // ?-------------------Admin - user Management-------------------->
    // ! -----------------wiselist----------------->
    app.post("/wishlist", async (req, res) => {
      const wishData = req.body;
      const result = await db.collection("wishlist").insertOne(wishData);
      res.send(result);
    });
    app.get("/wishlist", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query.email = email;
      }
      const wishlist = await db
        .collection("wishlist")
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(wishlist);
    });
    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("wishlist")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // ! -----------------wiselist----------------->
    // ! -----------------cart----------------->
    app.post("/cart", async (req, res) => {
      try {
        const { email, productId, price, size, SelectColor } = req.body;
        if (!email || !productId) {
          return res.status(400).send({ error: "Invalid request data" });
        }
        console.log(productId, email);

        const product = await db
          .collection("products")
          .findOne({ _id: new ObjectId(productId) });
        console.log(product);
        if (!product) {
          return res.status(404).send({ error: "Product not found" });
        }

        // Prevent duplicate entry
        const alreadyInCart = await db
          .collection("cart")
          .findOne({ email, _id: product._id });
        if (alreadyInCart) {
          return res.status(409).send({ message: "Already in cart" });
        }
        const { _id, ...productWithoutId } = product;
        const result = await db.collection("cart").insertOne({
          ...productWithoutId,
          email,
          price,
          size,
          addedAt: new Date(),
          SelectColor,
        });
        res.send({ insertedId: result.insertedId });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Server error" });
      }
    });

    app.get("/cart", async (req, res) => {
      const result = await db
        .collection("cart")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("cart")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // ! -----------------cart----------------->

    app.post("/love", async (req, res) => {
      try {
        const { productId, email, price, size } = req.body;
        if (!productId || !email) {
          return res.status(400).send({ error: "Invalid data" });
        }

        const query = { _id: new ObjectId(productId) };
        const product = await db.collection("products").findOne(query);
        if (!product) {
          return res.status(404).send({ error: "Product not found" });
        }

        // check if already loved
        const exist = await db.collection("love").findOne({ email, productId });
        if (exist) {
          return res.send({ message: "Already in favorites" });
        }

        // remove _id and add new one
        const { _id, ...rest } = product;

        const data = {
          ...rest,
          productId,
          email,
          lovedAt: new Date(),
          price,
          size,
        };

        const result = await db.collection("love").insertOne(data);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Server error" });
      }
    });

    app.get("/love", async (req, res) => {
      const love = await db
        .collection("love")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(love);
    });
    app.delete("/love/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("love")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // buy package api-------->
    app.post("/buy-package", async (req, res) => {
      const packageData = req.body;
      // const use_refferal = packageData.use_refferal;
      // if (use_refferal) {
      //   const invite_user_email = packageData.invite_user_email;
      //   const query = { email: invite_user_email };
      //   const updateData = {
      //     $inc: { referIncome: 50 },
      //   };
      //   const updating = await db.collection("users").updateOne(query, updateData);
      //   console.log("data updated", updating);
      // }
      const result = await db.collection("buyPackage").insertOne(packageData);
      res.send(result);
    });
    app.get("/buy-package", async (req, res) => {
      const packages = await db
        .collection("buyPackage")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(packages);
    });
    app.delete("/buy-package/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("buyPackage")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/buy-package/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body.packageStatus;
        const email = req.body.email;
        const planName = req.body.planName;
        const storeInfo = req.body.storeInfo;
        const validityDays = req.body.validityDays;
        const bonusAmountForUser = req.body.bonusAmountForUser;

        const latestReferralBonus = await db
          .collection("referralBonus")
          .find()
          .sort({ _id: -1 })
          .limit(1)
          .toArray();

        // const totalBonus = latestReferralBonus[0]?.bonus || 50;
        const totalBonus = parseInt(bonusAmountForUser) || 50;

        const invite_reffer_user_email = await db
          .collection("buyPackage")
          .findOne({ _id: new ObjectId(id) });
        const invite_user_email = invite_reffer_user_email.invite_user_email;

        if (invite_reffer_user_email && updatedData === "Approved") {
          const query = { email: invite_user_email };
          const updateData = {
            $inc: { referIncome: totalBonus },
            $push: { myReferralUser: { email: email, planName: planName } },
          };
          const updating = await db
            .collection("users")
            .updateOne(query, updateData);
          console.log("data updated", updating);
        }
        if (!id || !updatedData || !email) {
          return res.status(400).send({ error: "Missing required fields" });
        }

        if (updatedData === "Approved") {
          const userQuery = { email };
          const user = await db.collection("users").findOne(userQuery);

          if (!user) {
            return res.status(404).send({ error: "User not found" });
          }

          await db.collection("users").updateOne(userQuery, {
            $set: {
              "subscription.plan": planName,
              "subscription.validUntil": new Date(),
              isMember: true,
              storeInfo,
              validityDays,
            },
          });
        }

        const result = await db
          .collection("buyPackage")
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: { packageStatus: updatedData } },
          );

        res.send({
          success: true,
          message: "Package status updated successfully",
          result,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
    // buy product api-------->
    app.post("/sell-product", async (req, res) => {
      const productData = req.body;
      const result = await db.collection("sellProduct").insertOne(productData);
      res.send(result);
    });
    app.get("/sell-product", async (req, res) => {
      const products = await db
        .collection("sellProduct")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(products);
    });

    // manage withdraw--->
    app.post("/withdraw", async (req, res) => {
      const withdrawData = req.body;
      const result = await db.collection("withdraw").insertOne(withdrawData);
      res.send(result);
    });
    app.get("/withdraw", async (req, res) => {
      const withdraws = await db
        .collection("withdraw")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(withdraws);
    });
    app.patch("/withdraw/:id", async (req, res) => {
      const id = req.params.id;
      const newStatus = req.body.status;
      const approval_date = new Date().toLocaleDateString();
      const result = await db
        .collection("withdraw")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: newStatus, approval_date } },
        );
      res.send(result);
    });

    // manage withdraw--->
    // manage payment number--->
    app.post("/payment-number", async (req, res) => {
      const paymentData = req.body;
      const result = await db
        .collection("paymentNumber")
        .insertOne(paymentData);
      res.send(result);
    });
    app.get("/payment-number", async (req, res) => {
      const payments = await db
        .collection("paymentNumber")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(payments);
    });
    app.patch("/payment-number/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("paymentNumber")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });

    // website  logo--->
    app.post("/website-logo", async (req, res) => {
      const logoData = req.body;
      const result = await db.collection("websiteLogo").insertOne(logoData);
      res.send(result);
    });
    app.get("/website-logo", async (req, res) => {
      const logos = await db
        .collection("websiteLogo")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(logos[0]);
    });
    // logo management --->
    // manage package data ---->
    app.post("/manage-package", async (req, res) => {
      const packageData = req.body;
      const result = await db
        .collection("managePackage")
        .insertOne(packageData);
      res.send(result);
    });
    app.get("/manage-package", async (req, res) => {
      const packages = await db
        .collection("managePackage")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(packages);
    });
    app.delete("/manage-package/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("managePackage")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/manage-package/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("managePackage")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    // manage package data ---->
    // contact info--->
    app.post("/contact-info", async (req, res) => {
      const contactData = req.body;
      const result = await db.collection("contactInfo").insertOne(contactData);
      res.send(result);
    });
    app.get("/contact-info", async (req, res) => {
      const contacts = await db
        .collection("contactInfo")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(contacts[0]);
    });
    // promodata--->
    app.post("/promo-data", async (req, res) => {
      const promoData = req.body;
      const result = await db.collection("promoData").insertOne(promoData);
      res.send(result);
    });
    app.get("/promo-data", async (req, res) => {
      const promos = await db
        .collection("promoData")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(promos);
    });
    app.patch("/promo-data/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("promoData")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    app.delete("/promo-data/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("promoData")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // promodata--->

    // contact us ----->
    app.post("/contact-us", async (req, res) => {
      const contactUsData = req.body;
      const result = await db
        .collection("contactUs")
        .insertOne({ ...contactUsData, status: "unread" });
      res.send(result);
    });
    app.get("/contact-us", async (req, res) => {
      const contacts = await db
        .collection("contactUs")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(contacts);
    });
    app.patch("/contact-us/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("contactUs")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    app.delete("/contact-us/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("contactUs")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // contact us ----->
    // class-request---->
    app.post("/class-request", async (req, res) => {
      const classRequestData = req.body;
      const result = await db

        .collection("classRequest")
        .insertOne(classRequestData);
      res.send(result);
    });
    app.get("/class-request", async (req, res) => {
      const classRequests = await db
        .collection("classRequest")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(classRequests);
    });
    // reffer withdraw---->
    app.post("/refer-withdraw", async (req, res) => {
      const referWithdrawData = req.body;

      const userEmail = referWithdrawData.email;
      const amountToWithdraw = referWithdrawData.amount;
      const query = { email: userEmail };
      const updateData = {
        $inc: { referIncome: -amountToWithdraw },
      };
      const updating = await db
        .collection("users")
        .updateOne(query, updateData);
      console.log("data updated", updating);
      const result = await db

        .collection("referWithdraw")
        .insertOne(referWithdrawData);
      res.send(result);
    });
    app.get("/refer-withdraw", async (req, res) => {
      const referWithdraws = await db
        .collection("referWithdraw")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(referWithdraws);
    });
    app.patch("/refer-withdraw/:id", async (req, res) => {
      const id = req.params.id;
      const newStatus = req.body.status;
      const email = req.body.email;

      if (newStatus === "Rejected") {
        const query = { email: email };
        const updateData = {
          $inc: { referIncome: req.body.amount },
        };
        const updating = await db
          .collection("users")
          .updateOne(query, updateData);
        console.log("data updated", updating);
      }
      const result = await db
        .collection("referWithdraw")
        .updateOne({ _id: new ObjectId(id) }, { $set: { status: newStatus } });
      res.send(result);
    });
    // meyad sesh--------->
    app.patch("/users_mayead_sesh", async (req, res) => {
      const email = req.body.email;
      // const updatedData = {
      //   isMember: false,
      //   subscription: { plan: "No Plan", validUntil: "" },
      // };
      const result = await db.collection("users").updateOne(
        { email: email },
        {
          $set: {
            isMember: false,
            "subscription.plan": "No Plan",
            "subscription.validUntil": null,
          },
        },
      );
      res.send(result);
    });
    // meyad sesh--------->

    app.post("/referral-bonus", async (req, res) => {
      const referralData = req.body;
      const result = await db
        .collection("referralBonus")
        .insertOne(referralData);
      res.send(result);
    });
    app.get("/referral-bonus", async (req, res) => {
      const referrals = await db
        .collection("referralBonus")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(referrals[0]);
    });

    // add reffer discount--->
    // app.post("/addrefferdiscount", async (req, res) => {
    //   const data = req.body;
    //   const result = await db.collection("RefferDiscount").insertOne(data);
    //   res.send(result);
    // });
    app.post("/addrefferdiscount", async (req, res) => {
      const referralData = req.body;
      const result = await db
        .collection("RefferDiscount")
        .insertOne(referralData);
      res.send(result);
    });
    app.get("/addrefferdiscount", async (req, res) => {
      const bonus = await db
        .collection("RefferDiscount")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(bonus[0]);
    });
    app.post("/minimum_withdraw_amount", async (req, res) => {
      const min = req.body;
      const result = await db.collection("MinimumAmount").insertOne(min);
      res.send(result);
    });
    app.get("/minimum_withdraw_amount", async (req, res) => {
      const bonus = await db
        .collection("MinimumAmount")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(bonus[0]);
    });

    // website sign up page banner img--->
    app.post("/sign_up_banner", async (req, res) => {
      const data = req.body;
      const result = await db.collection("signUpBanner").insertOne(data);
      res.send(result);
    });
    app.get("/sign_up_banner", async (req, res) => {
      const bonus = await db
        .collection("signUpBanner")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(bonus[0]);
    });

    // withdraw_admin
    app.post("/withdraw_admin", async (req, res) => {
      const data = req.body;
      const result = await db.collection("withdraw_admin").insertOne(data);
      res.send(result);
    });
    app.get("/withdraw_admin", async (req, res) => {
      const result = await db
        .collection("withdraw_admin")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // telogram group--->
    app.post("/telegram_group", async (req, res) => {
      const data = req.body;
      const result = await db.collection("telegram_group").insertOne(data);
      res.send(result);
    });
    app.get("/telegram_group", async (req, res) => {
      const result = await db
        .collection("telegram_group")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result[0]);
    });
    // hisab for admin product buy---->
    app.post("/admin_hisab", async (req, res) => {
      const data = req.body;
      const result = await db.collection("admin_hisab").insertOne(data);
      res.send(result);
    });
    app.get("/admin_hisab", async (req, res) => {
      const result = await db
        .collection("admin_hisab")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });
    app.patch("/admin_hisab/:id", async (req, res) => {
      const id = req.params.id;
      const newStatus = req.body.status;
      const result = await db
        .collection("admin_hisab")
        .updateOne({ _id: new ObjectId(id) }, { $set: { status: newStatus } });
      res.send(result);
    });
    app.delete("/admin_hisab/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("admin_hisab")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // manage gift
    app.post("/manage_gift", async (req, res) => {
      const data = req.body;
      const result = await db.collection("manage_gift").insertOne(data);
      res.send(result);
    });
    app.get("/manage_gift", async (req, res) => {
      const result = await db
        .collection("manage_gift")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });
    app.patch("/manage_gift/:id", async (req, res) => {
      const id = req.params.id;
      const newStatus = req.body.status;
      const result = await db
        .collection("manage_gift")
        .updateOne({ _id: new ObjectId(id) }, { $set: { status: newStatus } });
      res.send(result);
    });
    app.delete("/manage_gift/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("manage_gift")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/manage_gift_by_user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("manage_gift")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });

    // update user store img
    app.patch("/update-store-image", async (req, res) => {
      const data = req.body;
      const email = data.email;
      const newImg = data.shopImage;
      const query = { email: email };

      const updatedDoc = {
        $set: {
          "storeInfo.shopImage": newImg,
        },
      };
      const result = await db.collection("users").updateOne(query, updatedDoc);
      res.send(result);
    });

    // class management---->
    app.post("/class-management", async (req, res) => {
      const classData = req.body;
      const result = await db
        .collection("classManagement")
        .insertOne(classData);
      res.send(result);
    });

    app.get("/class-management", async (req, res) => {
      const classes = await db.collection("classManagement").find().toArray();
      res.send(classes);
    });

    app.delete("/class-management/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("classManagement")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.patch("/class-management/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("classManagement")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    // class management---->
    // gift-certificate
    app.post("/gift-certificate", async (req, res) => {
      const classData = req.body;
      const result = await db
        .collection("gift-certificate")
        .insertOne(classData);
      res.send(result);
    });
    app.get("/gift-certificate", async (req, res) => {
      const classes = await db
        .collection("gift-certificate")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(classes);
    });

    // my product -------------->
    app.post("/my-product", async (req, res) => {
      const productData = req.body;
      const result = await db.collection("myProduct").insertOne(productData);
      res.send(result);
    });
    app.get("/my-product", async (req, res) => {
      const products = await db
        .collection("myProduct")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(products);
    });

    app.get("/my_product/:userId", async (req, res) => {
      const userId = req.params.userId;
      const products = await db
        .collection("myProduct")
        .find({ userId: userId })
        .sort({ _id: -1 })
        .toArray();
      res.send(products);
    });
    app.delete("/my-product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("myProduct")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // manage doller rate--------------->
    app.post("/manage-dollar-rate", async (req, res) => {
      const rateData = req.body;
      const result = await db.collection("dollarRate").insertOne(rateData);
      res.send(result);
    });
    app.get("/manage-dollar-rate", async (req, res) => {
      const rates = await db
        .collection("dollarRate")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(rates[0]);
    });

    // boosting order management------->
    app.post("/boosting-order", async (req, res) => {
      const orderData = req.body;
      const result = await db.collection("boostingOrder").insertOne(orderData);
      res.send(result);
    });
    app.get("/boosting-order", async (req, res) => {
      const orders = await db
        .collection("boostingOrder")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(orders);
    });
    // by user email--->
    app.get("/boosting-order/:email", async (req, res) => {
      const email = req.params.email;
      const orders = await db
        .collection("boostingOrder")
        .find({ userEmail: email })
        .sort({ _id: -1 })
        .toArray();
      res.send(orders);
    });
    app.patch("/boosting-order/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("boostingOrder")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
    app.delete("/boosting-order/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("boostingOrder")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // ── Chat Messages API ──────────────────────────────────────

    // Send a message
    app.post("/messages", async (req, res) => {
      const msg = { ...req.body, createdAt: new Date().toISOString() };
      const result = await db.collection("messages").insertOne(msg);
      res.send(result);
    });

    // Get messages by roomId (user email)
    app.get("/messages/:roomId", async (req, res) => {
      const { roomId } = req.params;
      const messages = await db
        .collection("messages")
        .find({ roomId })
        .sort({ createdAt: 1 })
        .toArray();
      res.send(messages);
    });

    // Mark messages as seen
    app.patch("/messages/seen/:roomId", async (req, res) => {
      const { roomId } = req.params;
      const { email } = req.body; // who is marking as seen
      const result = await db
        .collection("messages")
        .updateMany(
          { roomId, seenBy: { $ne: email } },
          { $push: { seenBy: email } },
        );
      res.send(result);
    });

    // Get all chat rooms (distinct users who messaged) with last message + unseen count for admin
    app.get("/messages-rooms", async (req, res) => {
      const { adminEmail } = req.query;
      const rooms = await db
        .collection("messages")
        .aggregate([
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: "$roomId",
              lastMessage: { $first: "$text" },
              lastTime: { $first: "$createdAt" },
              senderName: { $first: "$senderName" },
              senderPhoto: { $first: "$senderPhoto" },
              unseenCount: {
                $sum: {
                  $cond: [{ $in: [adminEmail, "$seenBy"] }, 0, 1],
                },
              },
            },
          },
          { $sort: { lastTime: -1 } },
        ])
        .toArray();
      res.send(rooms);
    });
    // Get all admin emails
    app.get("/admin-emails", async (req, res) => {
      const admins = await db
        .collection("users")
        .find({ isAdmin: true }, { projection: { email: 1, _id: 0 } })
        .toArray();
      const emails = admins.map((a) => a.email);
      res.send(emails);
    });

    // get-user-landing-page-all-data
    app.get("/get-user-landing-page-all-data/:email", async (req, res) => {
      const email = req.params.email;
      // find user by email--->
      const user = await db.collection("users").findOne({ email });
      const storeData = user?.storeInfo || null;
      // now find product for landing page---->
      const products = await db
        .collection("myProduct")
        .find({ userEmail: email })
        .toArray();
      res.send({ storeData, products });
    });

    // get orders by email-------->
    app.get("/orders-by-email/:email", async (req, res) => {
      const email = req.params.email;
      const orders = await db
        .collection("orders")
        .find({ email: email })
        .sort({ _id: -1 })
        .toArray();
      res.send(orders);
    });

    // single page data---->
    app.post("/single-page-data", async (req, res) => {
      const data = req.body;
      const result = await db.collection("singlePageData").insertOne(data);
      res.send(result);
    });
    app.get("/single-page-data/:email", async (req, res) => {
      const email = req.params.email;
      const data = await db
        .collection("singlePageData")
        .findOne({ email: email });
      res.send(data);
    });
    app.patch("/single-page-data/:email", async (req, res) => {
      const email = req.params.email;
      const updatedData = req.body;
      const result = await db
        .collection("singlePageData")
        .updateOne({ email }, { $set: updatedData });
      res.send(result);
    });

    // manage landing page banner image--->
    app.patch("/landing-page-banner/:email", async (req, res) => {
      const email = req.params.email;
      const newImg = req.body.bannerImage;
      const query = { email: email };
      const updatedDoc = {
        $set: { "storeInfo.bannerImage": newImg },
      };
      const result = await db.collection("users").updateOne(query, updatedDoc);
      res.send(result);
    });

    // landingpage analytics--------->
    app.post("/landingpage-view-analytics", async (req, res) => {
      const data = req.body;
      // check exists or not---->
      const email = data.email;
      const exist = await db
        .collection("landingPageAnalytics")
        .findOne({ email: email });
      if (exist) {
        const result = await db
          .collection("landingPageAnalytics")
          .updateOne({ email: email }, { $inc: { views: 1 } });
        res.send(result);
        return;
      }
      const result = await db
        .collection("landingPageAnalytics")
        .insertOne(data);
      res.send(result);
    });
    app.get("/landingpage-view-analytics/:email", async (req, res) => {
      const email = req.params.email;
      const data = await db
        .collection("landingPageAnalytics")
        .findOne({ email: email });
      res.send(data);
    });

    // same vabe product click analytics--->
    app.post("/product-click-analytics", async (req, res) => {
      const data = req.body;
      // check exists or not---->
      const email = data.email;
      const exist = await db
        .collection("productClickAnalytics")
        .findOne({ email: email });
      if (exist) {
        const result = await db
          .collection("productClickAnalytics")
          .updateOne({ email: email }, { $inc: { click: 1 } });
        res.send(result);
        return;
      }
      const result = await db
        .collection("productClickAnalytics")
        .insertOne(data);
      res.send(result);
    });

    // same vabe product click analytics--->
    app.get("/product-click-analytics/:email", async (req, res) => {
      const email = req.params.email;
      const data = await db
        .collection("productClickAnalytics")
        .find({ email: email })
        .toArray();
      res.send(data);
    });

    // -------------------get subdomain data-------------api---->
    // app.get("/get_data_for_my_landing_page/:subDomain", async (req, res) => {
    //   const subDomain = req.params.subDomain.toLocaleLowerCase();
    //   // step--1 find user by storeName ==  subdomain ---->
    //   const user = await db
    //     .collection("users")
    //     .findOne({ "storeInfo.shopName": subDomain });
    //   const email = user?.email;
    //   //  step-2 find singlepage product data--->
    //   const singlePageData = await db
    //     .collection("singlePageData")
    //     .findOne({ email: email });

    //   // step-3 --- find landing page data---->
    //   const landingPageData = await db
    //     .collection("myProduct")
    //     .find({ userEmail: email })
    //     .sort({ _id: -1 })
    //     .toArray();

    //   // step-4 final data--------->
    //   const finalData = {
    //     email,
    //     landingPageTitle: user?.landingPageTitle,
    //     landingPageSubTitle: user?.landingPageSubTitle,
    //     storeInfo: user?.storeInfo,
    //     singlePageData: singlePageData,
    //     products: landingPageData,
    //   };

    //   res.send(finalData);
    // });
    app.get("/get_data_for_my_landing_page/:subDomain", async (req, res) => {
      const subDomain = req.params.subDomain.toLowerCase().replace(/\s+/g, ""); // remove spaces

      // step--1 find user by normalized shopName
      const users = await db.collection("users").find().toArray();

      const user = users.find((u) => {
        const shopName = u?.storeInfo?.shopName
          ?.toLowerCase()
          .replace(/\s+/g, ""); // normalize DB value

        return shopName === subDomain;
      });

      const email = user?.email;

      // step-2
      const singlePageData = await db
        .collection("singlePageData")
        .findOne({ email: email });

      // step-3
      const landingPageData = await db
        .collection("myProduct")
        .find({ userEmail: email })
        .sort({ _id: -1 })
        .toArray();

      // step-999
      const deliveryCharge = await db
        .collection("delivery_charge")
        .find()
        .sort({ _id: -1 })
        .toArray();
      const ddd = deliveryCharge[0];
      // step-4
      const finalData = {
        email,
        landingPageTitle: user?.landingPageTitle,
        landingPageSubTitle: user?.landingPageSubTitle,
        storeInfo: user?.storeInfo,
        singlePageData: singlePageData,
        products: landingPageData,
        insideDhaka: ddd?.insideDhaka,
        outsideDhaka: ddd?.outsideDhaka,
      };

      res.send(finalData);
    });

    // add title and subtitle on user storeInfo---->
    app.patch("/add-title-and-subtitle/:email", async (req, res) => {
      const email = req.params.email;
      const data = req.body;
      const query = { email: email };
      const updatedDoc = {
        $set: {
          ...data,
        },
      };
      const result = await db.collection("users").updateOne(query, updatedDoc);
      res.send(result);
    });

    // product click and view ---------------->
    app.post("/product_click_new_api", async (req, res) => {
      const date = new Date();
      const data = req.body;
      const finalData = {
        ...data,
        clickDate: date.toLocaleDateString(),
        clickTime: date.toLocaleTimeString(),
      };
      const result = await db
        .collection("product_click_new_api")
        .insertOne(finalData);
      res.send(result);
    });
    app.get("/product_click_new_api", async (req, res) => {
      const result = await db
        .collection("product_click_new_api")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    app.post("/landingPageView", async (req, res) => {
      const date = new Date();
      const data = req.body;
      const finalData = {
        ...data,
        viewDate: date.toLocaleDateString(),
        viewTime: date.toLocaleTimeString(),
      };
      const result = await db
        .collection("landingPageView")
        .insertOne(finalData);
      res.send(result);
    });
    app.get("/landingPageView", async (req, res) => {
      const result = await db
        .collection("landingPageView")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });
    // ----------------------------------website request management---->
    // CREATE (POST)
    app.post("/website_request", async (req, res) => {
      try {
        const data = req.body;
        const result = await db.collection("website_request").insertOne(data);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to create data" });
      }
    });
    // READ ALL (GET)
    app.get("/website_request", async (req, res) => {
      try {
        const result = await db
          .collection("website_request")
          .find()
          .sort({ _id: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch data" });
      }
    });
    app.get("/website_request/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const result = await db
          .collection("website_request")
          .findOne({ email: email });

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch single data" });
      }
    });
    // UPDATE (PATCH)
    app.patch("/website_request/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        const result = await db
          .collection("website_request")
          .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to update data" });
      }
    });
    // DELETE
    app.delete("/website_request/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await db
          .collection("website_request")
          .deleteOne({ _id: new ObjectId(id) });

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to delete data" });
      }
    });

    // delivery-charge--->
    app.post("/delivery_charge", async (req, res) => {
      const data = req.body;
      const result = await db.collection("delivery_charge").insertOne(data);
      res.send(result);
    });
    app.get("/delivery_charge", async (req, res) => {
      const result = await db
        .collection("delivery_charge")
        .find()
        .sort({ _id: -1 })
        .toArray();
      const finalResult = result[0];
      res.send(finalResult);
    });

    // social media link--->
    app.post("/social_media_link", async (req, res) => {
      try {
        const data = req.body;

        const collection = db.collection("social_media_link");

        // Get latest document efficiently
        const prevData1 = await collection.find().sort({ _id: -1 }).toArray();
        const prevData = prevData1[0];

        if (prevData) {
          const result = await collection.updateOne(
            { _id: prevData._id },
            { $set: { ...data } },
          );
          return res.send(result);
        } else {
          const result = await collection.insertOne(data);
          return res.send(result);
        }
      } catch (error) {
        console.error("Error in /social_media_link:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
    app.get("/social_media_link", async (req, res) => {
      const result = await db
        .collection("social_media_link")
        .find()
        .sort({ _id: -1 })
        .toArray();
      const finalResult = result[0];
      res.send(finalResult);
    });
    // ---blog management--->
    app.post("/blog", async (req, res) => {
      const data = req.body;
      const result = await db.collection("blog").insertOne(data);
      res.send(result);
    });
    app.get("/blog", async (req, res) => {
      const result = await db
        .collection("blog")
        .find()
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("blog")
        .findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const result = await db
        .collection("blog")
        .deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.patch("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await db
        .collection("blog")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
