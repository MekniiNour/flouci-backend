const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const APP_TOKEN = "0c6cde31-581d-4a8c-a2ea-16ef247baf00"; // Jeton public
const APP_SECRET = "17ee3346-00b4-460e-89a2-0583393e8c4e"; // Jeton privé

app.post("/create-payment", async (req, res) => {
  try {
    const { amount, success_link, fail_link, tracking_id } = req.body;

    const response = await axios.post(
      "https://developers.flouci.com/api/generate_payment",
      {
        app_token: APP_TOKEN,
        app_secret: APP_SECRET,
        accept_card: true,
        amount,
        session_timeout_secs: 1200,
        success_link,
        fail_link,
        developer_tracking_id: tracking_id,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Erreur Flouci:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
});

app.get("/verify-payment/:payment_id", async (req, res) => {
  const paymentId = req.params.payment_id;

  try {
    const response = await axios.get(
      `https://developers.flouci.com/api/verify_payment/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${APP_SECRET}`, // ✅ Token privé (classique)
          apppublic: APP_TOKEN, // ✅ Token public (exigé)
          appsecret: APP_SECRET, // ✅ Token privé en tant que header aussi
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Erreur complète :", error?.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la vérification du paiement" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Serveur lancé sur le port " + PORT));
